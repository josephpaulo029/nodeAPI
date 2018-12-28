var express = require('express');
var router = express.Router();
var Task = require('../models/Task');
var db = require('../dbcon'); //reference of dbconnection.js
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myPassword');
var jwt = require('jsonwebtoken');
var secretCode = 'syngentaCode'

router.get('/getAccount/:id?', (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secretCode, function (err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            // res.status(200).send(decoded);
            if (req.params.id) {

                Task.getAccountById(req.params.id, (err, rows) => {

                    if (err) {
                        res.json(err);
                    }
                    else {
                        res.json(rows);
                    }
                });
            }
            else {

                Task.getAllAccount((err, rows) => {

                    if (err) {
                        res.json(err);
                    }
                    else {
                        res.json(rows);
                    }

                });
            }
        }

    });

});
router.post('/addAccount', (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, secretCode, function (err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            Task.addAccount(req.body, (err, count) => {
                if (err) {
                    res.json(err);
                }
                else {
                    res.status(200).send({ "message": "account added" });
                    // res.json(req.body);//or return count for 1 &amp;amp;amp; 0
                }
            });
        }
    });
});
router.post('/login', (req, res, next) => {

    var username = req.body.username;
    var password = req.body.password;
    db.query('SELECT * FROM users WHERE username = ?', [username], function (error, results, fields) {
        if (error) {
            // console.log("error ocurred",error);
            res.send({
                "auth": false,
                "code": 400,
                "failed": "error ocurred"
            });
        } else {
            // console.log('The solution is: ', results);
            if (results.length > 0) {
                const decryptedString = cryptr.decrypt(results[0].password);
                if (decryptedString == password) {
                    // res.send({
                    //     "code": 200,
                    //     "success": "login sucessfull"
                    // });
                    var token = jwt.sign({ id: results.id }, secretCode, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200).send({ "id": results[0].id, "auth": true, "token": token });
                }
                else {
                    res.send({
                        "auth": false,
                        "code": 204,
                        "success": "username and password does not match"
                    });
                }
            }
            else {
                res.send({
                    "auth": false,
                    "code": 204,
                    "success": "username does not exits"
                });
            }
        }
    });

});
router.delete('/:id', (req, res, next) => {

    Task.deleteAccount(req.params.id, (err, count) => {

        if (err) {
            res.json(err);
        }
        else {
            res.json(count);
        }

    });
});
router.put('/:id', (req, res, next) => {

    Task.updateAccount(req.params.id, req.body, (err, rows) => {

        if (err) {
            res.json(err);
        }
        else {
            res.json(rows);
        }
    });
});
module.exports = router;