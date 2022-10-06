import { gmail_v1 } from 'googleapis'
import onlyLegalLabelObjects from '../../utils/onlyLegalLabelObjects'
import * as global from '../../constants/globalConstants'

export const HISTORY_NEXT_PAGETOKEN = 'history'
export const HISTORY_TIME_STAMP = 0

export interface LabelIdName {
  id: string
  name: string
}
interface IFeedModel {
  labels: string[]
  threads: (gmail_v1.Schema$Message | undefined)[]
  nextPageToken: string | null
}

/**
 * @function restructureObject
 * @param {Object} message - a single message object from the history object.
 * @returns {Object} - returns an object where the threadId is set as the id.
 * */
const restructureObject = (message: gmail_v1.Schema$Message | undefined) => {
  if (message === undefined) {
    return
  }
  const newObject = { ...message, id: message.threadId }
  return newObject
}

/**
 * @function handleHistoryObject
 * @param {IHistoryObject[]} history - the history object from the Gmail api.
 * @param {LabelIdName[]} storageLabels - all the available Juno labels in this system.
 * @returns {IFeedModel[]} - End result will be that the function returns multiple arrays. One for each inbox.
 * */

// TODO: Make the remove changes also be worked on
// TODO: Fix this function to update the Archive feed correctly.

export default function handleHistoryObject({
  history,
  storageLabels,
}: {
  history: gmail_v1.Schema$History[]
  storageLabels: LabelIdName[]
}): IFeedModel[] {
  const inboxFeed: IFeedModel = {
    labels: [global.INBOX_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const toDoLabelId = storageLabels.find(
    (label) => label.name === 'Juno/To Do'
  )?.id
  if (!toDoLabelId) {
    throw Error('Cannot find the to do label')
  }
  const todoFeed: IFeedModel = {
    labels: [toDoLabelId],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const sentFeed: IFeedModel = {
    labels: [global.SENT_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  const draftFeed: IFeedModel = {
    labels: [global.DRAFT_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }
  // The All feed takes in all the changes of the other feeds.
  const archiveFeed: IFeedModel = {
    labels: [global.ARCHIVE_LABEL],
    threads: [],
    nextPageToken: HISTORY_NEXT_PAGETOKEN,
  }

  const handleRemovalUnreadLabel = (item: gmail_v1.Schema$History) => {
    if (item.labelsRemoved && item.labelsRemoved[0]) {
      if (
        item.labelsRemoved[0].labelIds?.includes(global.UNREAD_LABEL) &&
        item.labelsRemoved[0]?.message?.labelIds
      ) {
        const staticOnlyLegalLabels = onlyLegalLabelObjects({
          labelNames: item.labelsRemoved[0].message.labelIds,
          storageLabels,
        })
        if (
          staticOnlyLegalLabels.length > 0 &&
          staticOnlyLegalLabels.some((label) => label.id === global.INBOX_LABEL)
        ) {
          inboxFeed.threads.push(
            restructureObject(item.labelsRemoved[0].message)
          )
        }
        if (
          staticOnlyLegalLabels.length > 0 &&
          staticOnlyLegalLabels.some((label) => label.id === toDoLabelId)
        ) {
          todoFeed.threads.push(
            restructureObject(item.labelsRemoved[0].message)
          )
        }
        archiveFeed.threads.push(
          restructureObject(item.labelsRemoved[0].message)
        )
      }
    }
  }

  const handleRemovalOriginFeed = (item: gmail_v1.Schema$History) => {
    if (item.labelsRemoved) {
      if (item.labelsRemoved[0]?.message?.threadId) {
        // The all feed doesn't listen to this function set, since the All Feed doesn't need to be filtered.
        const toHandleObject = item.labelsRemoved[0]

        if (item.labelsRemoved[0]?.labelIds?.includes(global.INBOX_LABEL)) {
          const output = inboxFeed.threads.filter(
            (filterItem) => filterItem?.id !== toHandleObject?.message?.threadId
          )
          inboxFeed.threads = output
        }

        if (item.labelsRemoved[0]?.labelIds?.includes(toDoLabelId)) {
          const output = todoFeed.threads.filter(
            (filterItem) => filterItem?.id !== toHandleObject?.message?.threadId
          )
          todoFeed.threads = output
        }
      }
    }
  }

  const handleAdditionLabel = (item: gmail_v1.Schema$History) => {
    if (item.labelsAdded) {
      if (item.labelsAdded[0].labelIds?.includes(global.INBOX_LABEL)) {
        inboxFeed.threads.push(restructureObject(item?.labelsAdded[0]?.message))
      }
      if (item.labelsAdded[0].labelIds?.includes(toDoLabelId)) {
        todoFeed.threads.push(restructureObject(item.labelsAdded[0].message))
      }
      if (item.labelsAdded[0].labelIds?.includes(global.SENT_LABEL)) {
        sentFeed.threads.push(restructureObject(item.labelsAdded[0].message))
      }
    }
  }

  const handleAdditionDraftMessage = (item: gmail_v1.Schema$History) => {
    if (
      item?.messagesAdded &&
      item?.messagesAdded[0]?.message &&
      item?.messagesAdded[0]?.message?.labelIds
    ) {
      const draftThreadIndex = draftFeed.threads.findIndex((thread) => {
        if (item?.messagesAdded) {
          return thread?.threadId === item.messagesAdded[0].message?.threadId
        }
        return -1
      })
      // The api removes the older draft and sets a newer one - all of these events are listed in the history.
      // So the draftFeed object should overwrite an entry if the loop finds another one with the same threadId
      if (draftThreadIndex > -1) {
        draftFeed.threads.splice(draftThreadIndex, 1)
        draftFeed.threads.push(restructureObject(item.messagesAdded[0].message))
      } else {
        draftFeed.threads.push(restructureObject(item.messagesAdded[0].message))
      }
    }
  }

  const handleAdditionMessage = (item: gmail_v1.Schema$History) => {
    if (
      item?.messagesAdded &&
      item?.messagesAdded[0]?.message &&
      item?.messagesAdded[0]?.message?.labelIds
    ) {
      if (item.messagesAdded[0].message.labelIds.includes(global.INBOX_LABEL)) {
        inboxFeed.threads.push(restructureObject(item.messagesAdded[0].message))
      }
      if (item.messagesAdded[0].message.labelIds.includes(toDoLabelId)) {
        todoFeed.threads.push(restructureObject(item.messagesAdded[0].message))
      }
      if (item.messagesAdded[0].message.labelIds.includes(global.SENT_LABEL)) {
        sentFeed.threads.push(restructureObject(item.messagesAdded[0].message))
      }
      if (item.messagesAdded[0].message.labelIds.includes(global.DRAFT_LABEL)) {
        handleAdditionDraftMessage(item)
      }
      // allFeed.threads.push(restructureObject(item.messagesAdded[0].message))
    }
  }

  if (Array.isArray(history)) {
    try {
      // Remove all the entries that will not be used. We only want objects that have 3 keys or more.
      const cleanHistoryArray = history.filter(
        (item) => Object.keys(item).length > 2
      )
      // If item has been marked as read and is also archived, the item is coming up twice in the feed.
      // Make sure that the end feed doesn't include these items for the labelsRemoved
      for (let i = 0; i < cleanHistoryArray.length; i += 1) {
        const item = cleanHistoryArray[i]
        if (Object.prototype.hasOwnProperty.call(item, 'labelsRemoved')) {
          handleRemovalUnreadLabel(item)
          handleRemovalOriginFeed(item)
        }
        if (Object.prototype.hasOwnProperty.call(item, 'labelsAdded')) {
          handleAdditionLabel(item)
        }
        if (Object.prototype.hasOwnProperty.call(item, 'messagesAdded')) {
          handleAdditionMessage(item)
        }
      }
    } catch (err) {
      process.env.NODE_ENV === 'development' && console.error(err)
    }
  }
  return [inboxFeed, todoFeed, sentFeed, draftFeed, archiveFeed]
}
