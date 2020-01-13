import Color from 'color';

export function lighten(color: string, ratio: number) {
  return Color(color).lighten(ratio).hex();
}
