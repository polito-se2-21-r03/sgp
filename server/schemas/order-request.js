exports.orderRequestSchema = {
    "id": "/OrderRequestSchema",
    "type": "object",
    "properties": {
        "employeeId": {"type": "integer"},
        "clientId": {"type": "integer"},
        "products": {
            "type": "array",
            "items": {
                "properties": {
                    "productId": { "type": "integer" },
                    "amount": { "type": "integer", "minimum": 1 },
                    "price": { "type": "number" }
                },
                "required": ["productId", "amount", "price"]
            }
        }
    },
    "required": ["employeeId", "clientId", "products"]
};