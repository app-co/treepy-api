export function keyJson(value: any) {
  const key = Object.keys(value)[1] as any;
  const obj = value[key];

  return obj;
}
