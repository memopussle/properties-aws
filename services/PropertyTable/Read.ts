// insert data to dynamoDB table

import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
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
    // if queryStringParameters exists
    if (event.queryStringParameters) {
      //check if propertyId in query parameters
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await queryWithPrimaryPartition(event.queryStringParameters)
      } else {
        result.body = await queryWithSecondaryPartition(
          event.queryStringParameters
        );
         }
    } else {
      result.body = await scanTable();
    }
  
  } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }
console.log(result)
  return result;
};

// get all items
async function scanTable() {
  
  const queryResponse = await dbClient
    .scan({ TableName: TABLE_NAME! })
    .promise();
  return JSON.stringify(queryResponse);
}

async function queryWithSecondaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) { 
  const queryKey = Object.keys(queryParams)[0]; //status
  const queryValue = queryParams[queryKey];
  const queryResponse = await dbClient
    .query({
      TableName: TABLE_NAME!,
      IndexName: queryKey,
      KeyConditionExpression: "#zz = :zzzz", //-> endpoint: status=Pending
      ExpressionAttributeNames: {
        "#zz": queryKey, 
      },
      ExpressionAttributeValues: {
        ":zzzz": queryValue,
      },
    })
    .promise();
 return JSON.stringify(queryResponse.Items)
}

// read each item by propertyId query
async function queryWithPrimaryPartition(queryParams: APIGatewayProxyEventQueryStringParameters) {
const keyValue = queryParams[PRIMARY_KEY!];
const queryResponse = await dbClient
  .query({
    TableName: TABLE_NAME!,
    KeyConditionExpression: "#zz = :zzzz",
    ExpressionAttributeNames: {
      "#zz": PRIMARY_KEY!, // define the structure. ex: property=1234 -> property: PRIMARY_KEY
    },
    ExpressionAttributeValues: {
      ":zzzz": keyValue,
    },
  })
  .promise();
// convert queryResponse to JSON object
return JSON.stringify(queryResponse);
}

export { handler };
