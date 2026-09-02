export const metricsCatalog = [
  {
    "family": "Agile & Flow",
    "name": "Velocity",
    "meaning": "Completed estimate per sprint",
    "formula": "Trend; do not compare teams blindly",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Throughput",
    "meaning": "Completed work items per period",
    "formula": "Count completed items consistently",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Cycle Time",
    "meaning": "Elapsed time from work started to done",
    "formula": "Done date \u2212 start date",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Lead Time",
    "meaning": "Elapsed time from request to delivery",
    "formula": "Done date \u2212 request date",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Work in Progress",
    "meaning": "Started but unfinished items",
    "formula": "Count active items",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "WIP Age",
    "meaning": "Age of active unfinished work",
    "formula": "Today \u2212 start date",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Blocker Age",
    "meaning": "Time work remains blocked",
    "formula": "Today \u2212 blocked date",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Carry-over %",
    "meaning": "Committed sprint work moved forward",
    "formula": "Carry-over / committed \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Sprint Goal Success",
    "meaning": "Sprints achieving stated goal",
    "formula": "Goals achieved / sprints \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Predictability",
    "meaning": "Delivered vs committed work",
    "formula": "Delivered / committed \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Flow Efficiency",
    "meaning": "Active work time vs elapsed time",
    "formula": "Active time / cycle time \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Agile & Flow",
    "name": "Scope Churn",
    "meaning": "Scope changed during delivery period",
    "formula": "Changed / baseline scope \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Defect Trend",
    "meaning": "Opened/closed defects over time",
    "formula": "Trend by severity and period",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Escaped Defects",
    "meaning": "Defects discovered after release",
    "formula": "Count production defects",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Rework Rate",
    "meaning": "Work repeated due to defect/change",
    "formula": "Rework / completed work \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Test Pass Rate",
    "meaning": "Executed tests passing",
    "formula": "Passed / executed \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Automation Coverage",
    "meaning": "Eligible tests automated",
    "formula": "Automated / eligible \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Deployment Frequency",
    "meaning": "Production deployments per period",
    "formula": "DORA deployment frequency",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Lead Time for Changes",
    "meaning": "Commit-to-production elapsed time",
    "formula": "DORA lead time for changes",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Change Failure Rate",
    "meaning": "Deployments causing failure/remediation",
    "formula": "Failed changes / deployments \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Quality & Engineering",
    "name": "Recovery Time",
    "meaning": "Time to restore service after failure",
    "formula": "DORA recovery-time measure",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Milestone On-time %",
    "meaning": "Milestones achieved by baseline date",
    "formula": "On-time / completed \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Milestone Forecast Variance",
    "meaning": "Forecast vs baseline date",
    "formula": "Forecast \u2212 baseline date",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Schedule Variance",
    "meaning": "Earned-value schedule variance",
    "formula": "EV \u2212 PV",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "SPI",
    "meaning": "Schedule Performance Index",
    "formula": "EV / PV",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "CPI",
    "meaning": "Cost Performance Index",
    "formula": "EV / AC",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Risk Exposure",
    "meaning": "Weighted open risk exposure",
    "formula": "\u03a3 probability \u00d7 impact",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Risk Materialisation %",
    "meaning": "Risks becoming issues",
    "formula": "Materialised / closed risks \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Issue Resolution Time",
    "meaning": "Elapsed time to close issues",
    "formula": "Median/P85 close \u2212 open",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Dependency On-time %",
    "meaning": "Dependencies delivered by due date",
    "formula": "On-time / due \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Dependency Health",
    "meaning": "Criticality, age and status signal",
    "formula": "Transparent evidence-based heuristic",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Decision Cycle Time",
    "meaning": "Time from decision need to decision",
    "formula": "Decision date \u2212 raised date",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Project Delivery",
    "name": "Action Closure %",
    "meaning": "Actions closed by due date",
    "formula": "On-time closed / due \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "Budget Variance",
    "meaning": "Approved budget vs EAC",
    "formula": "Budget \u2212 EAC",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "Budget Consumed %",
    "meaning": "Actual spend vs budget",
    "formula": "Actual / budget \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "ETC",
    "meaning": "Expected remaining cost",
    "formula": "Forecast estimate to complete",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "EAC",
    "meaning": "Expected total cost",
    "formula": "Actual + ETC",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "Contingency Consumption",
    "meaning": "Contingency already used",
    "formula": "Used / approved contingency \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "Burn Rate",
    "meaning": "Average spend per period",
    "formula": "Recent actual cost / periods",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Financial",
    "name": "Forecast Variance %",
    "meaning": "Budget vs EAC percentage",
    "formula": "(Budget \u2212 EAC)/Budget \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "Benefit Realisation %",
    "meaning": "Measured benefit vs target",
    "formula": "(Actual\u2212Baseline)/(Target\u2212Baseline) \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "OKR Progress",
    "meaning": "Key-result progress",
    "formula": "Normalised baseline-to-target progress",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "Time to Value",
    "meaning": "Time to first evidenced value",
    "formula": "Evidence date \u2212 start/release",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "Outcome Evidence Coverage",
    "meaning": "Benefits with current evidence",
    "formula": "Evidenced / total benefits \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "Value Confidence",
    "meaning": "Confidence in benefit evidence",
    "formula": "Evidence completeness heuristic",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Value & Outcomes",
    "name": "Delivery-to-Value Gap",
    "meaning": "Delivery completion vs realised value",
    "formula": "Delivery % \u2212 value %",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Programme Milestone On-time %",
    "meaning": "Programme milestone reliability",
    "formula": "On-time / total programme milestones \u00d7 100",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Cross-project Dependency Health",
    "meaning": "Programme dependency health",
    "formula": "Weighted dependency health",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Programme Risk Exposure",
    "meaning": "Aggregate/systemic risk exposure",
    "formula": "Weighted exposure + concentration",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Programme Decision Cycle Time",
    "meaning": "Governance decision speed",
    "formula": "Median decision cycle",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Shared Capacity Coverage",
    "meaning": "Available shared capacity vs demand",
    "formula": "Capacity / demand \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Programme",
    "name": "Programme Benefit Realisation",
    "meaning": "Programme outcomes realised",
    "formula": "Normalised benefit progress",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Strategic Alignment Score",
    "meaning": "Investment fit to strategic themes",
    "formula": "Weighted strategy score",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Investment by Strategic Theme",
    "meaning": "Funding distribution by theme",
    "formula": "Funding/spend by strategic theme",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Portfolio WIP",
    "meaning": "Active initiatives",
    "formula": "Count active initiatives",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Portfolio Throughput",
    "meaning": "Initiatives completed per period",
    "formula": "Count completed initiatives",
    "indicator": "Lagging",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Portfolio Capacity Coverage",
    "meaning": "Capacity vs portfolio demand",
    "formula": "Available / demand \u00d7 100",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Benefits Pipeline",
    "meaning": "Planned/forecast/realised benefits",
    "formula": "Value by realisation stage",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Risk Concentration",
    "meaning": "Exposure concentrated in theme/vendor/capability",
    "formula": "Share of exposure by concentration",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  },
  {
    "family": "Portfolio",
    "name": "Investment Health",
    "meaning": "Value + delivery + financial signal",
    "formula": "Transparent weighted heuristic",
    "indicator": "Leading",
    "caution": "Use trends and context. Never use this metric alone to judge an individual's performance."
  }
] as const;
