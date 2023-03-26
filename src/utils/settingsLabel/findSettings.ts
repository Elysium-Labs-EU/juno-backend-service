import { OAuth2Client } from 'google-auth-library'

import { SETTINGS_DELIMITER, SETTINGS_LABEL } from './settingsConstants'
import { deleteLabel } from '../../api/Labels/removeLabel'
import type { TGmailV1SchemaLabelSchema } from '../../types/gmailTypes'

/**
 * @function findSettings
 * @param labels - takes in the response of the Label list api from Gmail
 * @param dispatch
 * It will attempt to filter and parse the settings label, if there are multiple settings labels that are of equal size, we clear it out.
 * @returns null or a Google Label that is the settings label.
 */

const findSettings = (
  labels: Array<TGmailV1SchemaLabelSchema>,
  auth: OAuth2Client
) => {
  const result = labels.filter((label) =>
    label.name?.includes(`${SETTINGS_LABEL + SETTINGS_DELIMITER}`)
  )

  if (!result.length) {
    return null
  }
  if (result.length === 1) {
    return result[0]
  }

  const longestSettingsLabel = result.reduce(
    (acc, curr) => {
      if (
        (curr?.name && acc?.name && curr.name.length > acc.name.length) ||
        !acc.name
      ) {
        return curr
      }
      return acc
    },
    { name: '', id: '', type: '' }
  )

  // If there are two or more equal length settings labels found
  // we drop it all and create a new one via the 'handleSettings' function.
  result
    .filter((label) => label !== longestSettingsLabel)
    .forEach((label) => {
      if (label && label?.id) {
        deleteLabel(auth, { body: { id: label.id } })
      }
    })

  return longestSettingsLabel
}

export default findSettings
