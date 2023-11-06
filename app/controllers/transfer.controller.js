const db = require("../models");
const { uuid } = require('uuidv4');
const TransferModel = db.transfers;
const UserModel = db.users;
const TreasureModel = db.treasures;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let message = [];
    if (!req.body.treasureGuid) {
        message.push("treasureGuid can not be empty!");
    }
    if (!req.body.receiverGuid) {
        message.push("receiverGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    const transfer = {
        transferGuid: uuid(),
        treasureGuid: req.body.treasureGuid,
        isExternal: req.body.isExternal ? req.body.isExternal : false,
        receiverGuid: req.body.receiverGuid,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        await db.sequelize.transaction(async (transaction) => {
            var condition = {};
            condition.treasureGuid = transfer.treasureGuid;
            let resultTreasure = await TreasureModel.findOne({
                attributes: ['treasureGuid', 'cryptoType', 'isActive'],
                where: condition,
                include: [
                    {
                        attributes: ['userGuid'],
                        model: UserModel, as: "vender"
                    }
                ]
            });
            if (resultTreasure) {
                if (resultTreasure.isActive == true) {

                    let resultCreateTransfer = await TransferModel.create(transfer, { transaction });
                    if (resultCreateTransfer) {
                        let resultUpdateTreasure = await TreasureModel.update(
                            { isActive: false },
                            {
                                where: {
                                    treasureGuid: resultTreasure.treasureGuid
                                },
                                transaction
                            }
                        );
                        if (resultUpdateTreasure) {
                            const treasureNew = {
                                treasureGuid: uuid(),
                                userGuid: transfer.receiverGuid,
                                cryptoType: resultTreasure.cryptoType,
                                isActive: true,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };
                            let resultCreateTreasure = await TreasureModel.create(treasureNew, { transaction });
                            if (resultCreateTreasure) {
                                res.send({ data: resultCreateTreasure, message: 'ทำรายการโอนสำเร็จ' });
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
                                message: err.message || "Some error occurred while update the treasure."
                            });
                        }
                    }
                    else {
                        res.status(500).send({
                            message: err.message || "Some error occurred while create the transfer."
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
                    message: `Cannot find Treasure with treasureGuid=${transfer.treasureGuid}.`
                });
            }
        });

    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the transfer."
        });
    }
};

exports.findAll = async (req, res) => {
    const treasureGuid = req.body.treasureGuid;
    const isExternal = req.body.isExternal;
    const receiverGuid = req.body.receiverGuid;
    var condition = {};
    if (treasureGuid) {
        condition.treasureGuid = treasureGuid;
    }
    if (isExternal != null) {
        condition.isExternal = isExternal;
    }
    if (receiverGuid) {
        condition.receiverGuid = receiverGuid;
    }

    try {
        let result = await TransferModel.findAll({
            where: condition,
            include: [
                {
                    attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                    model: UserModel, as: "receiver"
                },
                {
                    attributes: ['treasureGuid', 'cryptoType', 'isActive', 'createdAt'],
                    model: TreasureModel, as: "treasure",
                    include: [
                        {
                            attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
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
                err.message || "Some error occurred while retrieving transfer."
        });
    }
};

exports.findOne = async (req, res) => {
    const transferGuid = req.params.transferGuid;

    const treasureGuid = req.body.treasureGuid;
    const isExternal = req.body.isExternal;
    const receiverGuid = req.body.receiverGuid;

    let message = [];
    if (!transferGuid) {
        message.push("transferGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    var condition = {};
    condition.transferGuid = transferGuid;
    if (treasureGuid) {
        condition.treasureGuid = treasureGuid;
    }
    if (isExternal != null) {
        condition.isExternal = isExternal;
    }
    if (receiverGuid) {
        condition.receiverGuid = receiverGuid;
    }

    try {
        let result = await TransferModel.findOne({
            where: condition,
            include: [
                {
                    attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                    model: UserModel, as: "receiver"
                },
                {
                    attributes: ['treasureGuid', 'cryptoType', 'isActive', 'createdAt'],
                    model: TreasureModel, as: "treasure",
                    include: [
                        {
                            attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
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
                message: `Cannot find Transfer with transferGuid=${transferGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error retrieving Transfer with transferGuid=" + transferGuid
        });
    }
};