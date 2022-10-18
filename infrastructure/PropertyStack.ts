import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda"; //Runtime = lambda.Runtime, Code = lambda.Ccode
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";

export class PropertyStack extends Stack {
  private api = new RestApi(this, "PropertyApi"); // create a RestApi method

  //pas arguments to generictable : name, primaryKey, stack: this
  private propertyTable = new GenericTable("PropertyTable", "propertyId", this);

  constructor(scope: Construct, id: string, props: StackProps) {
    // use scope and id from super class Stack
    super(scope, id, props);

    // create a lambda function in clouFormation called helloLambda
    const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")), // path to deployed file
      handler: "hello.main",
    });

    // link helloLambda to API gateway : GET, PUT, POST, DELETE. like backend
    const helloLambdaIntergration = new LambdaIntegration(helloLambda);
    // https://19ufnv5k3b.execute-api.ap-southeast-2.amazonaws.com/prod/hello -> "hello from Lambda!"
    const helloLambdaResource = this.api.root.addResource("hello");
    // add get method
    helloLambdaResource.addMethod("GET", helloLambdaIntergration);
  }
}
