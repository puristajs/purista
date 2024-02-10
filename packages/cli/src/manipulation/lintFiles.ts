import { exec } from 'node:child_process'

export const lintFiles = async (_files: string[]) => {
  const cmd = 'npm run lint:fix'

  const child = exec(cmd, (err) => {
    if (err) {
      throw err
    }
  })
  child.stderr?.pipe(process.stderr)
  child.stdout?.pipe(process.stdout)
  return new Promise((resolve) => child.on('close', resolve))
}
