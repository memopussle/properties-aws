import { Stack } from "aws-cdk-lib";
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb"


// GenericTable is used to declutter PropertyStack.ts. dedicate to make a table in dynamodb table


export class GenericTable {
    private name: string;
    private primaryKey: string;
    private stack: Stack;
    private table: Table;

    // assign the types for each arguments
    public constructor(name: string, primaryKey: string, stack: Stack) {
        this.name = name;
        this.primaryKey = primaryKey;
        this.stack = stack;
        this.initialize()
    }

    // seperate to organize logic
    private initialize() {
        this.createTable()
    }

    //doc: aws-cdk/aws-dynamodb
    private createTable() {
        this.table = new Table(this.stack, this.name, {
            partitionKey: {
                name: this.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this.name
        })
    }
}
