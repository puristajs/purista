import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-4 [&>svg]:left-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
	{
		variants: {
			variant: {
				default: 'bg-background text-foreground',
				destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
			},
		},
		defaultVariants: { variant: 'default' },
	},
)

export type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>

export function Alert({ className, variant, ...props }: AlertProps) {
	return <div className={cn(alertVariants({ variant }), className)} role="alert" {...props} />
}

export function AlertTitle({ className, ...props }: React.ComponentProps<'h5'>) {
	return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
}
