var db = require('../dbcon'); //reference of dbconnection.js
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myPassword');

var Task = {
    getAllAccount: callback => {
        return db.query("Select * from users", callback);
    },
    getAccountById: function (id, callback) {
        return db.query("select * from users where id=?", [id], callback);
    },
    addAccount: function (info, callback) {
        info.password = cryptr.encrypt(info.password);
        // const decryptedString = cryptr.decrypt(encryptedString);
        console.log(info);
        db.query("Insert into users values(?,?,?,?,?,?,?)", [info.id, info.username, info.password, info.usertype, info.name, info.birthDate, info.gender], callback);
        return console.log("Account Added");
    },
    deleteAccount: function (id, callback) {
        return db.query("delete from users where id=?", [id], callback);
    },
    updateAccount: function (id, Task, callback) {
        return db.query("update users set name=?, age=?, gender=? where id=?", [Task.name, Task.age, Task.gender, id], callback);
    }
};
module.exports = Task; ``