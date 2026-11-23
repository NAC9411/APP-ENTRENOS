import assert from 'node:assert/strict';
import { TEST_PROFILES } from '../src/components/DeploymentGuideView';
import { evaluateComBProfile, isSevereHazardContext } from '../src/engine/combRules';
import { getPrioritizedControls } from '../src/engine/selectControls';
import { analyzeCustomSectorWithAi } from '../src/services/geminiClient';

async function runVerification() {
  console.log('=== Verificación de Perfiles ENTRE NOS (Casos A–E) ===\n');

  const resultsSummary: Record<string, { barrier: string; sub: string; control: string }> = {};

  for (const preset of TEST_PROFILES) {
    let business = { ...preset.business };

    if (preset.id === 'E') {
      const { analysis } = await analyzeCustomSectorWithAi(
        business.sectorName,
        business.customProcessDescription
      );
      business = { ...business, aiSectorAnalysis: analysis };
    }

    const evaluation = evaluateComBProfile(business, preset.answers, {});
    const { primaryControls } = getPrioritizedControls(business);
    const severe = isSevereHazardContext(business);

    console.log(`[Caso ${preset.id}] ${preset.title}`);
    console.log(`  - Barrera principal: ${evaluation.primaryBarrier} (matiz: ${evaluation.dominantSubBarrier})`);
    console.log(`  - Interpretación: ${evaluation.interpretationHeadline}`);
    console.log(`  - Intervención: ${evaluation.interventionTitle}`);
    console.log(`  - Peligro grave activo: ${severe}`);
    console.log(`  - Control priorizado #1: ${primaryControls[0]?.name ?? 'N/A'}\n`);

    assert.ok(evaluation.interpretationBody.length > 20, `Caso ${preset.id} debe tener interpretación`);
    assert.ok(evaluation.interventionMessage.length > 20, `Caso ${preset.id} debe tener mensaje personalizado`);
    assert.ok(primaryControls.length >= 1, `Caso ${preset.id} debe ofrecer controles físicos`);

    resultsSummary[preset.id] = {
      barrier: evaluation.primaryBarrier,
      sub: evaluation.dominantSubBarrier,
      control: primaryControls[0]?.name ?? '',
    };
  }

  // Verificar diferenciación explícita de cada perfil:
  assert.equal(resultsSummary.A.barrier, 'capability', 'Caso A debe clasificar Capacidad');
  assert.equal(resultsSummary.B.barrier, 'motivation', 'Caso B debe clasificar Motivación');
  assert.equal(resultsSummary.B.sub, 'production_pressure', 'Caso B debe detectar presión productiva/urgencia');
  assert.equal(resultsSummary.C.barrier, 'opportunity', 'Caso C debe clasificar Oportunidad');
  assert.equal(resultsSummary.D.barrier, 'motivation', 'Caso D debe clasificar Motivación');
  assert.equal(resultsSummary.D.sub, 'family_trust', 'Caso D debe detectar confianza familiar');
  assert.ok(resultsSummary.E.control.length > 0, 'Caso E debe sugerir controles para sector nuevo');

  // Verificar que los 5 casos tienen acciones/controles distintos
  const uniqueControls = new Set(Object.values(resultsSummary).map((r) => r.control));
  assert.equal(uniqueControls.size, 5, 'Cada perfil debe desembocar en una alternativa física distinta');

  console.log('✅ Todos los Casos A–E verificados con éxito y rutas diferenciadas.');
}

runVerification().catch((err) => {
  console.error('❌ Error en verificación de perfiles:', err);
  process.exit(1);
});
