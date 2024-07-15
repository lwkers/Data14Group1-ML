import json
import boto3
import time

# Create Athena client
athena_client = boto3.client('athena')

# Specify query location 
bucket = "data14group1-ml"
s3_output = f"s3://{bucket}/athena-query-outputs/"

def lambda_handler(event, context):
    
    # Get the user_id the input event
    input = json.loads(event['body'])
    user_id = input.get('user_id')
    print(user_id)

    # Specify database and table
    database = "ml"
    table = "test"
    
    if not user_id:
        return {
            'statusCode': 400,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                          "Access-Control-Allow-Methods": "POST,OPTIONS",
                          "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'user_id is required'})
        }
    
    # Construct the SQL query
    query = f"SELECT DISTINCT product_id, product_name, aisle, department FROM {table} WHERE user_id = {user_id};"
    
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
            rows = results['ResultSet']['Rows']
        
            # Initialize an empty list to store the formatted results
            formatted_results = []
            
            # Skip the header row (first row) and process each subsequent row
            for row in rows[1:]:
                data = [col.get('VarCharValue', '') for col in row['Data']]
                # Create a dictionary with 'id' and 'name' keys and append to the list
                formatted_results.append({'product_id': data[0], 'product_name': data[1], 'aisle': data[2], 'department':data[3]})
            
            # Print the formatted results
            print(formatted_results)
            
            # Optionally, you can return or further process the results
            return {
                'statusCode': 200,
                'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST,OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
                'body': json.dumps(formatted_results)
            }

        else:
            return {
                'statusCode': 500,
                'headers' : { "Access-Control-Allow-Origin" : "*",
                              "Access-Control-Allow-Methods": "POST,OPTIONS",
                              "Access-Control-Allow-Headers": "Content-Type"},
                'body': json.dumps({'error': 'Query failed or was cancelled.', 'state': state})
            }
    except athena_client.exceptions.InvalidRequestException as e:
        return {
            'statusCode': 400,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                          "Access-Control-Allow-Methods": "POST,OPTIONS",
                          "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'Invalid request', 'message': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers' : { "Access-Control-Allow-Origin" : "*",
                          "Access-Control-Allow-Methods": "POST,OPTIONS",
                          "Access-Control-Allow-Headers": "Content-Type"},
            'body': json.dumps({'error': 'Internal server error', 'message': str(e)})
        }