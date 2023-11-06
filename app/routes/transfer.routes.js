module.exports = app => {
    const transfers = require("../controllers/transfer.controller.js");
    var router = require("express").Router();

    //เพิ่มการโอนเหรียญ
    router.post("/", transfers.create);

    //ดึงการโอนเหรียญ
    router.get("/", transfers.findAll);

    //ดึงการโอนเหรียญด้วย transferGuid
    router.get("/:transferGuid", transfers.findOne);

    app.use('/api/transfers', router);
};