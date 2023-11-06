module.exports = (sequelize, Sequelize) => {
    const Sell = sequelize.define("sell", {
        sellGuid: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true
        },
        treasureGuid: {
            type: Sequelize.UUID
        },
        price: {
            type: Sequelize.DECIMAL
        }
    });

    return Sell;
};