import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App.js'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The tutorial UI needs a root element.')

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
