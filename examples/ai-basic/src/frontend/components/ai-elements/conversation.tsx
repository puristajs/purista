import { ArrowDownIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { useCallback } from 'react'
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom'

const cn = (...parts: Array<string | undefined | false>) => parts.filter(Boolean).join(' ')

export type ConversationProps = ComponentProps<typeof StickToBottom>

export const Conversation = ({ className, ...props }: ConversationProps) => (
	<StickToBottom
		className={cn('conversation-root', className)}
		initial="smooth"
		resize="smooth"
		role="log"
		{...props}
	/>
)

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>

export const ConversationContent = ({ className, ...props }: ConversationContentProps) => (
	<StickToBottom.Content className={cn('conversation-content', className)} {...props} />
)

export type ConversationEmptyStateProps = ComponentProps<'div'> & {
	title?: string
	description?: string
	icon?: ReactNode
}

export const ConversationEmptyState = ({
	className,
	title = 'No messages yet',
	description = 'Start a conversation to see messages here',
	icon,
	children,
	...props
}: ConversationEmptyStateProps) => (
	<div className={cn('conversation-empty', className)} {...props}>
		{children ?? (
			<>
				{icon && <div className="conversation-empty-icon">{icon}</div>}
				<div className="conversation-empty-text">
					<h3>{title}</h3>
					{description && <p>{description}</p>}
				</div>
			</>
		)}
	</div>
)

export type ConversationScrollButtonProps = ComponentProps<'button'>

export const ConversationScrollButton = ({ className, ...props }: ConversationScrollButtonProps) => {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext()
	const handleScrollToBottom = useCallback(() => {
		scrollToBottom()
	}, [scrollToBottom])

	if (isAtBottom) {
		return null
	}

	return (
		<button
			className={cn('conversation-scroll-button button secondary', className)}
			onClick={handleScrollToBottom}
			type="button"
			{...props}
		>
			<ArrowDownIcon size={16} />
		</button>
	)
}
