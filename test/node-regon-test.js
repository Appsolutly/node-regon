'use strict';

var Client = require('..');
var chai = require('chai');
var _ = require('lodash');
var assert = chai.assert;
var GUSApiKey = process.env.GUSApiKey || null;
var options = {
  // sandbox: false,
  disableAsync:true
};

delete process.env.GUSApiKey;

if (GUSApiKey)
  options.key = GUSApiKey;

describe('Node-regon', function() {


  it('should specify GUSApiKey', function() {
    assert.lengthOf(GUSApiKey, 20);
  });

  it('should by default return normal url', function(done) {
    var client = Client.createClient(options,
        function(err, soapClient) {
          var endpointUrl = soapClient.sandbox ? soapClient.urlSandbox : soapClient.url;
          assert.equal(endpointUrl, soapClient.url);
          done();
        });
  });

  it('should allow to set sandbox mode', function(done) {

    var client = Client.createClient(Object.assign(options,{
          sandbox: true
        }),
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

  it('should return result from getInfo and return string', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      assert.typeOf(soapClient.getInfo(), "null");

      done();
    });
  });

  it('should return result from DaneKomunikat(alias to getInfo) and return null', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      assert.typeOf(soapClient.DaneKomunikat(), "null");

      done();
    });
  });
  it('should return result from getValue for StatusSesji param and return string with value of 1, because we are logged in by default', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.typeOf(GetValueResult, "string");

      assert.equal(GetValueResult, "1");

      done();
    });
  });

  it('should return result after logging out from getValue for StatusSesji param and return object with GetValueResult with value of 0', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      soapClient.logout();
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.typeOf(GetValueResult, "string");

      assert.equal(GetValueResult, "0");

      done();
    });
  });

  it('should return result from getValue for KomunikatKod and return string', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('KomunikatKod');
      assert.typeOf(GetValueResult, "string");


      done();
    });
  });

  it('should return result from getValue for KomunikatTresc and return string', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('KomunikatTresc');
      assert.typeOf(GetValueResult, "string");

      done();
    });
  });

  it('should return result from GetValue (alias to getValue) and return string with value of 1, because we are logged in', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getValue('StatusSesji');
      assert.typeOf(GetValueResult, "string");

      done();
    });
  });

  it('should return result from getInfo and return object with GetValueResult with value of 1, because we are logged in', function(done) {
    var client = Client.createClient(options, function(err, soapClient) {
      var GetValueResult = soapClient.getInfo();
      assert.typeOf(GetValueResult, "null");

      //alias
      var GetValueResult = soapClient.DaneKomunikat();
      assert.typeOf(GetValueResult, "null");

      done();
    });
  });


});
