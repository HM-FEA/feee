"""
Custom exceptions and error handling for Nexus-Alpha
"""

from fastapi import HTTPException, status
from typing import Optional, Dict, Any


# ============================================
# Custom Exceptions
# ============================================

class NexusAlphaException(Exception):
    """Base exception for Nexus-Alpha"""

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code or "NEXUS_ERROR"
        self.details = details or {}
        super().__init__(message)

    def to_http_exception(self) -> HTTPException:
        """Convert to HTTPException for FastAPI"""
        return HTTPException(
            status_code=self.status_code,
            detail={
                "error": self.error_code,
                "message": self.message,
                "details": self.details
            }
        )


class StockNotFoundError(NexusAlphaException):
    """Stock ticker not found"""

    def __init__(self, ticker: str):
        super().__init__(
            message=f"Stock '{ticker}' not found",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="STOCK_NOT_FOUND",
            details={"ticker": ticker}
        )


class DataUnavailableError(NexusAlphaException):
    """Data not available for requested period/ticker"""

    def __init__(self, reason: str = "No data available"):
        super().__init__(
            message=reason,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="DATA_UNAVAILABLE"
        )


class InvalidParameterError(NexusAlphaException):
    """Invalid input parameter"""

    def __init__(self, parameter: str, reason: str):
        super().__init__(
            message=f"Invalid parameter '{parameter}': {reason}",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="INVALID_PARAMETER",
            details={"parameter": parameter, "reason": reason}
        )


class AIServiceError(NexusAlphaException):
    """Error from AI service (OpenAI, TradingAgents, etc)"""

    def __init__(self, service: str, reason: str):
        super().__init__(
            message=f"{service} service error: {reason}",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code="AI_SERVICE_ERROR",
            details={"service": service, "reason": reason}
        )


class DatabaseError(NexusAlphaException):
    """Database operation error"""

    def __init__(self, operation: str, reason: str):
        super().__init__(
            message=f"Database error during {operation}: {reason}",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="DATABASE_ERROR",
            details={"operation": operation, "reason": reason}
        )


class RateLimitError(NexusAlphaException):
    """API rate limit exceeded"""

    def __init__(self, service: str = "API"):
        super().__init__(
            message=f"{service} rate limit exceeded. Please try again later.",
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            error_code="RATE_LIMIT_EXCEEDED",
            details={"service": service}
        )


class ValidationError(NexusAlphaException):
    """Data validation error"""

    def __init__(self, field: str, error: str):
        super().__init__(
            message=f"Validation error in field '{field}': {error}",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="VALIDATION_ERROR",
            details={"field": field, "error": error}
        )


# ============================================
# Error response handlers
# ============================================

async def nexus_exception_handler(request, exc: NexusAlphaException):
    """Handle custom Nexus exceptions"""
    return {
        "error": exc.error_code,
        "message": exc.message,
        "details": exc.details,
        "status_code": exc.status_code
    }


def create_error_response(
    error_code: str,
    message: str,
    status_code: int = 400,
    details: Optional[Dict] = None
) -> Dict[str, Any]:
    """Create standardized error response"""
    return {
        "error": error_code,
        "message": message,
        "status_code": status_code,
        "details": details or {}
    }


# ============================================
# Validation helpers
# ============================================

def validate_ticker(ticker: str) -> bool:
    """Validate stock ticker format"""
    if not ticker or not isinstance(ticker, str):
        return False

    ticker = ticker.strip().upper()

    # Valid formats: AAPL, 000660, etc
    if len(ticker) < 1 or len(ticker) > 10:
        return False

    # Can be alphanumeric
    return ticker.isalnum()


def validate_date_format(date_str: str) -> bool:
    """Validate date format (YYYY-MM-DD)"""
    from datetime import datetime

    try:
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def validate_price(price: float) -> bool:
    """Validate price value"""
    if not isinstance(price, (int, float)):
        return False

    return price > 0


def validate_percentage(value: float) -> bool:
    """Validate percentage value (0-100)"""
    if not isinstance(value, (int, float)):
        return False

    return 0 <= value <= 100


# ============================================
# Logging and monitoring
# ============================================

import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class ErrorMetrics:
    """Track error metrics for monitoring"""

    def __init__(self):
        self.error_counts = {}
        self.last_errors = []

    def record_error(self, error_code: str, message: str):
        """Record error occurrence"""
        self.error_counts[error_code] = self.error_counts.get(error_code, 0) + 1

        self.last_errors.append({
            "error_code": error_code,
            "message": message,
            "timestamp": datetime.utcnow().isoformat()
        })

        # Keep only last 100 errors
        if len(self.last_errors) > 100:
            self.last_errors.pop(0)

        # Log error
        logger.error(f"{error_code}: {message}")

    def get_stats(self):
        """Get error statistics"""
        return {
            "error_counts": self.error_counts,
            "total_errors": sum(self.error_counts.values()),
            "last_errors": self.last_errors[-10:]  # Last 10
        }

    def reset(self):
        """Reset metrics"""
        self.error_counts.clear()
        self.last_errors.clear()


# Global error metrics instance
error_metrics = ErrorMetrics()
