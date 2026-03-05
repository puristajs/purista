import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@xyflow/react/dist/style.css'
import 'streamdown/styles.css'

import { App } from './App'
import './styles.css'

const container = document.getElementById('root')
if (!container) {
	throw new Error('Root element not found')
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
