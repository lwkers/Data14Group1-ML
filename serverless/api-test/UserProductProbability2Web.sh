#!/bin/bash

# # data14group1
curl -X POST "https://a95gpboodl.execute-api.ap-southeast-2.amazonaws.com/dev/UserProductProbability2Web" \
    -H "Content-Type: application/json" \
    -d '{"user_id": "3", "product_id": "16797"}'
