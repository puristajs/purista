import type { Methods } from 'trouter'
import { Trouter } from 'trouter'

type Params = Record<string, string>
type ParamIndexMap = Record<string, number>
type ParamStash = string[]

type Result<T> = [[T, ParamIndexMap][], ParamStash] | [[T, Params][]]
interface Router<T> {
  name: string
  add(method: string, path: string, handler: T): void
  match(method: string, path: string): Result<T>
}

export class HonoTRouter<T> implements Router<T> {
  router: Trouter<T>

  name = 'Trouter'

  constructor() {
    this.router = new Trouter<T>()
  }

  add(method: string, path: string, handler: T) {
    this.router.add(method as Methods, path, handler)
  }

  match(method: string, path: string): Result<T> {
    const routeAll = this.router.find('ALL' as Methods, path)
    const route = this.router.find(method as Methods, path)

    const handlers: [T, Record<string, string>][] = []

    routeAll.handlers.forEach((handler) => handlers.push([handler, routeAll.params]))
    route.handlers.forEach((handler) => handlers.push([handler, { ...routeAll.params, ...route.params }]))

    return [handlers]
  }
}
