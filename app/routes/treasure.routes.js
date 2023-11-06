module.exports = app => {
    const treasures = require("../controllers/treasure.controller.js");
    var router = require("express").Router();

    //เพิ่มเหรียญของตัวเอง
    router.post("/", treasures.create);

    //ดึงเหรียญของทุกคน หรือเฉพาะของตัวเองโดยส่ง body userGuid
    router.get("/", treasures.findAll);

    //ดึงเหรียญของตัวเอง หรือสถานะเหรียญ isActive
    router.get("/:treasureGuid", treasures.findOne);

    app.use('/api/treasures', router);
};