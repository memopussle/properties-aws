// insert data to dynamoDB table

import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda"; // Lambda Proxy Intergration: intergrate API route with lambda function

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient(); //Creates a DynamoDB document client with a set of configuration options.

const handler = async (
  event: APIGatewayProxyEvent,
  content: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from dynamodb",
  };

  try {
    // get item by id query
    if (event.queryStringParameters) {
      //check if propertyId in query parameters
      if (PRIMARY_KEY! in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[PRIMARY_KEY!];
        const queryResponse = await dbClient
          .query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: "#zz = :zzzz",
            ExpressionAttributeNames: {
              "#zz": PRIMARY_KEY!, // define the structure. ex: property=1234 -> property: PRIMARY_KEY
            },
            ExpressionAttributeValues: {
              ":zzzz": keyValue
            }
          })
          .promise();
        // convert queryResponse to JSON object
        result.body = JSON.stringify(queryResponse)
         }
    } else {
      // scan: returns all items
      const queryResponse = await dbClient
        .scan({ TableName: TABLE_NAME! })
        .promise();
      result.body = JSON.stringify(queryResponse);
    }
  
  } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }
console.log(result)
  return result;
};

export { handler };
