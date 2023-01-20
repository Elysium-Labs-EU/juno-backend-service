import AutoLinker from 'autolinker'
/**
 * @function enhancePlainText
 * @param localString a plain text string that needs to be enhanced.
 * @returns it will return a string that has been line "breaked" and has activated links.
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
