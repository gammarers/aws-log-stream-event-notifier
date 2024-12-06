import { Duration } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';

export interface NotifierStateMachineStateMachineProps {
  readonly notificationTopic: sns.ITopic;
}

export class NotifierStateMachine extends sfn.StateMachine {

  constructor(scope: Construct, id: string, props: NotifierStateMachineStateMachineProps) {
    super(scope, id, {
      stateMachineName: undefined, // `lambda-func-log-subscription-notification-${random}-state-machine`,
      timeout: Duration.minutes(5),
      definitionBody: (() => {

        // 👇 Prepare Text Message When Error
        const prepareErrorTextMessage: sfn.Pass = new sfn.Pass(scope, 'PrepareErrorTextMessage', {
          parameters: {
            Subject: sfn.JsonPath.format('😵[{}] AWS Lambda Function Invocation {} Log Found [{}][{}]',
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.account'),
              sfn.JsonPath.stringAt('$.region'),
            ),
            Message: sfn.JsonPath.format('Account : {}\nRegion : {}\nLogGroup : {}\nLogStream : {}\nLogLevel : {}\nTimestamp : {}\nRequestId : {}\nErrorType : {}\nErrorMessage : {}\nStackTrace : \n{}',
              sfn.JsonPath.stringAt('$.account'),
              sfn.JsonPath.stringAt('$.region'),
              sfn.JsonPath.stringAt('$.detail.responsePayload.logGroup'),
              sfn.JsonPath.stringAt('$.detail.responsePayload.logStream'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.timestamp'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.requestId'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.message.errorType'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.message.errorMessage'),
              sfn.JsonPath.stringAt('$.Prepare.Concatenated.StackTrace'),
            ),
          },
          resultPath: '$.Prepare.Sns.Topic',
        });

        // 👇 Prepare Text Message When Other(Not Error)
        const prepareOtherTextMessage: sfn.Pass = new sfn.Pass(scope, 'PrepareOtherTextMessage', {
          parameters: {
            Subject: sfn.JsonPath.format('😵[{}] AWS Lambda Function Invocation {} Log Found [{}][{}]',
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.account'),
              sfn.JsonPath.stringAt('$.region'),
            ),
            Message: sfn.JsonPath.format('Account : {}\nRegion : {}\nLogGroup : {}\nLogStream : {}\nLogLevel : {}\nTimestamp : {}\nRequestId : {}\nMessage : {}',
              sfn.JsonPath.stringAt('$.account'),
              sfn.JsonPath.stringAt('$.region'),
              sfn.JsonPath.stringAt('$.detail.responsePayload.logGroup'),
              sfn.JsonPath.stringAt('$.detail.responsePayload.logStream'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.timestamp'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.requestId'),
              sfn.JsonPath.stringAt('$.Temp.Log.Parsed.message'),
            ),
          },
          resultPath: '$.Prepare.Sns.Topic',
        });

        // 👇 Init
        const init: sfn.Pass = new sfn.Pass(scope, 'Init', {
          result: sfn.Result.fromString(''),
          resultPath: '$.Prepare.Concatenated.StackTrace',
        });

        // 👇 Get Log Events from Unzip JSON for lambda
        const getLogEvents = new sfn.Pass(scope, 'GetLogEvents', {
          parameters: {
            Events: sfn.JsonPath.stringAt('$.detail.responsePayload.logEvents'),
          },
          resultPath: '$.Temp.Log',
        });

        init.next(getLogEvents);

        // 👇 Get Log Event Array first index
        const getLogEventDetail = new sfn.Pass(scope, 'GetLogEventDetail', {
          parameters: {
            Detail: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Temp.Log.Events'), 0),
          },
          resultPath: '$.Temp.Log.Event',
        });

        const checkUntreatedLogEventDetailExist: sfn.Choice = new sfn.Choice(scope, 'CheckUntreatedLogEventDetailExist')
          .when(sfn.Condition.isPresent('$.Temp.Log.Events[0]'), getLogEventDetail)
          .otherwise(new sfn.Succeed(scope, 'Succeed'));

        getLogEvents.next(checkUntreatedLogEventDetailExist);


        // 👇 String to JSON for Log Message
        const getLogEventMessage: sfn.Pass = new sfn.Pass(scope, 'GetLogEventMessage', {
          parameters: {
            Parsed: sfn.JsonPath.stringToJson(sfn.JsonPath.stringAt('$.Temp.Log.Event.Detail.message')),
          },
          resultPath: '$.Temp.Log',
        });

        getLogEventDetail.next(getLogEventMessage);

        // 👇 String to JSON for Log Message Stack Trace
        const getLogEventMessageStackTrace: sfn.Pass = new sfn.Pass(scope, 'GetLogEventMessageStackTrace', {
          parameters: {
            Lines: sfn.JsonPath.stringAt('$.Temp.Log.Parsed.message.stackTrace'),
          },
          resultPath: '$.Temp.StackTrace',
        });


        // 👇 Log level choice
        const logLevelChoice = new sfn.Choice(scope, 'LogLevelChoice')
          .when(
            sfn.Condition.stringEquals(sfn.JsonPath.stringAt('$.Temp.Log.Parsed.level'), 'ERROR'),
            getLogEventMessageStackTrace,
          )
          .otherwise(prepareOtherTextMessage);

        getLogEventMessage.next(logLevelChoice);

        // 👇 Get Log event message stack trace first line
        const getLogEventMessageStackTraceLine = new sfn.Pass(scope, 'GetLogEventMessageStackTraceLine', {
          parameters: {
            Line: sfn.JsonPath.arrayGetItem(sfn.JsonPath.stringAt('$.Temp.StackTrace.Lines'), 0),
          },
          resultPath: '$.Temp.GetStackTrace',
        });

        const checkUntreatedMessageStackTraceLinesExist: sfn.Choice = new sfn.Choice(scope, 'CheckUntreatedMessageStackTraceLinesExist')
          .when(sfn.Condition.isPresent('$.Temp.StackTrace.Lines[0]'), getLogEventMessageStackTraceLine)
          .otherwise(prepareErrorTextMessage);

        getLogEventMessageStackTrace.next(checkUntreatedMessageStackTraceLinesExist);

        // 👇 Concatnate stack trace line (formatting)
        const concatenateStackTraceLine: sfn.Pass = new sfn.Pass(scope, 'ConcatenateStackTraceLine', {
          parameters: {
            StackTrace: sfn.JsonPath.format('{}{}\n', sfn.JsonPath.stringAt('$.Prepare.Concatenated.StackTrace'), sfn.JsonPath.stringAt('$.Temp.GetStackTrace.Line')),
          },
          resultPath: '$.Prepare.Concatenated',
        });

        getLogEventMessageStackTraceLine.next(concatenateStackTraceLine);

        // 👇 Get untreate message trace lines
        const getUntreatedMessageTraceLines: sfn.Pass = new sfn.Pass(scope, 'UntreatedMessageTraceLines', {
          parameters: {
            Lines: sfn.JsonPath.stringAt('$.Temp.StackTrace.Lines[1:]'),
          },
          resultPath: '$.Temp.StackTrace',
        });

        concatenateStackTraceLine.next(getUntreatedMessageTraceLines);
        getUntreatedMessageTraceLines.next(checkUntreatedMessageStackTraceLinesExist);

        const sendNotification: tasks.SnsPublish = new tasks.SnsPublish(scope, 'SendNotification', {
          topic: props.notificationTopic,
          inputPath: '$.Prepare.Sns.Topic',
          subject: sfn.JsonPath.stringAt('$.Subject'),
          message: sfn.TaskInput.fromJsonPathAt('$.Message'),
          resultPath: '$.Result.Sns.Topic',
        });

        prepareErrorTextMessage.next(sendNotification);
        prepareOtherTextMessage.next(sendNotification);

        const getUntreatedMessages: sfn.Pass = new sfn.Pass(scope, 'GetUntreatedMessages', {
          parameters: {
            Lines: sfn.JsonPath.stringAt('$.TempStackTrace.Lines[1:]'),
          },
          resultPath: '$.TempStackTrace',
        });

        getUntreatedMessages.next(checkUntreatedLogEventDetailExist);

        sendNotification.next(getUntreatedMessages);

        return sfn.DefinitionBody.fromChainable(init);
      })(),
    });
  }
}