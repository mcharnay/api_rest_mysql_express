//////////////////////////////////////////////REQUIRES Y CONEXIONES////////////////////////////////////////////////////
//requires express, mysql y body-parse
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

//está en producción como heroku, o, en localhost puerto 3050.
const PORT = process.env.PORT || 3050;

//express pasa a constante app.
const app = express();

app.use(bodyParser.json());

//conexión a modelo mysql
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node_bd'
});

//chequear conexión
connection.connect(error => {
    if (error) throw error;
    console.log('Base de datos corriendo con éxito.');
});

//conectar a puerto. Usa constante PORT
app.listen( PORT ,() => console.log(`Server Corriendo en puerto ${PORT}`));


/////////////////////////////////ROUTES//////////////////////////////////////////////////

//ENDPOINT
app.get('/', (req, res) =>{
    res.send('Es el endpoint');
});

//ENDPOINT MOSTRAR TODOS
app.get('/customers', (req, res) =>{
    const sql = 'SELECT * FROM customers';

    connection.query(sql, (error, results) => {
        if (error) throw error();
        if (results.length > 0){
            res.json(results);
        }else{
            res.send('Not result');
        }
    });

});

//ENDPOINT GET CUSTOMER POR ID
app.get('/customers/:id', (req, res) =>{
    const {id} = req.params
    const sql = `SELECT * FROM customers WHERE id = ${id}`;

    connection.query(sql, (error, result) => {
        if (error) throw error();
        if (result.length > 0){
            res.json(result);
        }else{
            res.send('Not result');
        }
    });

});

/////AGREGAR CON POSTMAN
//Para probar este método en en postman, clickear en body, luego en raw, text cambiarlo por json.

//ENDPOINT AGREGAR
app.post('/add', (req, res) =>{
    const sql = 'INSERT INTO customers SET ?';

    const customerObj = {
        name: req.body.name,
        city: req.body.city
    }

    connection.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Customer Created!');
    });
});

//ENDPOINT MODIFICAR
app.put('/update/:id', (req, res) =>{
    const { id } = req.params;
    const { name, city } = req.body;
    const sql = `UPDATE customers SET name = '${name}', city = '${city}' WHERE id =${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Customer UPDATED!');
    });
});

//ENDPOINT BORRAR
//htts://localhost:3050/delete/5
app.delete('/delete/:id', (req, res) =>{
    const {id} = req.params;
    const sql = `DELETE FROM customers WHERE id = ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Customers DELETED!');
    });

});

