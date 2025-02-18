import type { SchemaObject } from 'openapi3-ts/oas31'

const COMMENT_RE = /\*\//g
export const LB_RE = /\r?\n/g
export const DOUBLE_QUOTE_RE = /(?<!\\)"/g
const ESC_0_RE = /~0/g
const ESC_1_RE = /~1/g
const TILDE_RE = /~/g
const FS_RE = /\//g
export const TS_INDEX_RE = /\[("(\\"|[^"])+"|'(\\'|[^'])+')]/g // splits apart TS indexes (and allows for escaped quotes)
const TS_UNION_INTERSECTION_RE = /[&|]/
const JS_OBJ_KEY = /^(\d+|[A-Za-z_$][A-Za-z0-9_$]*)$/

/** Walk through any JSON-serializable object */
export function walk(
  obj: unknown,
  cb: (value: Record<string, unknown>, path: (string | number)[]) => void,
  path: (string | number)[] = [],
): void {
  if (!obj || typeof obj !== 'object') {
    return
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      walk(obj[i], cb, path.concat(i))
    }
    return
  }
  // eslint-disable-next-line n/no-callback-literal
  cb(obj as any, path)
  for (const k of Object.keys(obj)) {
    walk((obj as any)[k], cb, path.concat(k))
  }
}

/**
 * Preparing comments from fields
 * @see {comment} for output examples
 * @returns void if not comments or jsdoc format comment string
 */
export function getSchemaObjectComment(v?: SchemaObject, indentLv?: number): string | undefined {
  if (!v || typeof v !== 'object') {
    return
  }
  const output: string[] = []

  // * Not JSDOC tags: [title, format]
  if (v.title) {
    output.push(`${v.title} `)
  }
  if ((v as any).summary) {
    output.push(`${(v as any).summary} `)
  }
  if (v.format) {
    output.push(`Format: ${v.format} `)
  }

  // * JSDOC tags without value
  // 'Deprecated' without value
  if (v.deprecated) {
    output.push(`@deprecated `)
  }

  // * JSDOC tags with value
  const supportedJsDocTags: (keyof SchemaObject)[] = ['description', 'default', 'example']
  for (const field of supportedJsDocTags) {
    const allowEmptyString = field === 'default' || field === 'example'
    if (v[field] === undefined) {
      continue
    }
    if (v[field] === '' && !allowEmptyString) {
      continue
    }
    const serialized = typeof v[field] === 'object' ? JSON.stringify(v[field], null, 2) : v[field]
    output.push(`@${field} ${serialized} `)
  }

  // * JSDOC 'Constant' without value
  if ('const' in v) {
    output.push(`@constant `)
  }

  // * JSDOC 'Enum' with type
  if (v.enum) {
    let type = 'unknown'
    if (Array.isArray(v.type)) {
      type = v.type.join('|')
    } else if (typeof v.type === 'string') {
      type = v.type
    }
    // output.push(`@enum {${type}${v.nullable ? `|null` : ''}}`)
    output.push(`@enum {${type}`)
  }

  return output.length ? comment(output.join('\n'), indentLv) : undefined
}

/** wrap any string in a JSDoc-style comment wrapper */
export function comment(text: string, indentLv?: number): string {
  const commentText = text.trim().replace(COMMENT_RE, '*\\/')

  // if single-line comment
  if (!commentText.includes('\n')) {
    return `/** ${commentText} */`
  }

  // if multi-line comment
  const ln = indent(' * ', indentLv ?? 0)
  return ['/**', `${ln}${commentText.replace(LB_RE, `\n${ln}`)}`, indent(' */', indentLv ?? 0)].join('\n')
}

/** handle any valid $ref */
export function parseRef(ref: string): { filename: string; path: string[] } {
  if (typeof ref !== 'string') {
    return { filename: '.', path: [] }
  }

  // OpenAPI $ref
  if (ref.includes('#/')) {
    const [filename, pathStr] = ref.split('#')
    const parts = pathStr.split('/')
    const path: string[] = []
    for (const part of parts) {
      if (!part || part === 'properties') {
        continue
      } // remove empty parts and "properties" (gets flattened by TS)
      path.push(decodeRef(part))
    }
    return { filename: filename || '.', path }
  } else if (ref.includes('["')) {
    const parts = ref.split('["')
    const path: string[] = []
    for (const part of parts) {
      const sanitized = part.replace('"]', '').trim()
      if (!sanitized || sanitized === 'properties') {
        continue
      }
      path.push(sanitized)
    }
    return { filename: '.', path }
  }
  // remote $ref
  return { filename: ref, path: [] }
}

/** Parse TS index */
export function parseTSIndex(type: string): string[] {
  const parts: string[] = []
  const bracketI = type.indexOf('[')
  if (bracketI === -1) {
    return [type]
  }

  parts.push(type.substring(0, bracketI))
  const matches = type.match(TS_INDEX_RE)
  if (matches) {
    for (const m of matches) {
      parts.push(m.substring('["'.length, m.length - '"]'.length))
    }
  }
  return parts
}

/** Make TS index */
export function makeTSIndex(parts: (string | number)[]): string {
  return `${parts[0]}[${parts.slice(1).map(escStr).join('][')}]`
}

/** decode $ref (https://swagger.io/docs/specification/using-ref/#escape) */
export function decodeRef(ref: string): string {
  return ref.replace(ESC_0_RE, '~').replace(ESC_1_RE, '/').replace(DOUBLE_QUOTE_RE, '\\"')
}

/** encode $ref (https://swagger.io/docs/specification/using-ref/#escape) */
export function encodeRef(ref: string): string {
  return ref.replace(TILDE_RE, '~0').replace(FS_RE, '~1')
}

/** T[] */
export function tsArrayOf(type: string): string {
  return `(${type})[]`
}

/** X & Y & Z; */
export function tsIntersectionOf(...types: string[]): string {
  types = types.filter((t) => t !== 'unknown')
  if (types.length === 0) {
    return 'unknown'
  }
  if (types.length === 1) {
    return String(types[0])
  } // don’t add parentheses around one thing
  return types.map((t) => (TS_UNION_INTERSECTION_RE.test(t) ? `(${t})` : t)).join(' & ')
}

/** NonNullable<T> */
export function tsNonNullable(type: string): string {
  return `NonNullable<${type}>`
}

/** OneOf<T> (custom) */
export function tsOneOf(...types: string[]): string {
  if (types.length === 1) {
    return types[0]
  }
  return `OneOf<[${types.join(', ')}]>`
}

/** Pick<T> */
export function tsPick(root: string, keys: string[]): string {
  return `Pick<${root}, ${tsUnionOf(...keys.map(escStr))}>`
}

/** Omit<T> */
export function tsOmit(root: string, keys: string[]): string {
  return `Omit<${root}, ${tsUnionOf(...keys.map(escStr))}>`
}

/** WithRequired<T> */
export function tsWithRequired(root: string, keys: string[]): string {
  return `WithRequired<${root}, ${tsUnionOf(...keys.map(escStr))}>`
}

/** make a given property key optional */
export function tsOptionalProperty(key: string): string {
  return `${key}?`
}

/** make a given type readonly */
export function tsReadonly(type: string): string {
  return `readonly ${type}`
}

/** [T, A, B, ...] */
export function tsTupleOf(...types: string[]): string {
  return `[${types.join(', ')}]`
}

/** X | Y | Z */
export function tsUnionOf(...types: (string | number | boolean)[]): string {
  if (types.length === 0) {
    return 'never'
  }

  // de-duplicate the union
  const members = new Set<string>()
  for (const t of types) {
    // unknown swallows everything else in the union
    if (t === 'unknown') {
      return 'unknown'
    }

    members.add(String(t))
  }

  // never gets swallowed by anything else, so only return never
  //   if it is the only member
  if (members.has('never') && members.size === 1) {
    return 'never'
  }

  // (otherwise remove it)
  members.delete('never')

  // return the only member without parentheses
  const memberArr = Array.from(members)
  if (members.size === 1) {
    return memberArr[0]
  }

  // build the union string
  let out = ''
  for (let i = 0; i < memberArr.length; i++) {
    const t = memberArr[i]

    // if the type has & or | we should parenthesise it for safety
    const escaped = TS_UNION_INTERSECTION_RE.test(t) ? `(${t})` : t

    out += escaped
    if (i !== memberArr.length - 1) {
      out += ' | '
    }
  }

  return out
}

/** escape string value */
export function escStr(input: any): string {
  if (typeof input !== 'string') {
    return input
  }
  return `"${input.trim().replace(DOUBLE_QUOTE_RE, '\\"')}"`
}

/** surround a JS object key with quotes, if needed */
export function escObjKey(input: string): string {
  return JS_OBJ_KEY.test(input) ? input : escStr(input)
}

/** Indent a string */
export function indent(input: string, level: number) {
  if (level > 0) {
    return '  '.repeat(level).concat(input)
  } else {
    return input
  }
}

/** call Object.entries() and optionally sort */
export function getEntries<T>(
  obj: ArrayLike<T> | Record<string, T>,
  alphabetize?: boolean,
  excludeDeprecated?: boolean,
) {
  let entries = Object.entries(obj)
  if (alphabetize) {
    entries.sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true }))
  }
  if (excludeDeprecated) {
    entries = entries.filter(([, v]) => !(v && typeof v === 'object' && 'deprecated' in v && v.deprecated))
  }
  return entries
}
