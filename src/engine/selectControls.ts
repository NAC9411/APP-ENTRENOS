import { CONTROLS_CATALOG } from '../data/controlsCatalog';
import { SECTORS_CATALOG } from '../data/sectorsAndQuestions';
import { BusinessContext, PhysicalControlItem } from '../types/entreNos';

export function getPrioritizedControls(business: BusinessContext): {
  primaryControls: PhysicalControlItem[];
  otherControls: PhysicalControlItem[];
} {
  // Si es sector personalizado con sugerencias de IA, mostrarlas primero seguidas de controles transversales útiles
  if (business.sectorId === 'custom' && business.aiSectorAnalysis?.suggestedControls?.length) {
    const aiControls = business.aiSectorAnalysis.suggestedControls;
    const transversal = CONTROLS_CATALOG.filter((c) =>
      ['ctrl_parada_emergencia', 'ctrl_bloqueo_electrico', 'ctrl_piso_antideslizante'].includes(c.id)
    );
    return {
      primaryControls: aiControls.slice(0, 3),
      otherControls: transversal,
    };
  }

  const sector = SECTORS_CATALOG.find((s) => s.id === business.sectorId);
  const activity = sector?.activities.find((a) => a.id === business.activityId);

  const recommendedIds = activity?.recommendedControlIds ?? [];

  const primaryControls = recommendedIds
    .map((id) => CONTROLS_CATALOG.find((c) => c.id === id))
    .filter((item): item is PhysicalControlItem => Boolean(item));

  const sectorFallback = CONTROLS_CATALOG.filter(
    (c) => c.sectorIds.includes(business.sectorId) && !recommendedIds.includes(c.id)
  );

  // Si por algún motivo no hay actividad elegida, tomamos los primeros del sector (máx 3)
  const finalPrimary =
    primaryControls.length > 0
      ? primaryControls.slice(0, 3)
      : CONTROLS_CATALOG.filter((c) => c.sectorIds.includes(business.sectorId)).slice(0, 3);

  const primaryIds = new Set(finalPrimary.map((c) => c.id));
  const otherControls = [
    ...sectorFallback.filter((c) => !primaryIds.has(c.id)),
    ...CONTROLS_CATALOG.filter((c) => !primaryIds.has(c.id) && !c.sectorIds.includes(business.sectorId)),
  ].slice(0, 6);

  return {
    primaryControls: finalPrimary.length > 0 ? finalPrimary : CONTROLS_CATALOG.slice(0, 3),
    otherControls,
  };
}

export function buildSupplierSearchLinks(term: string): {
  googleUrl: string;
  mercadoLibreUrl: string;
} {
  const cleanTerm = term.trim().slice(0, 120);
  const encodedGoogle = encodeURIComponent(`${cleanTerm} proveedor seguridad industrial`);
  const encodedMl = encodeURIComponent(cleanTerm);

  return {
    googleUrl: `https://www.google.com/search?q=${encodedGoogle}`,
    mercadoLibreUrl: `https://listado.mercadolibre.com.co/${encodedMl.replace(/%20/g, '-')}`,
  };
}
