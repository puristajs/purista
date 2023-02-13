import { NodePlopAPI } from 'plop'

export const registerHandlebarHelpers = (plop: NodePlopAPI) => {
  plop.setHelper('eq', (a: string, b: string) => a === b)
  plop.setHelper('includes', (a: string[], b: string) => a.includes(b))
  plop.setHelper('isSet', (a: string) => a.trim() !== '')
}
