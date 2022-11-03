import { DynamoDB } from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
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
    // get propertyId
    const propertyId = event.queryStringParameters?.[PRIMARY_KEY];

    if (propertyId) {
      const deleteResult = await dbClient
        .delete({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: propertyId, // specify the propertyId to delete that item
          },
        })
        .promise();
      result.body = JSON.stringify(deleteResult);
    }
  } catch (error) {
    if (error instanceof Error)
      result.body = JSON.stringify({ message: error.message });
  }

  return result;
};

export { handler };
