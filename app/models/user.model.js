module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        userGuid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        firstname: {
            type: Sequelize.STRING
        },
        lastname: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.BOOLEAN
        }
    });

    return User;
};