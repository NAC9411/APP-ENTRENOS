export type MomentStep = 1 | 2 | 3 | 4 | 5 | 6;

export type AppView = 'journey' | 'followup' | 'metrics' | 'deploy';

export type EisenhowerQuadrant =
  | 'urgent_important'
  | 'important_not_urgent'
  | 'urgent_not_important'
  | 'delegate_later';

export type ComBComponent = 'motivation' | 'capability' | 'opportunity';

export type ComBPrimaryResult = ComBComponent | 'combined';

export type SubBarrierType =
  | 'overconfidence'
  | 'family_trust'
  | 'production_pressure'
  | 'knowledge_gap'
  | 'verification_gap'
  | 'supplier_access'
  | 'resource_time'
  | 'authority_support';

export type FollowUpStatus =
  | 'not_started'
  | 'consulted_alternatives'
  | 'requested_quote'
  | 'acquired_control'
  | 'installed_control'
  | 'technically_verified';

export interface SectorActivityOption {
  id: string;
  label: string;
  typicalRisk: string;
  defaultSevereHint?: boolean;
  recommendedControlIds: string[];
}

export interface SectorDefinition {
  id: string;
  name: string;
  shortDesc: string;
  activities: SectorActivityOption[];
}

export interface QuestionOption {
  id: string;
  label: string;
  friction: Partial<Record<ComBComponent, number>>;
  subBarrier?: SubBarrierType;
  factSummary: string;
}

export interface ComBQuestion {
  id: string;
  component: ComBComponent;
  question: string;
  helperText?: string;
  options: QuestionOption[];
}

export interface ContextualQuestion {
  id: string;
  component: string;
  prompt: string;
}

export interface PhysicalControlItem {
  id: string;
  name: string;
  category: string;
  sectorIds: string[];
  imageUrl?: string;
  imageAlt?: string;
  hazardReduced: string;
  howItWorks: string;
  suitableProcesses: string;
  verifyBeforeBuying: string;
  technicalChecks: string[];
  supplierSearchTerms: string[];
  isAiSuggested?: boolean;
}

export interface BusinessContext {
  companyName: string;
  ownerRole: string;
  location: string;
  sectorId: string;
  sectorName: string;
  activityId: string;
  activityLabel: string;
  customProcessDescription: string;
  riskEvaluated: string;
  eisenhowerQuadrant: EisenhowerQuadrant;
  severeHazardResponse: 'yes' | 'unsure' | 'no';
  aiSectorAnalysis?: {
    sectorLabel: string;
    mainRiskSummary: string;
    possibleSevereHazard: boolean;
    severeWarningNote: string;
    contextualQuestions: ContextualQuestion[];
    suggestedControls: PhysicalControlItem[];
  };
}

export interface ComBAssessment {
  answers: Record<string, string>; // questionId -> optionId
  contextualNotes: Record<string, string>;
  internalLevels: Record<ComBComponent, 'high_friction' | 'moderate_friction' | 'low_friction'>;
  primaryBarrier: ComBPrimaryResult;
  secondaryBarrier: ComBComponent | null;
  dominantSubBarrier: SubBarrierType;
  interpretationHeadline: string;
  interpretationBody: string;
  eisenhowerInsight: string;
  interventionTitle: string;
  interventionMessage: string;
  reflectiveQuestion: string;
  actionBridge: string;
  opportunityRoutes: string[];
  userReflectionNote: string;
  statedFacts: string[];
  aiPersonalizedUsed: boolean;
}

export interface ActionCommitment {
  id: string;
  createdAt: string;
  companyName: string;
  sectorName: string;
  activityLabel: string;
  riskEvaluated: string;
  severeHazardActive: boolean;
  primaryBarrier: ComBPrimaryResult;
  interpretationBody: string;
  personalizedMessage: string;
  selectedControl: PhysicalControlItem;
  alternativeControls: PhysicalControlItem[];
  firstStep: string;
  responsiblePerson: string;
  targetDate: string;
  reminderConfigured: boolean;
  intentionBefore: 'postergando' | 'pensandolo' | 'listo';
  intentionAfter: 'comprometido_hoy' | 'necesita_evaluacion_previa';
  followUpStatus: FollowUpStatus;
  followUpUpdatedAt: string;
  followUpNote?: string;
}

export interface PilotMetricsStore {
  consentGiven: boolean;
  consentUpdatedAt: string | null;
  experiencesCompleted: number;
  barrierCounts: Record<ComBPrimaryResult, number>;
  intentionShifts: number;
  controlsConsultedIds: string[];
  commercialLinkClicks: number;
  commitmentsDefined: number;
  progressDeclaredCount: number;
  technicallyVerifiedCount: number;
}
