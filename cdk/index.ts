import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { Runtime } from '@aws-cdk/aws-lambda';
import { LogGroup, RetentionDays } from '@aws-cdk/aws-logs';
import { PolicyStatement } from '@aws-cdk/aws-iam';

const app = new App();

const stack = new Stack(app, 'Stack', {
  stackName: 'codecommit-auto-build',
});

const handler = new NodejsFunction(stack, 'Handler', {
  entry: 'src/index.ts',
  runtime: Runtime.NODEJS_14_X,
  bundling: {
    minify: true,
    sourceMap: true,
  },
  environment: {
    NODE_OPTIONS: '--enable-source-maps',
  },
});

handler.addToRolePolicy(new PolicyStatement({
  actions: [
    'codecommit:ListTagsForResource',
    'codebuild:StartBuild',
  ],
  resources: [
    stack.formatArn({
      service: 'codecommit',
      resource: '*',
    }),
    stack.formatArn({
      service: 'codebuild',
      resource: 'project',
      resourceName: '*',
    }),
  ],
}));

new LogGroup(handler, 'LogGroup', {
  logGroupName: `/aws/lambda/${handler.functionName}`,
  retention: RetentionDays.ONE_DAY,
  removalPolicy: RemovalPolicy.DESTROY,
});
