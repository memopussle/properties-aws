import { Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";

// GenericTable is used to declutter PropertyStack.ts. dedicate to make a table in dynamodb table

// declare types of create, read, delete, update
export interface TableProps {
  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
  tableName: string;
  primaryKey: string;
}

export class GenericTable {
  //link all files in PropertyTable to GenericTable

  private stack: Stack;
  private props: TableProps;
  private table: Table;

  private createLambda: NodejsFunction | undefined;
  private readLambda: NodejsFunction | undefined;
  private updateLambda: NodejsFunction | undefined;
  private deleteLambda: NodejsFunction | undefined;

    // create lambda intergration for each method
  public createLambdaIntergration: LambdaIntegration;
  public readLambdaIntergration: LambdaIntegration;
  public updateLambdaIntergration: LambdaIntegration;
  public deleteLambdaIntergration: LambdaIntegration;

  // assign the values GenericTable to this constructor
  public constructor(stack: Stack, props: TableProps) {
    this.stack = stack;
    this.props = props;
    this.initialize();
  }

  // seperate to organize logic
  private initialize() {
    this.createTable();
  }

  //doc: aws-cdk/aws-dynamodb. create a new dynamodb table with dynamic values based on files linking to dynamodb
  private createTable() {
    this.table = new Table(this.stack, this.props.tableName, {
      partitionKey: {
        name: this.props.primaryKey,
        type: AttributeType.STRING,
      },
      tableName: this.props.tableName,
    });
  }


  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = `${this.props.tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(
        __dirname,
        "..",
        "services",
        this.props.tableName,
        `${lambdaName}.ts` // specify path to our files in services
      ),
      handler: "handler",
    });
  }
}
