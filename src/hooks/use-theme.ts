import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProfileStore } from '@/store';

export function useTheme() {
  const scheme = useColorScheme();
  const profileTheme = useProfileStore((s) => s.profile.theme);

  let resolved: 'light' | 'dark';
  if (profileTheme === 'system') {
    resolved = scheme === 'unspecified' ? 'light' : scheme;
  } else {
    resolved = profileTheme;
  }

  return Colors[resolved];
}
