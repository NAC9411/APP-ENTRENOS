import { useState } from 'react';
import { DeploymentGuideView, ProfilePreset } from './components/DeploymentGuideView';
import { FollowUpView } from './components/FollowUpView';
import { Header } from './components/Header';
import { Momento1Reality } from './components/Momento1Reality';
import { Momento2Discovery } from './components/Momento2Discovery';
import { Momento3Barrier } from './components/Momento3Barrier';
import { Momento4Intervention } from './components/Momento4Intervention';
import { Momento5Solutions } from './components/Momento5Solutions';
import { Momento6Commitment } from './components/Momento6Commitment';
import { MomentStepper } from './components/MomentStepper';
import { PilotMetricsView } from './components/PilotMetricsView';
import { SECTORS_CATALOG } from './data/sectorsAndQuestions';
import { evaluateComBProfile } from './engine/combRules';
import { getPrioritizedControls } from './engine/selectControls';
import { analyzeCustomSectorWithAi } from './services/geminiClient';
import {
  loadCommitments,
  loadPilotMetrics,
  recordMetricEvent,
  resetPilotMetrics,
  saveCommitment,
  setPilotConsent,
  updateCommitmentFollowUp,
} from './services/localPersistence';
import {
  ActionCommitment,
  AppView,
  BusinessContext,
  ComBAssessment,
  FollowUpStatus,
  MomentStep,
  PhysicalControlItem,
  PilotMetricsStore,
} from './types/entreNos';

function createInitialBusiness(): BusinessContext {
  const firstSector = SECTORS_CATALOG[0];
  const firstActivity = firstSector.activities[0];
  return {
    companyName: '',
    ownerRole: 'Propietario / Gerente',
    location: '',
    sectorId: firstSector.id,
    sectorName: firstSector.name,
    activityId: firstActivity.id,
    activityLabel: firstActivity.label,
    customProcessDescription: '',
    riskEvaluated: firstActivity.typicalRisk,
    eisenhowerQuadrant: 'important_not_urgent',
    severeHazardResponse: 'no',
  };
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('journey');
  const [currentStep, setCurrentStep] = useState<MomentStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<MomentStep>(1);

  const [business, setBusiness] = useState<BusinessContext>(() => createInitialBusiness());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contextualNotes, setContextualNotes] = useState<Record<string, string>>({});
  const [assessment, setAssessment] = useState<ComBAssessment | null>(null);
  const [experienceRecorded, setExperienceRecorded] = useState(false);

  const [selectedControl, setSelectedControl] = useState<PhysicalControlItem | null>(null);
  const [alternativeControls, setAlternativeControls] = useState<PhysicalControlItem[]>([]);
  const [savedCommitment, setSavedCommitment] = useState<ActionCommitment | null>(null);

  const [commitments, setCommitments] = useState<ActionCommitment[]>(() => loadCommitments());
  const [metrics, setMetrics] = useState<PilotMetricsStore>(() => loadPilotMetrics());

  const advanceToStep = (next: MomentStep) => {
    setCurrentStep(next);
    setMaxReachedStep((prev) => (next > prev ? next : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetJourney = () => {
    setBusiness(createInitialBusiness());
    setAnswers({});
    setContextualNotes({});
    setAssessment(null);
    setExperienceRecorded(false);
    setSelectedControl(null);
    setAlternativeControls([]);
    setSavedCommitment(null);
    setCurrentStep(1);
    setMaxReachedStep(1);
    setActiveView('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteDiscovery = () => {
    const evaluated = evaluateComBProfile(business, answers, contextualNotes);
    setAssessment(evaluated);

    if (!experienceRecorded) {
      const updated = recordMetricEvent({
        type: 'experience_completed',
        barrier: evaluated.primaryBarrier,
      });
      setMetrics(updated);
      setExperienceRecorded(true);
    }

    advanceToStep(3);
  };

  const handleConsultControl = (control: PhysicalControlItem) => {
    const updated = recordMetricEvent({ type: 'control_consulted', controlId: control.id });
    setMetrics(updated);
  };

  const handleCommercialClick = () => {
    const updated = recordMetricEvent({ type: 'commercial_click' });
    setMetrics(updated);
  };

  const handleChooseFirstStep = (
    control: PhysicalControlItem,
    allPrimary: PhysicalControlItem[]
  ) => {
    setSelectedControl(control);
    setAlternativeControls(allPrimary);
    advanceToStep(6);
  };

  const handleSaveCommitment = (commitment: ActionCommitment, intentionShifted: boolean) => {
    const updatedList = saveCommitment(commitment);
    setCommitments(updatedList);
    setSavedCommitment(commitment);

    const updatedMetrics = recordMetricEvent({
      type: 'commitment_defined',
      intentionShifted,
    });
    setMetrics(updatedMetrics);
  };

  const handleUpdateFollowUp = (
    commitmentId: string,
    status: FollowUpStatus,
    note?: string
  ) => {
    const updatedList = updateCommitmentFollowUp(commitmentId, status, note);
    setCommitments(updatedList);
    setMetrics(loadPilotMetrics());
  };

  const handleLoadProfilePreset = async (preset: ProfilePreset) => {
    let loadedBusiness: BusinessContext = { ...preset.business };

    if (preset.business.sectorId === 'custom') {
      const { analysis } = await analyzeCustomSectorWithAi(
        preset.business.sectorName,
        preset.business.customProcessDescription
      );
      loadedBusiness = {
        ...loadedBusiness,
        aiSectorAnalysis: analysis,
      };
    }

    const evaluated = evaluateComBProfile(loadedBusiness, preset.answers, {});
    const { primaryControls } = getPrioritizedControls(loadedBusiness);

    setBusiness(loadedBusiness);
    setAnswers(preset.answers);
    setContextualNotes({});
    setAssessment(evaluated);
    setExperienceRecorded(false);
    setSelectedControl(primaryControls[0] ?? null);
    setAlternativeControls(primaryControls);
    setSavedCommitment(null);
    setActiveView('journey');
    setCurrentStep(3);
    setMaxReachedStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetJourney={handleResetJourney}
      />

      {activeView === 'journey' && (
        <MomentStepper
          currentStep={currentStep}
          maxReachedStep={maxReachedStep}
          onSelectStep={(step) => setCurrentStep(step)}
        />
      )}

      <main className="flex-1">
        {activeView === 'journey' && (
          <>
            {currentStep === 1 && (
              <Momento1Reality
                business={business}
                onChange={setBusiness}
                onNext={() => advanceToStep(2)}
              />
            )}

            {currentStep === 2 && (
              <Momento2Discovery
                business={business}
                answers={answers}
                contextualNotes={contextualNotes}
                onChangeAnswer={(qId, optId) =>
                  setAnswers((prev) => ({ ...prev, [qId]: optId }))
                }
                onChangeContextualNote={(qId, val) =>
                  setContextualNotes((prev) => ({ ...prev, [qId]: val }))
                }
                onBack={() => advanceToStep(1)}
                onNext={handleCompleteDiscovery}
              />
            )}

            {currentStep === 3 && assessment && (
              <Momento3Barrier
                business={business}
                assessment={assessment}
                onBack={() => advanceToStep(2)}
                onNext={() => advanceToStep(4)}
              />
            )}

            {currentStep === 4 && assessment && (
              <Momento4Intervention
                business={business}
                assessment={assessment}
                onUpdateAssessment={setAssessment}
                onBack={() => advanceToStep(3)}
                onNext={() => advanceToStep(5)}
              />
            )}

            {currentStep === 5 && (
              <Momento5Solutions
                business={business}
                selectedControlId={selectedControl?.id ?? null}
                onConsultControl={handleConsultControl}
                onCommercialClick={handleCommercialClick}
                onChooseFirstStep={handleChooseFirstStep}
                onBack={() => advanceToStep(4)}
              />
            )}

            {currentStep === 6 && assessment && selectedControl && (
              <Momento6Commitment
                business={business}
                assessment={assessment}
                selectedControl={selectedControl}
                alternativeControls={alternativeControls}
                savedCommitment={savedCommitment}
                onSaveCommitment={handleSaveCommitment}
                onOpenFollowUp={() => setActiveView('followup')}
                onBack={() => advanceToStep(5)}
              />
            )}
          </>
        )}

        {activeView === 'followup' && (
          <FollowUpView
            commitments={commitments}
            onUpdateStatus={handleUpdateFollowUp}
            onStartNewJourney={handleResetJourney}
          />
        )}

        {activeView === 'metrics' && (
          <PilotMetricsView
            metrics={metrics}
            onToggleConsent={(consent) => setMetrics(setPilotConsent(consent))}
            onResetMetrics={() => setMetrics(resetPilotMetrics())}
          />
        )}

        {activeView === 'deploy' && (
          <DeploymentGuideView onLoadProfilePreset={handleLoadProfilePreset} />
        )}
      </main>

      <footer className="no-print border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            <p className="font-display font-bold text-blue-950">
              ENTRE NOS · «La confianza también nos protege»
            </p>
            <p className="mt-0.5">
              Herramienta de orientación preventiva basada en el modelo COM-B.
            </p>
          </div>
          <p className="max-w-lg leading-relaxed">
            Alcance técnico: ENTRE NOS no sustituye la identificación formal de peligros, la verificación de compatibilidad de máquinas, el diseño de ingeniería, la instalación competente ni las obligaciones legales del SG-SST.
          </p>
        </div>
      </footer>
    </div>
  );
}
