export const AUS_YEAR_NAMES: Record<string, Record<number, string>> = {
  NSW: { 0: 'Kindergarten', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  VIC: { 0: 'Prep', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  QLD: { 0: 'Prep', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  WA: { 0: 'Pre-primary', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  SA: { 0: 'Reception', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  TAS: { 0: 'Prep', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  ACT: { 0: 'Kindergarten', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
  NT: { 0: 'Transition', 1: 'Year 1', 2: 'Year 2', 3: 'Year 3', 4: 'Year 4', 5: 'Year 5', 6: 'Year 6', 7: 'Year 7', 8: 'Year 8', 9: 'Year 9', 10: 'Year 10', 11: 'Year 11', 12: 'Year 12' },
};

export function localiseToAustralian(text: string): string {
  const mapping: Record<string, string> = {
    'summarize': 'summarise',
    'summarized': 'summarised',
    'summarizing': 'summarising',
    'realize': 'realise',
    'realized': 'realised',
    'realizing': 'realising',
    'program': 'programme',
    'color': 'colour',
    'center': 'centre',
    'defense': 'defence',
    'license': 'licence',
    'organize': 'organise',
    'organized': 'organised',
    'organizing': 'organising',
    'analyzer': 'analyser',
    'analyze': 'analyse',
    'analyzed': 'analysed',
    'analyzing': 'analysing',
    'modeling': 'modelling',
    'learned': 'learnt',
  };

  let localised = text;
  Object.entries(mapping).forEach(([us, au]) => {
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    localised = localised.replace(regex, au);
  });
  
  return localised;
}

export function getDisplayYear(level: number, state: string = 'NSW'): string {
  return AUS_YEAR_NAMES[state]?.[level] || `Year ${level}`;
}
