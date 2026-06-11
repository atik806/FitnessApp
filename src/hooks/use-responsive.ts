import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isSmall = width < 380;
  const isMedium = width >= 380 && width < 600;
  const isLarge = width >= 600;
  const isTablet = width >= 768;

  const numColumns = isTablet ? 4 : isLarge ? 3 : 3;

  const scale = isSmall ? 0.85 : isMedium ? 1 : 1.1;

  const fontSize = (size: number) => Math.round(size * scale);
  const spacing = (size: number) => Math.round(size * scale);

  const contentPadding = isTablet ? 48 : 16;

  return {
    width,
    height,
    isSmall,
    isMedium,
    isLarge,
    isTablet,
    numColumns,
    scale,
    fontSize,
    spacing,
    contentPadding,
  };
}
