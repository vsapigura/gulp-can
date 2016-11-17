'use strict';

/**
 * Module dependencies.
 */
let appModulePath = require('app-module-path');
let extend = require('node.extend');

module.exports = class canClass {
  constructor(settings) {
    // initialise private properties
    this[Symbol.for('gulp')] = require('gulp');
    this[Symbol.for('_settings')] = {
        plugins: {},
        paths: {
            root: './',
            tasks: 'gulp/tasks/',
            watches: 'gulp/watches/',
            events: 'gulp/events/'
        }
    };

    // initialise public properties
    this.plugins = {};

    this._extendSettings(settings);

    appModulePath.addPath(this.settings.paths.root);
  }

  _extendSettings(settings) {
    settings = settings || {};

    //fix, for correct working of plugins, they will be skipped from extending
    if ('plugins' in settings) {
      let plugins = settings.plugins;
      delete settings.plugins;

      this[Symbol.for('_settings')] = extend(true, this.settings, settings);
      this[Symbol.for('_settings')].plugins = plugins;
    } else {
      this[Symbol.for('_settings')] = extend(true, this.settings, settings);
    }
  }

  get settings() {
    return this[Symbol.for('_settings')];
  }

  //now settings will be readonly
  // @ToDo add some exception
  set settings(settings) {
    //this[Symbol.for('_settings')] = settings;
  }

  getGulpInst() {
    return this[Symbol.for('gulp')];
  }

  getGulpPlugins() {
    return this.settings.plugins;
  }

  getTask(taskName) {
    return require((this.settings.paths.tasks + taskName).replace(':', '/'))(this);
  }

  registerTask(taskName, executeAfterTasks) {
    let task = this.getTask(taskName);
    executeAfterTasks = executeAfterTasks || [];

    this.getGulpInst().task(taskName, executeAfterTasks, task);
    return this;
  }

  getWatch(watchName) {
    return require((this.settings.paths.watches + watchName).replace(':', '/'))(this);
  }

  registerWatch(watchName) {
    require(this.settings.paths.events + 'watch')(this.getWatch(watchName));
    return this;
  }
}