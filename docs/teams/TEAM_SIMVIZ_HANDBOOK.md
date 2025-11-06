# 🎨 Team SimViz: Simulation & Visualization Handbook

**Team:** SimViz (Simulation & Visualization)
**Squad Size:** 3 engineers
**Workspace:** `/services/simviz-service`

---

## 🎯 Team Mission

"우리는 추상적인 금융 모델을 시각적이고 인터랙티브한 경험으로 변환하여 누구나 복잡한 시뮬레이션을 직관적으로 이해할 수 있게 만듭니다."

---

## 👥 Team Roles

### Lead: Visualization Architect
- 3D/2D visualization strategy
- Performance optimization (60 FPS guarantee)
- Integration with Quant Engine
- User experience research

### Senior Frontend Engineer (3D Specialist)
- Three.js 3D visualizations
- WebGL shader programming
- Global liquidity 3D globe
- Animation systems

### Python Engineer (Simulation Backend)
- FastAPI simulation endpoints
- Network graph generation (D3.js data)
- Quant Engine integration
- Caching strategy

---

## 🛠️ Technology Stack

```typescript
// Frontend (3D/Visualization)
Three.js 0.158+
React Three Fiber 8.15+
D3.js 7.8+
ECharts 5.4+

// Backend (Python)
FastAPI 0.104+
NetworkX 3.2+  // Graph algorithms
NumPy 1.26+

// State & Caching
Redis
Zustand (if integrated with Next.js)

// Deployment
Docker
Kubernetes
```

---

## 📁 Project Structure

```
services/simviz-service/
├── frontend/                    # 3D Visualization components
│   ├── src/
│   │   ├── components/
│   │   │   ├── Globe/
│   │   │   │   ├── LiquidityGlobe.tsx     # 3D global M2 visualization
│   │   │   │   ├── GlobeMarkers.tsx       # Country markers
│   │   │   │   ├── FlowArcs.tsx           # Capital flow animations
│   │   │   │   └── shaders/
│   │   │   │       ├── atmosphere.glsl
│   │   │   │       └── glow.glsl
│   │   │   ├── Network/
│   │   │   │   ├── ObsidianGraph.tsx      # Obsidian-style network
│   │   │   │   ├── CompanyNode.tsx
│   │   │   │   └── DebtEdge.tsx
│   │   │   ├── Charts/
│   │   │   │   ├── InterestRateChart.tsx  # ECharts
│   │   │   │   ├── SentimentGauge.tsx
│   │   │   │   └── FlowDiagram.tsx
│   │   │   └── Simulations/
│   │   │       ├── InterestRateSlider.tsx
│   │   │       ├── MacroScenarioPanel.tsx
│   │   │       └── ResultsTable.tsx
│   │   ├── hooks/
│   │   │   ├── useGlobeData.ts
│   │   │   ├── useSimulation.ts
│   │   │   └── useWebGL.ts
│   │   ├── utils/
│   │   │   ├── coordinates.ts             # Lat/Lng to 3D
│   │   │   ├── interpolation.ts           # Animation easing
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
│   │   │   ├── v1/
│   │   │   │   ├── routes/
│   │   │   │   │   ├── simulations.py
│   │   │   │   │   ├── visualizations.py
│   │   │   │   │   └── graphs.py
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

## 🌍 3D Global Liquidity Visualization

### Three.js Globe Component
```tsx
// frontend/src/components/Globe/LiquidityGlobe.tsx
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface CountryData {
  country: string;
  lat: number;
  lng: number;
  m2_value: number; // Billions USD
  growth_rate: number; // %
}

export const LiquidityGlobe = ({ data }: { data: CountryData[] }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 300], fov: 45 }}
      style={{ background: '#101015' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={1} />

      <Globe data={data} />
      <Markers data={data} />
      <FlowArcs data={data} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={150}
        maxDistance={500}
      />
    </Canvas>
  );
};

const Globe = ({ data }: { data: CountryData[] }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useTexture('/textures/earth-dark.jpg');

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001; // Slow auto-rotate
    }
  });

  return (
    <Sphere ref={globeRef} args={[100, 64, 64]}>
      <meshStandardMaterial
        map={texture}
        metalness={0.2}
        roughness={0.8}
      />
    </Sphere>
  );
};

const Markers = ({ data }: { data: CountryData[] }) => {
  const markers = useMemo(() => {
    return data.map((country) => {
      const position = latLngToVector3(country.lat, country.lng, 100);

      // Color based on growth rate
      const color = country.growth_rate > 5
        ? '#39FF14' // Green (growing)
        : country.growth_rate < 0
        ? '#FF1744' // Red (shrinking)
        : '#00E5FF'; // Cyan (stable)

      // Size based on M2 value
      const scale = Math.log(country.m2_value) / 5;

      return { position, color, scale, country };
    });
  }, [data]);

  return (
    <>
      {markers.map((marker, i) => (
        <mesh key={i} position={marker.position} scale={marker.scale}>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial
            color={marker.color}
            emissive={marker.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </>
  );
};

// Utility: Convert lat/lng to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}
```

### Flow Arcs (Capital Movement)
```tsx
// frontend/src/components/Globe/FlowArcs.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FlowData {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  amount: number; // USD billions
}

export const FlowArcs = ({ data }: { data: FlowData[] }) => {
  return (
    <>
      {data.map((flow, i) => (
        <Arc key={i} flow={flow} />
      ))}
    </>
  );
};

const Arc = ({ flow }: { flow: FlowData }) => {
  const lineRef = useRef<THREE.Line>(null);

  // Generate arc curve
  const curve = useMemo(() => {
    const start = latLngToVector3(flow.from.lat, flow.from.lng, 100);
    const end = latLngToVector3(flow.to.lat, flow.to.lng, 100);

    // Control point (higher arc for longer distances)
    const distance = new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end));
    const mid = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    ).multiplyScalar(1 + distance / 200);

    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      mid,
      new THREE.Vector3(...end)
    );
  }, [flow]);

  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // Animate flow
  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.5 + 0.3 * Math.sin(clock.elapsedTime * 2);
    }
  });

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00E5FF"
        transparent
        opacity={0.5}
        linewidth={2}
      />
    </line>
  );
};
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
  amount: number; // Debt amount
  type: 'loan' | 'bond' | 'mortgage';
}

export const ObsidianGraph = ({
  nodes,
  links
}: {
  nodes: Node[];
  links: Link[];
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1200;
    const height = 800;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

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
        const colors = {
          bank: '#00E5FF',
          reit: '#E6007A',
          construction: '#39FF14',
          government: '#FFC107',
        };
        return colors[d.type];
      })
      .attr('stroke', '#F5F5F5')
      .attr('stroke-width', 2)
      .call(drag(simulation) as any);

    // Labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('font-size', 12)
      .attr('fill', '#F5F5F5')
      .attr('text-anchor', 'middle')
      .attr('dy', -20);

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

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Drag behavior
    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  }, [nodes, links]);

  return (
    <div style={{ background: '#101015', padding: '20px' }}>
      <svg ref={svgRef} />
    </div>
  );
};
```

---

## 🐍 Python Backend - Simulation Orchestration

### FastAPI Main Application
```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import simulations, visualizations, graphs
from app.core.config import settings

app = FastAPI(
    title="SimViz Service",
    description="Simulation & Visualization Engine",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(simulations.router, prefix="/api/v1/simulations", tags=["simulations"])
app.include_router(visualizations.router, prefix="/api/v1/viz", tags=["visualizations"])
app.include_router(graphs.router, prefix="/api/v1/graphs", tags=["graphs"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "simviz"}
```

### Simulation Orchestrator
```python
# backend/app/services/simulation_orchestrator.py
import httpx
from typing import Dict, List
from app.core.config import settings
import redis

class SimulationOrchestrator:
    def __init__(self):
        self.quant_engine_url = settings.QUANT_ENGINE_URL
        self.redis_client = redis.Redis(host='redis', port=6379, db=0)

    async def run_interest_rate_simulation(
        self,
        new_rate: float,
        company_ids: List[str]
    ) -> Dict:
        """
        Orchestrate interest rate simulation

        Steps:
        1. Check cache
        2. Fetch company data from Platform Service
        3. Call Quant Engine for calculations
        4. Generate network graph data
        5. Cache result
        """
        cache_key = f"sim:interest_rate:{new_rate}:{'-'.join(company_ids)}"

        # Check cache
        cached = self.redis_client.get(cache_key)
        if cached:
            return json.loads(cached)

        # Fetch company data
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.PLATFORM_API_URL}/api/v1/companies/batch",
                json={"ids": company_ids}
            )
            companies = response.json()

        # Call Quant Engine
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.quant_engine_url}/api/v1/simulations/interest-rate",
                json={
                    "new_rate": new_rate,
                    "companies": companies,
                }
            )
            simulation_result = response.json()

        # Generate graph data
        graph_data = self._generate_network_graph(simulation_result)

        # Aggregate for visualization
        result = {
            "simulation": simulation_result,
            "graph": graph_data,
            "summary": self._generate_summary(simulation_result),
        }

        # Cache for 5 minutes
        self.redis_client.setex(cache_key, 300, json.dumps(result))

        return result

    def _generate_network_graph(self, simulation_result: Dict) -> Dict:
        """
        Generate D3.js network graph data

        Returns:
        {
            "nodes": [{"id", "name", "type", "total_debt"}],
            "links": [{"source", "target", "amount", "type"}]
        }
        """
        nodes = []
        links = []

        for company in simulation_result['companies']:
            # Add company node
            nodes.append({
                "id": company['company_id'],
                "name": company['company_name'],
                "type": "reit" if "REIT" in company['company_name'] else "construction",
                "total_debt": company['old_interest_expense'] * 20,  # Estimate
                "health_score": company['health_score'],
                "risk_level": company['risk_level'],
            })

            # Add links (if we have debt relationships)
            if 'creditors' in company:
                for creditor in company['creditors']:
                    links.append({
                        "source": creditor['bank_id'],
                        "target": company['company_id'],
                        "amount": creditor['loan_amount'],
                        "type": "loan",
                    })

        return {"nodes": nodes, "links": links}

    def _generate_summary(self, simulation_result: Dict) -> Dict:
        """Generate summary statistics"""
        companies = simulation_result['companies']

        return {
            "total_companies": len(companies),
            "high_risk_count": sum(1 for c in companies if c['risk_level'] == 'high'),
            "medium_risk_count": sum(1 for c in companies if c['risk_level'] == 'medium'),
            "low_risk_count": sum(1 for c in companies if c['risk_level'] == 'low'),
            "avg_health_score": sum(c['health_score'] for c in companies) / len(companies),
            "total_impact": sum(c['new_net_income'] - c['old_net_income'] for c in companies),
        }
```

### API Routes
```python
# backend/app/api/v1/routes/simulations.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.simulation_orchestrator import SimulationOrchestrator

router = APIRouter()
orchestrator = SimulationOrchestrator()

class InterestRateSimRequest(BaseModel):
    new_rate: float
    company_ids: list[str]

@router.post("/interest-rate")
async def simulate_interest_rate(request: InterestRateSimRequest):
    """
    Run interest rate impact simulation

    Example:
    POST /api/v1/simulations/interest-rate
    {
        "new_rate": 5.5,
        "company_ids": ["c1", "c2", "c3"]
    }
    """
    try:
        result = await orchestrator.run_interest_rate_simulation(
            new_rate=request.new_rate,
            company_ids=request.company_ids
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## 📊 ECharts Financial Charts

### Interest Rate Impact Chart
```tsx
// frontend/src/components/Charts/InterestRateChart.tsx
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface ChartData {
  company_name: string;
  old_net_income: number;
  new_net_income: number;
  health_score: number;
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

    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
};
```

---

## 🧪 Testing

### Frontend Tests (Jest + React Testing Library)
```typescript
// frontend/src/components/__tests__/ObsidianGraph.test.tsx
import { render } from '@testing-library/react';
import { ObsidianGraph } from '../Network/ObsidianGraph';

describe('ObsidianGraph', () => {
  const mockNodes = [
    { id: 'c1', name: 'Bank A', type: 'bank' as const, total_debt: 1000000 },
    { id: 'c2', name: 'REIT B', type: 'reit' as const, total_debt: 500000 },
  ];

  const mockLinks = [
    { source: 'c1', target: 'c2', amount: 200000, type: 'loan' as const },
  ];

  it('renders without crashing', () => {
    const { container } = render(
      <ObsidianGraph nodes={mockNodes} links={mockLinks} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders correct number of nodes', () => {
    const { container } = render(
      <ObsidianGraph nodes={mockNodes} links={mockLinks} />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });
});
```

### Backend Tests (Pytest)
```python
# backend/tests/test_simulation_orchestrator.py
import pytest
from app.services.simulation_orchestrator import SimulationOrchestrator

@pytest.mark.asyncio
async def test_run_interest_rate_simulation():
    orchestrator = SimulationOrchestrator()

    result = await orchestrator.run_interest_rate_simulation(
        new_rate=5.5,
        company_ids=['c1', 'c2']
    )

    assert 'simulation' in result
    assert 'graph' in result
    assert 'summary' in result
    assert result['summary']['total_companies'] == 2
```

---

## 🚀 Performance Optimization

### WebGL Best Practices
1. **Level of Detail (LOD)**: Reduce polygon count for distant objects
2. **Frustum Culling**: Don't render objects outside camera view
3. **Instancing**: Use `InstancedMesh` for repeated geometries
4. **Texture Optimization**: Use compressed textures (Basis Universal)

### D3.js Optimization
```typescript
// Use canvas renderer for large graphs (>1000 nodes)
const useCanvas = nodes.length > 1000;

if (useCanvas) {
  const canvas = d3.select('canvas').node() as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;

  // Custom canvas rendering
  simulation.on('tick', () => {
    context.clearRect(0, 0, width, height);

    // Draw links
    links.forEach((link) => {
      context.beginPath();
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
      context.strokeStyle = '#00E5FF';
      context.stroke();
    });

    // Draw nodes
    nodes.forEach((node) => {
      context.beginPath();
      context.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      context.fillStyle = '#E6007A';
      context.fill();
    });
  });
}
```

---

## 📚 Recommended Resources

### Books
- "Interactive Data Visualization for the Web" - Scott Murray (D3.js)
- "Three.js Cookbook" - Jos Dirksen
- "WebGL Programming Guide" - Kouichi Matsuda

### Courses
- Three.js Journey (Bruno Simon)
- D3.js Data Visualization (Curran Kelleher)
- WebGL Fundamentals (webglfundamentals.org)

### Documentation
- Three.js Docs: https://threejs.org/docs/
- D3.js Gallery: https://observablehq.com/@d3/gallery
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber

---

**Document Owner:** Visualization Architect
**Last Updated:** 2025-10-31
