import { v4 } from "uuid";


async function handler(event: any, context: any) {
    return {
        statusCode: 200,
        body: "Hello from Lambda!" + v4() // generate a random string
    }
}

export {handler}