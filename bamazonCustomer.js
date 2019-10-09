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

function runCustomer() {
    connection.query('SELECT * FROM products', function (err, result, fields) {
        if (err) throw err;
        let resultArray = makeArray(result);
        let output = table(resultArray);
        console.log(output);
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
        if (ans.item_id > 0 && ans.item_id < arrayLength + 1) {
            askQuantity(ans.item_id);
        } else {
            console.log(ans.item_id + ' is not valid');
            connection.end();
        }
    });
}

function askQuantity(id) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'amount',
            message: 'How many would you like to buy? '
        }
    ]).then(function (ans) {
        connection.query(`SELECT * FROM products WHERE item_id=${id}`, function (err, result, fields) {
            if (err) throw err;
            if(ans.amount > 0 && ans.amount <= result[0].stock_quantity){
                connection.query(`UPDATE products SET ? WHERE item_id=${id}`,
                [{
                    stock_quantity: result[0].stock_quantity - ans.amount
                }],
                function(err){
                    if(err) throw err;
                    console.log('quantity updated');
                });
            } else{
                console.log('Not a valid amount');
            }
            console.log(result);
            connection.end();
        });
    });
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