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

  // seperate to organize logic. which function should be called first
  private initialize() {
    this.createTable();
    this.createLambdas();
    this.grantTableRights();
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

  private createLambdas() {
    // if createLambda path exists -> call createSingleLambda() -> createLambdaIntergration
    if (this.props.createLambdaPath) {
      this.createLambda = this.createSingleLambda(this.props.createLambdaPath);
      this.createLambdaIntergration = new LambdaIntegration(this.createLambda);
    }
    if (this.props.readLambdaPath) {
      this.readLambda = this.createSingleLambda(this.props.readLambdaPath);
      this.readLambdaIntergration = new LambdaIntegration(this.readLambda);
    }
    if (this.props.updateLambdaPath) {
      this.updateLambda = this.createSingleLambda(this.props.updateLambdaPath);
      this.updateLambdaIntergration = new LambdaIntegration(this.updateLambda);
    }
    if (this.props.deleteLambdaPath) {
      this.deleteLambda = this.createSingleLambda(this.props.deleteLambdaPath);
      this.deleteLambdaIntergration = new LambdaIntegration(this.deleteLambda);
    }
  }

  //grant right forlambdas to access table
  private grantTableRights() {
    if (this.createLambda) {
      this.table.grantWriteData(this.createLambda);
    }
    if (this.readLambda) {
      this.table.grantReadData(this.readLambda);
    }
    if (this.updateLambda) {
      this.table.grantWriteData(this.updateLambda);
    }
    if (this.deleteLambda) {
      this.table.grantWriteData(this.deleteLambda);
    }
  }

  // specify paths to files in PropertyTable dynamically
  // all variables can be found in class NodejsFunction document
  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = `${this.props.tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: join(
        __dirname,
        "..",
        "services",
        this.props.tableName,
        `${lambdaName}.ts`
      ),
      handler: "handler",
      functionName: lambdaId,
      environment: {
        TABLE_NAME: this.props.tableName,
        PRIMARY_KEY: this.props.primaryKey,
      },
    });
  }
}
