/*
 * Copyright (c) 2016 Adam Kaczmarzyk <adaskaczmarzyk@gmail.com>
 * Appsolut.ly
 * MIT Licensed
 */

var Service = require('./service'),
    _ = require('lodash');


var Client = function (options) {
  var _this = this;
  options = options || {};
  this.service = new Service(options);

  this.initService = function () {
    return new Promise(function (resolve, reject) {
      _this.service.initTransport()
          .then((result) => {
                _.forEach(_this.service, function (value, key) {
                  if (typeof value == "function") {
                    _this[key] = function () {
                      return _this.service[key].apply(_this, arguments);
                    };
                  }
                });
                resolve(_this);
              },
              (error) => {
                reject(error);
              });
    });
  }

  return this;
};


var createClient = function (options) {
  var client = new Client(options);

  return client.initService();
};

module.exports = Client;
module.exports.createClient = createClient;
