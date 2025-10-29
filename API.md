# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### LogStreamEventNotifier <a name="LogStreamEventNotifier" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier"></a>

#### Initializers <a name="Initializers" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer"></a>

```typescript
import { LogStreamEventNotifier } from '@gammarers/aws-log-stream-event-notifier'

new LogStreamEventNotifier(scope: Construct, id: string, props: LogStreamEventNotifierProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.props">props</a></code> | <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps">LogStreamEventNotifierProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.Initializer.parameter.props"></a>

- *Type:* <a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps">LogStreamEventNotifierProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.isConstruct"></a>

```typescript
import { LogStreamEventNotifier } from '@gammarers/aws-log-stream-event-notifier'

LogStreamEventNotifier.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifier.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### LogStreamEventNotifierProps <a name="LogStreamEventNotifierProps" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps"></a>

#### Initializer <a name="Initializer" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps.Initializer"></a>

```typescript
import { LogStreamEventNotifierProps } from '@gammarers/aws-log-stream-event-notifier'

const logStreamEventNotifierProps: LogStreamEventNotifierProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps.property.notificationTopic">notificationTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | *No description.* |
| <code><a href="#@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps.property.requestFunction">requestFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | *No description.* |

---

##### `notificationTopic`<sup>Required</sup> <a name="notificationTopic" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps.property.notificationTopic"></a>

```typescript
public readonly notificationTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

---

##### `requestFunction`<sup>Required</sup> <a name="requestFunction" id="@gammarers/aws-log-stream-event-notifier.LogStreamEventNotifierProps.property.requestFunction"></a>

```typescript
public readonly requestFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

---



