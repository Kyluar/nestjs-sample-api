export type Data = Record<string, unknown>
export type PartialData<T extends Data> = Partial<Record<keyof T, unknown>>
