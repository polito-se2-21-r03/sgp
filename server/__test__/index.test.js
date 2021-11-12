const supertest = require('supertest');
const app = require('../server');
const dao = require('../dao');

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
  it("tests the base route and returns an array of products", async () => {
    const response = await supertest(app).get('/api/product');
    expect(response.status).toBe(200);
  });
});

/**
 * Test get all orders
 */
describe("Testing get all orders", () => {
  it("tests the base route and returns an array of orders", async () => {
    const response = await supertest(app).get('/api/order');
    expect(response.status).toBe(200);
  });
});

/**
 * Test create order API
 */
describe("Testing the movies API", () => {
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
    const response = await supertest(app).post('/api/order').send(body)
    expect(response.status).toBe(200);
  });

  // This is run after 
  // afterEach(async () => {
  //   await Movies.deleteOne({
  //     title: 'New Movie'
  //   })
  // })

});

describe("Test getClientById", () => {  
  it("Should get value from client table", async () => {
    const client = await dao.getClientById(1);
    expect(client.clientId).toBe(1); 
  })
})

describe("Test getEmployeeById", () => {  
  it("Should get value from employee table", async () => {
    const employee = await dao.getEmployeeById(1);
    expect(employee.employeeId).toBe(1); 
  })
})

describe("Test checkProductAvailability", () => {  
  it("Should get boolean from product table", async () => {
    const productAvailability = await dao.checkProductAvailability(1, 100);
    expect(productAvailability).toBe(true); //verificare anche il caso false?
  })
})

describe("Test insertOrderProduct", () => {  
  it("Should get boolean from order_product table", async () => {
    const insertOrderProduct = await dao.insertOrderProduct(2, 2, 20)
    expect(insertOrderProduct).toBe(true); 
  })
})




