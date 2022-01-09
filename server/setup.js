const sequelize = require("./sequelize");
const mock = require("./mock-products");

const randomFloat = (min, max) =>
  Math.round((Math.random() * (max - min) + min + Number.EPSILON) * 100) / 100;
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

async function reset() {
  await sequelize.sync({ force: true });

  await sequelize.models.order.bulkCreate([
    {
      clientId: 1,
      status: "CREATED",
      employeeId: 1,
    },
    {
      clientId: 1,
      status: "CREATED",
      employeeId: 1,
    },
    {
      clientId: 2,
      status: "CREATED",
      employeeId: 1,
    },
    {
      clientId: 2,
      status: "CREATED",
      employeeId: 1,
    },
    {
      clientId: 2,
      status: "PENDING",
      employeeId: 1,
    },
    {
      clientId: 1,
      status: "COMPLETED",
      employeeId: 1,
    },
    {
      clientId: 2,
      status: "PENDING CANCELATION",
      employeeId: 1,
    },
    {
      clientId: 2,
      status: "DELIVERED",
      employeeId: 1,
    },
  ]);

  await sequelize.models.product.bulkCreate(
    Array.from({ length: 21 }, (_, i) => ({
      producerId: randomInt(7, 10),
      quantity: randomInt(450, 730),
      price: randomFloat(1, 5),
      src: mock.vegetables[i].img,
      name: mock.vegetables[i].name,
      type: "VEGETABLES",
    }))
  );
  await sequelize.models.product.bulkCreate(
    Array.from({ length: 24 }, (_, i) => ({
      producerId: randomInt(7, 10),
      quantity: randomInt(1, 230),
      price: randomFloat(1, 12),
      unitOfMeasure: "Kg",
      src: mock.fruits[i].img,
      name: mock.fruits[i].name,
      type: "FRUITS",
    }))
  );
  await sequelize.models.product.bulkCreate(
    Array.from({ length: 5 }, (_, i) => ({
      producerId: randomInt(6, 10),
      quantity: randomInt(1, 230),
      price: randomFloat(1, 15),
      unitOfMeasure: "Kg",
      src: mock.cereals[i].img,
      name: mock.cereals[i].name,
      type: "CEREALS",
    }))
  );

  await sequelize.models.user
    .bulkCreate([
      {
        password: "pass",
        email: "antoniocentola97@gmail.com",
        firstname: "Antonio",
        lastname: "Centola",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "mark@email.com",
        firstname: "Mark",
        lastname: "Mendez",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "john@email.com",
        firstname: "John",
        lastname: "White",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "maria@email.com",
        firstname: "Maria",
        lastname: "Brown",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "pippo@email.com",
        firstname: "Pippo",
        lastname: "Rossi",
        is_tmp_password: 0,
        role: "ADMIN",
      },
      {
        password: "pass",
        email: "robert@email.com",
        firstname: "Robert",
        lastname: "Wesley",
        is_tmp_password: 0,
        role: "EMPLOYEE",
      },
      {
        password: "pass",
        email: "nicole@email.com",
        firstname: "Nicole",
        lastname: "s.p.a",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "frank@email.com",
        firstname: "Frank",
        lastname: "s.n.c",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "albertengo@email.com",
        firstname: "Albertengo",
        lastname: "s.a.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "bio@email.com",
        firstname: "Bio",
        lastname: "s.n.c",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "fruttafresca@email.com",
        firstname: "FruttaFresca",
        lastname: "s.r.l.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "vegetables@email.com",
        firstname: "Yummy Vegetables",
        lastname: "s.r.l.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "ildirettore@email.com",
        firstname: "Direttore",
        lastname: "Centola",
        is_tmp_password: 0,
        role: "WMANAGER",
      },
        {
            password: "pass",
            email: "pacimedina@gmail.com",
            firstname: "Francesco",
            lastname: "Medina",
            is_tmp_password: 0,
            role: "CLIENT",
        }
    ])
    .then(async () => {
      await sequelize.models.wallet.bulkCreate([
        {
          userId: 1,
          credit: 33,
        },
        {
          userId: 2,
          credit: 113.45,
        },
        {
          userId: 3,
          credit: 1233.45,
        },
        {
          userId: 3,
          credit: 1233.45,
        },
      ]);

      await sequelize.models.order_product.bulkCreate([
        {
          orderId: 1,
          productId: 1,
          userId: 9,
          amount: 2,
        },
        {
          orderId: 2,
          productId: 4,
          userId: 9,
          amount: 45,
        },
        {
          orderId: 1,
          productId: 12,
          userId: 9,
          amount: 21,
        },
        {
          orderId: 4,
          productId: 19,
          userId: 9,
          amount: 35,
        },
        {
          orderId: 1,
          productId: 9,
          userId: 8,
          amount: 33,
        },
      ]);
    })
    .catch((err) => console.log(err));
}

module.exports = { reset };
