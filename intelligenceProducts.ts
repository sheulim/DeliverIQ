export type IntelligenceProduct = {
  id: string;
  name: string;
  pitch: string;
  category: "Assurance" | "Commercial" | "Governance" | "Operations";
  status: "Live" | "Connected" | "New";
  description: string;
  route?: string;
  prompt: string;
  inputs: [string, string, string];
  output: string;
};

export const intelligenceProducts: IntelligenceProduct[] = [
  {id:"prooflayer",name:"ProofLayer AI",pitch:"Prove migration readiness",category:"Assurance",status:"Live",description:"Connect reconciliation, UAT, defects, waivers, approvals, adoption, rollback and decommission evidence.",route:"/prooflayer",prompt:"Build a source-linked migration acceptance decision pack.",inputs:["Migration or platform","Current gate","Known evidence gap"],output:"Acceptance decision pack"},
  {id:"scope-sentinel",name:"ScopeSentinel",pitch:"Catch scope leakage",category:"Commercial",status:"New",description:"Compare the approved scope with new requests and expose margin leakage before delivery absorbs it.",prompt:"Classify the request as in scope, ambiguous or out of scope and draft a client-safe next action.",inputs:["Approved scope or SOW","New request or meeting note","Commercial constraint"],output:"Scope delta and change request"},
  {id:"decision-receipt",name:"DecisionReceipt",pitch:"Prove every decision",category:"Governance",status:"Connected",description:"Create a durable decision record with evidence, assumptions, dissent, owner and review date.",prompt:"Create an evidence-backed decision receipt without inventing rationale or approval.",inputs:["Decision question","Evidence considered","Approver and review date"],output:"Decision receipt"},
  {id:"ai-policy-receipt",name:"AIPolicyReceipt",pitch:"Document AI use",category:"Governance",status:"New",description:"Record how AI supported a deliverable, what data was used, who reviewed it and what must be disclosed.",prompt:"Create an AI-use receipt and flag missing human review, consent or disclosure evidence.",inputs:["AI-assisted deliverable","Tool and data categories","Reviewer and client restriction"],output:"AI-use and disclosure receipt"},
  {id:"promise-ledger",name:"PromiseLedger",pitch:"Never lose commitments",category:"Commercial",status:"Connected",description:"Separate promises, requests and assumptions; track both parties, conditions, due dates and evidence.",prompt:"Extract bilateral commitments and identify dependencies that have not been accepted.",inputs:["Conversation or meeting note","Customer commitment","Delivery-team commitment"],output:"Source-linked promise ledger"},
  {id:"exception-miner",name:"ExceptionMiner",pitch:"Find hidden workflows",category:"Operations",status:"New",description:"Compare the written process with real cases to find workarounds, judgment points and unsafe automation gaps.",prompt:"Identify exceptions to the SOP and recommend what to automate, control or retain for human judgment.",inputs:["Documented process","Observed exception or case sample","Desired automation"],output:"Exception taxonomy and readiness map"},
  {id:"metric-witness",name:"MetricWitness",pitch:"Verify executive metrics",category:"Assurance",status:"Connected",description:"Attach definition, period, calculation, owner and freshness to every material status or KPI claim.",route:"/metrics",prompt:"Verify the metric claim and identify stale, inconsistent or unsupported evidence.",inputs:["Metric claim","Source and calculation","Reporting period"],output:"Metric evidence receipt"},
  {id:"exit-memory",name:"ExitMemory",pitch:"Capture irreplaceable knowhow",category:"Operations",status:"New",description:"Turn expert interviews into scenario-based runbooks, evidence gaps and a successor readiness check.",prompt:"Build a role-transition pack that separates verified knowledge from opinion and uncertainty.",inputs:["Role and responsibilities","Critical scenarios and exceptions","Evidence or successor"],output:"Verified transition pack"},
  {id:"tender-trap",name:"TenderTrap",pitch:"Expose bid obligations",category:"Commercial",status:"New",description:"Find mandatory clauses, service credits, dependencies and delivery assumptions that threaten bid margin.",prompt:"Extract bid obligations and create a delivery and margin red-flag register with source references.",inputs:["Tender clause or extract","Proposed response","Cost or delivery assumption"],output:"Bid obligation and margin-risk pack"},
  {id:"policy-delta",name:"PolicyDelta Studio",pitch:"Turn change into action",category:"Governance",status:"New",description:"Translate a policy or regulatory change into impacted controls, owners, evidence and implementation actions.",prompt:"Compare the new requirement with the current policy and create a reviewer-ready delta plan.",inputs:["New requirement","Current policy or control","Jurisdiction and reviewer"],output:"Policy delta and control action plan"},
];
