var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = 
   {
     userName: 'remembrallAdmin', // update me
     password: 'redChair1029', // update me
     server: 'remembrall.database.windows.net', // update me
     options: 
        {
           database: 'remembrall' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
           queryDatabase()
       }
   }
 );

function queryDatabase()
{
     //console.log('Reading rows from the Table...');
 
       // Read all rows from table
     request = new Request(
          "SELECT * from Medicine",
             function(err, rowCount, rows) 
                {
                    console.log(rowCount + ' row(s) returned');
                    process.exit();
                }
            );

     request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
         });
             });
     connection.execSql(request);
}

const mysql = require('mysql2');

var config2 =
{
    host: 'remembrall.database.windows.net',
    user: 'remembrallAdmin',
    password: 'redChair1029',
    database: 'remembrall',
    port: 1433,
    ssl: true
};

const conn = new mysql.createConnection(config2);

conn.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
           queryDatabase2();
    }   
});

function queryDatabase2(){
       console.log("coolness");
       conn.query('UPDATE Medicine SET taken=1 WHERE medicine=\'Tylenol\'', function (err, results, fields) { 
            if (err) throw err; 
            console.log('Dropped inventory table if existed.');
        })
       
       conn.end(function (err) { 
        if (err) throw err;
        else  console.log('Done.') 
        });
};
