/** Global layout tokens — apply consistently across all screens */
export const layout = {
  screenPaddingHorizontal: 24,
  screenPaddingTop: 16,
  screenPaddingBottom: 24,
  /** Clears floating bottom tab bar (72 + 12 margin + buffer) */
  tabBarContentOffset: 100,
  /** Profile / last-action screens need extra clearance */
  tabBarContentOffsetLarge: 120,
  sectionGap: 28,
  cardPadding: 18,
  cardMarginBottom: 16,
  cardBorderRadius: 18,
  inputHeight: 56,
  inputMarginBottom: 16,
  buttonHeight: 52,
  buttonBorderRadius: 16,
  buttonMarginVertical: 16,
  iconSize: 24,
  tabBarHeight: 72,
  tabBarMarginHorizontal: 16,
  tabBarMarginBottom: 12,
  tabBarBorderRadius: 28,
} as const;
