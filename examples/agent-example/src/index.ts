import { supportV1Service } from './service/support/v1/index.js'

if (import.meta.url === `file://${process.argv[1]}`) {
	const definitions = await supportV1Service.resolveDefinitions()
	process.stdout.write(
		JSON.stringify(
			{
				service: supportV1Service.info.serviceName,
				agent: 'triageTicket',
				queue: definitions.queues[0]?.queueName,
				command: definitions.commands[0]?.commandName,
				stream: definitions.streams[0]?.streamName,
			},
			null,
			2,
		),
	)
	process.stdout.write('\n')
}
