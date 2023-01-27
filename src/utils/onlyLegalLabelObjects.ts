import type { LabelIdName } from '../api/History/handleHistoryObject'

interface IOnlyLegalLabels {
  labelNames: Array<string>
  storageLabels: Array<LabelIdName>
}

/**
 * @function
 * @param {IOnlyLegalLabels} param0 - An object with two properties:
 * labelNames: an array of strings representing the names of labels
 * storageLabels: an array of LabelIdName objects
 * @return {IOnlyLegalLabels['storageLabels']} - an array of LabelIdName objects that match the labelNames
 * @typedef {Object} LabelIdName
 * @property {string} id
 * @property {string} name
 * @typedef {Object} IOnlyLegalLabels
 * @property {Array<string>} labelNames
 * @property {Array<LabelIdName>} storageLabels
 */

const onlyLegalLabels = ({ labelNames, storageLabels }: IOnlyLegalLabels) => {
  const idMapStorageLabels = storageLabels.map((label) => label.id)

  const filterArray = labelNames.filter((el) => idMapStorageLabels.includes(el))

  const newArray: IOnlyLegalLabels['storageLabels'] = []
  for (let i = 0; i < filterArray.length; i += 1) {
    const pushItem = storageLabels.find((item) => item.id === filterArray[i])
    if (pushItem) {
      newArray.push(pushItem)
    }
  }

  return newArray
}

export default onlyLegalLabels
