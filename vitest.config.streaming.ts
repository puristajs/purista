import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		isolate: false,
		globals: true,
		watch: false,
		environment: 'node',
		testTimeout: 30_000,
		hookTimeout: 30_000,
		include: [
			'packages/core/src/core/helper/createOpenStreamFunctionProxy.test.ts',
			'packages/core/src/core/types/stream/streamMessageGuards.test.ts',
			'packages/core/src/StreamDefinitionBuilder/streamDefinitionBuilder.test.ts',
			'packages/cli/src/api/content/manipulation/addDefinitionToBuilder.test.ts',
			'packages/cli/src/api/addPuristaService.integration.test.ts',
			'packages/cli/src/api/addPuristaArtifacts.integration.test.ts',
		],
		exclude: ['**/node_modules/**', '**/dist/**'],
		coverage: {
			enabled: true,
			reporter: ['text-summary', 'json-summary'],
			include: [
				'packages/core/src/core/helper/createOpenStreamFunctionProxy.impl.ts',
				'packages/core/src/core/types/stream/isStreamControl.impl.ts',
				'packages/core/src/core/types/stream/isStreamFrame.impl.ts',
				'packages/core/src/core/types/stream/isStreamMessage.impl.ts',
				'packages/core/src/core/types/stream/isStreamOpenRequest.impl.ts',
				'packages/core/src/StreamDefinitionBuilder/StreamDefinitionBuilder.impl.ts',
				'packages/cli/src/api/addPuristaStream.ts',
				'packages/cli/src/api/content/manipulation/addDefinitionToBuilder.ts',
				'packages/cli/src/api/content/service/getServiceFileContent.ts',
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
	},
})
