import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LogStreamEventNotifier } from '../src';

describe('LogStreamEventNotifier default Testing', () => {

  const app = new App();

  const stack = new Stack(app, 'Stack');

  new LogStreamEventNotifier(stack, 'LogStreamEventNotifier');

  const template = Template.fromStack(stack);

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot();
  });
});
