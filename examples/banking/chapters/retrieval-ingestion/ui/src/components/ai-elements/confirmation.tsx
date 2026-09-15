import type { DynamicToolUIPart, ToolUIPart } from 'ai'
import type { ComponentProps, ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ConfirmationPart = ToolUIPart | DynamicToolUIPart
type ConfirmationState = ConfirmationPart['state']
type ConfirmationApproval = Extract<ConfirmationPart, { state: 'approval-requested' }>['approval']

interface ConfirmationContextValue {
	approval: ConfirmationApproval
	state: ConfirmationState
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null)

function useConfirmation() {
	const context = useContext(ConfirmationContext)
	if (!context) throw new Error('Confirmation components must be used within Confirmation')
	return context
}

export type ConfirmationProps = ComponentProps<typeof Alert> & {
	approval: ConfirmationApproval
	state: ConfirmationState
}

export function Confirmation({ className, approval, state, ...props }: ConfirmationProps) {
	const contextValue = useMemo(() => ({ approval, state }), [approval, state])
	if (state === 'input-streaming' || state === 'input-available') return null
	return (
		<ConfirmationContext.Provider value={contextValue}>
			<Alert className={cn('flex flex-col gap-2', className)} {...props} />
		</ConfirmationContext.Provider>
	)
}

export type ConfirmationTitleProps = ComponentProps<typeof AlertDescription>

export function ConfirmationTitle({ className, ...props }: ConfirmationTitleProps) {
	return <AlertDescription className={cn('inline', className)} {...props} />
}

export interface ConfirmationRequestProps {
	children?: ReactNode
}

export function ConfirmationRequest({ children }: ConfirmationRequestProps) {
	const { state } = useConfirmation()
	return state === 'approval-requested' ? children : null
}

export interface ConfirmationAcceptedProps {
	children?: ReactNode
}

export function ConfirmationAccepted({ children }: ConfirmationAcceptedProps) {
	const { approval, state } = useConfirmation()
	if (!approval.approved || !['approval-responded', 'output-denied', 'output-available'].includes(state)) return null
	return children
}

export interface ConfirmationRejectedProps {
	children?: ReactNode
}

export function ConfirmationRejected({ children }: ConfirmationRejectedProps) {
	const { approval, state } = useConfirmation()
	if (approval.approved !== false || !['approval-responded', 'output-denied', 'output-available'].includes(state))
		return null
	return children
}

export type ConfirmationActionsProps = ComponentProps<'div'>

export function ConfirmationActions({ className, ...props }: ConfirmationActionsProps) {
	const { state } = useConfirmation()
	if (state !== 'approval-requested') return null
	return <div className={cn('flex items-center justify-end gap-2 self-end', className)} {...props} />
}

export type ConfirmationActionProps = ComponentProps<typeof Button>

export function ConfirmationAction({ className, ...props }: ConfirmationActionProps) {
	return <Button className={cn('h-8 px-3 text-sm', className)} type="button" {...props} />
}
