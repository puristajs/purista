import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useMemo, useState } from 'react'
import {
	Conversation,
	ConversationContent,
	ConversationEmptyState,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message'
import {
	PromptInput,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from '@/components/ai-elements/tool'

export function KnowledgeChat({
	sessionToken,
	knowledgeReady = true,
}: {
	sessionToken: string
	knowledgeReady?: boolean
}) {
	const [text, setText] = useState('')
	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: '/api/v1/knowledge/chat',
				headers: { authorization: `Bearer ${sessionToken}` },
				body: { collectionId: 'customer-help' },
			}),
		[sessionToken],
	)
	const { messages, sendMessage, status } = useChat({ transport })

	function submit(message: PromptInputMessage) {
		if (!message.text.trim() || !sessionToken || !knowledgeReady) return
		sendMessage({ text: message.text })
		setText('')
	}

	return (
		<section className="flex h-[36rem] flex-col rounded-xl border bg-card p-4 shadow-sm" aria-label="Knowledge chat">
			<p className="sr-only" aria-live="polite">
				{status === 'submitted'
					? 'The question was submitted.'
					: status === 'streaming'
						? 'The answer is streaming.'
						: status === 'error'
							? 'The answer failed.'
							: 'Ready for a question.'}
			</p>
			<Conversation>
				<ConversationContent>
					{messages.length === 0 ? (
						<ConversationEmptyState
							title="Ask Example Bank"
							description="Answers use the authorized customer-help collection."
						/>
					) : (
						messages.map((message) => (
							<Message from={message.role} key={message.id}>
								<MessageContent>
									{message.parts.map((part) => {
										if (part.type === 'text') {
											return <MessageResponse key={`${message.id}-text-${part.text}`}>{part.text}</MessageResponse>
										}
										if (part.type === 'dynamic-tool') {
											return (
												<Tool key={`${message.id}-tool-${part.toolCallId}`}>
													<ToolHeader type={part.type} state={part.state} toolName={part.toolName} />
													<ToolContent>
														<ToolInput input={part.input} />
														<ToolOutput
															output={'output' in part ? part.output : undefined}
															errorText={'errorText' in part ? part.errorText : undefined}
														/>
													</ToolContent>
												</Tool>
											)
										}
										return null
									})}
								</MessageContent>
							</Message>
						))
					)}
				</ConversationContent>
				<ConversationScrollButton />
			</Conversation>
			<PromptInput onSubmit={submit} className="mt-4">
				<PromptInputTextarea
					value={text}
					onChange={(event) => setText(event.currentTarget.value)}
					placeholder={
						!sessionToken
							? 'Sign in first'
							: knowledgeReady
								? 'Ask how long an international transfer can remain pending'
								: 'Ingest the source first'
					}
				/>
				<PromptInputSubmit status={status} disabled={!text.trim() || !sessionToken || !knowledgeReady} />
			</PromptInput>
		</section>
	)
}
