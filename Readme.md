**Overview**

A library for accessing data about businesses from the National Statistics Office in Poland. It can be used to access data stored in the National Court register using unique identifiers that each company has such as NIP (Tax Identification) and REGON (Statistical) numbers.

**Features**
  - find By NIP, REGON, and other params (check documentation on [wyszukiwarka regon](wyszukiwarkaregon.stat.gov.pl))
   - login,
   - logout,
   - getcaptcha,
   - sendCaptcha,
   - get system status vars,
   - !!! auto captcha detection and resolving with api anti-captcha.com - antigate (if antigateapi is not defined, it will return captcha value in response)


**Installation**

`npm install --save node-regon`

**Usage Examples**

First Import the library:

`const Client = require('node-regon');`

Then create a client:

```javascript
let gus = Client.createClient({
    key: "HERE_PUT_YOUR_PRODUCTION_KEY",
    disableAsync:true, // if it is true, you will get returned result, and it will waid for end of call
    captcha: {
      autofill: false,
      apiKey: "ANTIGATE_API"
    }
});

```

Finally, get basic information about NIP:

`var companyInfoByNip = gus.findByNip("6762264686");`

***Additional Options For Creating a Client***
- sandbox: `false`,  -  default is true
- autoLogin: `false`, - you can also run gis.login(), manually
- sid: `YOUR SESS ID`, - if you want to pass your session id
- captcha: `{ autofill: true, apiKey: "YOUR_ANTIGATE_API_KEY" }`

See more code samples in [examples/example.js](../node-regon/blob/master/examples/example.js)


**Documentation** 

Up to date documentation on fields and limitations of this API are accessible in Polish from this document on [Technical Instruction for BIR1](https://api.stat.gov.pl/Content/files/regon/regon_-_instrukcja_techniczna_bir1_dla_podmiotow_komercyjnych_v019.zip)



&copy;MIT licensed
