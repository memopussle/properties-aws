// insert data to dynamoDB table

import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda"; // Lambda Proxy Intergration: intergrate API route with lambda function
import { v4 } from "uuid";

const dbClient = new DynamoDB.DocumentClient(); //Creates a DynamoDB document client with a set of configuration options.

const handler = async(
  event: APIGatewayProxyEvent,
  content: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from dynamodb",
  };

  // insert this item to dynamodb table
  const item = {
    propertyId: v4(), // id needs to be unique string
  };

    try {
      //DocumentClient.put() : see DocumentClient.put() aws document
      await dbClient.put({ TableName: "PropertyTable", Item: item }).promise();
    } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }
  return result;
}

export { handler };
