exports.clientRequestSchema = {
    "id": "/ClientRequestSchema",
    "type": "object",
    "properties": {
        "firstname": {"type": "string"},
        "lastname": {"type": "string"},
        "password": {"type": "string"},
        "email": {"type": "string"},
        "is_tmp_password": {"type": "integer"},
    },
    "required": ["email", "password", "is_tmp_password"]
};