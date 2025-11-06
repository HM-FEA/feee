# 🎨 Nexus-Alpha SimViz Service

**Technology:** TypeScript (Frontend) + Python (Backend)
**Team:** Team SimViz (Simulation & Visualization)
**Port:** 8001 (Backend), 3001 (Frontend Dev)

---

## 📖 Overview

The SimViz Service transforms abstract financial models into interactive visualizations. It provides:

- 🌍 **3D Global Liquidity Globe**: Three.js visualization of M2 money supply by country
- 🕸️ **Obsidian-Style Network Graphs**: D3.js force-directed graphs for company debt relationships
- 📊 **Financial Charts**: ECharts integration for time-series and comparative analysis
- 🎲 **Simulation Orchestration**: Calls Quant Engine and formats results for visualization
- ⚡ **Performance Optimized**: 60 FPS rendering, WebGL acceleration, intelligent caching

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20 LTS
- Python 3.11+
- Redis 7+ (for caching)
- Docker (optional)

### Installation

#### Frontend
```bash
cd frontend
pnpm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8001
# NEXT_PUBLIC_QUANT_ENGINE_URL=http://localhost:8000
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env
# QUANT_ENGINE_URL=http://localhost:8000
# REDIS_URL=redis://localhost:6379
```

### Development

#### Frontend
```bash
cd frontend
pnpm dev  # http://localhost:3001
```

#### Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8001  # http://localhost:8001
```

---

## 📁 Project Structure

```
services/simviz-service/
├── frontend/                    # TypeScript/React Three Fiber
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe/
│   │   │   │   ├── LiquidityGlobe.tsx
│   │   │   │   ├── GlobeMarkers.tsx
│   │   │   │   ├── FlowArcs.tsx
│   │   │   │   └── shaders/
│   │   │   │       ├── atmosphere.glsl
│   │   │   │       └── glow.glsl
│   │   │   ├── Network/
│   │   │   │   ├── ObsidianGraph.tsx
│   │   │   │   ├── CompanyNode.tsx
│   │   │   │   └── DebtEdge.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── InterestRateChart.tsx
│   │   │   │   ├── SentimentGauge.tsx
│   │   │   │   └── FlowDiagram.tsx
│   │   │   └── Simulations/
│   │   │       ├── InterestRateSlider.tsx
│   │   │       └── MacroScenarioPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useGlobeData.ts
│   │   │   ├── useSimulation.ts
│   │   │   └── useWebGL.ts
│   │   ├── utils/
│   │   │   ├── coordinates.ts
│   │   │   ├── interpolation.ts
│   │   │   └── formatters.ts
│   │   └── types/
│   │       ├── simulation.ts
│   │       └── visualization.ts
│   ├── package.json
│   └── tsconfig.json
├── backend/                     # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── routes/
│   │   │           ├── simulations.py
│   │   │           ├── visualizations.py
│   │   │           └── graphs.py
│   │   ├── services/
│   │   │   ├── simulation_orchestrator.py
│   │   │   ├── graph_generator.py
│   │   │   └── data_aggregator.py
│   │   └── core/
│   │       ├── config.py
│   │       └── cache.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🌍 3D Global Liquidity Globe

### Three.js Implementation
```tsx
// frontend/src/components/Globe/LiquidityGlobe.tsx
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface CountryData {
  country: string;
  lat: number;
  lng: number;
  m2_value: number;  // Billions USD
  growth_rate: number;  // %
}

export const LiquidityGlobe = ({ data }: { data: CountryData[] }) => {
  return (
    <Canvas camera={{ position: [0, 0, 300], fov: 45 }} style={{ background: '#101015' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={1} />

      <Globe />
      <Markers data={data} />
      <FlowArcs data={data} />

      <OrbitControls enableZoom={true} enablePan={false} minDistance={150} maxDistance={500} />
    </Canvas>
  );
};

const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/textures/earth-dark.jpg');

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;  // Slow auto-rotate
    }
  });

  return (
    <Sphere ref={globeRef} args={[100, 64, 64]}>
      <meshStandardMaterial map={texture} metalness={0.2} roughness={0.8} />
    </Sphere>
  );
};

const Markers = ({ data }: { data: CountryData[] }) => {
  return (
    <>
      {data.map((country, i) => {
        const position = latLngToVector3(country.lat, country.lng, 100);

        // Color based on growth rate
        const color = country.growth_rate > 5 ? '#39FF14' : country.growth_rate < 0 ? '#FF1744' : '#00E5FF';

        // Size based on M2 value
        const scale = Math.log(country.m2_value) / 5;

        return (
          <mesh key={i} position={position} scale={scale}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </>
  );
};

function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}
```

---

## 🕸️ Obsidian-Style Network Graph

### D3.js Force-Directed Graph
```tsx
// frontend/src/components/Network/ObsidianGraph.tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'bank' | 'reit' | 'construction' | 'government';
  total_debt: number;
}

interface Link {
  source: string;
  target: string;
  amount: number;
  type: 'loan' | 'bond' | 'mortgage';
}

export const ObsidianGraph = ({ nodes, links }: { nodes: Node[]; links: Link[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 800;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', (d) => d.type === 'loan' ? '#00E5FF' : '#E6007A')
      .attr('stroke-width', (d) => Math.sqrt(d.amount) / 10)
      .attr('stroke-opacity', 0.6);

    // Nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => Math.log(d.total_debt) * 3)
      .attr('fill', (d) => {
        const colors = { bank: '#00E5FF', reit: '#E6007A', construction: '#39FF14', government: '#FFC107' };
        return colors[d.type];
      })
      .attr('stroke', '#F5F5F5')
      .attr('stroke-width', 2);

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  }, [nodes, links]);

  return (
    <div style={{ background: '#101015', padding: '20px' }}>
      <svg ref={svgRef} />
    </div>
  );
};
```

---

## 🐍 Backend - Simulation Orchestration

### FastAPI Application
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SimViz Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.routes import simulations

app.include_router(simulations.router, prefix="/api/v1/simulations", tags=["simulations"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "simviz"}
```

### Simulation Orchestrator
```python
# backend/app/services/simulation_orchestrator.py
import httpx
import redis
import json
from typing import Dict, List

class SimulationOrchestrator:
    def __init__(self):
        self.quant_engine_url = "http://localhost:8000"
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)

    async def run_interest_rate_simulation(self, new_rate: float, company_ids: List[str]) -> Dict:
        """
        Orchestrate interest rate simulation

        Steps:
        1. Check cache
        2. Fetch company data
        3. Call Quant Engine
        4. Generate network graph data
        5. Cache result
        """
        cache_key = f"sim:interest_rate:{new_rate}:{'-'.join(company_ids)}"

        # Check cache
        cached = self.redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

        # Call Quant Engine
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.quant_engine_url}/api/v1/simulations/interest-rate",
                json={"new_rate": new_rate, "company_ids": company_ids}
            )
            simulation_result = response.json()

        # Generate graph data
        graph_data = self._generate_network_graph(simulation_result)

        result = {
            "simulation": simulation_result,
            "graph": graph_data,
            "summary": self._generate_summary(simulation_result),
        }

        # Cache for 5 minutes
        self.redis_client.setex(cache_key, 300, json.dumps(result))

        return result

    def _generate_network_graph(self, simulation_result: Dict) -> Dict:
        """Generate D3.js network graph data"""
        nodes = []
        links = []

        for company in simulation_result['companies']:
            nodes.append({
                "id": company['company_id'],
                "name": company['company_name'],
                "type": "reit" if "REIT" in company['company_name'] else "construction",
                "total_debt": company['old_interest_expense'] * 20,
                "health_score": company['health_score'],
            })

        return {"nodes": nodes, "links": links}

    def _generate_summary(self, simulation_result: Dict) -> Dict:
        """Generate summary statistics"""
        companies = simulation_result['companies']

        return {
            "total_companies": len(companies),
            "high_risk_count": sum(1 for c in companies if c['risk_level'] == 'high'),
            "avg_health_score": sum(c['health_score'] for c in companies) / len(companies),
        }
```

---

## 📊 ECharts Integration

### Interest Rate Impact Chart
```tsx
// frontend/src/components/Charts/InterestRateChart.tsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartData {
  company_name: string;
  old_net_income: number;
  new_net_income: number;
}

export const InterestRateChart = ({ data }: { data: ChartData[] }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    const option = {
      backgroundColor: '#1B1B22',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      legend: {
        data: ['Old Net Income', 'New Net Income'],
        textStyle: { color: '#F5F5F5' },
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.company_name),
        axisLabel: { color: '#A9A9A9', rotate: 45 },
      },
      yAxis: {
        type: 'value',
        name: 'Net Income (M USD)',
        axisLabel: { color: '#A9A9A9' },
      },
      series: [
        {
          name: 'Old Net Income',
          type: 'bar',
          data: data.map((d) => d.old_net_income / 1e6),
          itemStyle: { color: '#00E5FF' },
        },
        {
          name: 'New Net Income',
          type: 'bar',
          data: data.map((d) => d.new_net_income / 1e6),
          itemStyle: {
            color: (params: any) => {
              const impact = data[params.dataIndex].new_net_income - data[params.dataIndex].old_net_income;
              return impact < 0 ? '#FF1744' : '#39FF14';
            },
          },
        },
      ],
    };

    chart.setOption(option);

    return () => { chart.dispose(); };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
pnpm test
```

Example:
```typescript
// frontend/src/components/__tests__/ObsidianGraph.test.tsx
import { render } from '@testing-library/react';
import { ObsidianGraph } from '../Network/ObsidianGraph';

test('renders graph with nodes', () => {
  const mockNodes = [
    { id: 'c1', name: 'Bank A', type: 'bank' as const, total_debt: 1000000 },
  ];
  const mockLinks = [];

  const { container } = render(<ObsidianGraph nodes={mockNodes} links={mockLinks} />);
  expect(container.querySelector('svg')).toBeInTheDocument();
});
```

### Backend Tests
```bash
cd backend
pytest
```

Example:
```python
# backend/tests/test_simulation_orchestrator.py
import pytest
from app.services.simulation_orchestrator import SimulationOrchestrator

@pytest.mark.asyncio
async def test_run_interest_rate_simulation():
    orchestrator = SimulationOrchestrator()
    result = await orchestrator.run_interest_rate_simulation(new_rate=5.5, company_ids=['c1', 'c2'])

    assert 'simulation' in result
    assert 'graph' in result
    assert result['summary']['total_companies'] == 2
```

---

## 🚀 Deployment

### Docker
```bash
# Build and run
docker-compose up --build

# Backend: http://localhost:8001
# Frontend: http://localhost:3001
```

### Kubernetes
```bash
kubectl apply -f /infra/kubernetes/applications/simviz-service/
```

---

## 📚 Documentation

- **API Reference**: http://localhost:8001/docs
- **Team Handbook**: `/docs/teams/TEAM_SIMVIZ_HANDBOOK.md`
- **Three.js Docs**: https://threejs.org/docs/
- **D3.js Gallery**: https://observablehq.com/@d3/gallery

---

**Last Updated:** 2025-10-31
