import { Agent, AgentContent, AgentHeader, AgentInstructions, AgentOutput, AgentTool, AgentTools } from '@/components/ai-elements/agent'
import type { DeveloperDeskScenarioDoc } from '@/lib/showcase'

export const ScenarioAgentCard = ({ scenario }: { scenario: DeveloperDeskScenarioDoc }) => (
	<Agent>
		<AgentHeader model={scenario.agent.model} name={scenario.agent.name} />
		<AgentContent>
			<AgentInstructions>
				<p className="text-sm font-medium">Instructions</p>
				<p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{scenario.agent.instructions}</p>
			</AgentInstructions>
			{scenario.agent.callables.length > 0 ? (
				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium">Tools and delegates</p>
					<AgentTools defaultValue={scenario.agent.callables[0]?.id}>
						{scenario.agent.callables.map(callable => (
							<AgentTool
								description={callable.description}
								inputSchema={callable.inputSchema}
								key={callable.id}
								kind={callable.kind}
								name={callable.name}
								value={callable.id}
							/>
						))}
					</AgentTools>
				</div>
			) : null}
			{scenario.agent.outputSchema ? <AgentOutput schema={scenario.agent.outputSchema} /> : null}
		</AgentContent>
	</Agent>
)
