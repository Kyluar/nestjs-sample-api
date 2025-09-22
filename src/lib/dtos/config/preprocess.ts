export const stringOrUndefined = (val: unknown) => {
  if (val === undefined || typeof val === 'string') return val
  return val
}
