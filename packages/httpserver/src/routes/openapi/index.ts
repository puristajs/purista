import { getOpenApiDocuIndex } from './getOpenApiDocuIndex.impl'
import { getOpenApiDocuJsInit } from './getOpenApiDocuJsInit.impl'
import { getOpenApiJson } from './getOpenApiJson.impl'

export const OPEN_API_ROUTE_FUNCTIONS = [getOpenApiDocuIndex, getOpenApiDocuJsInit, getOpenApiJson]
