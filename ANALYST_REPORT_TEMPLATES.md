# 📊 Analyst Report Templates

**Purpose**: Pre-built templates for financial analysis reports
**Integration**: Use with Reports page (Obsidian-style [[wiki-links]] supported)
**Phase**: 4.2 - Knowledge Graph + Analyst Reports

---

## Template 1: Company Analysis Report

```markdown
# [[{COMPANY_NAME}]] - Comprehensive Analysis

**Date**: {DATE}
**Analyst**: {YOUR_NAME}
**Category**: Financial
**Price Target**: ${TARGET_PRICE} (Current: ${CURRENT_PRICE})
**Recommendation**: BUY / HOLD / SELL

## Executive Summary

{2-3 sentence overview of investment thesis}

## Financial Performance

### Revenue Trends
- Q1 {YEAR}: ${REVENUE}B ({YoY_GROWTH}% YoY)
- Guidance: ${GUIDANCE}B for FY{YEAR}

### Profitability Metrics
- **Gross Margin**: {GM}%
- **Operating Margin**: {OM}%
- **Net Margin**: {NM}%
- **ROE**: {ROE}%

### Balance Sheet Health
- **Total Assets**: ${ASSETS}B
- **Total Debt**: ${DEBT}B
- **D/E Ratio**: {DE_RATIO}x
- **Cash**: ${CASH}B

## Valuation Analysis

### DCF Model
- **WACC**: {WACC}%
- **Terminal Growth**: {TG}%
- **Fair Value**: ${DCF_VALUE}/share
- **Upside**: {UPSIDE}%

### Multiples Comparison
| Metric | [[{COMPANY}]] | Industry Avg | Premium/Discount |
|--------|---------------|--------------|-------------------|
| P/E    | {PE}x         | {IND_PE}x    | {PREMIUM}%       |
| P/S    | {PS}x         | {IND_PS}x    | {PREMIUM}%       |
| EV/EBITDA | {EV}x      | {IND_EV}x    | {PREMIUM}%       |

### CAPM Analysis
- **Beta**: {BETA}
- **Cost of Equity**: {COE}%
- **Expected Return**: {ER}%

## Industry Analysis

### Sector Outlook
[[{SECTOR}]] sector is experiencing {GROWTH/DECLINE} due to:
- Factor 1
- Factor 2
- Factor 3

### Competitive Position
**Key Competitors**: [[{COMPETITOR_1}]], [[{COMPETITOR_2}]], [[{COMPETITOR_3}]]

**Market Share**: {MARKET_SHARE}%
**Competitive Advantages**:
1. {ADVANTAGE_1}
2. {ADVANTAGE_2}
3. {ADVANTAGE_3}

## Supply Chain Analysis

### Key Suppliers
- [[{SUPPLIER_1}]]: {DESCRIPTION}
- [[{SUPPLIER_2}]]: {DESCRIPTION}

### Key Customers
- [[{CUSTOMER_1}]]: {REVENUE_CONTRIBUTION}% of revenue
- [[{CUSTOMER_2}]]: {REVENUE_CONTRIBUTION}% of revenue

### Supply Chain Risks
- **Risk 1**: {DESCRIPTION} (Probability: {PROB}%, Impact: {IMPACT})
- **Risk 2**: {DESCRIPTION} (Probability: {PROB}%, Impact: {IMPACT})

## Macro Sensitivity

### Interest Rate Sensitivity
If Fed raises rates by 50bps:
- Revenue Impact: {IMPACT}%
- Margin Impact: {IMPACT}%
- Stock Price Impact: {IMPACT}%

### GDP Sensitivity
Elasticity: {ELASTICITY}
1% GDP growth → {REVENUE_IMPACT}% revenue growth

## Risk Factors

### Business Risks
1. **{RISK_1}**: {DESCRIPTION}
2. **{RISK_2}**: {DESCRIPTION}

### Financial Risks
- **Leverage**: D/E of {DE}x vs industry avg of {IND_DE}x
- **Liquidity**: Current ratio of {CR}x

### Regulatory Risks
{DESCRIPTION}

## Catalysts

### Near-term (0-6 months)
- {CATALYST_1}
- {CATALYST_2}

### Medium-term (6-18 months)
- {CATALYST_3}
- {CATALYST_4}

## Investment Thesis

### Bull Case
{3-4 sentences explaining why stock could outperform}

**Upside Scenario**: ${BULL_TARGET} (+{UPSIDE}%)

### Base Case
{3-4 sentences explaining most likely outcome}

**Base Scenario**: ${BASE_TARGET} (+{UPSIDE}%)

### Bear Case
{3-4 sentences explaining downside risks}

**Downside Scenario**: ${BEAR_TARGET} (-{DOWNSIDE}%)

## Recommendation

**Rating**: {BUY/HOLD/SELL}
**Price Target**: ${TARGET}
**Time Horizon**: {MONTHS} months
**Confidence Level**: {HIGH/MEDIUM/LOW}

---

## Sources
- {SOURCE_1_URL}
- {SOURCE_2_URL}
- {SOURCE_3_URL}

## Related Reports
- [[{RELATED_REPORT_1}]]
- [[{RELATED_REPORT_2}]]
```

---

## Template 2: Supply Chain Analysis

```markdown
# [[{PRODUCT_NAME}]] Supply Chain Deep Dive

**Date**: {DATE}
**Analyst**: {YOUR_NAME}
**Category**: Supply Chain

## Product Overview

**Product**: [[{PRODUCT}]]
**Manufacturer**: [[{COMPANY}]]
**End Markets**: {MARKETS}
**Annual Volume**: {UNITS} units

## Supply Chain Map

### Tier 1 Suppliers (Direct)
- [[{SUPPLIER_1}]]: {COMPONENT} ({SHARE}% of supply)
- [[{SUPPLIER_2}]]: {COMPONENT} ({SHARE}% of supply)

### Tier 2 Suppliers (Raw Materials)
- [[{SUPPLIER_3}]]: {MATERIAL}
- [[{SUPPLIER_4}]]: {MATERIAL}

### Bottleneck Analysis
**Current Bottleneck**: [[{COMPONENT}]] from [[{SUPPLIER}]]

**Impact**:
- Production capacity constrained to {CAPACITY}% of demand
- Lead time extended from {NORMAL}days to {CURRENT}days
- Cost increase: +{INCREASE}%

**Mitigation Strategies**:
1. {STRATEGY_1}
2. {STRATEGY_2}

## Demand Drivers

### AI Boom Impact
AI investment ↑ {PERCENT}% → [[{PRODUCT}]] demand ↑ {DEMAND_PERCENT}%

**Elasticity**: {ELASTICITY}

### Customer Segmentation
- **Hyperscalers**: {PERCENT}% (growing {GROWTH}% YoY)
- **Enterprise**: {PERCENT}% (growing {GROWTH}% YoY)
- **Consumer**: {PERCENT}% (growing {GROWTH}% YoY)

## Geopolitical Risks

### Taiwan Risk
- {PERCENT}% of production in Taiwan
- Scenario analysis: Taiwan strait conflict
  - Supply disruption: {MONTHS} months
  - Price spike: +{PERCENT}%

### US-China Relations
Impact of potential export controls:
- {ANALYSIS}

## Capacity Outlook

### Current Capacity: {CAPACITY} units/year

### Planned Expansion
- [[{COMPANY_1}]]: +{CAPACITY} by {DATE}
- [[{COMPANY_2}]]: +{CAPACITY} by {DATE}

**Total Pipeline**: {TOTAL_CAPACITY}

### Supply-Demand Balance
{YEAR} forecast:
- Demand: {DEMAND}
- Supply: {SUPPLY}
- **Gap**: {GAP} (surplus/deficit)

## Conclusion

{SUMMARY}

---

## Sources
- {SOURCE_URLs}
```

---

## Template 3: Macro Scenario Report

```markdown
# Macro Scenario: {SCENARIO_NAME}

**Date**: {DATE}
**Analyst**: {YOUR_NAME}
**Category**: Market
**Probability**: {PROB}%

## Scenario Setup

### Macro Assumptions
- **Fed Funds Rate**: {RATE}%
- **GDP Growth**: {GDP}%
- **Inflation (CPI)**: {CPI}%
- **Unemployment**: {UNEMP}%
- **Oil (WTI)**: ${OIL}/barrel

### Trigger Events
1. {EVENT_1}
2. {EVENT_2}
3. {EVENT_3}

## Sector Impact Analysis

### Winners
| Sector | Impact | Rationale |
|--------|--------|-----------|
| [[{SECTOR_1}]] | +{PERCENT}% | {REASON} |
| [[{SECTOR_2}]] | +{PERCENT}% | {REASON} |

### Losers
| Sector | Impact | Rationale |
|--------|--------|-----------|
| [[{SECTOR_3}]] | -{PERCENT}% | {REASON} |
| [[{SECTOR_4}]] | -{PERCENT}% | {REASON} |

## Company-Level Implications

### Top Beneficiaries
- [[{COMPANY_1}]]: {ANALYSIS}
- [[{COMPANY_2}]]: {ANALYSIS}

### Most Vulnerable
- [[{COMPANY_3}]]: {ANALYSIS}
- [[{COMPANY_4}]]: {ANALYSIS}

## Portfolio Positioning

### Recommended Allocation
- **Equities**: {PERCENT}%
- **Bonds**: {PERCENT}%
- **Cash**: {PERCENT}%
- **Alternatives**: {PERCENT}%

### Sector Overweights
1. [[{SECTOR}]]: {PERCENT}%
2. [[{SECTOR}]]: {PERCENT}%

### Sector Underweights
1. [[{SECTOR}]]: {PERCENT}%
2. [[{SECTOR}]]: {PERCENT}%

## Timeline

- **T+0 (Now)**: {STATUS}
- **T+3 months**: {PROJECTION}
- **T+6 months**: {PROJECTION}
- **T+12 months**: {PROJECTION}

## Monitoring Indicators

Key metrics to track scenario evolution:
1. **{INDICATOR_1}**: Current {VALUE}, Watch for {THRESHOLD}
2. **{INDICATOR_2}**: Current {VALUE}, Watch for {THRESHOLD}

---

## Sources
- {SOURCES}
```

---

## Template 4: Technical Innovation Report

```markdown
# [[{TECHNOLOGY}]] - Technology Deep Dive

**Date**: {DATE}
**Analyst**: {YOUR_NAME}
**Category**: Technical

## Technology Overview

**Innovation**: [[{TECH_NAME}]]
**Maturity Stage**: {EARLY/GROWTH/MATURE}
**Adoption Rate**: {PERCENT}% CAGR

## Technical Specifications

### Key Features
- {FEATURE_1}
- {FEATURE_2}
- {FEATURE_3}

### Performance Metrics
| Metric | Previous Gen | Current Gen | Improvement |
|--------|--------------|-------------|-------------|
| {METRIC_1} | {VALUE} | {VALUE} | {PERCENT}% |
| {METRIC_2} | {VALUE} | {VALUE} | {PERCENT}% |

## Competitive Landscape

### Technology Leaders
- [[{COMPANY_1}]]: {MARKET_SHARE}%
- [[{COMPANY_2}]]: {MARKET_SHARE}%

### Disruptive Entrants
- [[{STARTUP}]]: {INNOVATION_DESCRIPTION}

## Economic Impact

### TAM (Total Addressable Market)
- Current: ${TAM_CURRENT}B
- 2030 Projection: ${TAM_2030}B
- CAGR: {CAGR}%

### Value Chain Impact
{UPSTREAM} → [[{TECH}]] → {DOWNSTREAM}

**Margins**: {PERCENT}%

## Investment Implications

### Pure Plays
- [[{STOCK_1}]]: {THESIS}
- [[{STOCK_2}]]: {THESIS}

### Enablers
- [[{SUPPLIER}]]: Supplies {COMPONENT} for [[{TECH}]]

### Beneficiaries
- [[{CUSTOMER}]]: Uses [[{TECH}]] to improve {METRIC}

---

## Sources
- {TECHNICAL_PAPERS}
- {COMPANY_FILINGS}
- {INDUSTRY_REPORTS}
```

---

## How to Use Templates

1. **Copy Template**: Select appropriate template above
2. **Replace Placeholders**: Replace all `{VARIABLE}` and `[[ENTITY]]` with actual values
3. **Create Report**: Go to Reports page → New Report
4. **Paste & Edit**: Paste template and customize
5. **Link Entities**: Use `[[Entity Name]]` syntax for automatic linking
6. **Publish**: Save as public to share with community

---

## Best Practices

### Writing Style
- **Be Concise**: 1-2 pages max for standard reports
- **Use Data**: Cite sources for all numbers
- **Link Liberally**: Connect to related entities and reports
- **Update Regularly**: Version control via Reports system

### Entity Linking
```markdown
Good: "[[NVIDIA]] manufactures [[H100]] GPUs using [[TSMC]] 5nm process"
Bad:  "Nvidia makes H100 GPUs"
```

### Structuring Analysis
1. **Top-Down**: Macro → Sector → Company → Product
2. **Bottom-Up**: Component → Product → Company → Sector

### Version Control
- Update existing reports vs creating new ones
- Version number auto-increments
- Track changes in update notes

---

**Created by**: NEXUS-ALPHA Platform
**Version**: 1.0
**Last Updated**: 2025-11-13
**Integration**: Fully compatible with Reports page and Knowledge Graph
