import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"; // use bundler nodejs to convert ts file to js
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class PropertyStack extends Stack {
  private api = new RestApi(this, "PropertyApi"); // create a RestApi method

  //pass arguments to generictable : name, primaryKey, stack: this
  //private propertyTable = new GenericTable("PropertyTable", "propertyId", this);

  private propertyTable = new GenericTable(this, {
    tableName: "PropertyTable",
    primaryKey: "propertyId",
    createLambdaPath: 'Create'
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    // use scope and id from super class Stack
    super(scope, id, props);

    // deploy hello.ts using node-lambda
    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    // give permission to lambda to list s3 buckets by IAM
    const s3ListPolicy = new PolicyStatement();

    //doc: s3 actions
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");
    // attach permission to helloLambda
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    // link helloLambda to API gateway : GET, PUT, POST, DELETE. like backend
    const helloLambdaIntergration = new LambdaIntegration(helloLambdaNodeJs);
    // https://19ufnv5k3b.execute-api.ap-southeast-2.amazonaws.com/prod/hello -> "hello from Lambda!"
    const helloLambdaResource = this.api.root.addResource("hello");
    // add get method
    helloLambdaResource.addMethod("GET", helloLambdaIntergration);
  }
}
