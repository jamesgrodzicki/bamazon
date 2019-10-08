const inquirer = require('inquirer');
const mysql = require('mysql');
const {table} = require('table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function(err){
    if(err) throw err;
});

connection.query('SELECT * FROM products', function(err, result, fields){
    if(err) throw err;
    // console.log(result);
    let resultArray = makeArray(result);
    let output = table(resultArray);
    console.log(output);
});

connection.end();

function makeArray(arrayOfObjects){
    let keysArray = Object.keys(arrayOfObjects[0]);
    let newArray = [];
    newArray.push(keysArray);
    for(let i=0; i<arrayOfObjects.length; i++){
        let arrayHolder = Object.values(arrayOfObjects[i]);
        newArray.push(arrayHolder);
    }
    return newArray;
}