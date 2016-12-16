'use strict';

var ibmdb = require("ibm_db");
var cn = "DATABASE=SSSSSS;HOSTNAME=XXXXX;PORT=50000;PROTOCOL=TCPIP;UID=XXXXX;PWD=XXXXX;{DB2 ODBC Driver};";


module.exports = function(Master) {

Master.startDBO = function(data,cb) {

 ibmdb.open(cn, function(err,conn) {
    conn.beginTransaction(function (err) {
      if (err) {
        console.log(err);
        conn.closeSync();
        cb(err,null);
      }
      else{
        var result = conn.querySync('insert into DBO."Cashbook_tb" ("CashbookID","UserID","Store","CloseBalance","OpenBalance") values ('+data+',123,6666,300,5000)');
        console.log(conn.querySync('select * from DBO."Cashbook_tb" where "CashbookID" ='+data));

        //process.exit(1);
        //console.log(result);
        conn.commitTransactionSync();
        var resu = conn.querySync('select * from DBO."Cashbook_tb" where "CashbookID" ='+data);
        console.log(resu);
        //conn.closeSync();
        cb(err,resu);
      }
    });
  });

}

Master.remoteMethod(
   'startDBO',
   {
     http: {path: '/startDBO', verb: 'post'},
     accepts: [{arg: 'body', type: 'number', http: { source: 'query' }}],
      returns: {type: 'object',root:true}
   }
);

};
