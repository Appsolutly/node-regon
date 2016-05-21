/*
 * Copyright (c) 2016 Adam Kaczmarzyk <adaskaczmarzyk@gmail.com>
 * Appsolut.ly
 * MIT Licensed
 */

var Service = require('./service'),
  _ = require('lodash');


var Client = function(options, callback) {
  options = options || {};
  this.service = new Service(options, callback);

  var _this = this;
  _.forEach(this.service, function(value, key) {
    if (typeof value == "function") {
      _this[key] = function() {
        this.service[key].apply(this, arguments)
      };
    }
  });
  return this.service;
};


var createClient = function(options, callback) {
  if (!callback)
    callback = function() {};

  var client = new Client(options, callback);

  return client;
};

module.exports = Client;
module.exports.createClient = createClient;
