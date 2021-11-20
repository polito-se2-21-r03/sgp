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
            password: 'pass',
            email: 'mark@email.com',
            firstname: 'Mark',
            lastname: 'Mendez',
            is_tmp_password: 0,
            role: 'CLIENT',
        },
        {
            password: 'pass',
            email: 'john@email.com',
            firstname: 'John',
            lastname: 'White',
            is_tmp_password: 0,
            role: 'CLIENT',
        },
        {
            password: 'pass',
            email: 'maria@email.com',
            firstname: 'Maria',
            lastname: 'Brown',
            is_tmp_password: 0,
            role: 'CLIENT',
        },
        {
            password: 'pass',
            email: 'pippo@email.com',
            firstname: 'Pippo',
            lastname: 'Rossi',
            is_tmp_password: 0,
            role: 'ADMIN',
        },
        {
            password: 'pass',
            email: 'robert@email.com',
            firstname: 'Robert',
            lastname: 'Wesley',
            is_tmp_password: 0,
            role: 'EMPLOYEE',
        }
    ]).then(async () => {
        await sequelize.models.wallet.bulkCreate([
            {
                userEmail: 'mark@email.com',
                credit: 33.45,
            },
            {
                userEmail: 'john@email.com',
                credit: 113.45,
            },
            {
                userEmail: 'maria@email.com',
                credit: 1233.45,
            },
        ]);
    }).catch(err => console.log(err))

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