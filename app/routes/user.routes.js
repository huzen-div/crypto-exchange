module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();

    //เพิ่มผู้ใช้งาน
    router.post("/", users.create);

    //ดึงผู้ใช้งาน
    router.get("/", users.findAll);

    //ดึงผู้ใช้งานเฉพาะตัวเอง
    router.get("/:userGuid", users.findOne);

    app.use('/api/users', router);
};