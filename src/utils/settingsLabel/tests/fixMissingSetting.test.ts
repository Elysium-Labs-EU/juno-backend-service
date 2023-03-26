import { describe, expect, it } from 'vitest'

import fixMissingSetting from '../fixMissingSettings'
import { showAvatarMap, emailFetchSizeMap } from '../settingsConstants'

describe('fixMissingSetting', () => {
  it('should return correct fixed setting object', () => {
    const missingSettings = ['isAvatarVisible', 'emailFetchSize']
    const fixedSettings = fixMissingSetting(missingSettings)
    expect(fixedSettings).toEqual({
      isAvatarVisible: showAvatarMap.SA1,
      emailFetchSize: emailFetchSizeMap.FS20,
    })
  })

  it('should return correct fixed setting object when some setting is not in the map', () => {
    const missingSettings = [
      'isAvatarVisible',
      'emailFetchSize',
      'randomSetting',
    ]
    const fixedSettings = fixMissingSetting(missingSettings)
    expect(fixedSettings).toEqual({
      isAvatarVisible: showAvatarMap.SA1,
      emailFetchSize: emailFetchSizeMap.FS20,
    })
  })
  it('should return empty object when no missing settings', () => {
    const missingSettings: Array<string> = []
    const fixedSettings = fixMissingSetting(missingSettings)
    expect(fixedSettings).toEqual({})
  })
})
