import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { NotifierStateMachine } from './resources/notifier-state-machine';


export interface LogStreamEventNotifierProps {
  readonly notificationTopic: sns.ITopic;
  readonly requestFunction: lambda.IFunction;
}

export class LogStreamEventNotifier extends Construct {

  constructor(scope: Construct, id: string, props: LogStreamEventNotifierProps) {
    super(scope, id);

    const machine = new NotifierStateMachine(this, 'NotifierStateMachine', {
      notificationTopic: props.notificationTopic,
    });

    // Lambda Function Invocation Success EventBridge Rule
    new events.Rule(this, 'LambdaFunctionLogSubscriptionFuncSuccessRule', {
      // ruleName: `lambda-func-log-subscription-${random}-func-success-rule`,
      eventPattern: {
        source: ['lambda'],
        detailType: ['Lambda Function Invocation Result - Success'],
        detail: {
          requestContext: {
            functionArn: [{
              wildcard: `${props.requestFunction.functionArn}:*`,
            }],
          },
        },
      },
      targets: [
        new targets.SfnStateMachine(machine, {
          role: new iam.Role(this, 'StartExecMachineRole', {
            // roleName: `log-notification-start-exec-machine-${random}-role`,
            description: 'lambda func log subscription notification start exec machine (send notification).',
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
            inlinePolicies: {
              'states-start-execution-policy': new iam.PolicyDocument({
                statements: [
                  new iam.PolicyStatement({
                    effect: iam.Effect.ALLOW,
                    actions: [
                      'states:StartExecution',
                    ],
                    resources: ['*'],
                  }),
                ],
              }),
            },
          }),
        }),
      ],
    });
  }

}