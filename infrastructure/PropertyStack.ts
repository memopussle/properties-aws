import { Stack, StackProps } from "aws-cdk-lib";
import {
  Code,
  Function as LambdaFunction,
  Runtime,

} from "aws-cdk-lib/aws-lambda"; //Runtime = lambda.Runtime, Code = lambda.Ccode
import { Construct } from "constructs";
import { join } from "path";


export class PropertyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    // use scope and id from super class Stack
    super(scope, id, props);

      // create a lambda function in clouFormation called helloLambda
      const helloLambda = new LambdaFunction(this, 'helloLambda' , {
          runtime: Runtime.NODEJS_16_X,
          code: Code.fromAsset(join(__dirname, '..', 'services', 'hello')), // path to deployed file
          handler: 'hello.main'
      })
  }
}
