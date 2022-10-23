import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { join } from "path";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs"; // creates a Lambda function with automatic transpiling and bundling of TypeScript or Javascript code. 
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class PropertyStack extends Stack {
  private api = new RestApi(this, "PropertyApi"); // create a RestApi method

  //pass arguments to generictable : name, primaryKey, stack: this
  //private propertyTable = new GenericTable("PropertyTable", "propertyId", this);

  private propertyTable = new GenericTable(this, {
    tableName: "PropertyTable",
    primaryKey: "propertyId",
    createLambdaPath: "Create",
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    // use scope and id from super class Stack
    super(scope, id, props);

    //finding hello.ts file in PropertyTable
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

    // link helloLambda to API gateway. The input to the integrated Lambda function can be expressed as any combination of request headers, path variables, query string parameters, and body
    const helloLambdaIntergration = new LambdaIntegration(helloLambdaNodeJs);
    // https://19ufnv5k3b.execute-api.ap-southeast-2.amazonaws.com/prod/hello -> "hello from Lambda!"
    const helloLambdaResource = this.api.root.addResource("hello");
    // specify get method
    helloLambdaResource.addMethod("GET", helloLambdaIntergration);

    // Property intergration /deploy POST method
    const propertyResource = this.api.root.addResource("property");
    propertyResource.addMethod(
      "POST",
      this.propertyTable.createLambdaIntergration
    );
  }
}
