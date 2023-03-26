/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SETTINGS_LABEL,
  showAvatarKeyMap,
  SETTINGS_DELIMITER,
  showIntroductionKeyMap,
  flexibleFlowKeyMap,
  alternateActionsKeyMap,
  emailFetchSizeKeyMap,
} from './settingsConstants'
import type { ISettingsObject } from './settingsTypes'

export const buildLabelString = (input: ISettingsObject) => {
  let newString = `${SETTINGS_LABEL}`
  const settingFunctions = {
    isAvatarVisible: (value: any) => {
      if (showAvatarKeyMap[value as any]) {
        newString += `${
          SETTINGS_DELIMITER +
          showAvatarKeyMap[value as keyof typeof showAvatarKeyMap]
        }`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    showIntroduction: (value: any) => {
      if (showIntroductionKeyMap[value as any]) {
        newString += `${
          SETTINGS_DELIMITER +
          showIntroductionKeyMap[value as keyof typeof showIntroductionKeyMap]
        }`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    isFlexibleFlowActive: (value: any) => {
      if (flexibleFlowKeyMap[value as any]) {
        newString += `${
          SETTINGS_DELIMITER +
          flexibleFlowKeyMap[value as keyof typeof flexibleFlowKeyMap]
        }`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    alternateActions: (value: any) => {
      if (
        alternateActionsKeyMap[value as keyof typeof alternateActionsKeyMap]
      ) {
        newString += `${
          SETTINGS_DELIMITER +
          alternateActionsKeyMap[value as keyof typeof alternateActionsKeyMap]
        }`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
    emailFetchSize: (value: any) => {
      if (emailFetchSizeKeyMap[value as any]) {
        newString += `${
          SETTINGS_DELIMITER +
          emailFetchSizeKeyMap[value as keyof typeof emailFetchSizeKeyMap]
        }`
      } else {
        newString += `${SETTINGS_DELIMITER + value}`
      }
    },
  }

  for (const [key, value] of Object.entries(input)) {
    if (settingFunctions[key as keyof typeof settingFunctions]) {
      settingFunctions[key as keyof typeof settingFunctions](value)
    }
  }

  return newString
}
