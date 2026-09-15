import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				outline: 'border bg-background hover:bg-accent hover:text-accent-foreground',
			},
			size: { default: 'h-10 px-4 py-2', sm: 'h-9 rounded-md px-3' },
		},
		defaultVariants: { variant: 'default', size: 'default' },
	},
)

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
	return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
