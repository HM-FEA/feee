# 🎨 부동산 시뮬레이터 - 프론트엔드 컴포넌트 상세

**Parent Guide:** REAL_ESTATE_PILOT_GUIDE.md
**Phase:** 2 - Frontend Implementation

---

## 컴포넌트 2: 시뮬레이션 컨트롤 (금리 슬라이더)

```tsx
// components/real-estate/SimulationControls.tsx
'use client';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface SimulationControlsProps {
  interestRate: number;
  onRateChange: (rate: number) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export const SimulationControls = ({
  interestRate,
  onRateChange,
  onSimulate,
  isSimulating,
}: SimulationControlsProps) => {
  return (
    <div className="space-y-6">
      {/* 금리 슬라이더 */}
      <div>
        <Label className="text-[#F5F5F5] text-lg mb-4 block">
          기준금리 조정
        </Label>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <Slider
              value={[interestRate]}
              onValueChange={(value) => onRateChange(value[0])}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-[#A9A9A9] text-sm mt-2">
              <span>0%</span>
              <span>5%</span>
              <span>10%</span>
            </div>
          </div>

          {/* 현재 금리 표시 */}
          <div className="text-center min-w-[120px]">
            <p className="text-[#A9A9A9] text-sm">현재 금리</p>
            <p className="text-4xl font-bold text-[#00E5FF]">
              {interestRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* 시뮬레이션 실행 버튼 */}
      <div className="flex gap-4">
        <Button
          onClick={onSimulate}
          disabled={isSimulating}
          className="bg-[#00E5FF] hover:bg-[#00B8CC] text-[#101015] font-semibold px-8 py-3 text-lg"
        >
          {isSimulating ? '시뮬레이션 실행 중...' : '시뮬레이션 실행'}
        </Button>

        {/* 프리셋 버튼들 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onRateChange(2.5)}
            className="border-[#33333F] text-[#F5F5F5] hover:bg-[#33333F]"
          >
            완화 (2.5%)
          </Button>
          <Button
            variant="outline"
            onClick={() => onRateChange(3.5)}
            className="border-[#33333F] text-[#F5F5F5] hover:bg-[#33333F]"
          >
            현재 (3.5%)
          </Button>
          <Button
            variant="outline"
            onClick={() => onRateChange(5.5)}
            className="border-[#33333F] text-[#F5F5F5] hover:bg-[#33333F]"
          >
            긴축 (5.5%)
          </Button>
        </div>
      </div>

      {/* 설명 */}
      <p className="text-[#A9A9A9] text-sm">
        💡 금리를 조정하여 부동산 섹터 기업들의 재무 영향을 시뮬레이션하세요.
        변동금리 대출이 있는 기업들의 이자비용과 순이익이 즉시 변화합니다.
      </p>
    </div>
  );
};
```

---

## 컴포넌트 3: D3.js 네트워크 그래프

```tsx
// components/real-estate/DebtNetworkGraph.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'bank' | 'company';
  health_score?: number;
  risk_level?: string;
  total_debt?: number;
}

interface Link {
  source: string;
  target: string;
  loan_amount: number;
  interest_rate: number;
}

interface DebtNetworkGraphProps {
  nodes: Node[];
  links: Link[];
}

export const DebtNetworkGraph = ({ nodes, links }: DebtNetworkGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = 800;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Define arrow markers
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .join('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#00E5FF');

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#00E5FF')
      .attr('stroke-width', (d) => Math.sqrt(d.loan_amount) / 50)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrow)');

    // Link labels (loan amount)
    const linkLabel = svg.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-size', 10)
      .attr('fill', '#A9A9A9')
      .attr('text-anchor', 'middle')
      .text((d) => `${(d.loan_amount / 1000).toFixed(0)}B`);

    // Nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => {
        if (d.type === 'bank') return 40;
        return d.total_debt ? Math.log(d.total_debt) * 3 : 30;
      })
      .attr('fill', (d) => {
        if (d.type === 'bank') return '#00E5FF';

        // 기업은 위험도에 따라 색상 변경
        const riskColors = {
          Low: '#39FF14',
          Medium: '#FFC107',
          High: '#FF9800',
          Critical: '#FF1744',
        };
        return riskColors[d.risk_level as keyof typeof riskColors] || '#E6007A';
      })
      .attr('stroke', '#F5F5F5')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(drag(simulation) as any);

    // Node labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text((d) => d.name)
      .attr('font-size', 12)
      .attr('fill', '#F5F5F5')
      .attr('text-anchor', 'middle')
      .attr('dy', -50);

    // Health score labels (for companies)
    const healthLabel = svg.append('g')
      .selectAll('text')
      .data(nodes.filter((d) => d.type === 'company'))
      .join('text')
      .text((d) => `${d.health_score?.toFixed(0)}점`)
      .attr('font-size', 14)
      .attr('font-weight', 'bold')
      .attr('fill', '#F5F5F5')
      .attr('text-anchor', 'middle')
      .attr('dy', 5);

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    node
      .on('mouseover', function (event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => {
            const currentR = d.type === 'bank' ? 40 : (d.total_debt ? Math.log(d.total_debt) * 3 : 30);
            return currentR * 1.3;
          });

        tooltip
          .style('opacity', 1)
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .html(
            d.type === 'bank'
              ? `<strong>${d.name}</strong><br/>유형: 은행`
              : `<strong>${d.name}</strong><br/>
                 건전성 점수: ${d.health_score?.toFixed(1)}<br/>
                 위험도: ${d.risk_level}<br/>
                 총 부채: ${(d.total_debt / 1000).toFixed(1)}B`
          );
      })
      .on('mouseout', function (event, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: any) => {
            return d.type === 'bank' ? 40 : (d.total_debt ? Math.log(d.total_debt) * 3 : 30);
          });

        tooltip.style('opacity', 0);
      });

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);

      healthLabel
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
    <div className="relative">
      <svg ref={svgRef} className="bg-[#101015] rounded-lg" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute bg-[#1B1B22] border border-[#33333F] text-[#F5F5F5] px-3 py-2 rounded-lg text-sm pointer-events-none opacity-0 transition-opacity"
        style={{ zIndex: 1000 }}
      />

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#00E5FF]" />
          <span className="text-[#A9A9A9]">은행</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#39FF14]" />
          <span className="text-[#A9A9A9]">저위험 기업</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FFC107]" />
          <span className="text-[#A9A9A9]">중위험 기업</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FF1744]" />
          <span className="text-[#A9A9A9]">고위험 기업</span>
        </div>
      </div>
    </div>
  );
};
```

---

## 컴포넌트 4: 기업 건전성 테이블

```tsx
// components/real-estate/CompanyHealthTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Company {
  company_id: string;
  company_name: string;
  sector: string;
  health_score: number;
  risk_level: string;
  new_icr: number;
  debt_ratio: number;
  income_change_pct: number;
}

interface CompanyHealthTableProps {
  companies: Company[];
}

export const CompanyHealthTable = ({ companies }: CompanyHealthTableProps) => {
  const getRiskBadgeColor = (riskLevel: string) => {
    const colors = {
      Low: 'bg-[#39FF14] text-[#101015]',
      Medium: 'bg-[#FFC107] text-[#101015]',
      High: 'bg-[#FF9800] text-[#F5F5F5]',
      Critical: 'bg-[#FF1744] text-[#F5F5F5]',
    };
    return colors[riskLevel as keyof typeof colors] || 'bg-[#A9A9A9]';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-[#33333F]">
            <TableHead className="text-[#A9A9A9]">기업명</TableHead>
            <TableHead className="text-[#A9A9A9]">섹터</TableHead>
            <TableHead className="text-[#A9A9A9]">건전성 점수</TableHead>
            <TableHead className="text-[#A9A9A9]">ICR</TableHead>
            <TableHead className="text-[#A9A9A9]">부채비율</TableHead>
            <TableHead className="text-[#A9A9A9]">순이익 변화</TableHead>
            <TableHead className="text-[#A9A9A9]">위험도</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.company_id} className="border-[#33333F]">
              <TableCell className="text-[#F5F5F5] font-medium">
                {company.company_name}
              </TableCell>
              <TableCell className="text-[#A9A9A9]">{company.sector}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-2 bg-[#33333F] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        company.health_score >= 70
                          ? 'bg-[#39FF14]'
                          : company.health_score >= 50
                          ? 'bg-[#FFC107]'
                          : 'bg-[#FF1744]'
                      }`}
                      style={{ width: `${company.health_score}%` }}
                    />
                  </div>
                  <span className="text-[#F5F5F5] font-mono text-sm">
                    {company.health_score.toFixed(0)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#F5F5F5] font-mono">
                {company.new_icr.toFixed(2)}x
              </TableCell>
              <TableCell className="text-[#F5F5F5] font-mono">
                {company.debt_ratio.toFixed(0)}%
              </TableCell>
              <TableCell>
                <span
                  className={`font-mono ${
                    company.income_change_pct >= 0
                      ? 'text-[#39FF14]'
                      : 'text-[#FF1744]'
                  }`}
                >
                  {company.income_change_pct >= 0 ? '+' : ''}
                  {company.income_change_pct.toFixed(1)}%
                </span>
              </TableCell>
              <TableCell>
                <Badge className={getRiskBadgeColor(company.risk_level)}>
                  {company.risk_level}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## 페이지 라우트 생성

```tsx
// app/(dashboard)/real-estate/page.tsx
import { InterestRateSimulator } from '@/components/real-estate/InterestRateSimulator';

export default function RealEstatePage() {
  return <InterestRateSimulator />;
}
```

---

## 환경 변수 설정

```bash
# apps/web/.env.local

# SimViz Service URL
NEXT_PUBLIC_SIMVIZ_URL=http://localhost:8001

# Quant Engine URL (백업용)
NEXT_PUBLIC_QUANT_ENGINE_URL=http://localhost:8000
```

---

## 개발 서버 실행

### 터미널 1: Quant Engine
```bash
cd services/quant-engine
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

### 터미널 2: SimViz Service
```bash
cd services/simviz-service/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

### 터미널 3: Web Frontend
```bash
cd apps/web
pnpm dev
```

### 테스트
브라우저에서 `http://localhost:3000/real-estate` 접속

---

## 다음 단계

1. **실제 데이터 연동**: 한국거래소 API, 금융감독원 DART API에서 부동산 기업 재무 데이터 수집
2. **은행 데이터 추가**: 대출 관계 실제 데이터 연동
3. **히스토리 추적**: 시뮬레이션 결과 저장 및 비교 기능
4. **PDF 리포트 생성**: 시뮬레이션 결과를 PDF로 다운로드
5. **알림 시스템**: 특정 기업이 위험 수준에 도달하면 알림

---

**Last Updated:** 2025-10-31
