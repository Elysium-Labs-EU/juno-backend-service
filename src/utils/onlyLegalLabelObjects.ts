import type { LabelIdName } from '../api/History/handleHistoryObject'

interface IOnlyLegalLabels {
  labelNames: Array<string>
  storageLabels: Array<LabelIdName>
}

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
