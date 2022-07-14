import { EventEmitter } from 'node:events'

export type EventMap = Record<string, any>

export type EventKey<T extends EventMap> = string & keyof T
type EventReceiver<T> = (params: T) => void

export interface IEmitter<T extends EventMap> {
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void
}

export class GenericEventEmitter<T extends EventMap> implements IEmitter<T> {
  private emitter = new EventEmitter()
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.on(eventName, fn)
  }

  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>) {
    this.emitter.off(eventName, fn)
  }

  emit<K extends EventKey<T>>(eventName: K, params: T[K]) {
    this.emitter.emit(eventName, params)
  }
}
