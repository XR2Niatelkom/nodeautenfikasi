const mysql = require("mysql")
// const router = require("./siswa")
// const { route } = require("./siswa")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pelanggaran_siswa"
})

db.connect(error => {
    if(error){
        console.log(error.message)
    } 
    else {
        console.log("MySQL Connected")
    }
})

module.exports = db