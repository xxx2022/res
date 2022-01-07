const express = require("express")
const router = express.Router()
const urlData = require("url");
const db = require("../../config/db")

router.get('/test', (req, resp) => {
    resp.json({
        msg: "success!!!!"
    })
})
//查看所有菜品信息
router.post("/foodList", (request, response) => {
    const sql = `select * from foods`
    db.dataControl(sql, (req, res) => {
        if (req.status == false) {
            return response.status(400).json({
                msg: req.msg
            })
        } else {
            if (req.data && req.data.length > 0) {
                response.status(200).send({
                    data: req.data
                })
            } else {
                response.send({
                    msg: '暂无数据'
                })
            }
        }
    })
})
//增加菜品信息
router.post("/foodAdd", (request, response) => {
    // const sql = `insert into foods value`
    const sql = `select * from foods where food_name='${request.body.food_name}'`
    db.dataControl(sql, (req, res) => {
        if (req.status == false) {
            response.send({
                msg: req.msg
            })
        } else {
            if (req.data && req.data.length > 0) {
                return response.status(400).send({
                    msg: '菜品已存在'
                })
            } else {
                const sql = `insert into foods (img_url, price, food_name, type, sales, description, attr) values('${request.body.img_url}','${request.body.price}','${request.body.food_name}','${request.body.type}','${request.body.sales}','${request.body.description}','${request.body.attr}')`
                db.dataControl(sql, (req, res) => {
                    if (req.status == false) {
                        return response.send({
                            msg: req.msg
                        })
                    } else {
                        return response.status(200).send({
                            msg: '添加成功'
                        })
                    }
                })
            }
        }
    })
})
//删除菜品
router.post("/foodDel", (request, response) => {
    const sql = `delete from foods where id='${request.body.id}'`
    db.dataControl(sql, (req, res) => {
        if (req.status == false) {
            return response.send({
                msg: req.msg
            })
        } else {
            return response.send({
                msg: req.msg
            })
        }
    })
})
//修改菜品信息
router.post("/foodUpdate", (request, response) => {
    const sql = "update foods set food_name = '" + request.body.food_name + "', price='" + request.body.price + "', type='" + request.body.type + "', description='" + request.body.description + "', sales='" + request.body.sales + "', attr='" + request.body.attr + "' where id='" + request.body.id + "'";
    db.dataControl(sql, (req, res) => {
        if (req.status == false) {
            return response.send({
                msg: req.msg
            })
        } else {
            return response.status(200).send({
                msg: "修改成功"
            })
        }
    })
})

//获取单个菜品详情
router.get("/foodDetail", (request, response) => {
    const urlInfo = urlData.parse(request.url, true)
    const sql = `select * from foods where id='${urlInfo.query.id}'`
    db.dataControl(sql, (req, res) => {
        if (req.status == false) {
            return response.send({
                msg: req.msg
            })
        } else {
            if (req.data && req.data.length > 0) {
                response.status(200).send({
                    data: req.data
                })
            } else {
                return response.send({
                    msg: '暂无数据'
                })
            }
        }
    })
})
router.post("/submenu", (request, response) => {
    const sql = `select * from foods_type `
    let nameList = []
    db.dataControl(sql, (req, res) => {
        req.data.forEach((item) => {
            nameList.push({
                name: item.name,
                id: item.id,
                data: []
            })
        })
        for (let i=0; i < nameList.length; i++) {
            let sqlName = `select a.id,a.img_url,a.price,a.food_name,a.description,a.sales from foods a inner join foods_type b on  a.parent_id =b.id where a.parent_id='${nameList[i].id}'`
            db.dataControl(sqlName, (req, res) => {
                nameList[i].data=req.data
                if(nameList[nameList.length-1].data.length>0){
                    response.status(200).send({
                        data: nameList
                    })
                }
               
            })
        }
    })
})

module.exports = router