const sequelize = require('./sequelize');
const mock = require('./mock-products');

const randomFloat = (min,max) => Math.round((Math.random() * (max - min) + min + Number.EPSILON) * 100) / 100;
const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min);

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
                userId: 1,
                credit: 33.45,
            },
            {
                userId: 2,
                credit: 113.45,
            },
            {
                userId: 3,
                credit: 1233.45,
            },
        ]);
    }).catch(err => console.log(err))

    await sequelize.models.product.bulkCreate(Array.from({length: 21},
        (_, i) => ({
            "producerId": randomInt(1,5),
            "quantity": randomInt(1,230),
            "price": randomFloat(1,90),
            "src": mock.vegetables[i].img,
            "name": mock.vegetables[i].name,
            "type": 'VEGETABLES',
        }))
    )
    await sequelize.models.product.bulkCreate(Array.from({length: 24},
        (_, i) => ({
            "producerId": randomInt(1,5),
            "quantity": randomInt(1,230),
            "price": randomFloat(1,90),
            "src": mock.fruits[i].img,
            "name": mock.fruits[i].name,
            "type": 'FRUITS',
        }))
    )
    await sequelize.models.product.bulkCreate(Array.from({length: 5},
        (_, i) => ({
            "producerId": randomInt(1,5),
            "quantity": randomInt(1,230),
            "price": randomFloat(1,90),
            "src": mock.cereals[i].img,
            "name": mock.cereals[i].name,
            "type": 'CEREALS',
        }))
    )
}

module.exports = { reset };