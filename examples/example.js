var Client = require('../index');

//firstly you will need to init client, sandbox mode dont work correctly, it returns some encoded strings (you can ask GUS why)
//

console.log("_________________________________");
console.log("_________________________________");
console.log("_________________________________");
console.log("");
console.log("If you think that this package is usefull, please make some donation for http://hospicjumtischnera.org/pl/ NIP: 6762264686")
console.log("");
console.log("");
console.log("http://hospicjumtischnera.org/pl/")
console.log("NIP: 6762264686")
console.log("");
console.log("");
console.log("_________________________________");
console.log("_________________________________");
console.log("_________________________________");

gus = Client.createClient({
    key: "HERE_PUT_YOUR_PRODUCTION_KEY",
    disableAsync:true, // if it is true, you will get returned result, and it will waid for end of call
    captcha: {
      autofill: false,
      apiKey: "ANTIGATE_API"
    }
});
// AVAILABLE ADDITIONAL OPTIONS:
// sandbox: false,  - but it don't work for some time, by default is true
// autoLogin: false, - if you want to run gis.login(), by yourself
// sid:"YOUR SESS ID", - if you want to pass your session id
// captcha: {
//   autofill: true,
//   apiKey: "YOUR_ANTIGATE_API_KEY"
// }
// if you want to auto resolve captchas.


console.log("login GUS sessionID: ", gus.getSessionId());

// If you want to get basic information about NIP, lets:
var findCompanyByNip = gus.findByNip("6762264686");
console.log(findCompanyByNip);


// If you want to get full report by REGON:
var companyRegon = findCompanyByNip.response.Regon; // get regon from previous query
var fullReport = gus.getFullReport(companyRegon);

console.log(companyRegon, fullReport);


// You can also:
// gus.findByMultiRegon([
//   "NIP",
//   "NIP2"
// ]);
// gus.findByRegony9zn([
//   "NIP_9chars",
//   "NIP_9chars"
// ]);
// gus.findByRegony14zn([
//   "NIP_14chars",
//   "NIP_14chars"
// ]);


//You can use search
// You need to specify correct search params, one or many of: Krs, Krsy, Nip, Nipy, Regon, Regony14zn, Regony9zn
// checkout GUS API
console.log("SEARCH", gus.search({
	"Nip": "6762264686"
}));

//You can logout:
// gus.logout();




//You can get info about session if exists (checkout documentation of GUS API):
console.log("getInfo", gus.getInfo());

//You can get value:
console.log("getValue StatusSesji", gus.getValue("StatusSesji"));
console.log("getValue KomunikatKod", gus.getValue("KomunikatKod"));
console.log("getValue KomunikatTresc", gus.getValue("KomunikatTresc"));


//You can get captcha if exist, and for example show it to Your client to fill
// it is base64 image, checkout GUS API documentation
console.log("getCaptcha", gus.getCaptcha());

// You can send captcha result, and if it will be correct, get captcha wont show for this session
console.log("checkCaptcha", gus.checkCaptcha("123452"));
console.log("getCaptcha", gus.getCaptcha());

