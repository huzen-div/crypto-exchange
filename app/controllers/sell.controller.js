const db = require("../models");
const { uuid } = require('uuidv4');
const SellModel = db.sells;
const UserModel = db.users;
const TreasureModel = db.treasures;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let message = [];
    if (!req.body.treasureGuid) {
        message.push("treasureGuid can not be empty!");
    }
    if (!req.body.price) {
        message.push("price can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    const sell = {
        sellGuid: uuid(),
        treasureGuid: req.body.treasureGuid,
        price: req.body.price,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        var condition = {};
        condition.treasureGuid = sell.treasureGuid;
        let resultTreasure = await TreasureModel.findOne(
            {
                attributes: ['treasureGuid', 'isActive'],
                where: condition,
                include: [
                    {
                        attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                        model: UserModel, as: "vender"
                    },
                    {
                        attributes: ['sellGuid'],
                        model: SellModel
                    }
                ]
            });
        if (resultTreasure) {
            if (resultTreasure.isActive == true && !resultTreasure.sell?.sellGuid) {
                let result = await SellModel.create(sell);
                if (result) {
                    res.send({ data: result, message: 'ทำรายการขายสำเร็จ' });
                }
                else {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while create the sell."
                    });
                }
            }
            else {
                res.status(404).send({
                    message: `เหรียญได้ขายหรือโอนไปให้คนอื่นแล้ว`
                });
            }
        } else {
            res.status(404).send({
                message: `Cannot find Treasure with treasureGuid=${treasureGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the sell."
        });
    }
};

exports.findAll = async (req, res) => {
    const treasureGuid = req.body.treasureGuid;
    var condition = {};
    if (treasureGuid) {
        condition.treasureGuid = treasureGuid;
    }

    try {
        let result = await SellModel.findAll({
            attributes: ['sellGuid', 'price', 'createdAt'],
            where: condition,
            include: [
                {
                    attributes: ['treasureGuid', 'cryptoType', 'isActive', 'createdAt'],
                    model: TreasureModel, as: "treasure",
                    include: [
                        {
                            attributes: ['userGuid', 'firstname', 'lastname'],
                            model: UserModel, as: "vender"
                        }
                    ]
                }
            ]
        });
        res.send(result);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving sell."
        });
    }
};

exports.findOne = async (req, res) => {
    const sellGuid = req.params.sellGuid;

    const treasureGuid = req.body.treasureGuid;

    let message = [];
    if (!sellGuid) {
        message.push("sellGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    var condition = {};
    condition.sellGuid = sellGuid;
    if (treasureGuid) {
        condition.treasureGuid = treasureGuid;
    }

    try {
        let result = await SellModel.findOne({
            attributes: ['sellGuid', 'price', 'createdAt'],
            where: condition,
            include: [
                {
                    attributes: ['treasureGuid', 'cryptoType', 'isActive', 'createdAt'],
                    model: TreasureModel, as: "treasure",
                    include: [
                        {
                            attributes: ['userGuid', 'firstname', 'lastname'],
                            model: UserModel, as: "vender"
                        }
                    ]
                }
            ]
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: `Cannot find Sell with sellGuid=${sellGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error retrieving Sell with sellGuid=" + sellGuid
        });
    }
};