module.exports = (sequelize, Sequelize) => {
    const Buy = sequelize.define("buy", {
        buyGuid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true
        },
        sellGuid: {
            type: Sequelize.UUID
        },
        buyerGuid: {
            type: Sequelize.UUID
        },
        fiatType: {
            type: Sequelize.STRING(5)
        },
        buyPrice: {
            type: Sequelize.DECIMAL
        }
    });

    return Buy;
};