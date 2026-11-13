import { parse, SvgAst } from 'react-native-svg';
import { iconXml } from '../data/iconXml';

export type ArtworkKind = keyof typeof iconXml;

type Props = { kind: ArtworkKind; width?: number; height?: number; color?: string };

const parsedIcons = new Map<ArtworkKind, ReturnType<typeof parse>>();

function iconAst(kind: ArtworkKind) {
  if (!parsedIcons.has(kind)) parsedIcons.set(kind, parse(iconXml[kind]));
  return parsedIcons.get(kind) ?? null;
}

export function ChoiceArtwork({ kind, width = 76, height = 64, color }: Props) {
  return <SvgAst ast={iconAst(kind)} override={{ width, height, accessible: false, ...(color && { stroke: color }) }} />;
}
