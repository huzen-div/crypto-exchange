module.exports = app => {
    const buys = require("../controllers/buy.controller.js");
    var router = require("express").Router();

    //ซื้อเหรียญ
    router.post("/", buys.create);

    //ดึงประวัติซื้อเหรียญทั้งหมด หรือโดย buyGuid
    router.get("/", buys.findAll);

    //ดึงประวัติซื้อเหรียญด้วย buyGuid
    router.get("/:buyGuid", buys.findOne);

    app.use('/api/buys', router);
};