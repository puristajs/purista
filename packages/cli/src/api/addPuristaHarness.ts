import { type HarnessScaffoldingInput, prepareHarnessScaffold, writeHarnessScaffold } from './harnessScaffolding.js'

/** Create and mount an empty service-owned Harness; its name defaults to the lower-camel service name. */
export const addPuristaHarness = async (input: HarnessScaffoldingInput & { harnessName?: string }) => {
	return writeHarnessScaffold(prepareHarnessScaffold(input, undefined, input.harnessName))
}
