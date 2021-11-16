const sequelize = require('./sequelize');

async function reset()  {

    await sequelize.sync({ force: true });

    await sequelize.models.order.bulkCreate([
        {
            clientId: 1,
            status: 'CREATED',
            employeeId: 1,
        },
        {
            clientId: 2,
            status: 'PENDING',
            employeeId: 1,
        },
        {
            clientId: 1,
            status: 'COMPLETED',
            employeeId: 1,
        },
        {
            clientId: 2,
            status: 'PENDING',
            employeeId: 1,
        },
        {
            clientId: 2,
            status: 'DELIVERED',
            employeeId: 1,
        },
    ]);

    await sequelize.models.user.bulkCreate([
        {
            username: 'pippo',
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            role: 'ADMIN',
        },
        {
            username: 'pluto',
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            role: 'EMPLOYEE',
        },
        {
            username: 'topolino',
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            role: 'EMPLOYEE',
        },
        {
            username: 'giacomo',
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            role: 'ADMIN',
        },
        {
            username: 'francesco',
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            role: 'ADMIN',
        },
    ]).then(async () => {
        await sequelize.models.client.create(
            {
                name: 'Robert',
                walletId: 1,
                userId: 1,
            });

        await sequelize.models.employee.create(
            {
                name: 'Leonard',
                userId: 2,
                type: 'DELIVERYMAN'
            },
        );
    })

    await sequelize.models.product.bulkCreate([
        {
            name: 'carota',
            producerId: 1,
            quantity: 300,
            type: 'BIO',
            price: 1.2
        },
        {
            name: 'banana',
            producerId: 1,
            quantity: 300,
            type: 'BIO',
            price: 1.2
        },
        {
            name: 'pomodoro',
            producerId: 1,
            quantity: 300,
            type: 'BIO',
            price: 1.2
        },
        {
            name: 'uova',
            producerId: 1,
            quantity: 300,
            type: 'BIO',
            price: 1.2
        },
    ]);
}

module.exports = { reset };