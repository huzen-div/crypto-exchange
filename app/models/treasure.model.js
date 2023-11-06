module.exports = (sequelize, Sequelize) => {
    const Treasure = sequelize.define("treasure", {
        treasureGuid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true
        },
        userGuid: {
            type: Sequelize.UUID
        },
        cryptoType: {
            type: Sequelize.STRING(20)
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    });

    return Treasure;
};