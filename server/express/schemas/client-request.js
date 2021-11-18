exports.clientRequestSchema = {
    "id": "/ClientRequestSchema",
    "type": "object",
    "properties": {
        "walletId": {"type": "integer"},
        "userId": {"type": "integer"},
        "name": {"type": "string"}
    },
    "required": ["walletId", "userId", "name"]
};