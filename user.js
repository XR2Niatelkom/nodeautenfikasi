const express = require("express")
const router = express.Router()
const db = require("./db")
const hash = require("object-hash")
const md5 = require("md5")
const Crypt = require ("cryptr")
const crypt = new Crypt("8008808808")

validateToken = () => {
    return (req, res, next) => {
        if(!req.get("Token")) {
            res.json({
                message: "Access Forbidden"
            })
        } else {
            let token = req.get("Token")
            let decryptToken = crypt.decrypt(token)
            let sql = "select * from user where ?"
            let param = { id_user: decryptToken}

            db.query(sql, param, (error, result) => {
                if (error) throw error
                if (result.length > 0) {
                    next()
                } else {
                    res.json({
                        message: "Invalid Token"
                    })
                }
            })
        }
    }
}

router.get("/user", (req,res) => {
    let sql = "select * from user"
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

router.get("/user/:id_user", (req,res) => {
    let data = {
        id_user:req.params.id_user
    }
    let sql = "select * from user where ?"
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


router.post("/user", (req,res) => {
    let data = {
        name_user: req.body.name_user,
        username: req.body.username,
        password: md5(req.body.password)
    }
    let sql = "insert into user set ?"
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

router.post("/user/auth", (req,res) => {
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    let sql = "select * from user where username = ? and password = ?"
    db.query(sql, param, (error, result) => {
        if (error) throw error
        if (result.length > 0) {
            res.json({
                message: "logged",
                token: crypt.encrypt(result[0].id_user),
                data: result
            })
        } else {
            res.json({
                message: "invalid username/password"
            })
        }
    })
})

router.put("/user", (req,res) => {
    var password = req.body.password
    const hashPassword = hash.MD5(password)
    let data = [
        {
        name_user: req.body.name_user,
        username: req.body.username,
        password: hashPassword
    },
    {
        id_user: req.body.id_user
    }
    ]
    let sql = "update user set ? where ?"
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

router.delete("/user/:id_user", (req,res) => {
    let data = {
        id_user: req.params.id_user
    }

    let sql = "delete from user where ?"
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