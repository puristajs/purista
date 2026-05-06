import { execa } from 'execa'

const imageName = process.env.PURISTA_SANDBOX_IMAGE?.trim() || 'purista-sandbox-agent:latest'

await execa('docker', ['build', '-t', imageName, '-f', 'Dockerfile.sandbox', '.'], {
	stdio: 'inherit',
	reject: true,
})
