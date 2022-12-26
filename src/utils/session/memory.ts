/*!
 * express-session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

import util from 'util'

import Store from './store.ts'

/**
 * Shim setImmediate for node.js < 0.10
 * @private
 */

/* istanbul ignore next */
const defer =
  typeof setImmediate === 'function'
    ? setImmediate
    : (fn: any) => process.nextTick(fn.bind(null, ...arguments))

/**
 * A session store in memory.
 * @public
 */

export default function MemoryStore(obj?: any) {
  Store.call(obj)
  obj.sessions = Object.create(null)
}

/**
 * Inherit from Store.
 */

util.inherits(MemoryStore, Store)

/**
 * Get all active sessions.
 *
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.all = function all(callback: any): void {
  const sessionIds = Object.keys(this.sessions)
  const sessions = Object.create(null)

  sessionIds.forEach((sessionId) => {
    const session = getSession.call(this, sessionId)
    if (session) {
      sessions[sessionId] = session
    }
  })

  if (callback) {
    defer(callback, null, sessions)
  }
}

/**
 * Clear all sessions.
 *
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.clear = function clear(callback: any): void {
  this.sessions = Object.create(null)
  if (callback) {
    defer(callback)
  }
}

/**
 * Destroy the session associated with the given session ID.
 *
 * @param {string} sessionId
 * @public
 */

MemoryStore.prototype.destroy = function destroy(
  sessionId: any,
  callback: any
) {
  delete this.sessions[sessionId]
  callback && defer(callback)
}

/**
 * Fetch session by the given session ID.
 *
 * @param {string} sessionId
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.get = function get(sessionId: any, callback: any) {
  defer(callback, null, getSession.call(this, sessionId))
}

/**
 * Commit the given session associated with the given sessionId to the store.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.set = function set(
  sessionId: any,
  session: any,
  callback: any
) {
  this.sessions[sessionId] = JSON.stringify(session)
  callback && defer(callback)
}

/**
 * Get number of active sessions.
 *
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.length = function length(callback: any) {
  this.all(function (err: any, sessions: any) {
    if (err) return callback(err)
    callback(null, Object.keys(sessions).length)
  })
}

/**
 * Touch the given session object associated with the given session ID.
 *
 * @param {string} sessionId
 * @param {object} session
 * @param {function} callback
 * @public
 */

MemoryStore.prototype.touch = function touch(
  sessionId: any,
  session: any,
  callback: any
) {
  const currentSession = getSession.call(this, sessionId)

  if (currentSession) {
    // update expiration
    currentSession.cookie = session.cookie
    this.sessions[sessionId] = JSON.stringify(currentSession)
  }

  callback && defer(callback)
}

/**
 * Get session from the store.
 * @private
 */

function getSession(sessionId) {
  let sess = this.sessions[sessionId]

  if (!sess) {
    return
  }

  // parse
  sess = JSON.parse(sess)

  if (sess.cookie) {
    const expires =
      typeof sess.cookie.expires === 'string'
        ? new Date(sess.cookie.expires)
        : sess.cookie.expires

    // destroy expired session
    if (expires && expires <= Date.now()) {
      delete this.sessions[sessionId]
      return
    }
  }

  return sess
}
