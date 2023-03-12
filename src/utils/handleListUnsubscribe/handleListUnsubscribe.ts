import type { IBodyProps } from '../bodyDecoder/bodyDecoderTypes'
import fetchUnsubscribeLink from './fetchUnsubscribeLink'

/**
 * This function handles the list-unsubscribe functionality in an email message. If the
 * `unsubscribeLink` parameter is provided, it will be used to unsubscribe the recipient from the
 * email list. Otherwise, the function will try to fetch the unsubscribe link from the email body
 * using the `fetchUnsubscribeLink` function. If the email has multiple unsubscribe links, the
 * function will prefer the first link that is not a mailto link.
 *
 * @param {IBodyProps} convertedBody - The email body object.
 * @param {string | null} unsubscribeLink - The list-unsubscribe link, if available.
 *
 * @returns {string} The preferred unsubscribe link.
 *
 * @example
 *
 * // Case 1: Unsubscribe link provided
 * const convertedBody = { emailHTML: '...', emailFileHTML: [], removedTrackers: [] };
 * const unsubscribeLink = 'https://example.com/unsubscribe';
 * const preferredLink = handleListUnsubscribe(convertedBody, unsubscribeLink);
 * console.log(preferredLink); // Output: 'https://example.com/unsubscribe'
 *
 * // Case 2: No unsubscribe link provided
 * const convertedBody = { emailHTML: '...', emailFileHTML: [], removedTrackers: [] };
 * const unsubscribeLink = null;
 * const preferredLink = handleListUnsubscribe(convertedBody, unsubscribeLink);
 * console.log(preferredLink); // Output: 'https://example.com/unsubscribe'
 */

export default function handleListUnsubscribe(
  convertedBody: IBodyProps,
  unsubscribeLink: string | null
) {
  if (!unsubscribeLink) {
    return fetchUnsubscribeLink(convertedBody)
  }
  const links = unsubscribeLink
    .split(',')
    .map((link) => link.trim().replace(/(<|>)+/g, ''))
  let preferNoMailLink = links.find((item) => !item.startsWith('mailto'))
  if (!preferNoMailLink) {
    preferNoMailLink = links[0]
  }
  return preferNoMailLink
}
