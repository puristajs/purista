import { exec } from 'node:child_process'

export const isPackageInstalled = async (packageName: string) => {
  return new Promise<boolean>((resolve) => {
    const cmd = 'npm ls ' + packageName
    const child = exec(cmd, (err) => {
      if (err) {
        resolve(false)
      }
    })
    child.stderr?.pipe(process.stderr)
    child.on('close', () => resolve(true))
  })
}
