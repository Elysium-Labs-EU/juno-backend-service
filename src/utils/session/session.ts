/*!
 * Connect - session - Session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

'use strict'

/**
 * Create a new `Session` with the given request and `data`.
 *
 * @param {IncomingRequest} req
 * @param {Object} data
 * @api private
 */

export default function Session(req, data) {
  Object.defineProperty(this, 'req', { value: req })
  Object.defineProperty(this, 'id', { value: req.sessionID })

  if (typeof data === 'object' && data !== null) {
    // merge data into this, ignoring prototype properties
    for (const prop in data) {
      if (!(prop in this)) {
        this[prop] = data[prop]
      }
    }
  }
}

/**
 * Update reset `.cookie.maxAge` to prevent
 * the cookie from expiring when the
 * session is still active.
 *
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'touch',
  fn: function touch() {
    return this.resetMaxAge()
  },
})

/**
 * Reset `.maxAge` to `.originalMaxAge`.
 *
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'resetMaxAge',
  fn: function resetMaxAge() {
    this.cookie.maxAge = this.cookie.originalMaxAge
    return this
  },
})

/**
 * Save the session data with optional callback `fn(err)`.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'save',
  fn: function save(fn: any) {
    this.req.sessionStore.set(this.id, this, fn || function () {})
    return this
  },
})

/**
 * Re-loads the session data _without_ altering
 * the maxAge properties. Invokes the callback `fn(err)`,
 * after which time if no exception has occurred the
 * `req.session` property will be a new `Session` object,
 * although representing the same session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'reload',
  fn: function reload(fn: any) {
    const req = this.req
    const store = this.req.sessionStore

    store.get(this.id, function (err: any, sess: any) {
      if (err) return fn(err)
      if (!sess) return fn(new Error('failed to load session'))
      store.createSession(req, sess)
      fn()
    })
    return this
  },
})

/**
 * Destroy `this` session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'destroy',
  fn: function destroy(fn: any) {
    delete this.req.session
    this.req.sessionStore.destroy(this.id, fn)
    return this
  },
})

/**
 * Regenerate this request's session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod({
  obj: Session.prototype,
  name: 'regenerate',
  fn: function regenerate(fn: any) {
    this.req.sessionStore.regenerate(this.req, fn)
    return this
  },
})

/**
 * Helper function for creating a method on a prototype.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} fn
 * @private
 */
function defineMethod({ obj, name, fn }: { obj: any; name: any; fn: any }) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: false,
    value: fn,
    writable: true,
  })
}
