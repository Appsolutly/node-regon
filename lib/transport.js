/*
 * Copyright (c) 2016 Adam Kaczmarzyk <adaskaczmarzyk@gmail.com>
 * Appsolut.ly
 * MIT Licensed
 */
function regonRepair(regon){
	regon = regon.toString();
	if (regon.length != 9 || regon.length != 14)
		{
			if(regon.length < 9)
				{
					while(regon.length != 9)
					{
						regon = "0"+regon;
					}
				}
			else if (regon.length > 9 && regon.length < 14)
				{
					while(regon.length != 14)
					{
						regon = "0"+regon;
					}
				}
		}
		return regon
}
 
var soap = require('soap-extended'),
  _ = require('lodash');

var Transport = function(wsdl, options, callback) {
  var wsdlOptions = {
    "forceSoap12Headers": true
  }
  this.client = soap.createClient(wsdl, wsdlOptions, callback);

  this.getAction = function(function_name) {
    switch (function_name) {
      case 'GetValue':
      case 'PobierzCaptcha':
      case 'SprawdzCaptcha':
        prefix = 'http://CIS/BIR/2014/07/IUslugaBIR';
        break;
      default:
        prefix = 'http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl';
    }
    return prefix + '/' + function_name;
  }

  this.getParams = function(function_name, value, type = "", silosId = "") {
	  let raportName = '';
	  if (type == "F"){
		  switch(silosId) {
			case 1:
			  raportName = 'PublDaneRaportDzialalnoscFizycznejCeidg';
			  break;
			case 2:
			  raportName = 'PublDaneRaportDzialalnoscFizycznejRolnicza';
			  break;
			case 3:
			  raportName = 'PublDaneRaportDzialalnoscFizycznejPozostala';
			  break;
			case 4:
			  raportName = 'PublDaneRaportDzialalnoscFizycznejWKrupgn';
			  break;
		  }
	  } else if (type == "P"){
			  raportName = 'PublDaneRaportPrawna';
			}
    var response = "";
    switch (function_name) {
      case 'DaneKomunikat':
        response = '<tns:DaneKomunikat/>';
        break;
	  case 'DanePobierzPelnyRaport':
        response = '<tns:DanePobierzPelnyRaport><tns:pRegon>' + regonRepair(value) + '</tns:pRegon><tns:pNazwaRaportu>' + raportName + '</tns:pNazwaRaportu></tns:DanePobierzPelnyRaport>';
        break;
      case 'DanePobierzTypJednostki':
        response = '<tns:DanePobierzPelnyRaport><tns:pRegon>' + regonRepair(value) + '</tns:pRegon><tns:pNazwaRaportu>PublDaneRaportTypJednostki</tns:pNazwaRaportu></tns:DanePobierzPelnyRaport>';
        break;
      case 'GetValue':
        response = '<q5:GetValue><q5:pNazwaParametru>' + value + '</q5:pNazwaParametru></q5:GetValue>';
        break;
      case 'Wyloguj':
        response = '<tns:Wyloguj><tns:pIdentyfikatorSesji>' + value + '</tns:pIdentyfikatorSesji></tns:Wyloguj>';
        break;
      case 'Zaloguj':
        response = '<tns:Zaloguj><tns:pKluczUzytkownika>' + value + '</tns:pKluczUzytkownika></tns:Zaloguj>';
        break;
      case 'DaneSzukaj':
        response = '<tns:DaneSzukaj><tns:pParametryWyszukiwania>' + value + '</tns:pParametryWyszukiwania></tns:DaneSzukaj>';
        break;
      case 'PobierzCaptcha':
        response = '<q1:PobierzCaptcha/>';
        break;
      case 'SprawdzCaptcha':
        response = '<q1:SprawdzCaptcha><q1:pCaptcha>' + value + '</q1:pCaptcha></q1:SprawdzCaptcha>';
        break;
    }
    return response;
  }
  this.getParamsValues = function(params) {
    var self = this;
    var response = "";

    if (typeof params != "object")
      return false;

    _(params).forEach(function(value, key) {
      response += self.getParamValue(key, value);
    });
    console.log();
    return response;
  }

  this.getParamValue = function(param_name, value) {
    var response = "";
    switch (_.lowerCase(param_name).replace(/\s/g, '')) {
      case 'krs':
        response = '<dat:Krs>' + value + '</dat:Krs>';
        break;
      case 'krsy':
        response = '<dat:Krsy>' + value + '</dat:Krsy>';
        break;
      case 'nip':
        response = '<dat:Nip>' + value + '</dat:Nip>';
        break;
      case 'nipy':
        response = '<dat:Nipy>' + value + '</dat:Nipy>';
        break;
      case 'regon':
        response = '<dat:Regon>' + regonRepair(value) + '</dat:Regon>';
        break;
      case 'regony14zn':
        response = '<dat:Regony14zn>' + regonRepair(value) + '</dat:Regony14zn>';
        break;
      case 'regony9zn':
        response = '<dat:Regony9zn>' + regonRepair(value) + '</dat:Regony9zn>';
        break;
      default:
        response = '<dat:Regony9zn>' + regonRepair(value) + '</dat:Regony9zn>';
        break;
    }
    return response;
  }

  return this.client;
};



module.exports = Transport;
