import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../services/PropertyTable/Create";

const event: APIGatewayProxyEvent = {

  body: {
    status: "someName",
    address: "dunedine"
  },
} as any; // passing event as argument in handler function

const result = handler(event, {} as any).then((apiResult) => {
  const item = JSON.parse(apiResult.body);
  console.log(123);
});
