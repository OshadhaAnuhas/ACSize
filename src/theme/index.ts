export const colors = {
  background: '#F8FAFC', surface: '#FFFFFF', navy: '#0F172A', slate: '#475569', muted: '#64748B',
  line: '#E2E8F0', teal: '#0D9488', tealDark: '#0F766E', mint: '#E5F7F8', cyan: '#38BDF8',
  paleCyan: '#E0F2FE', amber: '#F59E0B', paleAmber: '#FEF3C7', danger: '#DC2626', success: '#15803D',
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
export const typeScale = { caption: 12, body: 15, section: 19, title: 28, display: 30 } as const;
export const elevation = { card: { shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 } } as const;
