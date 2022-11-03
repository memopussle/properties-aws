// insert data to dynamoDB table

import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda"; // Lambda Proxy Intergration: intergrate API route with lambda function
import { generateRandomId, getEventBody } from "../Shared/Utils";
import {
  MissingFieldError,
  validateAsPropertyEntry,
} from "../Shared/InputValidator";
import { addCorsHeader } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient(); //Creates a DynamoDB document client with a set of configuration options.

const handler = async (
  event: APIGatewayProxyEvent,
  content: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "hello from dynamodb",
  };
  addCorsHeader(result);

  try {
    // insert item to dynamodb table
    const item = getEventBody(event);

    item.propertyId = generateRandomId(); // create a key propertyId in item
    //-> {address:'...', propertyId: ".."}

    // validate the new item
    validateAsPropertyEntry(item);

    //DocumentClient.put() : see DocumentClient.put() aws document
    await dbClient.put({ TableName: TABLE_NAME!, Item: item }).promise();
    result.body = JSON.stringify({
      id: item.propertyId,
    }); // result.body response
  } catch (error) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }

    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }

  return result;
};

export { handler };
