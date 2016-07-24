var Client = require('../index');



        gusClient = Client.createClient({
            key: "be1232cf4d3b4a04a486",
            sandbox: false,
            disableAsync:true,
            autoLogin:false,
            sid:"e94hcu8v5254986g5sne",
            captcha: {
              autofill: true,
              apiKey: "321375e8bbd7190ae101e756598fefe1"
            }
        });

        console.log("createGusClientIfNotExsists::done");


      var gus = gusClient;
        console.log("createGusClientIfNotExsists::done");

      gus.login();
      console.log("gus/find_by_nip::done", gus.getSessionId());

      var findCompanyByNip = gus.findByNip("7561969268");
      console.log(findCompanyByNip);
      var notFound = typeof findCompanyByNip.response.notFound != "undefined";
      var response = findCompanyByNip.response;
      if(notFound)
        return findCompanyByNip;

      if(typeof response.Regon == "undefined")
          return findCompanyByNip;


      var companyRegon = response.Regon;
      var fullReport = gus.getFullReport(companyRegon);

      console.log(companyRegon, fullReport);

// //
// var client = Client.createClient({
//     key: "f85390dcbe244abab34e",
//     sandbox: false,
//     // sid: "",
//     // autoLogin: false,
//     captcha: {
//       autofill: true,
//       apiKey: "321375e8bbd7190ae101e756598fefe1"
//     }
//   },
//   function(err, soapClient) {
//     // for (var i = 0; i < 100; i++) {
//     console.log('sid', soapClient.getSessionId());


//     // console.log('getFullReport', soapClient.getFullReport('000331501'));
//     // //
//     // console.log('StatusSesji', soapClient.getValue('StatusSesji'));
//     // console.log('KomunikatKod', soapClient.getValue('KomunikatKod'));
//     // console.log('KomunikatTresc', soapClient.getValue('KomunikatTresc'));
//     // //
//     // // // console.log('logout', soapClient.logout());
//     // // console.log('sid after ', soapClient.getSessionId());
//     // console.log('info ', soapClient.getInfo());
//     // // console.log('logout', soapClient.logout(soapClient.getSessionId()));


//     // console.log('search', soapClient.search({
//     //   "Nip": "7561969268"
//     // }));
//     console.log('findByNip', soapClient.findByNip("7561969268"));
//     // console.log('findByMultiNip', soapClient.findByMultiNip([
//     //   "7561969268",
//     //   "6762410610"
//     // ]));

//     // console.log('findByRegon', soapClient.findByRegon("000331501"));

//     // console.log('findByMultiRegon', soapClient.findByMultiRegon([
//     //   "000331501",
//     //   "017196553"
//     // ]));
//     // console.log('findByRegony9zn', soapClient.findByRegony9zn([
//     //   "000331501",
//     //   "017196553"
//     // ]));
//     // console.log('findByRegony14zn', soapClient.findByRegony14zn([
//     //   "00033150100000",
//     //   "01719655300000"
//     // ]));

//     // deasync.sleep(1000);
//     // };
//     // soapClient.search();

//   }
// );
