import { parse, SvgAst } from 'react-native-svg';
import { iconXml } from '../data/iconXml';
import { useProfile } from '../context/ProfileContext';

export type ArtworkKind = keyof typeof iconXml;

type Props = { kind: ArtworkKind; width?: number; height?: number; color?: string };

const parsedIcons = new Map<string, ReturnType<typeof parse>>();

function iconAst(kind: ArtworkKind, dark: boolean) {
  const key = `${kind}:${dark}`;
  if (!parsedIcons.has(key)) {
    let xml: string = iconXml[kind];
    if (dark) {
      const replacements: Record<string, string> = {
        '#0F172A': '#E2E8F0', '#E2E8F0': '#334155', '#CBD5E1': '#475569',
        '#F8FAFC': '#1E293B', '#FFFFFF': '#1E293B', '#0D9488': '#5EEAD4',
        '#2563EB': '#93C5FD', '#CCFBF1': '#134E4A', '#FEF3C7': '#3D2C15',
        '#DBEAFE': '#172C4A', '#94A3B8': '#CBD5E1',
      };
      xml = xml.replace(/#[0-9A-Fa-f]{6}/g, (value) => replacements[value.toUpperCase()] ?? value);
    }
    parsedIcons.set(key, parse(xml));
  }
  return parsedIcons.get(key) ?? null;
}

export function ChoiceArtwork({ kind, width = 76, height = 64, color }: Props) {
  const { dark } = useProfile();
  return <SvgAst ast={iconAst(kind, dark)} override={{ width, height, accessible: false, ...(color && { stroke: color }) }} />;
}
