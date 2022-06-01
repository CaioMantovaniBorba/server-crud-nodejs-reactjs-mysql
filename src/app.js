const express = require('express');
const cors = require('cors');
const mysql2 = require('mysql2');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
    user: "root",
    host: "localhost",
    password: "root",
    database: "mysql-db"
});

db.connect(function (err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database as id ' + db.threadId);
});

app.post('/create', (req, res) => {
    const data = req.body.name;
    const id = uuidv4();

    db.query(`INSERT INTO users (id, name) VALUES ('${id}', '${data}')`, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send("Values inserted");
        }
    });
});

app.get('/list', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.put('/update', (req, res) => {
    const id = req.body.id;
    const name = req.body.name;

    db.query('UPDATE users SET name = ? WHERE id = ?', [id, name], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM users WHERE id = ?', id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
});

module.exports = app;