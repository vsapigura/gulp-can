'use strict';
/**
 * Module with canClass class
 * @module lib/index
 * @type {exports}
 */

/*
 * Module dependencies.
 */
let appModulePath = require('app-module-path');
let extend = require('node.extend');
let path = require('path');

/**
 * Class representing a canClass.
 * @class
 * @classdesc Class representing a canClass.
 */
module.exports = class canClass {

  /**
   * Update settings property
   * @constructs
   * @param {Object|function} data object, or callback what returns data object
   * @throws {TypeError}
   */
  constructor(data) {
    data = data || {};
    if('function' === typeof data) {
      data = data.apply(this);
    }
    if(!data || 'object' !== typeof data) {
      throw new TypeError('Wrong type of "data" property');
    }

    this[this._k('gulp')] = data.gulp || require('gulp');
    this[this._k('settingsDefault')] = {
        paths: {
            root: './',
            tasks: 'gulp/tasks/',
            watches: 'gulp/watches/',
            events: 'gulp/events/'
        }
    };

    this[this._k('plugins')] = data.plugils || require('gulp-load-plugins')({
        config : require.main.require('./package')
    });
    this.settings = data.settings || {};

    appModulePath.addPath(this.settings.paths.root);
  }

  /**
   * Get value of plugins property
   * @type {function}
   * @returns {Object} plugins property value
   */
  get plugins() {
    return this[this._k('plugins')];
  }

  /**
   * Thorw exception on change of plugins value
   * @type {function}
   * @throws {Error}
   */
  set plugins(plugins) {
      throw new Error('"plugins" can\'t be changed');
  }

  /**
   * Get value of settings property
   * @type {function}
   * @returns {Object} settings property value
   */
  get settings() {
    return this[this._k('settings')];
  }

  /**
   * Updating of settings property
   * @type {function}
   * @param {Object|function} settings - data with settings, or callback what returns settings object
   * @throws {TypeError}
   */
  set settings(settings) {
    if(!this[this._k('settings')]) {
      this[this._k('settings')] = this.getSettingsDefault();
    }
    if (settings) {
      if('function' === typeof settings) {
        this[this._k('settings')] = settings.apply(this);
      }
      if(!settings || 'object' !== typeof settings) {
        throw new TypeError('Wrong type of "settings" property');
      }
      this[this._k('settings')] = extend(true, this[this._k('settings')], settings);
    }
    return this[this._k('settings')];
  }

  /**
   * Get value of settingsDefault property
   * @returns {Object} settingsDefault property value
   */
  get settingsDefault() {
    return this[this._k('settingsDefault')];
  }

  /**
   * Thorw exception on change of settingsDefault value
   * @throws {Error}
   */
  set settingsDefault(settings) {
    throw new Error('"settingsDefault" is readonly');
  }

  /**
   * Get value of variables property
   * @returns {Object} variables property value (hashmap)
   */
  get variables() {
    return this[this._k('variables')];
  }

  /**
   * Thorw exception on change of variables value
   * @throws {Error}
   */
  set variables(variables) {
    throw new Error('"variables" is readonly');
  }

  /**
   * Returns unique identifier generated for private properties
   * @see [Symbol]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Symbol}
   *
   * @private
   * @param {string} key - key of property
   * @returns {Symbol} Returns unique identifier generated for private variables
   */
  _k(key) {
    return Symbol.for(key);
  }

  /**
   * Returns Gulp instance
   * @returns {Object} Gulp instance
   */
  getGulp() {
    return this[this._k('gulp')];
  }

  /**
   * Check what plugin with current key exists
   * @param {string|number} key - key of stored plugin
   * @returns {boolean}
   */
  hasPlugin(key) {
    return this.plugins.has(key);
  }

  /**
   * Get value of plugins property
   * @param {string|number} key - key of stored plugin
   * @returns {Object} plugins property value
   */
  getPlugin(key) {
    return this.plugins.get(key);
  }

  /**
   * Update plugins property value
   * @param {string|number} key - key for storing of plugin
   * @param {Object} value - Object for storing of plugin
   * @returns {Object} this
   */
  setPlugin(key, value) {
    this.plugins.set(key, value);
    return this;
  }

  /**
   * Get object with Gulp plugins (hashmap)
   * @returns {Object} plugins property value
   */
  getPlugins() {
    return this.plugins;
  }

  /**
   * Get value of settings property
   * @returns {Object} settings property value
   */
  getSettings() {
    return this.settings;
  }

  /**
   * Update settings property value
   * @param {Object|function} settings - data with settings, or callback what returns settings object
   * @returns {Object} this
   */
  setSettings(settings) {
    this.settings = settings;
    return this;
  }

  /**
   * Get value of settings property default value
   * @returns {Object} settings property default value
   */
  getSettingsDefault() {
    return this.settingsDefault;
  }


  /**
   * Check what plugin with current key exists
   * @param {string|number} key - key of stored variable
   * @returns {boolean}
   */
  hasVariable(key) {
    return this.variables.has(key);
  }

  /**
   * Get value of variable property
   * @param {string|number} key - key of stored variable
   * @returns {Object} variable property value
   */
  getVariable(key) {
    return this.variables.get(key);
  }

  /**
   * Update variable property value
   * @param {string|number} key - key for storing of variable
   * @param {Object} value - Object for storing of variable
   * @returns {Object} this
   */
  setVariable(key, value) {
    this.variables.set(key, value);
    return this;
  }

  /**
   * Get value of variables property (hashmap)
   * @returns {Object} variables property value
   */
  getVariables() {
    return this.variables;
  }

  /**
   * Returns module with Gulp task, where injected current instance
   * @returns {function} module with Gulp task logic
   */
  getTask(taskName) {
    return require(
      path.join(this.settings.paths.tasks, taskName.replace(':', '/'))
    )(this);
  }

  /**
   * Register task
   * @param {string} taskName - Task name
   * @param {Array} executeAfterTasks - key of property @see [deps]{@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn}
   * @returns {Object} Current instance (this)
   */
  registerTask(taskName, executeAfterTasks) {
    let task = this.getTask(taskName);
    executeAfterTasks = executeAfterTasks || [];

    this.getGulp().task(taskName, executeAfterTasks, task);
    return this;
  }

  /**
   * Returns watch
   * @returns {function} module with Gulp watch logic
   */
  getWatch(watchName) {
    return require(
      path.join(this.settings.paths.watches, watchName.replace(':', '/'))
    )(this);
  }

  /**
   * Register watch
   * @param {string} watchName - watch name
   * @returns {Object} Current instance (this)
   */
  registerWatch(watchName) {
    require(
      path.join(this.settings.paths.events, 'watch')(
        this.getWatch(watchName)
      )
    );
    return this;
  }
}