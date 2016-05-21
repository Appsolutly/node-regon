'use strict';

var Client = require('..');
var chai = require('chai');
var Antigate = require('antigate');
var _ = require('lodash');
var assert = chai.assert;
var AntigateApiKey = process.env.AntigateApiKey || null;
var GUSApiKey = process.env.GUSApiKey || null;
var options = {
  sandbox: true
};

delete process.env.AntigateApiKey;
delete process.env.GUSApiKey;

if (GUSApiKey)
  options.key = GUSApiKey;

if (AntigateApiKey)
  options.captcha = {
    autofill: true,
    apiKey: AntigateApiKey
  }

describe('Node-regon', function() {


  it('should specify GUSApiKey', function() {
    assert.lengthOf(GUSApiKey, 20);
  });

  it('should specify AntigateApiKey before testing Captcha', function() {
    assert.typeOf(AntigateApiKey, "string");
  });


  it('should set options as callback if options is not defined', function(done) {
    var client = Client.createClient(function(err, soapClient) {
      var endpointUrl = soapClient.sandbox ? soapClient.urlSandbox : soapClient.url;
      done();
    });
  });

  it('should by default return normal url', function(done) {
    var client = Client.createClient({},
      function(err, soapClient) {
        var endpointUrl = soapClient.sandbox ? soapClient.urlSandbox : soapClient.url;
        assert.equal(endpointUrl, soapClient.url);
        done();
      });
  });

  it('should allow to set sandbox mode', function(done) {

    var client = Client.createClient({
        sandbox: true
      },
      function(err, soapClient) {
        var endpointUrl = soapClient.sandbox ? soapClient.urlSandbox : soapClient.url;
        assert.equal(endpointUrl, soapClient.urlSandbox);
        done();
      });
  });

  it('should return correct apiKey defined in options', function(done) {
    var client = Client.createClient({
      key: "ssssss"
    }, function(err, soapClient) {
      assert.equal(soapClient.key, "ssssss");
      done();
    });
  });

  it('should return client id session as soapClient', function() {
    var opt = Object.assign({}, options);
    opt.disableAsync = true;
    var client = Client.createClient(opt);
    assert.lengthOf(client.login(), 20);
  });

  it('should by default put aaaaaabbbbbcccccdddd key', function(done) {
    var client = Client.createClient(function(err, soapClient) {
      assert.equal(soapClient.key, "aaaaaabbbbbcccccdddd");
      done();
    });
  });

  it('should login and returns session id (20 signs)', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      assert.lengthOf(soapClient.getSessionId(), 20);
      done();
    });
  });

  it('should not login and returns null, because of setting autoLogin to false', function(done) {
    var opt = Object.assign({}, options);
    opt.autoLogin = false;
    var client = Client.createClient(opt, function(err, soapClient) {
      assert.typeOf(soapClient.getSessionId(), "null");
      done();
    });
  });


  it('should returns session id, after login and with setting autoLogin as false', function(done) {
    var opt = Object.assign({}, options);
    opt.autoLogin = false;
    var client = Client.createClient(opt, function(err, soapClient) {

      assert.typeOf(soapClient.getSessionId(), "null");

      soapClient.login();

      assert.lengthOf(soapClient.getSessionId(), 20);

      done();
    });
  });


  it('should save old session id, after many login actions', function(done) {
    var opt = Object.assign({}, options);
    opt.autoLogin = false;
    var client = Client.createClient(opt, function(err, soapClient) {

      assert.typeOf(soapClient.getSessionId(), "null");

      soapClient.login();

      var loginSession = soapClient.getSessionId()
      assert.lengthOf(soapClient.getSessionId(), 20);

      soapClient.login();

      assert.equal(loginSession, soapClient.getSessionId());

      done();
    });
  });

  it('should set session id after Zaloguj (alias to login)', function(done) {
    var opt = Object.assign({}, options);
    opt.autoLogin = false;
    var client = Client.createClient(opt, function(err, soapClient) {
      soapClient.Zaloguj();
      assert.lengthOf(soapClient.getSessionId(), 20);

      done();
    });
  });


  it('should remove session id after logout action', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      soapClient.logout();
      assert.typeOf(soapClient.getSessionId(), "null");

      done();
    });
  });

  it('should remove session id after Wyloguj (alias to logout)', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      soapClient.Wyloguj();
      assert.typeOf(soapClient.getSessionId(), "null");

      done();
    });
  });

  it('should return result from getInfo and return object with DaneKomunikatResult', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      assert.property(soapClient.getInfo(), "DaneKomunikatResult");

      done();
    });
  });

  it('should return result from DaneKomunikat(alias to getInfo) and return object with DaneKomunikatResult', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      assert.property(soapClient.DaneKomunikat(), "DaneKomunikatResult");

      done();
    });
  });
  it('should return result from getValue for StatusSesji param and return object with GetValueResult with value of 1, because we are logged in by default', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.property(GetValueResult, "GetValueResult");

      assert.equal(GetValueResult.GetValueResult, "1");

      done();
    });
  });

  it('should return result after logging out from getValue for StatusSesji param and return object with GetValueResult with value of 0', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      soapClient.logout();
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.property(GetValueResult, "GetValueResult");

      assert.equal(GetValueResult.GetValueResult, "0");

      done();
    });
  });

  it('should return result from getValue for KomunikatKod and return object with GetValueResult', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('KomunikatKod');
      assert.property(GetValueResult, "GetValueResult");

      done();
    });
  });

  it('should return result from getValue for KomunikatTresc and return object with GetValueResult', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('KomunikatTresc');
      assert.property(GetValueResult, "GetValueResult");

      done();
    });
  });

  it('should return result from GetValue (alias to getValue) and return object with GetValueResult with value of 1, because we are logged in', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.property(GetValueResult, "GetValueResult");

      done();
    });
  });

  it('should return result from getInfo and return object with GetValueResult with value of 1, because we are logged in', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getInfo();
      assert.property(GetValueResult, "DaneKomunikatResult");

      //alias
      var GetValueResult = soapClient.DaneKomunikat();
      assert.property(GetValueResult, "DaneKomunikatResult");

      done();
    });
  });

  it('should return captcha', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var captcha = soapClient.getCaptcha();
      assert.property(captcha, "PobierzCaptchaResult");
      assert.isAtLeast((captcha.PobierzCaptchaResult)
        .length, 1);

      var captcha = soapClient.PobierzCaptcha();
      assert.property(captcha, "PobierzCaptchaResult");
      assert.isAtLeast((captcha.PobierzCaptchaResult)
        .length, 1);
      done();
    });
  });

  it('should return true, we are passing aaaa, which is standard value for sandbox', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var captcha = soapClient.getCaptcha();
      assert.property(captcha, "PobierzCaptchaResult");
      assert.isAtLeast((captcha.PobierzCaptchaResult)
        .length, 1);

      var captchaResult = soapClient.checkCaptcha("aaaaa");
      assert.isTrue(captchaResult, 1);
      done();
    });
  });

  if (AntigateApiKey) {

    it('should return not return NaN value as balance var, we are testing antigate if You have passed correct Antigate key', function(done) {
      var ag = new Antigate(AntigateApiKey);

      ag.getBalance(function(error, balance) {
        assert.isNotNaN(balance);
        done();
      });

    });

    // it('should return result from getFullReport and return object with response and DanePobierzPelnyRaportResult, and', function(done) {
    //  var client = Client.createClient( {captcha: {
    //  autofill: true,
    //  apiKey: AntigateApiKey
    // }}, function(err, soapClient) {
    //    var fullReport = soapClient.getFullReport('000331501');
    //    console.log(fullReport);
    //    assert.property(fullReport, "response");
    //    assert.property(fullReport.response, "DanePobierzPelnyRaportResult");
    //    assert.typeOf(fullReport.response['DanePobierzPelnyRaportResult'], "string");
    //    assert.match(fullReport.response['DanePobierzPelnyRaportResult'], /^<dane>/);

    //    done();
    //  });
    // });
  }




});
