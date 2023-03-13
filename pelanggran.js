const express = require("express") 
const router = express.Router() 
const db = require("./db") 
 
const multer = require("multer") 
const path = require("path") 
const fs = require("fs")  
 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, './image') 
    }, 
    filename: (req, file, cb) => { 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname)) 
    } 
}) 
 
let upload = multer({storage: storage}) 
 
//---------------------------------------------- Pelanggaran ------------------------------------------------------ 
 
//end-point akses data pelanggaran 
router.get("/pelanggaran", (req, res) => { 
    //create sql query 
    let sql = "select * from pelanggaran" 
 
    //run query 
    db.query(sql, (error, result) => { 
        let response = null 
        if (error) { 
            response = { 
                message: error.message //pesan error 
            } 
        } else { 
            response = { 
                count: result.length, //jumlah data 
                pelanggaran: result //isi data 
            } 
        } 
        res.json(response) //send response 
    }) 
}) 
 
//end point akses data pelanggaran berdasarkan id_pelanggaran tertentu 
router.get("/pelanggaran/:id_pelanggaran", (req, res) => { 
    let data = { 
        id_pelanggaran: req.params.id_pelanggaran 
    } 
    //create sql query 
    let sql = "select * from pelanggaran where ?" 
 
    //run query 
    db.query(sql, data, (error, result) => { 
        let response = null 
        if (error) { 
            response = { 
                message: error.message //pesan error 
            } 
        } else { 
            response = { 
                count: result.length, //jumlah data 
                pelanggaran: result //isi data 
            } 
        } 
        res.json(response) //send response 
    }) 
}) 
 
//end point menyimpan data pelanggaran 
router.post("/pelanggaran", upload.single("image"), (req, res) => { 
 
    //prepare data 
    let data = { 
        nama_pelanggaran: req.body.nama_pelanggaran, 
        poin: req.body.poin, 
        image: req.file.filename 
    } 
 
    if(!req.file){ 
        res.json({ 
            message: "Tidak ada file yang dikirim" 
        }) 
    } else { 
        let sql = "insert into pelanggaran set ?" 
        db.query(sql, data, (error, result) => { 
            if(error) throw error 
            res.json({ 
                message: result.affectedRows + " data berhasil disimpan" 
            }) 
        }) 
    } 
}) 
 
//end point mengubah data pelanggaran 
router.put("/pelanggaran", upload.single("image"), (req, res) => { 
 
    let data = null, sql= null 
    let param = { id_pelanggaran: req.body.id_pelanggaran } 
 
    if (!req.file) { 
        data = { 
            nama_pelanggaran: req.body.nama_pelanggaran, 
            poin: req.body.poin 
        } 
    } else { 
        data = { 
            nama_pelanggaran: req.body.nama_pelanggaran, 
            poin: req.body.poin, 
            image: req.file.filename 
        } 
    } 
 
    sql = "select * from pelanggaran where ?" 
 
    db.query(sql, param, (err, result) => { 
        if (err) throw err 
        let fileName = result[0].image 
 
        let dir = path.join(__dirname, "image", fileName) 
        fs.unlink(dir, (error) => {}) 
    }) 
 
    sql = "update pelanggaran set ? where ?" 
 
    db.query(sql, [data,param], (error, result) => { 
        if (error) { 
            res.json({ 
                message: error.message 
            }) 
        } else { 
            res.json({ 
                message: result.affectedRows + " data berhasil diubah" 
            }) 
        } 
    }) 
 
}) 
 
//end point menghapus data pelanggaran berdasarkan id_pelanggaran 
router.delete("/pelanggaran/:id_pelanggaran", (req, res) => { 
    //prepare data 
    let param = {id_pelanggaran: req.params.id_pelanggaran} 
 
    //create query sql delete 
    let sql = "select * from pelanggaran where ?" 
 
    db.query(sql, param, (error, result) => { 
        if (error) throw error

        let fileName = result[0].image 
        let dir = path.join(__dirname, "image", fileName) 
        fs.unlink(dir, (error) => {}) 
    }) 
 
    sql = "delete from pelanggaran where ?" 
    db.query(sql, param, (error, result) => { 
        if (error) { 
            res.json({ 
                message: error.message 
            }) 
        } else { 
            res.json({ 
                message: result.affectedRows + " data berhasil dihapus" 
            }) 
        } 
    }) 
}) 
 
module.exports = router