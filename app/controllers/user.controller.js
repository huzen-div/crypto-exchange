const db = require("../models");
const { uuid } = require('uuidv4');
const UserModel = db.users;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    let message = [];
    if (!req.body.username) {
        message.push("username can not be empty!");
    }
    if (!req.body.password) {
        message.push("password can not be empty!");
    }
    if (!req.body.firstname) {
        message.push("firstname can not be empty!");
    }
    if (!req.body.lastname) {
        message.push("lastname can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    const user = {
        userGuid: uuid(),
        username: req.body.username,
        password: req.body.password,//on prd encrypt
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        published: req.body.published ? req.body.published : false,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    try {
        let result = await UserModel.create(user);
        res.send({ data: result });
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the User."
        });
    }
};

exports.findAll = async (req, res) => {
    const firstname = req.query.firstname;
    var condition = firstname ? { firstname: { [Op.iLike]: `%${firstname}%` } } : null;

    try {
        let result = await UserModel.findAll({ 
            attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
            where: condition 
        });
        res.send(result);
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving user."
        });
    }
};

exports.findOne = async (req, res) => {
    const userGuid = req.params.userGuid;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    let message = [];
    if (!userGuid) {
        message.push("userGuid can not be empty!");
    }
    if (message.length > 0) {
        res.status(400).send({ message });
        return;
    }

    var condition = {};
    condition.userGuid = userGuid;
    if (firstname) {
        condition.firstname = { [Op.iLike]: `%${firstname}%` };
    }
    if (lastname) {
        condition.lastname = { [Op.iLike]: `%${lastname}%` };
    }

    try {
        let result = await UserModel.findOne(
            {
                attributes: ['userGuid', 'firstname', 'lastname', 'published', 'createdAt'],
                where: condition,
            });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({
                message: `Cannot find User with userGuid=${userGuid}.`
            });
        }
    }
    catch (err) {
        res.status(500).send({
            message:
                err.message || "Error retrieving User with userGuid=" + userGuid
        });
    }
};