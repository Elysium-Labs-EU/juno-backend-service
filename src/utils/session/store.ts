/*!
 * Connect - session - Store
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

import Cookie from './cookie.ts'

const EventEmitter = require('events').EventEmitter

import Session from './session.ts'

import util from 'util'

/**
 * Abstract base class for session stores.
 * @public
 */

export default function Store() {
  EventEmitter.call(this)
}

/**
 * Inherit from EventEmitter.
 */

util.inherits(Store, EventEmitter)

/**
 * Re-generate the given requests's session.
 *
 * @param {IncomingRequest} req
 * @return {Function} fn
 * @api public
 */

Store.prototype.regenerate = function (req: any, fn: any) {
  const self = this
  this.destroy(req.sessionID, function (err: any) {
    self.generate(req)
    fn(err)
  })
}

/**
 * Load a `Session` instance via the given `sid`
 * and invoke the callback `fn(err, sess)`.
 *
 * @param {String} sid
 * @param {Function} fn
 * @api public
 */

Store.prototype.load = function (sid: any, fn: any) {
  const self = this
  this.get(sid, function (err: any, sess: any) {
    if (err) return fn(err)
    if (!sess) return fn()
    const req = { sessionID: sid, sessionStore: self }
    fn(null, self.createSession(req, sess))
  })
}

/**
 * Create session from JSON `sess` data.
 *
 * @param {IncomingRequest} req
 * @param {Object} sess
 * @return {Session}
 * @api private
 */

Store.prototype.createSession = function (req: any, sess: any) {
  const expires = sess.cookie.expires
  const originalMaxAge = sess.cookie.originalMaxAge

  sess.cookie = new Cookie(sess.cookie)

  if (typeof expires === 'string') {
    // convert expires to a Date object
    sess.cookie.expires = new Date(expires)
  }

  // keep originalMaxAge intact
  sess.cookie.originalMaxAge = originalMaxAge

  req.session = new Session(req, sess)
  return req.session
}
