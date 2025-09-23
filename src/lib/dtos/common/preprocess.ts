export const processToString = (val: unknown) => {
  if (typeof val === 'string') return val
  return val
}
