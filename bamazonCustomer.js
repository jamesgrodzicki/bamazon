const inquirer = require('inquirer');
const mysql = require('mysql');
const { table } = require('table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon_db'
});

connection.connect(function (err) {
    if (err) throw err;
});

runCustomer();

connection.end();

function runCustomer() {
    connection.query('SELECT * FROM products', function (err, result, fields) {
        if (err) throw err;
        let resultArray = makeArray(result);
        let output = table(resultArray);
        console.log(output);
        // let item_id = askID(result.length);
        askID(result.length);
    });
}

function askID(arrayLength) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Enter the ID of the item you would like to buy: '
        }
    ]).then(function (ans) {
        if (ans.item_id > 0 && ans.item_id < arrayLength) {
            return ans.item_id;
        } else {
            console.log(item_id + 'is not valid');
        }
    })
}

function makeArray(arrayOfObjects) {
    let keysArray = Object.keys(arrayOfObjects[0]);
    let newArray = [];
    newArray.push(keysArray);
    for (let i = 0; i < arrayOfObjects.length; i++) {
        let arrayHolder = Object.values(arrayOfObjects[i]);
        newArray.push(arrayHolder);
    }
    return newArray;
}