import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { CopilotStep as BaseCopilotStep } from '@okgrow/react-native-copilot';

const CopilotStep = React.memo(
  ({ step, children, ...rest }) => {
    const child = React.Children.only(children);
    return (
      <BaseCopilotStep text={step.title} order={step.order} name={step.value}>
        { cloneElement(child, rest) }
      </BaseCopilotStep>
    );
  }
);

CopilotStep.propTypes = {
  children: PropTypes.element.isRequired,
  step: PropTypes.shape({
    title: PropTypes.string,
    order: PropTypes.number,
    value: PropTypes.string,
  }).isRequired,
};

export default CopilotStep;
