import { materializeProjectGeneration } from '../blueprints/materializeProjectGeneration.js'
import { planProjectGeneration } from '../blueprints/planProjectGeneration.js'
import type { CreateProjectInput } from './types.js'

export const initFiles = async (settings: CreateProjectInput, options: { cwd?: string } = {}) =>
	materializeProjectGeneration(planProjectGeneration(settings, options))
