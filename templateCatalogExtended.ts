export type TemplateItem={name:string;level:string;purpose:string;sheet:string;fields?:string[]};
export type TemplateArea={area:string;workbook:string;templates:TemplateItem[]};

export const templateAreas:TemplateArea[]=[
{area:'Dependencies',workbook:'/downloads/DeliverIQ_Dependencies_Toolkit.xlsx',templates:[
{name:'Basic Dependency Register',level:'Starter',purpose:'Single-project log of what you are waiting on from others.',sheet:'01 Basic Dependency Register',fields:['Dependency','Provider','Consumer','Owner','Due Date','Status']},
{name:'Cross-Team Dependency Register',level:'Professional / AI-ready',purpose:'Multi-attribute register for tracking dependencies between teams.',sheet:'02 CrossTeam Dependency Registe',fields:['Dependency','Provider Team','Consumer Team','Dependency Type','Owner','Due Date','Criticality','Impact','Escalation','Status']},
{name:'Programme Dependency Heatmap',level:'Executive',purpose:'Roll-up view of the riskiest cross-project dependencies for leadership.',sheet:'03 Programme Dependency Heatmap',fields:['Project','Dependency','Upstream','Downstream','Criticality','Due Date','Days at Risk','Executive Action']},
{name:'Dependency Impact Assessment',level:'Professional / AI-ready',purpose:'Models the knock-on effect if a specific dependency slips.',sheet:'04 Dependency Impact Assessment',fields:['Dependency','Slip Scenario','Milestones Affected','Projects Affected','Risk Exposure','Mitigation','Decision Required']},
{name:'Dependency Scoring Guide',level:'Reference',purpose:'How to score criticality, set RAG thresholds, and read the heatmap.',sheet:'05 Dependency Scoring Guide'},
{name:'Escalation & SLA Tracker',level:'Operational',purpose:'Tracks who a dependency was escalated to, when, and against what SLA.',sheet:'06 Escalation & SLA Tracker'},
{name:'Dependency Health Dashboard',level:'Analysis',purpose:'Live counts and RAG split calculated from the registers, by formula.',sheet:'07 Dependency Health Dashboard'}]},
{area:'RAID',workbook:'/downloads/DeliverIQ_RAID_Toolkit.xlsx',templates:[
{name:'Simple RAID Log',level:'Starter',purpose:'Single flat list of Risks, Assumptions, Issues and Dependencies.',sheet:'01 Simple RAID Log',fields:['Type','Title','Owner','Status','Due Date']},
{name:'Scored RAID Register',level:'Professional / AI-ready',purpose:'Adds probability x impact scoring and RAG to prioritise items.',sheet:'02 Scored RAID Register',fields:['Type','Title','Probability','Impact','Score','RAG','Owner','Mitigation','Target Date','Escalation']},
{name:'Executive RAID Summary',level:'Executive',purpose:'Top items only, framed as business impact for leadership.',sheet:'03 Executive RAID Summary',fields:['Top Item','Business Impact','Trend','Owner','Decision Needed','Target Resolution']},
{name:'Technical Migration RAID',level:'Specialist',purpose:'Domain-specific RAID for technical / data migration risk.',sheet:'04 Technical Migration RAID',fields:['Domain','Risk/Issue','Data/System','Environment','Probability','Impact','Mitigation','Fallback','Owner']},
{name:'RAID Scoring Guide',level:'Reference',purpose:'Probability/impact scale, scoring matrix, and RAID definitions.',sheet:'05 RAID Scoring Guide'},
{name:'Assumptions Log',level:'Deep-dive',purpose:'Dedicated tracker for assumptions - the most-neglected RAID category.',sheet:'06 Assumptions Log'},
{name:'RAID Trend Tracker',level:'Analysis',purpose:'Week-over-week counts by type and RAG, calculated by formula.',sheet:'07 RAID Trend Tracker'}]},
{area:'RACI',workbook:'/downloads/DeliverIQ_RACI_Toolkit.xlsx',templates:[
{name:'Basic RACI Matrix',level:'Starter',purpose:'Simple activity-by-role responsibility matrix.',sheet:'01 Basic RACI Matrix',fields:['Activity','Responsible','Accountable','Consulted','Informed']},
{name:'Project Governance RACI',level:'Professional / AI-ready',purpose:'Deliverable-level RACI across the full governance structure.',sheet:'02 Project Governance RACI',fields:['Deliverable','Sponsor','PM','Delivery Lead','Business','Technology','Vendor','PMO']},
{name:'Programme RACI',level:'Executive',purpose:'Decision rights across programme-level roles and SteerCo.',sheet:'03 Programme RACI',fields:['Decision / Outcome','Programme Director','Project Leads','Architecture','Finance','Risk','SteerCo']},
{name:'Agile Team RACI',level:'Agile',purpose:'Scrum-team responsibility split for common agile ceremonies/artefacts.',sheet:'04 Agile Team RACI',fields:['Activity','Product Owner','Scrum Master','Developers','Architect','Business']},
{name:'RACI Facilitation Guide',level:'Reference',purpose:'Rules for building a valid RACI and running the workshop.',sheet:'05 RACI Facilitation Guide'},
{name:'RACI Validation Checklist',level:'Reference',purpose:'Automated-style checks to catch the most common RACI mistakes.',sheet:'06 RACI Validation Checklist'},
{name:'Decision Rights Matrix',level:'Deep-dive',purpose:'Extends RACI with Recommend/Decide/Perform for high-stakes calls.',sheet:'07 Decision Rights Matrix'}]},
{area:'Status Reporting',workbook:'/downloads/DeliverIQ_StatusReporting_Toolkit.xlsx',templates:[
{name:'One-Page Weekly Status',level:'Starter',purpose:'Single-page team-level status for weekly circulation.',sheet:'01 OnePage Weekly Status',fields:['Overall RAG','Achievements','Next Week','Risks','Issues','Decisions']},
{name:'Executive Status Report',level:'Executive',purpose:'Summarised health, milestones, financials and asks for leadership.',sheet:'02 Executive Status Report',fields:['Executive Summary','Delivery Health','Milestones','Financials','RAID','Decisions','Asks']},
{name:'Programme Status Pack',level:'Executive / Programme',purpose:'Roll-up across multiple projects for programme boards.',sheet:'03 Programme Status Pack',fields:['Programme Health','Project RAG','Cross-Project Dependencies','Benefits','Financials','Executive Actions']},
{name:'Agile Delivery Health Report',level:'Agile',purpose:'Sprint-level throughput and predictability metrics.',sheet:'04 Agile Delivery Health Report',fields:['Sprint Goal','Throughput','Carry-over','Blocked','Defects','Predictability','Actions']},
{name:'RAG Definitions & Thresholds',level:'Reference',purpose:'What Green/Amber/Red mean and when to change status.',sheet:'05 RAG Definitions & Thresholds'},
{name:'Reporting Cadence & Calendar',level:'Operational',purpose:'Who reports what, to whom, and by when.',sheet:'06 Reporting Cadence & Calendar'},
{name:'Status Metrics Glossary',level:'Reference',purpose:'Plain-English definitions of SPI, CPI, predictability and more.',sheet:'07 Status Metrics Glossary'}]},
{area:'Planning',workbook:'/downloads/DeliverIQ_Planning_Toolkit.xlsx',templates:[
{name:'Project Charter',level:'Starter',purpose:'Foundational one-page mandate: purpose, scope, governance.',sheet:'01 Project Charter',fields:['Purpose','Objectives','Scope','Out of Scope','Milestones','Governance','Success Measures']},
{name:'Delivery Plan',level:'Professional / AI-ready',purpose:'Workstream-level milestones, owners and dates.',sheet:'02 Delivery Plan',fields:['Workstream','Milestone','Owner','Start','Finish','Dependency','Status']},
{name:'90-Day Mobilisation Plan',level:'Leadership',purpose:'First-90-days plan for standing up a new project or team.',sheet:'03 90Day Mobilisation Plan',fields:['Period','Objective','Deliverables','Stakeholders','Risks','Measures']},
{name:'Hybrid Project Plan',level:'Hybrid',purpose:'Blends waterfall phases with agile epics/sprints.',sheet:'04 Hybrid Project Plan',fields:['Phase','Epic','Milestone','Sprint/Date','Owner','Acceptance','Status']},
{name:'Milestone Schedule (Gantt-style)',level:'Deep-dive',purpose:'Sequenced milestones with dependencies and duration.',sheet:'05 Milestone Schedule (Gantt)'},
{name:'Resource Plan',level:'Deep-dive',purpose:'Role-level allocation, FTE %, and start/end dates.',sheet:'06 Resource Plan'},
{name:'Assumptions & Constraints',level:'Reference',purpose:'Dedicated, fuller version of the Charter assumptions section.',sheet:'07 Assumptions & Constraints'}]},
{area:'Cutover & Release',workbook:'/downloads/DeliverIQ_CutoverRelease_Toolkit.xlsx',templates:[
{name:'Cutover Checklist',level:'Starter',purpose:'Sequenced high-level cutover task list.',sheet:'01 Cutover Checklist',fields:['Task','Owner','Sequence','Validation','Status']},
{name:'Detailed Cutover Runbook',level:'Professional / AI-ready',purpose:'Minute-by-minute execution runbook with rollback per step.',sheet:'02 Detailed Cutover Runbook',fields:['Step','Start','Duration','Owner','Dependency','Command','Validation','Rollback','Status']},
{name:'Go/No-Go Readiness',level:'Executive',purpose:'Go/No-Go criteria and sign-off for the cutover decision.',sheet:'03 GoNoGo Readiness',fields:['Criterion','Evidence','Owner','Status','Exception','Decision']},
{name:'Hypercare Tracker',level:'Professional / AI-ready',purpose:'Post-go-live issue tracking during the hypercare window.',sheet:'04 Hypercare Tracker',fields:['Issue','Severity','Owner','Opened','Workaround','Resolution','Status']},
{name:'Rollback Decision Guide',level:'Reference',purpose:'Trigger criteria and roles for invoking rollback.',sheet:'05 Rollback Decision Guide'},
{name:'Cutover Communication Plan',level:'Deep-dive',purpose:'Who is told what, at which point in the cutover, via which channel.',sheet:'06 Cutover Communication Plan'},
{name:'Environment Readiness',level:'Deep-dive',purpose:'Pre-cutover technical readiness sign-off by environment.',sheet:'07 Environment Readiness'}]},
{area:'Benefits & Value',workbook:'/downloads/DeliverIQ_BenefitsValue_Toolkit.xlsx',templates:[
{name:'Benefits Register',level:'Starter',purpose:'Master list of benefits, baseline, target and status.',sheet:'01 Benefits Register',fields:['Benefit','Owner','Baseline','Target','Actual','Target Date']},
{name:'Benefits Realisation Plan',level:'Professional / AI-ready',purpose:'Links outcomes to benefits, KPIs and measurement source.',sheet:'02 Benefits Realisation Plan',fields:['Outcome','Benefit','KPI','Baseline','Target','Measurement Source','Owner','Realisation Date']},
{name:'OKR Tracker',level:'Agile',purpose:'Objective/Key Result tracking for value delivery.',sheet:'03 OKR Tracker',fields:['Objective','Key Result','Baseline','Target','Actual','Owner','Confidence']},
{name:'Value Governance Dashboard',level:'Executive',purpose:'Investment vs realised benefit, with confidence and decision.',sheet:'04 Value Governance Dashboard',fields:['Investment','Planned Benefit','Realised Benefit','Evidence','Confidence','Decision']},
{name:'Benefits Dependency Map',level:'Deep-dive',purpose:'Which deliverables and workstreams must land for each benefit.',sheet:'05 Benefits Dependency Map'},
{name:'Business Case Summary',level:'Deep-dive',purpose:'Cost, benefit, payback and ROI placeholders with formulas.',sheet:'06 Business Case Summary'},
{name:'Benefits Review Log',level:'Operational',purpose:'Cadence and outcomes of periodic benefits review meetings.',sheet:'07 Benefits Review Log'}]},
{area:'Change Control',workbook:'/downloads/DeliverIQ_ChangeControl_Toolkit.xlsx',templates:[
{name:'Simple Change Request',level:'Starter',purpose:'Single-form request for a scope, schedule or cost change.',sheet:'01 Simple Change Request',fields:['Change','Reason','Requested By','Owner','Status']},
{name:'Full Change Impact Assessment',level:'Professional / AI-ready',purpose:'Multi-dimension impact scoring before a change is approved.',sheet:'02 Full Change Impact Assessmen',fields:['Scope Impact','Schedule Impact','Cost Impact','Capacity Impact','Risk Impact','Benefit Impact','Recommendation']},
{name:'Change Control Board Pack',level:'Executive',purpose:'Options analysis and recommendation for the CCB to decide.',sheet:'03 Change Control Board Pack',fields:['Change','Business Need','Options','Impact','Recommendation','Decision']},
{name:'Agile Scope Change Log',level:'Agile',purpose:'Backlog-level scope changes and Product Owner decisions.',sheet:'04 Agile Scope Change Log',fields:['Change','Epic/Feature','Reason','Priority Shift','Sprint Impact','PO Decision']},
{name:'Change Log (Master Index)',level:'Reference',purpose:'Single running index of every CR raised, for traceability.',sheet:'05 Change Log (Master Index)'},
{name:'CCB Meeting Minutes Template',level:'Operational',purpose:'Structured record of each Change Control Board meeting.',sheet:'06 CCB Meeting Minutes Template'},
{name:'Change Impact Scoring Guide',level:'Reference',purpose:'Thresholds that decide which approval route a change takes.',sheet:'07 Change Impact Scoring Guide'}]},
{area:'Stakeholders',workbook:'/downloads/DeliverIQ_Stakeholders_Toolkit.xlsx',templates:[
{name:'Stakeholder Map',level:'Starter',purpose:'Influence/interest map with sentiment and engagement strategy.',sheet:'01 Stakeholder Map',fields:['Stakeholder','Role','Influence','Interest','Engagement']},
{name:'Stakeholder Engagement Plan',level:'Professional / AI-ready',purpose:'Needs, strategy, channel and cadence per stakeholder.',sheet:'02 Stakeholder Engagement Plan',fields:['Stakeholder','Needs','Influence','Interest','Strategy','Channel','Cadence','Owner']},
{name:'Stakeholder RACI Pack',level:'Professional / AI-ready',purpose:'Decision rights for each stakeholder across key decisions.',sheet:'03 Stakeholder RACI Pack',fields:['Stakeholder','Decision Rights','R','A','C','I','Engagement','Escalation']},
{name:'Communication Calendar',level:'Operational',purpose:'Scheduled communications by audience and channel.',sheet:'04 Communication Calendar',fields:['Audience','Message','Channel','Frequency','Owner','Next Date']},
{name:'Power-Interest Grid Guide',level:'Reference',purpose:'How to place stakeholders on the grid and what each quadrant means.',sheet:'05 Power-Interest Grid Guide'},
{name:'Sentiment Tracker',level:'Deep-dive',purpose:'Sentiment over time, to catch a stakeholder drifting negative early.',sheet:'06 Sentiment Tracker'},
{name:'Engagement Action Log',level:'Operational',purpose:'Specific follow-up actions committed to individual stakeholders.',sheet:'07 Engagement Action Log'}]}
];

export const supplementalTemplates=[
{name:'Capacity Plan',area:'Resource & Capacity',href:'/templates/capacity-plan.csv'},
{name:'Budget & Forecast Tracker',area:'Financial Control',href:'/templates/budget-forecast-tracker.csv'},
{name:'Requirements Traceability Register',area:'Requirements',href:'/templates/requirements-traceability.csv'},
{name:'Action Log',area:'Governance & Execution',href:'/templates/action-log.csv'},
{name:'Decision Log',area:'Governance & Decisions',href:'/templates/decision-log.csv'},
{name:'Meeting → Governance Pack',area:'Governance & Meetings',href:'/templates/meeting-governance-pack.md'},
{name:'Steering Committee Pack',area:'Governance & Decisions',href:'/templates/steering-committee-pack.md'},
{name:'Release Calendar',area:'Release & Change',href:'/templates/release-calendar.csv'},
{name:'Retrospective Vault',area:'Continuous Improvement',href:'/templates/retrospective-vault.csv'},
{name:'Sprint Health Check',area:'Agile & Flow',href:'/templates/sprint-health-check.csv'},
{name:'Programme Milestone Plan',area:'Programme',href:'/templates/programme-milestone-plan.csv'},
{name:'Portfolio Intake Scorecard',area:'Portfolio',href:'/templates/portfolio-intake-scorecard.csv'},
{name:'Portfolio Prioritisation Scorecard',area:'Portfolio',href:'/templates/portfolio-prioritisation-scorecard.csv'}
];
