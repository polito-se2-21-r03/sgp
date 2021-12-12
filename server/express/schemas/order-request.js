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

exports.orderUpdateSchema = {
    "id": "/OrderUpdateSchema",
    "type": "object",
    "properties": {
        "clientId": {"type": "integer"},
        "status": {"type": "string"},
        "products": {
            "type": "array",
            "items": {
                "properties": {
                    "productId": { "type": "integer" },
                    "amount": { "type": "integer", "minimum": 1 },
                    "price": { "type": "number" }
                }
            }
        }
    },
    "required": ["clientId","status"]
};

exports.confirmOrderProductSchema = {
    "id": "/ConfirmOrderProductSchema",
    "type": "object",
    "properties": {
        "products": {
            "type": "array",
            "items": {
                "properties": {
                    "productId": { "type": "integer" },
                    "confirmed": { "type": "integer" },
                },
                "required": ["productId","confirmed"]
            }
        }
    },
    "required": ["products"]
};