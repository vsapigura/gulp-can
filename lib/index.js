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
let HashMap = require('hashmap');
let clc = require('cli-color');

/**
 * function used for setters where variable is HashMap
 * @private
 * @type {function}
 * @param {string} attrKey - attribute name/key, what will be handled 
 * @param {Object} attrValue - Object, what will be converted to HashMap
 * @param {function} valueItemPreProcessCallback - (optinal) callback what will be used, for processing each of attrValue property
 * @throws {TypeError}
 */
function attrHashMapSetter(attrKey, attrValue, valueItemPreProcessCallback) {
    if (attrValue) {
      if('function' === typeof attrValue) {
         attrValue = attrValue.apply(this);
      }

      if(!attrValue || 'object' !== typeof attrValue) {
        throw new TypeError('Wrong type for "' + attrKey + '" property');
      }

      Object.keys(attrValue).forEach(function(key) {
        let value = (valueItemPreProcessCallback && 'function' === typeof valueItemPreProcessCallback)
          ? valueItemPreProcessCallback.call(this, attrValue[key])
          : attrValue[key];

        this[this._k(attrKey)].set(key, value);
      }.bind(this));
    }
    return this[this._k(attrKey)];
}
/**
 * Class representing a canClass.
 * @class
 * @classdesc Class representing a canClass.
 */
class canClass {

  /**
   * Constuctor for class
   * @constructs
   * @param {Object|function} data object, or callback what returns data object
   * @throws {Error|TypeError}
   */
  constructor(data) {
    data = data || {};

    if('function' === typeof data) {
      data = data.apply(this);
    }

    if(!data || 'object' !== typeof data) {
      throw new TypeError('Wrong type of "data" property');
    }

    if(!data.gulp) {
      throw new Error('Gulp not passed as parameter!');
    }

    //initilize private variables
    this[this._k('gulp')] = data.gulp;
    this[this._k('paths')] = new HashMap();
    this[this._k('plugins')] = new HashMap();
    this[this._k('variables')] = new HashMap();

    //variables what will be hadled by setter's
    this.paths = {
        root: '.',
        tasks: 'gulp/tasks/',
        watches: 'gulp/watches/',
        events: 'gulp/events/'
    };

    if(data.paths) {
      this.paths = data.paths;
    }

    appModulePath.addPath(path.join(this.paths.get('root'), 'node_modules'));

    this.variables = data.variables || {};
    this.plugins = data.plugils || require('gulp-load-plugins')({
        config :  path.resolve(this.paths.get('root'), 'package.json')
    });
  }

  /**
   * Get value of paths property
   * @type {function}
   * @returns {Object} paths property value
   */
  get paths() {
    return this[this._k('paths')];
  }

  /**
   * Updating of paths property
   * @type {function}
   * @param {Object|function} paths - object with paths, or callback what returns object
   * @throws {TypeError}
   */
  set paths(paths) {
    return attrHashMapSetter.call(this, 'paths', paths, function(value) {
      return 'string' === typeof value ? path.resolve(value) : value;
    });
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
   * Set plugins
   * @type {function}
   * @param {Object|function} plugins - object with plugins, or callback what returns object
   * @throws {TypeError}
   */
  set plugins(plugins) {
    return attrHashMapSetter.call(this, 'plugins', plugins);
  }

  /**
   * Get value of variables property
   * @returns {Object} variables property value (hashmap)
   */
  get variables() {
    return this[this._k('variables')];
  }

  /**
   * Updating of variables property
   * @type {function}
   * @param {Object|function} variables - object with variables, or callback what returns object
   * @throws {TypeError}
   */
  set variables(variables) {
    return attrHashMapSetter.call(this, 'variables', variables);
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
   * Check what path with current key exists
   * @param {string|number} key - key of stored path
   * @returns {boolean}
   */
  hasPath(key) {
    return this.paths.has(key);
  }

  /**
   * Get value of paths property
   * @param {string|number} key - key of stored path
   * @returns {Object} path property value
   */
  getPath(key) {
    return this.paths.get(key);
  }

  /**
   * Update path property value
   * @param {string|number} key - key for storing of path
   * @param {Object} value - Object for storing of path
   * @returns {Object} this
   */
  setPath(key, value) {
    this.paths.set(key, value);
    return this;
  }

  /**
   * Get object with path (hashmap)
   * @returns {Object} paths property value
   */
  getAllPaths() {
    return this.paths;
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
  getAllPlugins() {
    return this.plugins;
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
  getAllVariables() {
    return this.variables;
  }

  /**
   * Returns registered tasks names
   * @returns {Array} array with names of registered tasks
   */
  getRegisteredTasksNames() {
    return Object.keys(this.getGulp().tasks);
  }
  /**
   * Returns module with Gulp task, where injected current instance
   * @returns {function} module with Gulp task logic
   */
  getTask(taskName) {
    return require(
      path.join(this.paths.get('tasks'), taskName.replace(':', '/'))
    )(this);
  }

  /**
   * Register proxy task
   * @param {string} taskName - Task name
   * @param {Array} executeAfterTasks - key of property @see [deps]{@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn}
   * @returns {Object} Current instance (this)
   */
  registerProxyTask(taskName, executeAfterTasks) {
    executeAfterTasks = executeAfterTasks || [];
    this.getGulp().task(taskName, executeAfterTasks, function () {});
    return this;
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
      path.join(this.paths.get('watches'), watchName.replace(':', '/'))
    )(this);
  }


  /**
   * Register proxy watch, same as gulp.watch(watchPaths, executeAfterTasks);
   * @param {string} watchName - watch name
   * @param {Array} executeAfterTasks - array af task names what will be executed on event 
   * @returns {Object} Current instance (this)
  **/

  registerProxyWatch(watchPaths, executeAfterTasks, watchEventName) {
    let watch = this.getGulp().watch(watchPaths, executeAfterTasks || []);
    if(watchEventName) {
       let watchEvent = this.getWatchEvent(watchEventName);
       watchEvent(
        this,
        watch,
        watchEventName
      );
    }
    return this;
  };

  /**
   * Register watch
   * @param {string} watchName - watch name
   * @returns {Object} Current instance (this)
   */
  registerWatch(watchName, watchEventName) {
    if(watchEventName) {
       let watchEvent = this.getWatchEvent(watchEventName);
       watchEvent(
        this,
        this.getWatch(watchName),
        watchEventName
      );
    } else {
      this.getWatch(watchName);
    }
    return this;
  }

  /**
   * Get watch event, if event not found, default event will eb returned
   * @param {string} watchName - watch name
   * @returns {Object} Watch event
   * @throws {Error}
   */
  getWatchEvent(name) {
    name = name || '';

    let watchEvent;
    let eventPath = path.join(this.paths.get('events'), name.replace(':', '/'));
    try {
      watchEvent = require(eventPath);
    } catch(err) {
      if(err.code === 'MODULE_NOT_FOUND') {
        console.log(
          clc.yellow('[w] watch event not found. Default watch event will be used, instead of:' + eventPath)
        );
        watchEvent = this.getWatchEventDefault();
      } else {
        throw new Error(err);
      }
    }
    return watchEvent;
  }

  /**
   * Get default watch event
   * @returns {Object} Default watch event
   */
  getWatchEventDefault() {
    return require('./watch-event-default');
  }
}
module.exports = canClass;