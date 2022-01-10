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

  await sequelize.models.product.bulkCreate([
    {
      producerId: 9,
      quantity: 150,
      price: 1.67,
      unitOfMeasure: "Kg",
      src: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      name: "carrots",
      type: "VEGETABLES",
    },
    {
      producerId: 9,
      quantity: 50,
      price: 0.99,
      unitOfMeasure: "Kg",
      src: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      name: "apples",
      type: "FRUITS",
    },
    {
      producerId: 9,
      quantity: 50,
      price: 0.99,
      unitOfMeasure: "Kg",
      src: "https://images.unsplash.com/photo-1566842600175-97dca489844f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
      name: "cauliflower",
      type: "VEGETABLES",
    },
    {
      producerId: 9,
      quantity: 50,
      price: 0.99,
      unitOfMeasure: "Kg",
      src: "https://images.unsplash.com/photo-1587351177732-5b0739d1bd44?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      name: "broccoli",
      type: "VEGETABLES",
    },
    {
      producerId: 9,
      quantity: 50,
      price: 0.99,
      unitOfMeasure: "Kg",
      src: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80",
      name: "pumpkin",
      type: "FRUITS",
    },
  ]);
  await sequelize.models.product.bulkCreate(
    Array.from({ length: 21 }, (_, i) => ({
      producerId: randomInt(7, 8),
      quantity: randomInt(450, 730),
      price: randomFloat(1, 5),
      src: mock.vegetables[i].img,
      name: mock.vegetables[i].name,
      type: "VEGETABLES",
    }))
  );
  await sequelize.models.product.bulkCreate(
    Array.from({ length: 24 }, (_, i) => ({
      producerId: randomInt(7, 8),
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
      producerId: randomInt(6, 8),
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
        phone: "123456789",
        firstname: "Antonio",
        lastname: "Centola",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "mark@email.com",
        phone: "123456789",
        firstname: "Mark",
        lastname: "Mendez",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "john@email.com",
        phone: "123456789",
        firstname: "John",
        lastname: "White",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "maria@email.com",
        phone: "123456789",
        firstname: "Maria",
        lastname: "Brown",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "pippo@email.com",
        phone: "123456789",
        firstname: "Pippo",
        lastname: "Rossi",
        is_tmp_password: 0,
        role: "ADMIN",
      },
      {
        password: "pass",
        email: "robert@email.com",
        phone: "123456789",
        firstname: "Robert",
        lastname: "Wesley",
        is_tmp_password: 0,
        role: "EMPLOYEE",
      },
      {
        password: "pass",
        email: "nicole@email.com",
        phone: "123456789",
        firstname: "Nicole",
        lastname: "s.p.a",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "frank@email.com",
        phone: "123456789",
        firstname: "Frank",
        lastname: "s.n.c",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "albertengo@email.com",
        phone: "123456789",
        firstname: "Albertengo",
        lastname: "s.a.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "bio@email.com",
        phone: "123456789",
        firstname: "Bio",
        lastname: "s.n.c",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "fruttafresca@email.com",
        phone: "123456789",
        firstname: "FruttaFresca",
        lastname: "s.r.l.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "vegetables@email.com",
        phone: "123456789",
        firstname: "Yummy Vegetables",
        lastname: "s.r.l.s",
        is_tmp_password: 0,
        role: "FARMER",
      },
      {
        password: "pass",
        email: "ildirettore@email.com",
        phone: "123456789",
        firstname: "Direttore",
        lastname: "Centola",
        is_tmp_password: 0,
        role: "WMANAGER",
      },
      {
        password: "pass",
        email: "pacimedina@gmail.com",
        phone: "123456789",
        firstname: "Francesco",
        lastname: "Medina",
        is_tmp_password: 0,
        role: "CLIENT",
      },
      {
        password: "pass",
        email: "mariorossi@email.com",
        phone: "123456789",
        firstname: "Mario",
        lastname: "Rossi",
        is_tmp_password: 0,
        role: "EMPLOYEE",
      },
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
          orderId: 3,
          productId: 1,
          userId: 9,
          amount: 2,
        },
        {
          orderId: 4,
          productId: 4,
          userId: 9,
          amount: 45,
        },
        {
          orderId: 5,
          productId: 12,
          userId: 9,
          amount: 21,
        },
        {
          orderId: 7,
          productId: 19,
          userId: 9,
          amount: 35,
        },
        {
          orderId: 8,
          productId: 9,
          userId: 8,
          amount: 33,
        },
      ]);
    })
    .catch((err) => console.log(err));

  await sequelize.models.order_product.bulkCreate([
    {
      orderId: 8,
      productId: 2,
      userId: 9,
      amount: 12,
      confirmed: 0,
    },
    {
      orderId: 7,
      productId: 6,
      userId: 9,
      amount: 12,
      confirmed: 1,
    },
    {
      orderId: 5,
      productId: 4,
      userId: 9,
      amount: 23,
      confirmed: 0,
    },
    {
      orderId: 4,
      productId: 7,
      userId: 9,
      amount: 2,
      confirmed: 0,
    },
    {
      orderId: 3,
      productId: 12,
      userId: 9,
      amount: 5,
      confirmed: 1,
    },
  ]);
}

module.exports = { reset };
