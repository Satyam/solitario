export type tTopLeft = {
  left: number;
  top: number;
};
export type tCoordsState = Record<string, tTopLeft>;
export type tCoordsAction = tTopLeft & { name: string };
