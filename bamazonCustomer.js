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
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'Would you like to buy something? '
        }
    ]).then(function (ans) {
        if (ans.confirm) {
            connection.query('SELECT * FROM products', function (err, result, fields) {
                if (err) throw err;
                let resultArray = makeArray(result);
                let output = table(resultArray);
                console.log(output);
                askID(result.length);
            });
        } else {
            connection.end();
        }
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
        let item_id = ans.item_id;
        if (item_id > 0 && item_id < arrayLength + 1) {
            askQuantity(item_id);
        } else {
            console.log(item_id + ' is not valid');
            runCustomer();
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
            let amount = ans.amount;
            if (amount > 0 && amount <= result[0].stock_quantity) {
                let total = amount * result[0].price;
                console.log('Total price = ' + total);
                connection.query(`UPDATE products SET ? WHERE item_id=${id}`,
                    [{
                        stock_quantity: result[0].stock_quantity - amount
                    }],
                    function (err) {
                        if (err) throw err;
                        console.log('quantity updated');
                        runCustomer();
                    });
            } else {
                console.log('Not a valid amount');
                runCustomer();
            }
        });
    });
}

function makeArray(arrayOfObjs) {
    let titles = Object.keys(arrayOfObjs[0]);
    return [
        titles,
        ...arrayOfObjs.map(function (a) { return Object.values(a); })
    ];
}