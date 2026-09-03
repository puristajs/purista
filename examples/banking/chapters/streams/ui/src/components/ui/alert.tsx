import type * as React from 'react'
import { cn } from '@/lib/utils'

export function Alert({ className, ...props }: React.ComponentProps<'div'>) {
	return <div role="alert" className={cn('rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm', className)} {...props} />
}
