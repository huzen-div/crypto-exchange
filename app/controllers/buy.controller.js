const db = require("../models");
const { uuid } = require('uuidv4');
const BuyModel = db.buys;
const SellModel = db.sells;
const UserModel = db.users;
const TreasureModel = db.treasures;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let message = [];
    if (!req.body.sellGuid) {
        message.push("sellGuid can not be empty!");
    }
    if (!req.body.buyerGuid) {
        message.push("buyerGuid can not be empty!");
    }
    if (!req.body.fiatType) {
        message.push("fiatType can not be empty!");
    }
    if (!req.body.buyPrice) {
        message.push("buyPrice can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    const buy = {
        buyGuid: uuid(),
        sellGuid: req.body.sellGuid, //d83fc52b-5e45-43fa-9eae-d343e1c76242
        buyerGuid: req.body.buyerGuid, //011cac48-ec14-4875-af30-78f591affdfb
        fiatType: req.body.fiatType,//'THB'
        buyPrice: req.body.buyPrice,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        await db.sequelize.transaction(async (transaction) => {
            var condition = {};
            condition.sellGuid = buy.sellGuid;
            let resultSell = await SellModel.findOne({
                attributes: ['sellGuid', 'price'],
                where: condition,
                include: [
                    {
                        attributes: ['treasureGuid', 'cryptoType', 'isActive'],
                        model: TreasureModel, as: "treasure",
                        include: [
                            {
                                attributes: ['userGuid'],
                                model: UserModel, as: "vender"
                            }
                        ]
                    }
                ]
            });
            if (resultSell) {
                if (resultSell.treasure?.isActive == true) {

                    let resultCreateBuy = await BuyModel.create(buy, { transaction });
                    if (resultCreateBuy) {
                        let resultUpdateTreasure = await TreasureModel.update(
                            { isActive: false },
                            {
                                where: {
                                    treasureGuid: resultSell.treasure.treasureGuid
                                },
                                transaction
                            }
                        );
                        if (resultUpdateTreasure) {
                            const treasureNew = {
                                treasureGuid: uuid(),
                                userGuid: buy.buyerGuid,
                                cryptoType: resultSell.treasure.cryptoType,
                                isActive: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };
                            let resultCreateTreasure = await TreasureModel.create(treasureNew, { transaction });
                            if (resultCreateTreasure) {
                                res.send({ data: resultCreateTreasure, message: 'ทำรายการซื้อสำเร็จ' });
                            }
                            else {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while create the treasure."
                                });
                            }
                        }
                        else {
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while update the buy."
                            });
                        }
                    }

                }
                else {
                    res.status(404).send({
                        message: `เหรียญได้ขายหรือโอนไปให้คนอื่นแล้ว`
                    });
                }
            } else {
                res.status(404).send({
                    message: `Cannot find Sell with sellGuid=${buy.sellGuid}.`
                });
            }
        });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the buy."
        });
    }
};

exports.findAll = async (req, res) => {
    const sellGuid = req.body.sellGuid;
    var condition = {};
    if (sellGuid) {
        condition.sellGuid = sellGuid;
    }

    try {
        let result = await BuyModel.findAll({
            attributes: ['buyGuid', 'sellGuid', 'buyerGuid', 'fiatType', 'buyPrice', 'createdAt'],
            where: condition,
            include: [
                {
                    attributes: ['sellGuid', 'treasureGuid', 'price', 'createdAt'],
                    model: SellModel,
                    include: [
                        {
                            attributes: ['treasureGuid', 'userGuid', 'cryptoType', 'isActive'],
                            model: TreasureModel, as: "treasure",
                            include: [
                                {
                                    attributes: ['userGuid', 'firstname', 'lastname'],
                                    model: UserModel, as: 'vender'
                                }
                            ]
                        }
                    ]
                },
                {
                    attributes: ['userGuid', 'firstname', 'lastname'],
                    model: UserModel, as: 'buyer'
                }
            ]
        });
        res.send(result);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving buy."
        });
    }
};

exports.findOne = async (req, res) => {
    const buyGuid = req.params.buyGuid;

    const fiatType = req.body.fiatType;

    let message = [];
    if (!buyGuid) {
        message.push("buyGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    var condition = {};
    condition.buyGuid = buyGuid;
    if (fiatType) {
        condition.fiatType = fiatType;
    }

    try {
        let result = await BuyModel.findOne({
            attributes: ['buyGuid', 'sellGuid', 'buyerGuid', 'fiatType', 'buyPrice', 'createdAt'],
            where: condition,
            include: [
                {
                    attributes: ['sellGuid', 'treasureGuid', 'price', 'createdAt'],
                    model: SellModel,
                    include: [
                        {
                            attributes: ['treasureGuid', 'userGuid', 'cryptoType', 'isActive'],
                            model: TreasureModel, as: "treasure",
                            include: [
                                {
                                    attributes: ['userGuid', 'firstname', 'lastname'],
                                    model: UserModel, as: 'vender'
                                }
                            ]
                        }
                    ]
                },
                {
                    attributes: ['userGuid', 'firstname', 'lastname'],
                    model: UserModel, as: 'buyer'
                }
            ]
        });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: `Cannot find Buy with buyGuid=${buyGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error retrieving Buy with buyGuid=" + buyGuid
        });
    }
};