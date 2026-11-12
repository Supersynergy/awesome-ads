---
name: Keyword Health
description: Review Google Ads keyword health across quality score, keyword-level CPL or CPA, conversion quality, bid recommendations, and pause candidates. Use for weekly keyword reviews, low quality score diagnosis, expensive keywords, bid changes, and low-performer pause recommendations.
---

# Keyword Health

Use this skill when the work is keyword-level diagnosis and action planning. The goal is to identify which keywords deserve more budget, lower bids, landing page work, match type changes, or pausing.

## Start Here

1. Read any customized keyword-health instructions if available.
2. Discover connected Google Ads, analytics, CRM, and spreadsheet tools.
3. Confirm account, campaign scope, timezone, currency, date range, conversion actions, and KPI target.
4. Pull keyword performance with quality score components when available.
5. Compare keyword CPL, CPA, ROAS, conversion rate, CTR, CPC, impression share, and CRM quality.
6. Separate brand, competitor, prospecting, remarketing, and experimental keywords.
7. Diagnose quality score issues before recommending bid cuts.
8. Draft bid, match type, landing page, negative, or pause recommendations.
9. Apply changes only when explicit authority exists.

## Health Checks

Quality score:

- expected CTR
- ad relevance
- landing page experience
- keyword to ad group theme fit
- search term mismatch

Efficiency:

- CPL or CPA versus target
- conversion value or ROAS versus target
- spend with no conversions
- assisted or lagged conversions when available
- CRM stage quality and closed revenue when connected

Coverage:

- impression share lost to budget
- impression share lost to rank
- top of page rate
- absolute top rate
- eligible but low-volume keywords

## Recommendation Types

- `increase-bid` - efficient keyword is rank-limited or losing impression share to rank.
- `decrease-bid` - keyword converts but above target and not strategically required.
- `pause-candidate` - repeated spend without conversions or poor CRM quality after enough data.
- `quality-work` - quality score issue likely needs copy, structure, or landing page work.
- `match-type-change` - query behavior suggests tighter or broader matching.
- `keep-watching` - signal is interesting but data is not sufficient.

## Pause Rules

Do not recommend pausing solely from a tiny sample. Consider:

- minimum spend or click threshold from customized instructions
- conversion lag
- brand protection or strategic coverage
- whether negatives or match type tightening would solve the issue
- whether the landing page or tracking is broken

## Output Format

```text
Keyword health: <account>, <date window>.
Winners: <keywords to protect or scale>.
Issues: <quality score or efficiency problems>.
Recommendations: <bid, pause, match, landing page, or negative actions>.
Needs approval: <specific changes>.
Blocked: <missing data or none>.
```

