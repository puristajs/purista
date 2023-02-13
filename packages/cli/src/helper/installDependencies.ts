import { exec } from 'child_process'

export const installDependencies = async (cmd: string) => {
  const child = exec(cmd, (err) => {
    if (err) {
      throw err
    }
  })
  child.stderr?.pipe(process.stderr)
  child.stdout?.pipe(process.stdout)
  return new Promise((resolve) => child.on('close', resolve))
}
