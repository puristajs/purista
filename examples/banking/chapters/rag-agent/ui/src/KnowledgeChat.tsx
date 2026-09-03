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

export function KnowledgeChat({ sessionToken }: { sessionToken: string }) {
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
		if (!message.text.trim() || !sessionToken) return
		sendMessage({ text: message.text })
		setText('')
	}

	return (
		<section className="flex h-[36rem] flex-col rounded-xl border bg-card p-4 shadow-sm" aria-label="Knowledge chat">
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
									{message.parts.map((part) =>
										part.type === 'text' ? (
											<MessageResponse key={`${message.id}-${part.type}-${part.text}`}>{part.text}</MessageResponse>
										) : null,
									)}
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
					placeholder={sessionToken ? 'Ask about transfers, cards, or account access' : 'Add a session token first'}
				/>
				<PromptInputSubmit status={status} disabled={!text.trim() || !sessionToken} />
			</PromptInput>
		</section>
	)
}
