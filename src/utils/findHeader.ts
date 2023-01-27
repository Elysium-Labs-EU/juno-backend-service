import { gmail_v1 } from 'googleapis'

export default function findHeader(
  rawMessage: gmail_v1.Schema$Message,
  query: string
) {
  if (
    rawMessage?.payload?.headers &&
    rawMessage?.payload?.headers?.find((e) => e.name === query)
  ) {
    return (
      rawMessage.payload.headers.find((e) => e.name === query)?.value ?? null
    )
  }
  if (
    rawMessage?.payload?.headers &&
    rawMessage.payload.headers.find((e) => e.name === query.toLowerCase())
  ) {
    return (
      rawMessage.payload.headers.find((e) => e.name === query.toLowerCase())
        ?.value ?? null
    )
  }
  return null
}
