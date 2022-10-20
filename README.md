## Lambda Problem

- Deploy implementation and dependencies
- Transform TS into JS

- TS files -> JS have been taken care of by ts-node, but not hello.js

## Solutions:

1. Monorepo:

- deploy the node modules
- hard distinction between Lambdas

2. Node Lambda - Amazon Lambda Node.js Library ( this project uses this solution)

3. Webpack

- initial difficult configuration
- small and fast bundles

### Node Lambda

```sh
npm install --save-dev esbuild@0
```


## CloudWatch

- Everytime Lambda is executed, it will create a log in CloudWatch
- It will record everything happen in execution 
- We can use it to debug or when things don't work

## AWS SDK (Software Development Kit)

- AWS SDK helps simplify coding by providing JavaScript objects for AWS Services. It allows developers **access AWS from Javascript Code**