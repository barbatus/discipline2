
import React, { cloneElement } from 'react';
import { pure } from 'recompose';
import { CopilotStep as BaseCopilotStep } from '@okgrow/react-native-copilot';

const CopilotStep = pure(
  ({ step, children, ...rest }) => {
    const child = React.Children.only(children);
    return (
      <BaseCopilotStep text={step.title} order={step.order} name={step.value}>
        { cloneElement(child, rest) }
      </BaseCopilotStep>
    );
  }
);

export default CopilotStep;
