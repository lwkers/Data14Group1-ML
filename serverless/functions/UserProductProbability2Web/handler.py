import json
import boto3
import time

# Create Athena client
athena_client = boto3.client('athena')
# The SageMaker runtime is what allows us to invoke the endpoint that we've created.
sage_runtime = boto3.Session().client('sagemaker-runtime')

# Specify query location 
bucket = "data14group1-ml"
s3_output = f"s3://{bucket}/athena-query-outputs/"

def lambda_handler(event, context):
    # Get the user_id the input event
    input = json.loads(event['body'])
    user_id = input.get('user_id')
    product_id = input.get('product_id')
    
    # Specify database and table
    database = "ml"
    table = "test"
    # Speicify the model endpoint
    endpoint_name = 'sagemaker-xgboost-2024-07-12-06-40-44-418'
    
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'user_id is required'})
        }
    elif not product_id:
        return {
            'statusCode': 400,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'product_id is required'})
        }
    
    columns = "user_orders,\
               user_sum_days_since_prior,\
               user_mean_days_since_prior,\
               user_total_products,\
               user_distinct_products,\
               user_reorder_ratio,\
               up_orders,\
               up_first_order,\
               up_last_order,\
               up_average_cart_position,\
               prod_orders,\
               prod_reorder_probability,\
               prod_reorder_times,\
               prod_reorder_ratio,\
               user_average_basket,\
               up_order_rate,\
               up_orders_since_last_order,\
               up_order_rate_since_first_order"

    
    # Construct the SQL query
    #query = f"SHOW COLUMNS FROM {table}";
    query = f"SELECT {columns} FROM {table} WHERE user_id = {user_id} AND product_id = {product_id};"
    print(query)
    
    try:
        # Start query execution
        response = athena_client.start_query_execution(
            QueryString=query,
            QueryExecutionContext={'Database': database},
            ResultConfiguration={'OutputLocation': s3_output}
        )
        
        query_execution_id = response['QueryExecutionId']
        
        # Wait for the query to complete
        while True:
            response = athena_client.get_query_execution(QueryExecutionId=query_execution_id)
            state = response['QueryExecution']['Status']['State']
            
            if state in ['SUCCEEDED', 'FAILED', 'CANCELLED']:
                break
            
            time.sleep(2)
        
        if state == 'SUCCEEDED':
            print('SUCCEEDED')
            results = athena_client.get_query_results(QueryExecutionId=query_execution_id)
            
            # Obtain query output
            rows = results['ResultSet']['Rows']
            data = [[col.get('VarCharValue', '') for col in row['Data']] for row in rows[1:]]
            
            features = ','.join(data[0])
            # http://localhost:3000
            
            if not features:
                return {
                  'statusCode': 200,
                  'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
                  'body': json.dumps({'error': 'No matching record found'})
                }
            
            # Now we use the SageMaker runtime to invoke our endpoint, sending the review we were given
            response = sage_runtime.invoke_endpoint(EndpointName = endpoint_name,# The name of the endpoint we created
                                                    ContentType = 'text/csv',                 # The data format that is expected
                                                    Body = features
                                                    )

            # The response is an HTTP response whose body contains the result of our inference
            result = response['Body'].read().decode('utf-8')

            # Round the result so that our web app only gets '1' or '0' as a response.
            result = float(result)
            #'Content-Type' : 'text/plain',
            return {
                'statusCode' : 200,
                'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
                'body' : str(result)
            }
        else:
            return {
                'statusCode': 500,
                'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
                'body': json.dumps({'error': 'Query failed or was cancelled.', 'state': state})
            }
    except athena_client.exceptions.InvalidRequestException as e:
        return {
            'statusCode': 400,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'Invalid request', 'message': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST, OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'Internal server error', 'message': str(e)})
        }

