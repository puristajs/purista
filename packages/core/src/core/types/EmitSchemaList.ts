import type { Schema } from '@decs/typeschema'

export type EmitSchemaList<T> = {
  [K in keyof T]: Schema
}
