/*!
 * Connect - session - Cookie
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

'use strict'

import cookie from 'npm:cookie'
import deprecate from 'npm:deprecate'
// const deprecate = require('depd')('express-session')

import session from './types/index.d.ts'

/**
 * Initialize a new `Cookie` with the given `options`.
 *
 * @param {IncomingMessage} req
 * @param {Object} options
 * @api private
 */

export default function Cookie(options: session.Cookie) {
  // const Cookie = (module.exports = function Cookie(options) {
  //   const path = '/'
  //   const maxAge = null
  //   const httpOnly = true
  let settings: session.Cookie = {
    originalMaxAge: 0,
    path: '/',
    maxAge: undefined,
    httpOnly: true,
  }

  if (options) {
    if (typeof options !== 'object') {
      throw new TypeError('argument options must be a object')
    }

    // for (const key in options) {
    //   if (key !== 'data') {
    //     settings[key as keyof typeof settings] = options[key as keyof typeof options]
    //   }
    // }
    // TODO: Check what the key 'data' check is for and if we need to prevent that as well.
    settings = { ...settings, ...options }

    if (
      (options.originalMaxAge === undefined ||
        options.originalMaxAge === null) &&
      settings?.maxAge
    ) {
      options.originalMaxAge = settings.maxAge
    }
  }
  return settings
}

/*!
 * Prototype.
 */

Cookie.prototype = {
  /**
   * Set expires `date`.
   *
   * @param {Date} date
   * @api public
   */

  set expires(date) {
    this._expires = date
    this.originalMaxAge = this.maxAge
  },

  /**
   * Get expires `date`.
   *
   * @return {Date}
   * @api public
   */

  get expires() {
    return this._expires
  },

  /**
   * Set expires via max-age in `ms`.
   *
   * @param {Number} ms
   * @api public
   */

  set maxAge(ms) {
    if (ms && typeof ms !== 'number' && !(ms instanceof Date)) {
      throw new TypeError('maxAge must be a number or Date')
    }

    if (ms instanceof Date) {
      deprecate('maxAge as Date; pass number of milliseconds instead')
    }

    this.expires = typeof ms === 'number' ? new Date(Date.now() + ms) : ms
  },

  /**
   * Get expires max-age in `ms`.
   *
   * @return {Number}
   * @api public
   */

  get maxAge() {
    return this.expires instanceof Date
      ? this.expires.valueOf() - Date.now()
      : this.expires
  },

  /**
   * Return cookie data object.
   *
   * @return {Object}
   * @api private
   */

  get data() {
    return {
      originalMaxAge: this.originalMaxAge,
      expires: this._expires,
      secure: this.secure,
      httpOnly: this.httpOnly,
      domain: this.domain,
      path: this.path,
      sameSite: this.sameSite,
    }
  },

  /**
   * Return a serialized cookie string.
   *
   * @return {String}
   * @api public
   */

  serialize: function (name: any, val: any) {
    return cookie.serialize(name, val, this.data)
  },

  /**
   * Return JSON representation of this cookie.
   *
   * @return {Object}
   * @api private
   */

  toJSON: function () {
    return this.data
  },
}
