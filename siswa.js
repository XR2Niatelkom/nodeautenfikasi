const express = require("express")
const router = express.Router()
const db = require("./db")

router.get("/siswa", (req,res) => {
    let sql = "select * from siswa"
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

router.get("/siswa/:id_siswa", (req,res) => {
    let data = {
        id_siswa:req.params.id_siswa
    }
    let sql = "select * from siswa where ?"
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


router.post("/siswa", (req,res) => {
    let data = {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        poin: req.body.poin
    }
    let sql = "insert into siswa set ?"
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

router.put("/siswa", (req,res) => {
    let data = [
        {
        nis: req.body.nis,
        nama_siswa: req.body.nama_siswa,
        kelas: req.body.kelas,
        poin: req.body.poin
    },
    {
        id_siswa:req.body.id_siswa
    }
    ]
    let sql = "update siswa set ? where ?"
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

router.delete("/siswa/:id_siswa", (req,res) => {
    let data = {
        id_siswa: req.params.id_siswa
    }

    let sql = "delete from siswa where ?"
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

module.exports = router