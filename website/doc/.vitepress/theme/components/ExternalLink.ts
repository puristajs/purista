import type { AnchorHTMLAttributes } from 'react'
import type { FunctionalComponent } from 'vue'
import { h } from 'vue'

export interface ExternalLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target'> {
  href: string
}

export const LOCAL_URL_REG = /^https?:\/\/localhost:/

/**
 * @see https://github.com/vuejs/vitepress/issues/822 for details
 */
export const ExternalLink: FunctionalComponent<ExternalLinkProps> = ({
  href,
  ...props
}) => {
  if (process.env.NODE_ENV === 'development' && !LOCAL_URL_REG.test(href)) {
    console.error('You should use markdown style link instead')
  }
  return h(
    'a',
    {
      href,
      target: '_blank',
      rel: 'noreferrer noopener',
      ...props,
    },
    href,
  )
}
