import createSettingsLabel from './createSettings'
import fixMissingSetting from './fixMissingSettings'
import {
  SETTINGS_DELIMITER,
  AVAILABLE_SETTINGS,
  showAvatarMap,
  emailFetchSizeMap,
  flexibleFlowMap,
  showIntroductionMap,
  alternateActionsMap,
} from './settingsConstants'
import type { ISettingsObject } from './settingsTypes'
import type { TGmailV1SchemaLabelSchema } from '../../types/gmailTypes'

/**
 * @function parseSettings
 * @param settingsLabel - takes in the found label from Google, which holds all the settings
 * The function will attempt to parse the label and set the system settings according the results.
 * The found label will be store to the localStorage for later reference.
 * @returns {void}
 */

export default function parseSettings(
  settingsLabel: TGmailV1SchemaLabelSchema
) {
  const parsedSettings = settingsLabel.name?.split(SETTINGS_DELIMITER)
  if (parsedSettings && parsedSettings.length > 0) {
    // Remove the prefix of 'Juno/' from the parsed result
    parsedSettings.shift()
    const baseSettings = AVAILABLE_SETTINGS
    const foundSettings: Partial<ISettingsObject> = {}
    for (const value of Object.values(parsedSettings)) {
      switch (value) {
        case 'SA0':
        case 'SA1':
          foundSettings.isAvatarVisible = showAvatarMap[value]
          baseSettings.filter((item) => item !== 'avatar')
          break
        case 'FS20':
        case 'FS25':
        case 'FS30':
          foundSettings.emailFetchSize = emailFetchSizeMap[value]
          break
        case 'FF0':
        case 'FF1':
          foundSettings.isFlexibleFlowActive = flexibleFlowMap[value]
          break
        case 'SI0':
        case 'SI1':
          foundSettings.showIntroduction = showIntroductionMap[value]
          break
        case 'AA0':
        case 'AA1':
          foundSettings.alternateActions = alternateActionsMap[value]
          break
        default:
          // No default option needed, if there is a missing settings function.
          break
      }
    }
    const missingSettings = baseSettings.filter(
      (item) => !Object.keys(foundSettings).includes(item)
    )
    if (missingSettings.length > 0) {
      const fixedResult = fixMissingSetting(missingSettings)
      // Patch the foundSettings with the fixed settings and update the settings label on Gmail with the fixed settings.
      const completeSettings = Object.assign(foundSettings, fixedResult)
      createSettingsLabel(completeSettings)
      return completeSettings
    }
    return foundSettings
  }
}
