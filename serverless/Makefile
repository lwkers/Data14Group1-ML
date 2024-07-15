ENVIRONMENT=dev

deploy:
	sls deploy --stage ${ENVIRONMENT} --verbose

package:
	sls package --stage ${ENVIRONMENT}

test-user:
	serverless invoke --function UserProducts2Web --stage ${ENVIRONMENT} --path event/user_id.json
test-prob:
	serverless invoke --function UserProductProbability2Web --stage ${ENVIRONMENT} --path event/user_product_id.json

remove:
# The S3 event bucket created by serverless.yml needs to be emptyed before run the following remove command.
	sls remove --stage ${ENVIRONMENT}