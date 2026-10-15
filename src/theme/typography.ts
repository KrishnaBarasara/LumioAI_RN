export const typography = {
  largeHeading: { fontSize: 30, fontWeight: '700' as const, lineHeight: 38 },
  screenTitle: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  caption: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  tabLabel: { fontSize: 11, fontWeight: '600' as const, lineHeight: 14 },
  /** @deprecated use screenTitle */
  h1: { fontSize: 30, fontWeight: '700' as const, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
} as const;
