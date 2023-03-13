const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const moment = require("moment")
const md5 = require("md5")
const Crypt = require ("cryptr")
const crypt = new Crypt("140533601726")

const siswaroute = require("./siswa")
const userroute = require("./user")
const pelanggaranroute = require("./pelanggran")
const transaksiroute = require("./transaksi")
// const { error } = require("console")
// const { debugPort } = require("process")
// const { strictEqual } = require("assert")

const app = express()
app.use(express.json())
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(siswaroute)
app.use(userroute)
app.use(pelanggaranroute)
app.use(transaksiroute)

app.get("/pelanggaran_siswa", (req,res) => {
    let sql = "select * from pelanggaran_siswa"
    db.query(sql,(error,result) => {
        let response = null
        if (error){
            response = {
                message: error.message
            }
        } else {
            response = {
                count: result.length,
                siswa: result
            }
        }
        res.json(response)
    })
})

app.get("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let data = {
        id_pelanggaran_siswa:req.params.id_pelanggaran_siswa
    }
    let sql = "select * from pelanggaran_siswa where ?"
    db.query(sql,data, (error, result) => {
        let response = null 
        if (error){
            response = {
                message: error.message
            }
        } 
        else {
            response = {
                count: result.length,
                siswa: result
            }
        }
        res.json(response)
    })
})


app.post("/pelanggaran_siswa", (req,res) => {
    let data = {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    let sql = "insert into pelanggaran_siswa set ?"
    db.query(sql,data,(error,result) => {
        let response = null 
        if (error) {
            response = {
                message: error.message
            }
        } 
        else {
            response = {
                message: result.affectedRows + "data inserted"
            }
        }
        res.json(response)
    })
})

app.put("/pelanggaran_siswa", (req,res) => {
    let data = [
        {
        id_siswa: req.body.id_siswa,
        id_user: req.body.id_user,
        waktu: moment().format('YYYY-MM-DD HH:mm:ss')
    },
    {
        id_pelanggaran_siswa: req.body.id_pelanggaran_siswa
    }
    ]
    let sql = "update pelanggaran_siswa set ? where ?"
    db.query(sql,data,(error,result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response)
    })
})

app.delete("/pelanggaran_siswa/:id_pelanggaran_siswa", (req,res) => {
    let data = {
        id_pelanggaran_siswa: req.params.id_pelanggaran_siswa
    }

    let sql = "delete from pelanggaran_siswa where ?"
    db.query(sql,data,(error,result) =>{
        let response = null 
        if(error) {
            response = {
                message: error.message
            }
        }
        else {
            response = {
                message: result.affectedRows + "data deleted"
            }
        }
        res.json(response)
    })
})


//transaksi 


app.listen(7000,() => {
    console.log("ayang cantik wleee")
})