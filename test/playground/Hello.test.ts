import {  APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/PropertyTable/Read'

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    propertyId: 'a379fcd8-48eb-450f-ad76-350616f2a583'
  } 
} as any // passing event as argument in handler function



const result = handler(event, {} as any).then((apiResult) => {
  const item = JSON.parse(apiResult.body)
  console.log(123);
})