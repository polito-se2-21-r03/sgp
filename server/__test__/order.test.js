const supertest = require('supertest');
const app = require('../server');

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

    expect(response.status).toBe(503);

  });

  // This is run after 
  // afterEach(async () => {
  //   await Movies.deleteOne({
  //     title: 'New Movie'
  //   })
  // })

});

