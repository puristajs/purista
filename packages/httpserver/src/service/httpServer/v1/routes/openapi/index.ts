import { getOpenApiDocuIndex } from './getOpenApiDocuIndex.impl.js'
import { getOpenApiDocuJsInit } from './getOpenApiDocuJsInit.impl.js'
import { getOpenApiJson } from './getOpenApiJson.impl.js'

export * from './getIndexHtml.impl.js'
export * from './getJsInit.impl.js'

export const OPEN_API_ROUTE_FUNCTIONS = [getOpenApiDocuIndex, getOpenApiDocuJsInit, getOpenApiJson]
