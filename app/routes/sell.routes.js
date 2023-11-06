module.exports = app => {
    const sells = require("../controllers/sell.controller.js");
    var router = require("express").Router();

    //ขายเหรียญ
    router.post("/", sells.create);

    //ดึงรายการขายเหรียญทั้งหมด หรือโดย treasureGuid
    router.get("/", sells.findAll);

    //ดึงรายการขายเหรียญด้วย sellGuid
    router.get("/:sellGuid", sells.findOne);

    app.use('/api/sells', router);
};