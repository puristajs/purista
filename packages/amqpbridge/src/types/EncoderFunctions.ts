export type EncoderFunctions = {
  encode: <T>(input: T) => Promise<Buffer>
  decode: <T>(input: Buffer) => Promise<T>
}
