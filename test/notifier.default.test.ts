import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LogStreamEventNotifier } from '../src';

describe('LogStreamEventNotifier default Testing', () => {

  const app = new App();

  const stack = new Stack(app, 'Stack');

  const notificationTopic = new sns.Topic(stack, 'Topic');

  const requestFunction = new lambda.Function(stack, 'Function', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event, context) => JSON.parse("{}");'),
  });

  new LogStreamEventNotifier(stack, 'LogStreamEventNotifier', {
    notificationTopic,
    requestFunction,
  });

  const template = Template.fromStack(stack);

  it('Should have one iam role existing', async () => {
    // topic, fnction, states
    template.resourceCountIs('AWS::IAM::Role', 3);
  });

  it('Should have one state machine existing', async () => {
    template.resourceCountIs('AWS::StepFunctions::StateMachine', 1);
  });

  it('Should have one event rule existing', async () => {
    template.resourceCountIs('AWS::Events::Rule', 1);
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});
