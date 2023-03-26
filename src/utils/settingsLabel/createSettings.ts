import { OAuth2Client } from 'google-auth-library'

import { buildLabelString } from './buildLabelString'
import {
  SETTINGS_DELIMITER,
  SETTINGS_LABEL,
  alternateActionsKeyMap,
  emailFetchSizeKeyMap,
  flexibleFlowKeyMap,
  showAvatarKeyMap,
  showIntroductionKeyMap,
} from './settingsConstants'
import type { ISettingsObject } from './settingsTypes'
import { newLabel } from '../../api/Labels/createLabel'

/**
 * @function createSettingsLabel
 * @param dispatch - takes in a callback function to store the result of the function to the Redux store.
 * @param presetValues - an optional parameter, the parameter is in the format of an label.
 * Creates a settings label to be stored as a label inside Gmail.
 * @returns {void}
 */
export default async function createSettingsLabel(
  auth: OAuth2Client,
  presetValues?: ISettingsObject
) {
  if (presetValues) {
    // If there are presetValues, create an updated settings label whilst maintaining the user's settings
    const presetValueBody = { body: { name: buildLabelString(presetValues) } }
    const response = await newLabel(auth, presetValueBody)
    return response
  }

  const defaultSettingsString = `${
    SETTINGS_LABEL +
    SETTINGS_DELIMITER +
    showAvatarKeyMap.true +
    SETTINGS_DELIMITER +
    emailFetchSizeKeyMap[20] +
    SETTINGS_DELIMITER +
    showIntroductionKeyMap.true +
    SETTINGS_DELIMITER +
    flexibleFlowKeyMap.false +
    SETTINGS_DELIMITER +
    alternateActionsKeyMap.true
  }`
  // If there are no presetValues, create a default settings label
  const newLabelBody = { body: { name: defaultSettingsString } }
  const response = await newLabel(auth, newLabelBody)
  return response
}
