/*
 * Copyright (c) 2016 Adam Kaczmarzyk <adaskaczmarzyk@gmail.com>
 *                    Mateusz Sych
 * Appsolut.ly
 * MIT Licensed
 */

var Enum = require('./enum'),
    Transport = require('./transport'),
    debug = require('debug')('worker'),
    _ = require('lodash'),
    parseString = require('xml2js').parseString,
    path = require("path"),
    regonRepair = require('./utils').regonRepair;


var SOAP_1_1 = 1;
var SOAP_1_2 = 2;


var Service = function (options) {
  var _this = this;

  this.birVersion = options.birVersion || '1';
  this.sandbox = options.sandbox || false;
  this.url = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc";
  this.urlSandbox = "https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc";
  if(this.birVersion  === '1.1') {
    this.wsdl = path.join(path.dirname(module.filename), '../') + 'wsdl/UslugaBIRzewnPubl11' + (this.sandbox ? "Sandbox" : "") + '.xsd';
  } else {
    this.wsdl = path.join(path.dirname(module.filename), '../') + 'wsdl/UslugaBIRzewnPubl' + (this.sandbox ? "Sandbox" : "") + '.xsd';
  }
  this.action = "http://www.w3.org/2005/08/addressing";
  this.key = options.key || process.env.GUSApiKey || 'abcde12345abcde12345';
  this.transport = this.transport || {};
  this.streamContext = null;
  this.sid = null;
  this.autoLogin = options.autoLogin !== false;

  this.streamContext = this.stream_context_create();

  this.getSessionId = function () {
    return _this.sid;
  };

  this.setInitialSessionId = function (sid) {

    _this.sid = sid;
    debug('service.setInitialSessionId', 'Calling: ', sid);
    return new Promise(function (resolve, reject) {
      _this.getValue(Enum.SESSION_STATUS)
          .then((isSessionCorrectAndActive) => {
                debug('service.setInitialSessionId', 'Session StatusSesji returned: ', isSessionCorrectAndActive);
                resolve(isSessionCorrectAndActive);
              },
              (error) => {
                reject(error);
              });
    });
  };

  this.login = function () {

    if (_this.getSessionId())
      return Promise.resolve(_this.getSessionId());

    var function_name = "Zaloguj";
    var params = { _xml: _this.transport_class.getParams(function_name, _this.key) };
    return new Promise(function (resolve, reject) {
      _this.call(function_name, params)
          .then((response) => {
                if (!response.ZalogujResult)
                  reject("Problem with login. Please check if you entered correct api key, and if sandbox is defined correctly.")
                else {
                  _this.sid = response.ZalogujResult;
                  resolve(response);
                }
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.Zaloguj = this.login;

  this.logout = function (value) {
    var function_name = "Wyloguj";

    if (!value)
      value = _this.getSessionId();

    var params = { _xml: _this.transport_class.getParams(function_name, value) };
    return new Promise(function (resolve, reject) {
      _this.call(function_name, params)
          .then((response) => {
                _this.sid = null;
                resolve(response);
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.Wyloguj = this.logout;

  this.getInfo = function () {
    var function_name = "DaneKomunikat";
    var params = { _xml: _this.transport_class.getParams(function_name) };
    return new Promise(function (resolve, reject) {
      _this.call(function_name, params)
          .then((response) => {
                resolve(response[Object.keys(response)[0]]);
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.DaneKomunikat = this.getInfo;

  this.getValue = function (value) {
    var function_name = "GetValue";
    var params = { _xml: _this.transport_class.getParams(function_name, value) };
    return new Promise(function (resolve, reject) {
      _this.call(function_name, params)
          .then((response) => {
                resolve(response[Object.keys(response)[0]]);
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.GetValue = this.getValue;

  this.getFullReport = function (value, type, silosId) {
    var function_name = '';
    if (!type)
      throw "You need to specify TYPE.";
    if (!value)
      throw "You need to specify REGON.";

    if (!_this.getSessionId())
      throw "You need to make login request! SessionId is not defined.";

    function_name = "DanePobierzPelnyRaport";
    var params = { _xml: _this.transport_class.getParams(function_name, value, type, silosId) };
    return new Promise(function (resolve, reject) {
      _this.call(function_name, params)
          .then((response) => {
                _this.checkResult(response, function_name).then((result) => {
                      if (result.error) {
                        reject(result.error);
                      } else {
                        resolve(result.response);
                      }
                    },
                    (error) => {
                      reject(error);
                    });
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.DanePobierzPelnyRaport = this.getFullReport;
  this.DanePobierzPelnyRaportP = this.getFullReport;

  this.search = function (params) {
    var paramsRenderered;

    debug('service.search', params);

    if (!params || !(paramsRenderered = _this.transport_class.getParamsValues(params)))
      throw "You need to specify correct search params, one or many of: Krs, Krsy, Nip, Nipy, Regon, Regony14zn, Regony9zn";

    var function_name = _this.birVersion  === '1.1' ? "DaneSzukajPodmioty" :  "DaneSzukaj";

    if (!_this.getSessionId())
      throw "You need to make login request! SessionId is not defined.";

    var paramsForXml = { _xml: _this.transport_class.getParams(function_name, paramsRenderered) };

    return new Promise(function (resolve, reject) {
      _this.call(function_name, paramsForXml, "xmlns:dat=\"http://CIS/BIR/PUBL/2014/07/DataContract\"")
          .then((response) => {
                _this.checkResult(response, function_name).then((result) => {
                      if (result.error) {
                        reject(result.error);
                      } else {
                        resolve(result.response);
                      }
                    },
                    (error) => {
                      reject(error);
                    });
              },
              (error) => {
                reject(error);
              });
    });
  };
  this.DaneSzukaj = this.search;
  this.DaneSzukajPodmioty = this.search;

  this.findByNip = function (value) {
    return this.search({
      "Nip": value
    });
  };

  this.findByMultiNip = function (value) {
    return this.search({
      "Nipy": value
    });
  };

  this.findByRegon = function (value) {
    return this.search({
      "Regon": value
    });
  };

  this.findByRegony14zn = function (value) {
    return this.search({
      "Regony14zn": value
    });
  };
  this.findByMultiRegony14zn = this.findByRegony14zn;

  this.findByRegony9zn = function (value) {
    return this.search({
      "Regony9zn": value
    });
  };
  this.findByMultiRegony9zn = this.findByRegony9zn;
  this.findByMultiRegon = this.findByRegony9zn;

  this.checkResult = function (response, function_name) {

    var firstObject = response[Object.keys(response)[0]];

    //results found
    if (firstObject != null) {
      if (firstObject[0] == "[") {
        var json = JSON.parse(firstObject);
        return Promise.resolve({
          error: null,
          response: json
        });
      }
      var json = "";
      parseString(firstObject, function (err, result) {
        json = result;
      });
      // json = JSON.parse(json);
      if (json.root)
        if (json.root.dane)
          json = json.root.dane;

      if (typeof json[0] != undefined)
        return Promise.resolve({
          error: null,
          response: json[0]
        });
      else
        return Promise.resolve({
          error: null,
          response: json
        });
    }

    //check error code
    return new Promise(function (resolve, reject) {
      _this.getValue(Enum.ERROR_CODE).then((errorCode) => {
        if (errorCode == Enum.SEARCH_ERROR_INVALIDARGUMENT) {
          resolve({
            error: "Invalud arguments for function: " + function_name,
            response: response
          });
        }
        if (errorCode == Enum.SEARCH_ERROR_SESSION) {
          resolve({
            error: "Problem with session for function: " + function_name,
            response: response
          });
        }
        if (errorCode == Enum.SEARCH_ERROR_NOTAUTHORIZED) {
          resolve({
            error: "You are not authorized to do this action for function: " + function_name,
            response: response
          });
        }
        if (errorCode == Enum.SEARCH_ERROR_NOTFOUND) {
          resolve({
            error: "Not found",
            response: response
          });
        }
        resolve({
          error: null,
          response: response
        });
      }, (error) => {
        reject(error);
      });
    });
  };

  this.call = function (function_name, arguments, additionalEnvelope) {
    var soapHeader = {
      "wsa:To": _this.sandbox ? _this.urlSandbox : _this.url,
      "wsa:Action": _this.transport_class.getAction(function_name)
    };

    _this.transport.soapHeaders = [];
    _this.transport.addSoapHeader(soapHeader);

    _this.transport.clearSoapHeadersInside();
    _this.transport.addSoapHeadersInside("xmlns:wsa", this.action);

    if (additionalEnvelope)
      _this.transport.additionalEnvelope = additionalEnvelope;
    else
      _this.transport.additionalEnvelope = "";

    if (_this.sid)
      _this.transport.addHttpHeader("sid", _this.sid);

    debug('service.call', 'Start Calling: ', function_name, arguments, additionalEnvelope);

    var function_args = arguments;

    return new Promise(function (resolve, reject) {
      _this.transport[function_name](function_args, function (error, result, raw, soapHeader) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

  this.initTransport = function () {
    _this.transport_class = new Transport(
        _this.wsdl, {
          "soap_version": SOAP_1_2,
          "exception": true,
          "stream_context": _this.streamContext,
          "location": _this.sandbox ? _this.urlSandbox : _this.url
        }
    );
    return new Promise(function (resolve, reject) {
      _this.transport_class.getClient()
          .then((client) => {
                _this.transport = client;

                //set initial session id
                if (options.sid) {
                  debug('service', 'Custom SessionId is defined: ', options.sid);
                  var isInitialSessionSet = _this.setInitialSessionId(options.sid);

                  // throws error, if You decided to disable autologin, and if session is inactual
                  if (isInitialSessionSet == "0" && !_this.autoLogin) {
                    throw "Passed SessionId is incorrect. Please use login() function or remove incorrect sid from options parameter.";
                  }

                }

                // login if there is no sess id and autoLogin is disabled
                if (!_this.getSessionId() && _this.autoLogin !== false) {
                  _this.login().then(() => {
                    resolve(true);
                  }, (error) => {
                    reject(error);
                  });
                } else {
                  resolve(true);
                }
              },
              (error) => {
                reject(error);
              });
    });
  };

  return this;
};

Service.prototype.stream_context_create = function (options, params) {
  var resource = {};
  options = options || {};

  // BEGIN REDUNDANT
  this.resourceIdCounter = this.resourceIdCounter || 0;

  function Resource(type, id, opener) { // Can reuse the following for other resources, just changing the instantiation
    // See http://php.net/manual/en/resource.php for types
    this.type = type;
    this.id = id;
    this.opener = opener;
  }
  // END REDUNDANT
  this.resourceIdCounter++;

  resource = new Resource('stream-context', this.resourceIdCounter, 'stream_context_create');
  resource.stream_options = options;
  resource.stream_params = params;

  return resource;
}

module.exports = Service;
