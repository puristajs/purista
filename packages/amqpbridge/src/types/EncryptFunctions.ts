export type EncryptFunctions = {
  encrypt: (input: Buffer) => Promise<Buffer>
  decrypt: (input: Buffer) => Promise<Buffer>
}
