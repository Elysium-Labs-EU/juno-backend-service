/**
 *
 * @param unsubscribeLink - a string or undefined - coming from the Gmail header
 * @returns nothing if there is no input, prefer the regular page link over the mailto link. If there is input, it will return at least a string.
 */
export default function handleListUnsubscribe(unsubscribeLink: string | null) {
  if (!unsubscribeLink) return null

  const links = unsubscribeLink
    .split(',')
    .map((link) => link.trim().replace(/(<|>)+/g, ''))
  let preferNoMailLink = links.find((item) => !item.startsWith('mailto'))
  if (!preferNoMailLink) preferNoMailLink = links[0]
  return preferNoMailLink
}
