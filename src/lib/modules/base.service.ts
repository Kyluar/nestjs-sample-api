import { DataType } from '../types'

export class BaseService<D extends DataType> {
  constructor(
    protected data: D[],
    protected dataName: string = 'Data'
  ) {
    this.data = data
    this.dataName = dataName
  }

  private dataExists(uuid: string) {
    return this.data.find((u) => u.uuid === uuid) ? true : false
  }

  list(limit: number, page: number, query?: string) {
    const start = (page - 1) * limit
    const end = start + limit
    const data = this.data
    if (query) {
      return data.some((d) =>
        Object.values(d).some((v) => String(v).includes(query))
      )
    }
    return data.slice(start, end)
  }

  get(uuid: string) {
    const data = this.data.find((u) => u.uuid === uuid)
    if (data) {
      return data
    }
    return `${this.dataName} not find`
  }

  create(data: D) {
    const exists = this.dataExists(data.uuid as string)
    if (!exists) {
      this.data.push(data)
      return data
    }
    return `${this.dataName} already exists in database`
  }

  update(uuid: string, data: D) {
    if (!this.dataExists(uuid)) return `${this.dataName} do not exists`
    const idx = this.data.findIndex((u) => u.uuid === uuid)

    Object.keys(this.data[idx]).forEach((key) => {
      if (Object.keys(data).some((k) => k === key)) {
        this.data[idx] = { uuid: uuid, ...data }
      }
    })

    return this.data[idx]
  }

  patch(uuid: string, data: Partial<D>) {
    if (!this.dataExists(uuid)) return `${this.dataName} do not exists`
    const idx = this.data.findIndex((u) => u.uuid === uuid)

    Object.keys(this.data[idx]).forEach((key) => {
      if (Object.keys(data).some((k) => k === key)) {
        this.data[idx] = { ...this.data[idx], ...data }
      }
    })

    return this.data[idx]
  }

  delete() {
    return `You made a DELETE request to delete a(n) ${this.dataName}!`
  }
}
