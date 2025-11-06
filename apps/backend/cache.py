"""
Caching layer for API responses and expensive computations
Implements in-memory cache with optional Redis support
"""

import hashlib
import json
import time
from typing import Any, Optional, Dict, Callable
from functools import wraps
from datetime import datetime, timedelta
from enum import Enum

# ============================================
# Cache Configuration
# ============================================

class CacheTTL(Enum):
    """Cache time-to-live durations"""
    STOCK_PRICE = 300  # 5 minutes
    FUNDAMENTAL = 3600  # 1 hour
    TECHNICAL = 600  # 10 minutes
    AI_REPORT = 7200  # 2 hours
    NEWS = 1800  # 30 minutes
    TRADING_AGENTS = 1800  # 30 minutes
    MACRO_DATA = 86400  # 1 day


# ============================================
# In-Memory Cache (Default)
# ============================================

class InMemoryCache:
    """Simple in-memory cache with TTL support"""

    def __init__(self):
        self.store: Dict[str, Dict[str, Any]] = {}
        self.hits = 0
        self.misses = 0

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key not in self.store:
            self.misses += 1
            return None

        entry = self.store[key]

        # Check if expired
        if entry["expires_at"] < time.time():
            del self.store[key]
            self.misses += 1
            return None

        self.hits += 1
        return entry["value"]

    def set(self, key: str, value: Any, ttl: int):
        """Set value in cache with TTL"""
        self.store[key] = {
            "value": value,
            "expires_at": time.time() + ttl,
            "created_at": time.time()
        }

    def delete(self, key: str):
        """Delete value from cache"""
        if key in self.store:
            del self.store[key]

    def clear(self):
        """Clear all cache"""
        self.store.clear()

    def cleanup_expired(self):
        """Remove expired entries"""
        current_time = time.time()
        expired_keys = [
            key for key, entry in self.store.items()
            if entry["expires_at"] < current_time
        ]
        for key in expired_keys:
            del self.store[key]
        return len(expired_keys)

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total = self.hits + self.misses
        hit_rate = (self.hits / total * 100) if total > 0 else 0

        return {
            "entries": len(self.store),
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": f"{hit_rate:.1f}%",
            "total_requests": total
        }


# ============================================
# Redis Cache (Optional)
# ============================================

class RedisCache:
    """Redis-based cache (requires redis-py)"""

    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0):
        try:
            import redis
            self.redis_client = redis.Redis(
                host=host,
                port=port,
                db=db,
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
            self.available = True
            print("✅ Redis cache connected")
        except Exception as e:
            self.available = False
            print(f"⚠️  Redis not available: {str(e)} - using in-memory cache")

    def get(self, key: str) -> Optional[Any]:
        """Get value from Redis"""
        if not self.available:
            return None

        try:
            value = self.redis_client.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            print(f"⚠️  Redis get error: {str(e)}")
            return None

    def set(self, key: str, value: Any, ttl: int):
        """Set value in Redis with TTL"""
        if not self.available:
            return

        try:
            self.redis_client.setex(
                key,
                ttl,
                json.dumps(value)
            )
        except Exception as e:
            print(f"⚠️  Redis set error: {str(e)}")

    def delete(self, key: str):
        """Delete value from Redis"""
        if not self.available:
            return

        try:
            self.redis_client.delete(key)
        except Exception as e:
            print(f"⚠️  Redis delete error: {str(e)}")

    def clear(self):
        """Clear all cache"""
        if not self.available:
            return

        try:
            self.redis_client.flushdb()
        except Exception as e:
            print(f"⚠️  Redis clear error: {str(e)}")


# ============================================
# Hybrid Cache Manager
# ============================================

class CacheManager:
    """Unified cache manager with fallback strategy"""

    def __init__(self, use_redis: bool = False):
        self.memory_cache = InMemoryCache()

        if use_redis:
            self.redis_cache = RedisCache()
        else:
            self.redis_cache = None

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache (tries Redis first, then memory)"""
        # Try Redis first if available
        if self.redis_cache and self.redis_cache.available:
            value = self.redis_cache.get(key)
            if value is not None:
                return value

        # Fallback to memory cache
        return self.memory_cache.get(key)

    def set(self, key: str, value: Any, ttl: int):
        """Set value in both caches"""
        # Always use memory cache
        self.memory_cache.set(key, value, ttl)

        # Also use Redis if available
        if self.redis_cache and self.redis_cache.available:
            self.redis_cache.set(key, value, ttl)

    def delete(self, key: str):
        """Delete from both caches"""
        self.memory_cache.delete(key)
        if self.redis_cache:
            self.redis_cache.delete(key)

    def clear(self):
        """Clear both caches"""
        self.memory_cache.clear()
        if self.redis_cache:
            self.redis_cache.clear()

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        return {
            "memory_cache": self.memory_cache.get_stats(),
            "redis_available": self.redis_cache.available if self.redis_cache else False
        }


# ============================================
# Global cache instance
# ============================================

cache_manager = CacheManager(use_redis=False)  # Set to True if Redis available


# ============================================
# Decorators for automatic caching
# ============================================

def cache_result(ttl: CacheTTL):
    """Decorator to cache function results"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> Any:
            # Generate cache key from function name and arguments
            cache_key = generate_cache_key(func.__name__, args, kwargs)

            # Check cache
            cached = cache_manager.get(cache_key)
            if cached is not None:
                return cached

            # Call function
            result = await func(*args, **kwargs)

            # Cache result
            cache_manager.set(cache_key, result, ttl.value)

            return result

        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> Any:
            # Generate cache key
            cache_key = generate_cache_key(func.__name__, args, kwargs)

            # Check cache
            cached = cache_manager.get(cache_key)
            if cached is not None:
                return cached

            # Call function
            result = func(*args, **kwargs)

            # Cache result
            cache_manager.set(cache_key, result, ttl.value)

            return result

        # Return appropriate wrapper
        import inspect
        if inspect.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


# ============================================
# Utility functions
# ============================================

def generate_cache_key(func_name: str, args: tuple, kwargs: dict) -> str:
    """Generate unique cache key from function name and arguments"""
    key_data = {
        "func": func_name,
        "args": str(args),
        "kwargs": str(sorted(kwargs.items()))
    }

    key_string = json.dumps(key_data, sort_keys=True)
    return hashlib.md5(key_string.encode()).hexdigest()


def invalidate_ticker_cache(ticker: str):
    """Invalidate all cache entries for a specific ticker"""
    patterns = [
        f"stock_price_{ticker}",
        f"fundamental_{ticker}",
        f"technical_{ticker}",
        f"ai_report_{ticker}",
        f"news_{ticker}",
        f"trading_agents_{ticker}"
    ]

    for pattern in patterns:
        cache_manager.delete(pattern)

    print(f"✅ Cache invalidated for {ticker}")


def cache_warmup():
    """Pre-populate cache with frequently accessed data"""
    print("🔥 Warming up cache...")
    # This can be called on startup to pre-populate common requests
    # Implementation depends on your specific use case


# ============================================
# Cache middleware for FastAPI
# ============================================

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class CacheMiddleware(BaseHTTPMiddleware):
    """Middleware to cache GET requests"""

    CACHEABLE_PATHS = [
        "/api/stock/",
        "/api/fundamental/",
        "/api/technical/",
        "/api/news/"
    ]

    async def dispatch(self, request: Request, call_next):
        # Only cache GET requests
        if request.method != "GET":
            return await call_next(request)

        # Check if path is cacheable
        is_cacheable = any(
            request.url.path.startswith(path)
            for path in self.CACHEABLE_PATHS
        )

        if not is_cacheable:
            return await call_next(request)

        # Generate cache key
        cache_key = f"http_{request.url.path}_{request.url.query}"

        # Check cache
        cached_response = cache_manager.get(cache_key)
        if cached_response:
            return cached_response

        # Call endpoint
        response = await call_next(request)

        # Only cache successful responses
        if response.status_code == 200:
            # Note: This is simplified - real implementation needs to handle response body
            cache_manager.set(cache_key, response, CacheTTL.STOCK_PRICE.value)

        return response
