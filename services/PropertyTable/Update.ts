import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { getEventBody } from "../Shared/Utils";
import { addCorsHeader } from "../Shared/Utils";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

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
    //request body:
    // queryStringParameters: {
    //   status: "Pending";
    //}
    const requestBody = getEventBody(event);
    const propertyId = event.queryStringParameters?.[PRIMARY_KEY]; // only get propertyId if event.queryStringParameters exists

    if (requestBody && propertyId) {
      const requestBodyKey = Object.keys(requestBody)[0];
      const requestBodyValue = requestBody[requestBodyKey];

      //provide property id
      const updateResult = await dbClient
        .update({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: propertyId,
          },
          UpdateExpression: "set #zzzNew = :new",
          ExpressionAttributeValues: {
            ":new": requestBodyValue,
          },
          ExpressionAttributeNames: {
            "#zzzNew": requestBodyKey,
          },
          ReturnValues: "UPDATED_NEW",
        })
        .promise();
      result.body = JSON.stringify(updateResult);
    }
  } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }

  return result;
};

export { handler };
