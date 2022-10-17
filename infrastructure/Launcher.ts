import { PropertyStack } from "./PropertyStack";
import { App } from "aws-cdk-lib";

const app = new App();
new PropertyStack(app, "Property-reserve", {
  stackName: "PropertyReserve",
}); // inialize PropertyStack
