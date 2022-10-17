import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class PropertyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    // use scope and id from super class Stack
      super(scope, id, props);
      
      
  }
}
