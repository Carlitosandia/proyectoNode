const express = require('express');
const admin = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');


admin.get('/', (req, res) => {
    res.status(200).json({ message: 'Admin' });
});

admin.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(email && password ){
        const query = `SELECT * FROM admin WHERE email = '${email}' AND password = '${password}'`;
        const rows = await db.query(query);
        console.log(rows);
        if(rows.length == 1){
            const token = jwt.sign({
                user_id: rows[0].id,
                uder_email: rows[0].email
            }, 'debugkey');
            return res.status(200).json({ code: 200, message: token });
        }else{
            return res.status(403).json({ code: 401, error: 'Usuario y/o contraseña incorrectos' });
        }
    }
    return res.status(500).json({ code: 500, error: 'Campos incompletos' });
});

admin.get('/getEmployees', async (req, res) => {
    const query = `SELECT * FROM employees`;
    const rows = await db.query(query);
    return res.status(200).json({ code: 200, employees: rows });
});

admin.post('/addEmployee', async (req, res) => {
    const { name, email, password, position, salary } = req.body;
    if (name && email && password && position && salary) {
        const query = `INSERT INTO employees (name, email, password, position, salary) VALUES ('${name}', '${email}', '${password}', '${position}', '${salary}')`;
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: 'Empleado registrado con éxito' });
        }
        return res.status(500).json({ code: 500, message: 'Ocurrió un error' });
    }
    return res.status(500).json({ code: 500, message: 'Campos incompletos' });
});

admin.put('/editEmployee/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(500).json({ code: 500, message: 'No se envió el ID' });
    }
    const query = `SELECT * FROM employees WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.length == 0) {
        return res.status(500).json({ code: 500, message: 'El empleado no existe' });
    }
    const { name, email, password, position, salary } = req.body;
    if (name && email && password && position && salary) {
        const query = `UPDATE employees SET name = '${name}', email = '${email}', password = '${password}', position = '${position}', salary = '${salary}' WHERE id = ${id}`;
        const rows = await db.query(query);
        if (rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: 'Empleado actualizado con éxito' });
        }
        return res.status(500).json({ code: 500, message: 'Ocurrió un error' });
    }
    return res.status(500).json({ code: 500, message: 'Campos incompletos' });
});

admin.delete('/deleteEmployee/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(500).json({ code: 500, message: 'No se envió el ID' });
    }
    const query = `SELECT * FROM employees WHERE id = ${id}`;
    const rows = await db.query(query);
    if (rows.length == 0) {
        return res.status(500).json({ code: 500, message: 'El empleado no existe' });
    }
    const queryDelete = `DELETE FROM employees WHERE id = ${id}`;
    const rowsDelete = await db.query(queryDelete);
    if (rowsDelete.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: 'Empleado eliminado con éxito' });
    }
    return res.status(500).json({ code: 500, message: 'Ocurrió un error' });
});


module.exports = admin;