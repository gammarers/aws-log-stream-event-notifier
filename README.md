# AWS Log Stream Event Notifier

[![GitHub](https://img.shields.io/github/license/gammarers/aws-log-stream-event-notifier?style=flat-square)](https://github.com/gammarers/aws-log-stream-event-notifier/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-log-stream-event-notifier?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-log-stream-event-notifier)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-log-stream-event-notifier/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-log-stream-event-notifier/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-log-stream-event-notifier?sort=semver&style=flat-square)](https://github.com/gammarers/aws-log-stream-event-notifier/releases)

This AWS CDK Construct detects logs specified by a CloudWatch Logs subscription filter, parses them into JSON on the Lambda side, passes the parsed content to EventBridge, and routes it to a Step Functions state machine. The state machine then publishes the log content to SNS Topic.

## Install

### TypeScript

#### install by npm

```shell
npm install @gammarers/aws-log-stream-event-notifier
```

#### install by yarn

```shell
yarn add @gammarers/aws-log-stream-event-notifier
```

## Example

```typescript
import { LogStreamEventTrigger } from '@gammarers/aws-log-stream-event-notifier';

declare const notificationTopic: sns.Topic;
declare const requestFunction: lambda.Function;

new LogStreamEventNotifier(stack, 'LogStreamEventNotifier', {
  notificationTopic,
  requestFunction,
});

```

## License

This project is licensed under the Apache-2.0 License.