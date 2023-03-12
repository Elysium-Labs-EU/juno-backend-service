import AutoLinker from 'autolinker'

/**
 * This function enhances plain text by converting line breaks to HTML <br> tags and adding hyperlinks
 * to URLs using the AutoLinker library.
 *
 * @param {string} localString - The plain text to enhance.
 *
 * @returns {string} The enhanced plain text.
 *
 * @example
 *
 * // Case 1: Input plain text with URLs and line breaks
 * const plainText = 'Hello, world! Check out https://example.com.\n\nBest regards, John';
 * const enhancedText = enhancePlainText(plainText);
 * console.log(enhancedText);
 * // Output: 'Hello, world! Check out <a href="https://example.com">https://example.com</a>.<br><br>Best regards, John'
 *
 * // Case 2: Input plain text without URLs or line breaks
 * const plainText = 'Hello, world! Best regards, John';
 * const enhancedText = enhancePlainText(plainText);
 * console.log(enhancedText);
 * // Output: 'Hello, world! Best regards, John'
 */

export default function enhancePlainText(localString: string) {
  const lineBreakRegex = /(?:\r\n|\r|\n)/g
  return (
    AutoLinker.link(localString, { email: false }).replace(
      lineBreakRegex,
      '<br>'
    ) ?? ''
  )
}
