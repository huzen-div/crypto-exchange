const db = require("../models");
const { uuid } = require('uuidv4');
const TreasureModel = db.treasures;
const UserModel = db.users;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let message = [];
    if (!req.body.userGuid) {
        message.push("userGuid can not be empty!");
    }
    if (!req.body.cryptoType) {
        message.push("cryptoType can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    const treasure = {
        treasureGuid: uuid(),
        userGuid: req.body.userGuid,
        cryptoType: req.body.cryptoType,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        let result = await TreasureModel.create(treasure);
        res.send({data:result});
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the treasure."
        });
    }
};

exports.findAll = async (req, res) => {
    const isActive = req.body.isActive;
    const userGuid = req.body.userGuid;

    var condition = {};
    if (isActive === true || isActive === false) {
        condition.isActive = isActive;
    }
    if (userGuid) {
        condition.userGuid = userGuid;
    }

    try {
        let result = await TreasureModel.findAll(
            {
                where: condition,
                include: [
                    {
                        attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                        model: UserModel, as: "vender"
                    }
                ]
            }
        );
        res.send(result);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving treasure."
        });
    }
};

exports.findOne = async (req, res) => {
    const treasureGuid = req.params.treasureGuid;
    const isActive = req.body.isActive;
    const userGuid = req.body.userGuid;

    let message = [];
    if (!treasureGuid) {
        message.push("treasureGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    var condition = {};
    condition.treasureGuid = treasureGuid;
    if (isActive === true || isActive === false) {
        condition.isActive = isActive;
    }
    if (userGuid) {
        condition.userGuid = userGuid;
    }

    try {
        let result = await TreasureModel.findOne(
            {
                where: condition,
                include: [
                    {
                        attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                        model: UserModel, as: "vender"
                    }
                ]
            });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: `Cannot find Treasure with treasureGuid=${treasureGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error retrieving Treasure with treasureGuid=" + treasureGuid
        });
    }
};