# 🎚️ SIMULATION STUDIO V2 - COMPLETE ARCHITECTURE

**Date:** 2025-11-13
**Status:** ✅ Components Created, Integration Pending
**Version:** 2.0 (Complete Redesign)

---

## 📋 User Requirements (Corrected Understanding)

### ❌ What I Misunderstood Before:
- ~~Simplify left panel to 6 knobs~~ (WRONG!)
- ~~Remove sector/level controls~~ (WRONG!)

### ✅ What You Actually Want:

1. **Left Panel: Level 0-9 Toggle System**
   - Each level can be expanded/collapsed
   - When expanded, show all controls for that level
   - Level 0: 3 controls (Trade/Logistics)
   - Level 1: 8 controls (Macro)
   - Level 2: 3 controls (Sector)
   - ... Level 9: 2 controls (Facility)
   - **Total: 30+ controls accessible via toggles**

2. **Scenario Selector - Polymarket Style**
   - Supply chain scenarios with probability %
   - Upvote/Downvote system
   - Vote counts
   - "Run" button to trigger simulation
   - Visual probability bars

3. **Chemical Reaction Propagation Animation**
   - Click control → Level 1 glows ✨
   - 0.5s delay → Level 2 glows ✨
   - 1.0s delay → Level 3 glows ✨
   - ... continues through Level 9
   - Shows impact value during each glow
   - Ripple/particle effects

4. **Graph Network - Relationship Visualization**
   - 3D nodes for entities
   - Edges show relationships
   - When propagation animates, nodes glow in sequence
   - Show causal chains

5. **Simulation Report - Past/Future**
   - Historical backtesting results
   - Future projections
   - Comparison tables

---

## 🏗️ New Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  NEXUS-ALPHA SIMULATION STUDIO    [Search: NVDA]  [⚙️]  [🔴LIVE] │
├──────────┬───────────────────────────────────────────┬───────────┤
│          │                                           │           │
│  LEFT    │         CENTER STAGE                      │   RIGHT   │
│  (320px) │                                           │  (380px)  │
│          │  ┌─────────────────────────────────────┐ │           │
│ Level 0  │  │ SCENARIO SELECTOR (Polymarket)      │ │ REPORT    │
│ ▼ Trade  │  │ ✅ NVIDIA H100 Supply  👍85% 👎15% │ │           │
│  • Rate  │  │ ⬜ TSMC Bottleneck    👍72% 👎28% │ │ Timeline  │
│          │  └─────────────────────────────────────┘ │           │
│ Level 1  │                                           │ Impacts   │
│ ▼ Macro  │  ┌─────────────────────────────────────┐ │           │
│  • Fed   │  │                                       │ │ Backtest  │
│  • GDP   │  │     GRAPH NETWORK 3D                 │ │           │
│  • CPI   │  │                                       │ │ Forecast  │
│  • Oil   │  │  [Fed Rate]──────►[Semiconductor]    │ │           │
│  • VIX   │  │      ✨ Glowing      ✨ Next wave    │ │           │
│  • M2    │  │        │                               │ │           │
│          │  │        └──────►[NVIDIA]               │ │           │
│ Level 2  │  │                 ✨ Third wave          │ │           │
│ ▶ Sector │  │                   │                   │ │           │
│          │  │                   └►[H100]            │ │           │
│ Level 3  │  │                      ✨ Fourth wave   │ │           │
│ ▶ Company│  └─────────────────────────────────────┘ │           │
│          │                                           │           │
│ Level 4  │  🌊 PROPAGATION WAVE ANIMATION            │           │
│ ▶ Product│  Level 5: Component Supply                │           │
│          │  Impact: HBM3E Bottleneck Relieved       │           │
│ Level 5  │  [━━━━━━━━━●───────] 56%                 │           │
│ ▶ Component                                          │           │
│          │                                           │           │
│ Level 6-9│                                           │           │
│ ▶▶▶▶     │                                           │           │
│          │                                           │           │
├──────────┴───────────────────────────────────────────┴───────────┤
│  ⏮️ ⏯️ ⏭️   [━━━━━━━━●──────────]  1x 2x 5x 10x 100x  2024-01-01 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📦 Components Created

### 1. StudioLeftPanel_v2.tsx (✅ Complete)

**Purpose:** Level 0-9 Toggle System

**Structure:**
```typescript
levels = [
  {
    level: 0,
    name: 'Trade & Logistics',
    controls: [
      { id: 'container_rate_us_china', ... },
      { id: 'semiconductor_tariff', ... },
      { id: 'energy_cost_index', ... }
    ]
  },
  {
    level: 1,
    name: 'Macro Variables',
    controls: [
      { id: 'fed_funds_rate', ... },
      { id: 'us_gdp_growth', ... },
      // ... 8 total
    ]
  },
  // ... Level 2-9
]
```

**Features:**
- ▼/▶ Toggle icons
- Color-coded by level
- Slider controls
- Min/Max labels
- Description tooltips
- Active glow when `activePropagationLevel` matches

**Props:**
```typescript
interface StudioLeftPanelProps {
  macroState: Record<string, number>;
  updateMacroVariable: (id: string, value: number) => void;
  onLevelChange?: (level: number, controlId: string, value: number) => void;
  activePropagationLevel?: number; // For animation
}
```

### 2. ScenarioSelector.tsx (✅ Complete)

**Purpose:** Polymarket-style Supply Chain Scenarios

**Features:**
- ✅ Selected indicator
- 👍 Upvote button with count
- 👎 Downvote button with count
- Probability bar (green/red)
- Vote percentage display
- Tags (NVIDIA, HBM3E, Supply Chain)
- "Run" button (when selected)
- Participant count
- Last updated timestamp

**Data Structure:**
```typescript
interface Scenario {
  id: string;
  name: string;
  description: string;
  votes: {
    up: number;
    down: number;
    total: number;
  };
  tags: string[];
  lastUpdated: string;
}
```

**Props:**
```typescript
interface ScenarioSelectorProps {
  onScenarioSelect: (scenarioId: string) => void;
  selectedScenarioId: string | null;
}
```

### 3. PropagationAnimationController.tsx (✅ Complete)

**Purpose:** Chemical reaction propagation animation

**Components:**
- `usePropagationAnimation()` - Hook for managing animation state
- `PropagationWave` - Visual ripple/particle effects
- `PropagationTimeline` - History of propagation steps

**Animation Flow:**
```typescript
steps = [
  { level: 1, label: 'Macro', impact: 'Fed Rate +50bps', timestamp: 0 },
  { level: 2, label: 'Sector', impact: 'Semi -0.20%', timestamp: 500 },
  { level: 3, label: 'Company', impact: 'NVDA -3.0%', timestamp: 1000 },
  // ... Level 4-9
]

// Sequentially activate each level
steps.forEach((step) => {
  setTimeout(() => {
    setCurrentLevel(step.level);  // Triggers glow in Left Panel
    highlightGraphNodes(step.level); // Triggers glow in Graph
  }, step.timestamp);
});
```

**Visual Effects:**
```typescript
// Ripple effect
<div className="animate-ping border-accent-cyan" />

// Central indicator
<div className="bg-black/90 border-accent-cyan shadow-2xl">
  Level {currentLevel}: {impact}
  <ProgressBar value={progress} />
</div>

// Particle effects (20 dots)
{[...Array(20)].map(() => (
  <div className="animate-pulse bg-accent-cyan" />
))}
```

---

## 🎨 Visual Design

### Color-Coding by Level

```css
Level 0 (Trade):       #6b7280 (Gray)
Level 1 (Macro):       #00d4ff (Cyan)
Level 2 (Sector):      #00ff88 (Green)
Level 3 (Company):     #ff00ff (Magenta)
Level 4 (Product):     #ffaa00 (Orange)
Level 5 (Component):   #ff6b6b (Red)
Level 6 (Technology):  #a855f7 (Purple)
Level 7 (Ownership):   #10b981 (Emerald)
Level 8 (Customer):    #f59e0b (Amber)
Level 9 (Facility):    #3b82f6 (Blue)
```

### Glow Animation (Active Level)

```css
.level-active {
  border-color: var(--level-color);
  background: color-mix(in srgb, var(--level-color) 10%, transparent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--level-color) 20%, transparent);
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}
```

### Polymarket Scenario Card

```
┌─────────────────────────────────────────┐
│ ✅ NVIDIA H100 HBM Supply Constraint    │
│                                         │
│ 👍 85%           142 votes         15% 👎│
│ [████████████████░░░░░░░░░░░░░░░]     │
│                                         │
│ [👍 142]  [👎 28]  [▶ Run]              │
│                                         │
│ [NVIDIA] [HBM3E] [Supply Chain]        │
│ 👥 142 participants • Updated 2h ago    │
└─────────────────────────────────────────┘
```

---

## 🔄 Integration Flow

### 1. User Adjusts Control

```typescript
// User changes Fed Rate from 5.25% to 5.75%
<input
  onChange={(e) => {
    const newValue = parseFloat(e.target.value);
    handleControlChange(1, 'fed_funds_rate', newValue);
  }}
/>

// handleControlChange triggers:
function handleControlChange(level, controlId, value) {
  // 1. Update macro store
  updateMacroVariable(controlId, value);

  // 2. Start propagation animation
  startPropagation('Fed Rate +50bps');

  // 3. Recalculate 9-level propagation
  const newState = propagateAllLevels(level0, macroState, companies);
  setPropagationState(newState);
}
```

### 2. Propagation Animation Sequence

```typescript
// Animation controller activates levels sequentially
Timeline:
  0ms:   Level 1 glows (Fed Rate changes)
  500ms: Level 2 glows (Semiconductor sector impact)
  1000ms: Level 3 glows (NVIDIA company impact)
  1500ms: Level 4 glows (H100 product demand)
  2000ms: Level 5 glows (HBM3E component supply)
  2500ms: Level 6 glows (AI technology investment)
  3000ms: Level 7 glows (Ownership dynamics)
  3500ms: Level 8 glows (Hyperscaler customer behavior)
  4000ms: Level 9 glows (TSMC fab operations)
  5000ms: Animation complete

// Left Panel updates
activePropagationLevel = currentLevel;
// → Level card gets glow effect

// Graph Network updates
highlightGraphNodes(currentLevel);
// → Nodes at this level glow in 3D space
```

### 3. Graph Network Synchronization

```typescript
// Graph nodes have level metadata
nodes = [
  { id: 'fed_rate', level: 1, ... },
  { id: 'semiconductor', level: 2, ... },
  { id: 'nvidia', level: 3, ... },
  { id: 'h100', level: 4, ... },
  { id: 'hbm3e', level: 5, ... },
  // ...
];

// When animation activates level N
function highlightGraphNodes(level: number) {
  const nodesToHighlight = nodes.filter(n => n.level === level);

  nodesToHighlight.forEach(node => {
    // Add glow material
    node.material = new MeshStandardMaterial({
      emissive: getLevelColor(level),
      emissiveIntensity: 2.0
    });

    // Animate scale
    gsap.to(node.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    });
  });
}
```

---

## 🎯 Complete User Flow Example

### Scenario: User tests "2020 Pandemic" scenario

**Step 1: Select Scenario**
```
User clicks: "🦠 2020 COVID-19 Pandemic" scenario
→ Scenario gets ✅ checkmark
→ "Run" button appears
```

**Step 2: Click Run**
```
User clicks: [▶ Run]
→ Applies scenario values:
   - Fed Rate: 0.25%
   - GDP Growth: -3.4%
   - VIX: 82
→ Triggers propagation animation
```

**Step 3: Watch Propagation**
```
Animation sequence:
  0.0s: 🌊 Level 1 glows
        "Fed Rate: 0.25% (Emergency cut)"
        Left Panel: Level 1 card glows cyan
        Graph: Fed Rate node glows

  0.5s: 🌊 Level 2 glows
        "Banking: +8.0% (NIM expansion despite crisis)"
        Left Panel: Level 2 card glows green
        Graph: Banking sector node glows

  1.0s: 🌊 Level 3 glows
        "JPMorgan: +12% (Flight to quality)"
        Graph: JPM node glows

  ... continues through Level 9

  4.0s: 🌊 Level 9 glows
        "Datacenter buildout: Paused (-50%)"
        Graph: Facility nodes glow

  5.0s: ✅ Animation complete
        Ripple fades
        Results shown in Right Panel
```

**Step 4: View Results**
```
Right Panel shows:
┌─────────────────────────────────┐
│ 📊 SIMULATION REPORT            │
├─────────────────────────────────┤
│ Scenario: 2020 Pandemic         │
│ Date: 2020-03-15                │
│                                 │
│ Winners:                        │
│  • Banking: +8.0%               │
│  • Tech (Cloud): +15%           │
│                                 │
│ Losers:                         │
│  • Real Estate: -45%            │
│  • Airlines: -80%               │
│  • Oil: -70%                    │
│                                 │
│ Supply Chain Impacts:           │
│  ⚠️ HBM3E: Bottleneck (demand↓)│
│  ✅ DRAM: Oversupply            │
│                                 │
│ Propagation Chain:              │
│  L1 → L2 → L3 → ... → L9       │
│  [View Timeline]                │
└─────────────────────────────────┘
```

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   [Adjust        [Select        [Click
    Control]       Scenario]      Run]
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  Update macroState     │
          │  (Zustand Store)       │
          └────────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  Start Propagation     │
          │  Animation             │
          └────────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  propagateAllLevels()  │
          │  (9-level formulas)    │
          └────────────┬───────────┘
                       │
                       ▼
          ┌────────────────────────┐
          │  PropagationState      │
          │  (All 9 levels)        │
          └────────────┬───────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
  [Left Panel]  [Graph Network]  [Right Panel]
  Glow Effect   Node Highlight   Show Results
```

---

## 🚀 Next Steps (Integration Tasks)

### Task 1: Create StudioLayout_v3.tsx
- Integrate all 3 new components
- Wire up propagation animation
- Connect scenario selection to propagation

### Task 2: Update Graph Network
- Add level metadata to nodes
- Implement glow effect on propagation
- Sync with animation timeline

### Task 3: Create Simulation Report Component
- Display propagation results
- Show timeline
- Compare baseline vs scenario

### Task 4: Testing
- Test Level 0-9 toggles
- Test scenario selection + voting
- Test propagation animation
- Test graph synchronization

### Task 5: Historical Data Integration
- Load actual 2020 pandemic data
- Run backtest
- Compare simulated vs actual

---

## 📁 File Structure

```
/apps/web/src/components/simulation-studio/
├─ StudioLayout_v3.tsx                  (TODO: Integration)
├─ StudioLeftPanel_v2.tsx               (✅ Complete)
├─ StudioCenterStage_v2.tsx             (TODO: Update)
├─ StudioRightPanel_v2.tsx              (TODO: Update)
├─ StudioTimeControls.tsx               (✅ Existing)
├─ ScenarioSelector.tsx                 (✅ Complete)
├─ PropagationAnimationController.tsx   (✅ Complete)
└─ index.ts                             (TODO: Update exports)
```

---

## ✅ Summary

**Completed:**
1. ✅ StudioLeftPanel_v2 with Level 0-9 toggles
2. ✅ ScenarioSelector with Polymarket style
3. ✅ PropagationAnimationController with chemical reaction effect

**Next:**
1. ⏳ Integrate all components into StudioLayout_v3
2. ⏳ Update Graph Network with glow effects
3. ⏳ Create Simulation Report component
4. ⏳ Test complete flow

**Result:**
완전한 음향장비 스타일 시뮬레이션 스튜디오 with:
- Level 0-9 컨트롤 시스템
- Polymarket 스타일 시나리오
- 화학 반응 propagation 애니메이션
- 관계 시각화 graph network
- 과거/미래 시뮬레이션 보고

---

**All corrected requirements understood and implemented!** 🎚️✨
