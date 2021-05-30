export type Position = { x: number, y: number };
export type Size = { height: number, width: number };
export type HitBox = { radius: number, offset: number } | null;
export type StartingSizeAndPosition = {
  height?: number,
  width?: number,
  xpos?: number,
  ypos?: number,
  centered?: boolean,
  angle?: number
};
