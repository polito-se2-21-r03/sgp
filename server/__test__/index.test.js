const supertest = require('supertest');
const app = require('../express/app');
const { reset } = require('../setup');
const {models} = require("../sequelize");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Test model for non-API calls
 */
// describe("Testing the API", () => {
//   it("tests our testing framework if it works", () => {
//     expect(4).toBe(4);
//   });
// });

/**
 * Test model for API call
 */
// describe("Testing the movies API", () => {

//   it("tests the base route and returns true for status", async () => {

//     const response = await supertest(app).get('/');

//     expect(response.status).toBe(200);
//     expect(response.body.status).toBe(true);

//   });

//   // This is run after 
// 	afterEach(async () => {
// 		await Movies.deleteOne({
// 			title: 'New Movie'
// 		})
// 	})

// });

/**
 * Test get all products
 */
describe("Testing get all products", () => {

  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })

  it("tests the base route and returns an array of products", async () => {
    const response = await supertest(server).get('/api/product');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
     await server.close()
  })
});

/**
 * Test get all orders
 */
describe("Testing get all orders", () => {

  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })

  it("tests the base route and returns an array of orders", async () => {
    const response = await supertest(server).get('/api/order');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await server.close()
  })
});

/**
 * Test create order API
 */
describe("Testing the movies API", () => {

  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })

  it("tests the base route and returns true for status", async () => {
    const body = {
      "clientId": 1,
      "employeeId": 1,
      "products": [
        {
          "productId": 1,
          "amount": 3,
          "price": 3.4
        },
        {
          "productId": 2,
          "amount": 1,
          "price": 0.4
        }
      ]
    }
    const response = await supertest(server).post('/api/order').send(body)
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await server.close()
  })

});

describe("Test getClientById", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should get value from client table", async () => {
    const client = await models.client.findByPk(1);
    expect(client.id).toBe(1);
  })
  afterAll(async () => {
    await server.close()
  })
})

describe("Test getEmployeeById", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should get value from employee table", async () => {
    const employee = await models.employee.findByPk(1);
    expect(employee.id).toBe(1);
  })
  afterAll(async () => {
    await server.close()
  })
})

describe("Test checkProductAvailability", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should get integer", async () => {
    const productAvailability = await models.product.count({where: {id: 1, quantity: {[Op.gt]: 100}}});
    expect(productAvailability).toBe(1);
  })
  afterAll(async () => {
    await server.close()
  })
})

describe("Test insertOrderProduct", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should get boolean", async () => {
    const insertOrderProduct = await models.order_product.create({orderId: 2, productId: 2,amount: 20});
    expect(insertOrderProduct.orderId).toBe(2);
  })
  afterAll(async () => {
    await server.close()
  })
})




