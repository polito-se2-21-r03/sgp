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

  it("tests the base route and returns an array of orders", async () => {
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
describe("Testing ", () => {

  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })

  it("Insert a new order should return code 200", async () => {
    const body = {
      "clientId": 1,
      "employeeId": 1,
      "products": [
        {
          name: 'uova',
          producerId: 1,
          quantity: 50,
          type: 'BIO',
          price: 1.2},
        {
          name: 'pomodoro',
          producerId: 1,
          quantity: 20,
          type: 'BIO',
          price: 1.2
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
    const client = await models.user.findByPk(1);
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
    const employee = await models.user.findOne({where: {role: "EMPLOYEE", id: 5}});
    expect(employee.email).toBe('robert@email.com');
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
  it("Should get orderId", async () => {
    const insertOrderProduct = await models.order_product.create({orderId: 2, productId: 2,amount: 20});
    expect(insertOrderProduct.orderId).toBe(2);
  })
  afterAll(async () => {
    await server.close()
  })
})


describe("Test getAll from wallet", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("tests the base route and returns an array of wallets", async () => {
    const response = await supertest(server).get('/api/wallet');
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    await server.close()
  })
})

describe("Test update wallet", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
    
  
  })
  it("tests the base route and return a wallet updated", async () => {
    body = {credit: 300};
    const response = await supertest(server).put('/api/wallet/1').send(body);
    expect(response.status).toBe(200);
  });
  afterAll(async () => {
    await server.close()
  })
})

describe("Test body validation for wallet update", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
    
  
  })
  it("tests the body of req and return with error for body not valid", async () => {
    body = {createdAt: 200 };
    const response = await supertest(server).put('/api/wallet/1').send(body);
    expect(response.status).toBe(422);
  });
  afterAll(async () => {
    await server.close()
  })
})


describe("Test update wallet for valid client", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
    
  
  })
  it("tests update of wallet for not valid client and return with error", async () => {
    const response = await models.wallet.findOne({where: {userId: 20}});
    expect(response).toBe(null);
  });
  afterAll(async () => {
    await server.close()
  })
})


describe("Test client creation", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should return userId", async () => {
    body = ({
      password: "passWord",
      email: "mario@email.com",
      firstname: "Mario",
      lastname: "Rossi",
      is_tmp_password: 0,
      role: "CLIENT",
      createdAt: Date.now(),
    });
    const response = await models.user.create(body);
    expect(response.id).toBe(6);
  })
  afterAll(async () => {
    await server.close()
  })
})

describe("Test body validation of client creation", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("Should return userId", async () => {
    const body = {
      "clientId": 1,
      "employeeId": 1,
      "products": [
        {
          name: 'uova',
          producerId: 1,
          quantity: 50,
          type: 'BIO',
          price: 1.2},
        {
          name: 'pomodoro',
          producerId: 1,
          quantity: 20,
          type: 'BIO',
          price: 1.2
        }
      ]
    }
    const response = await supertest(server).post('/api/user').send(body);
    expect(response.status).toBe(422); //come si fa?
  })
  afterAll(async () => {
    await server.close()
  })
})


describe("Test getAll from client", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("tests the get from user to filter only clients", async () => {
    const clients = await models.user.count({where: {role: 'CLIENT'}})
    expect(clients).toBe(3); 
  });
  afterAll(async () => {
    await server.close()
  })
})



describe("Test email that already exists", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("tests the get from user to search the email amoung the registered clients", async () => {
    const client = await models.user.findByPk('maria@email.com') //la Pk è l'userId non l'email, come faccio a inserire l'email?
    expect(client.id).toBe(3); 
  });
  afterAll(async () => {
    await server.close()
  })
})



describe("Test association wallet to new client", () => {
  let server = null;

  beforeAll(async () => {
    await reset();
    server = app.listen(3001, () => console.log('Listening on port 3001'));
  })
  it("tests the creation of wallet for new registered client and return id of new wallet", async () => {
    const response = await models.wallet.create({userEmail: 'john@email.com', credit: 0 })
    expect(response.id).toBe(4); 
  });
  afterAll(async () => {
    await server.close()
  })
})








