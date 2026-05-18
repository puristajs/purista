[**PURISTA API**](../../README.md)

***

[PURISTA API](../../packages.md) / @purista/cli

# @purista/cli

`@purista/cli` is the canonical PURISTA CLI engine. It supports:

- interactive human usage
- non-interactive shell and CI execution
- programmatic access for scripts and agents
- local blueprint-driven project generation without cloning `starter`

Create a new project:

```bash
npx @purista/cli init
```

Or use the dedicated wrapper:

```bash
npm create purista@latest
```

Scaffold artifacts inside an existing PURISTA project:

```bash
purista add service user --description "User service"
purista add command sign-up --service user --service-version 1 --description "Register a user"
purista add queue process-jobs --service user --service-version 1 --description "Background jobs"
purista add agent triage --service user --service-version 1 --description "Review tickets"
```

Non-interactive mode fails fast when a required value has no declared default:

```bash
purista add service user --description "User service" --non-interactive
purista init my-app --defaults --non-interactive
```

Programmatic usage:

```ts
import { runPuristaCommand } from '@purista/cli'

await runPuristaCommand(
  'add-service',
  { name: 'user', description: 'User service' },
  { cwd: process.cwd(), mode: 'programmatic' },
)
```

Project creation can also be planned and materialized directly:

```ts
import { planProjectGeneration, materializeProjectGeneration } from '@purista/cli'

const plan = planProjectGeneration({
  target: 'my-app',
  projectName: 'my-app',
  runtime: 'node',
  eventBridge: 'default',
  useWebserver: true,
  fileConvention: 'camel',
  eventConvention: 'dotCase',
  linter: 'biome',
  formatter: 'biome',
  type: 'module',
  packageManager: 'npm',
  installDependencies: false,
})

await materializeProjectGeneration(plan)
```

Generated tests follow the public testing helpers:

- `createCommandContextMock(...)` for command handler tests
- `createSubscriptionContextMock(...)` for subscription handler tests
- `createStreamTestHarness(...)` for runtime stream tests
- `createQueueWorkerTestHarness(...)` for runtime queue worker tests
- `createAgentTestHarness(...)` and `createScriptedHarnessModel(...)` for agent runtime tests

**Visit [purista.dev](https://purista.dev)**

**Follow on Twitter [@purista_js](https://twitter.com/purista_js)**  
**Join the [Discord Chat](https://discord.gg/9feaUm3H2v)**

<a href="https://www.producthunt.com/posts/purista?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-purista" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=386519&theme=light" alt="PURISTA - Typescript&#0032;framework&#0032;for&#0032;IoT&#0044;&#0032;microservices&#0044;&#0032;and&#0032;serverless | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Classes

- [PuristaCliError](classes/PuristaCliError.md)
- [PuristaCliPromptError](classes/PuristaCliPromptError.md)
- [PuristaCliValidationError](classes/PuristaCliValidationError.md)

## Interfaces

- [Options](interfaces/Options.md)
- [PascalCaseOptions](interfaces/PascalCaseOptions.md)

## Type Aliases

- [AddPuristaQueueInput](type-aliases/AddPuristaQueueInput.md)
- [AddPuristaQueueWorkerInput](type-aliases/AddPuristaQueueWorkerInput.md)
- [BasePromptRequest](type-aliases/BasePromptRequest.md)
- [BlueprintId](type-aliases/BlueprintId.md)
- [ConfirmPromptRequest](type-aliases/ConfirmPromptRequest.md)
- [EnqueueOption](type-aliases/EnqueueOption.md)
- [ExampleServiceGeneratorStep](type-aliases/ExampleServiceGeneratorStep.md)
- [InputPromptRequest](type-aliases/InputPromptRequest.md)
- [Locale](type-aliases/Locale.md)
- [OutputAdapter](type-aliases/OutputAdapter.md)
- [ProjectBlueprint](type-aliases/ProjectBlueprint.md)
- [ProjectBlueprintContext](type-aliases/ProjectBlueprintContext.md)
- [ProjectBlueprintContribution](type-aliases/ProjectBlueprintContribution.md)
- [ProjectConfigPatch](type-aliases/ProjectConfigPatch.md)
- [ProjectFileContribution](type-aliases/ProjectFileContribution.md)
- [ProjectGenerationPlan](type-aliases/ProjectGenerationPlan.md)
- [ProjectGeneratorStep](type-aliases/ProjectGeneratorStep.md)
- [ProjectSnapshot](type-aliases/ProjectSnapshot.md)
- [PromptAdapter](type-aliases/PromptAdapter.md)
- [PromptAnswerMap](type-aliases/PromptAnswerMap.md)
- [PromptChoice](type-aliases/PromptChoice.md)
- [PromptRequest](type-aliases/PromptRequest.md)
- [PuristaCliEngineOptions](type-aliases/PuristaCliEngineOptions.md)
- [PuristaCommandContext](type-aliases/PuristaCommandContext.md)
- [PuristaCommandId](type-aliases/PuristaCommandId.md)
- [PuristaCommandIssue](type-aliases/PuristaCommandIssue.md)
- [PuristaCommandMode](type-aliases/PuristaCommandMode.md)
- [PuristaCommandResolution](type-aliases/PuristaCommandResolution.md)
- [PuristaCommandResult](type-aliases/PuristaCommandResult.md)
- [PuristaConfig](type-aliases/PuristaConfig.md)
- [PuristaExecutableCommand](type-aliases/PuristaExecutableCommand.md)
- [PuristaFileMutation](type-aliases/PuristaFileMutation.md)
- [PuristaProjectInfo](type-aliases/PuristaProjectInfo.md)
- [PuristaProjectServices](type-aliases/PuristaProjectServices.md)
- [QueueProducerOptions](type-aliases/QueueProducerOptions.md)
- [QueueWorkerOptions](type-aliases/QueueWorkerOptions.md)
- [ResolvedProjectBlueprints](type-aliases/ResolvedProjectBlueprints.md)
- [SelectPromptRequest](type-aliases/SelectPromptRequest.md)
- [ServiceVersionSnapshot](type-aliases/ServiceVersionSnapshot.md)

## Variables

- [blueprintIds](variables/blueprintIds.md)
- [projectBlueprintRegistry](variables/projectBlueprintRegistry.md)
- [puristaCommandIds](variables/puristaCommandIds.md)
- [puristaConfigSchema](variables/puristaConfigSchema.md)

## Functions

- [addPuristaAgent](functions/addPuristaAgent.md)
- [addPuristaCommand](functions/addPuristaCommand.md)
- [addPuristaQueue](functions/addPuristaQueue.md)
- [addPuristaQueueWorker](functions/addPuristaQueueWorker.md)
- [addPuristaService](functions/addPuristaService.md)
- [addPuristaStream](functions/addPuristaStream.md)
- [addPuristaSubscription](functions/addPuristaSubscription.md)
- [camelCase](functions/camelCase.md)
- [capitalCase](functions/capitalCase.md)
- [constantCase](functions/constantCase.md)
- [convertToProjectFileCasing](functions/convertToProjectFileCasing.md)
- [createAmqpConfigFile](functions/createAmqpConfigFile.md)
- [createBiomeConfigFile](functions/createBiomeConfigFile.md)
- [createDaprConfigFile](functions/createDaprConfigFile.md)
- [createEntrypointFile](functions/createEntrypointFile.md)
- [createEslintCommonJsConfigFile](functions/createEslintCommonJsConfigFile.md)
- [createEslintModuleConfigFile](functions/createEslintModuleConfigFile.md)
- [createEventBridgeFile](functions/createEventBridgeFile.md)
- [createGitIgnoreFile](functions/createGitIgnoreFile.md)
- [createHttpConfigFile](functions/createHttpConfigFile.md)
- [createHttpFile](functions/createHttpFile.md)
- [createMqttConfigFile](functions/createMqttConfigFile.md)
- [createNatsConfigFile](functions/createNatsConfigFile.md)
- [createProjectSnapshot](functions/createProjectSnapshot.md)
- [createPublicIndexHtml](functions/createPublicIndexHtml.md)
- [createPuristaCliEngine](functions/createPuristaCliEngine.md)
- [createReadmeFile](functions/createReadmeFile.md)
- [createServiceEventEnumFile](functions/createServiceEventEnumFile.md)
- [dotCase](functions/dotCase.md)
- [getCommandBuilderFileContent](functions/getCommandBuilderFileContent.md)
- [getCommandSchemaFileContent](functions/getCommandSchemaFileContent.md)
- [getCommandTestFileContent](functions/getCommandTestFileContent.md)
- [getCommandTypeFileContent](functions/getCommandTypeFileContent.md)
- [getGeneralServiceConfigFileContent](functions/getGeneralServiceConfigFileContent.md)
- [getQueueBuilderFileContent](functions/getQueueBuilderFileContent.md)
- [getQueueSchemaFileContent](functions/getQueueSchemaFileContent.md)
- [getQueueTestFileContent](functions/getQueueTestFileContent.md)
- [getQueueTypeFileContent](functions/getQueueTypeFileContent.md)
- [getQueueWorkerBuilderFileContent](functions/getQueueWorkerBuilderFileContent.md)
- [getQueueWorkerTestFileContent](functions/getQueueWorkerTestFileContent.md)
- [getServiceBuilderFileContent](functions/getServiceBuilderFileContent.md)
- [getServiceConfigFileContent](functions/getServiceConfigFileContent.md)
- [getServiceFileContent](functions/getServiceFileContent.md)
- [getServiceTestFileContent](functions/getServiceTestFileContent.md)
- [getStreamBuilderFileContent](functions/getStreamBuilderFileContent.md)
- [getStreamSchemaFileContent](functions/getStreamSchemaFileContent.md)
- [getStreamTestFileContent](functions/getStreamTestFileContent.md)
- [getStreamTypeFileContent](functions/getStreamTypeFileContent.md)
- [getSubscriptionBuilderFileContent](functions/getSubscriptionBuilderFileContent.md)
- [getSubscriptionSchemaFileContent](functions/getSubscriptionSchemaFileContent.md)
- [getSubscriptionTestFileContent](functions/getSubscriptionTestFileContent.md)
- [getSubscriptionTypeFileContent](functions/getSubscriptionTypeFileContent.md)
- [kebabCase](functions/kebabCase.md)
- [loadPuristaConfig](functions/loadPuristaConfig.md)
- [materializeProjectGeneration](functions/materializeProjectGeneration.md)
- [noCase](functions/noCase.md)
- [pascalCase](functions/pascalCase.md)
- [pascalSnakeCase](functions/pascalSnakeCase.md)
- [pathCase](functions/pathCase.md)
- [planProjectGeneration](functions/planProjectGeneration.md)
- [resolveProjectBlueprints](functions/resolveProjectBlueprints.md)
- [resolvePuristaCommand](functions/resolvePuristaCommand.md)
- [runPuristaCommand](functions/runPuristaCommand.md)
- [scanPuristaProject](functions/scanPuristaProject.md)
- [sentenceCase](functions/sentenceCase.md)
- [snakeCase](functions/snakeCase.md)
- [split](functions/split.md)
- [splitSeparateNumbers](functions/splitSeparateNumbers.md)
- [trainCase](functions/trainCase.md)
