import type { Result, Router } from 'hono/dist/types/router'
import Trouter, { Methods } from 'trouter'

export class HonoTRouter<T> implements Router<T> {
  router: Trouter<T>

  constructor() {
    this.router = new Trouter<T>()
  }

  add(method: string, path: string, handler: T) {
    this.router.add(method as Methods, path, handler)
  }

  match(method: string, path: string): Result<T> | null {
    const routeAll = this.router.find('ALL' as Methods, path)
    const route = this.router.find(method as Methods, path)

    const result: Result<T> = {
      handlers: [...routeAll.handlers, ...route.handlers],
      params: { ...routeAll.params, ...route.params },
    }

    return route.handlers.length ? result : null
  }
}
