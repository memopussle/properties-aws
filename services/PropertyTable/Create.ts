// insert data to dynamoDB table

import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda"; // Lambda Proxy Intergration: intergrate API route with lambda function
import { v4 } from "uuid";

const dbClient = new DynamoDB.DocumentClient(); //Creates a DynamoDB document client with a set of configuration options.

const handler = async (
  event: APIGatewayProxyEvent,
  content: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from dynamodb",
  };

  // insert item to dynamodb table
  const item =
    typeof event.body === "object" ? event.body : JSON.parse(event.body); // JSON.parse: convert JSON object to JS object
  item.propertyId = v4(); // create a key propertyId in item
  //-> {address:'...', propertyId: ".."}

  try {
    //DocumentClient.put() : see DocumentClient.put() aws document
    await dbClient.put({ TableName: "PropertyTable", Item: item }).promise();
  } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }

  result.body = JSON.stringify(`Created item with id: ${item.propertyId}`); // result.body response
  return result;
};

export { handler };
