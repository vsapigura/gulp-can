'use strict';

/**
 * Module with default watch event wrapper
 * @module lib/watch-event-default
 * @type {exports}
 */

/*
 * Module dependencies.
 */
let clc = require('cli-color');
let HashMap = require('hashmap');

module.exports = function (can, watch) {
  let eventCB = function (evt) {
    console.log(
      clc.cyan('[w] ' + (evt.type ? evt.type.toUpperCase() : '') + ': '),
      evt.path
    );
  };

  let readyUniqueKey = new Date().getTime();
  return watch
    .on('add', eventCB)
    .on('change', eventCB)
    .on('delete', eventCB)
    .on('rename', eventCB)
    .on('ready', function(event) {
      //prevent ready message on even add file event
      if(!(can._k('watchEventReady') in can)) {
        can[can._k('watchEventReady')] = new HashMap();
      }
      if(!can[can._k('watchEventReady')].has(readyUniqueKey)) {
        can[can._k('watchEventReady')].set(readyUniqueKey, true);
        console.log(
          clc.green('[w] STARTED: '),
          event._patterns
        );
      }
      
    })
    .on('error', function(event) {
      console.log(
        clc.red('[w] ERR: '),
        event
      );
    });
};