# AWS Log Stream Event Notifier

[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-log-stream-event-notifier/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-log-stream-event-notifier/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-log-stream-event-notifier?sort=semver&style=flat-square)](https://github.com/gammarers/aws-log-stream-event-notifier/releases)

This AWS CDK Construct detects logs specified by a CloudWatch Logs subscription filter, parses them into JSON on the Lambda side, passes the parsed content to EventBridge, and routes it to a Step Functions state machine. The state machine then publishes the log content to SNS Topic.

## Install

### TypeScript

#### install by npm

```shell
npm install @gammarer/aws-log-stream-event-notifier
```

#### install by yarn

```shell
yarn add @gammarer/aws-log-stream-event-notifier
```

## Example

```typescript
import { LogStreamEventTrigger } from '@gammarer/aws-log-stream-event-notifier';

declare const notificationTopic: sns.Topic;
declare const requestFunction: lambda.Function;

new LogStreamEventNotifier(stack, 'LogStreamEventNotifier', {
  notificationTopic,
  requestFunction,
});

```

## License

This project is licensed under the Apache-2.0 License.