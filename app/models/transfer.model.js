module.exports = (sequelize, Sequelize) => {
    const Transfer = sequelize.define("transfer", {
        transferGuid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true
        },
        treasureGuid: {
            type: Sequelize.UUID
        },
        isExternal: {
            type: Sequelize.BOOLEAN
        },
        receiverGuid: {
            type: Sequelize.UUID
        }
    });

    return Transfer;
};