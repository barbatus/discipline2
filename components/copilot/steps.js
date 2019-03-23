import { first, last } from 'lodash';
import Enum from 'app/depot/Enum';

const CopilotStepEnum = new Enum({
  CREATE_FIRST: {
    value: 'CREATE_FIRST',
    order: 1,
    title: 'Create Your First Tracker!',
  },
  ADD_ICON: {
    value: 'ADD_ICON',
    order: 2,
    title: 'Add an icon to make your tracker pretty :)',
  },
});

export const CopilotScreenEnum = new Enum({
  EMPTY: {
    value: 'EMPTY_APP',
    steps: [CopilotStepEnum.CREATE_FIRST],
  },
  FIRST_TRACKER: {
    value: 'FIRST_TRACKER',
    steps: [CopilotStepEnum.ADD_ICON],
  },
});

export function checkIfStepLast(step) {
  const screens = CopilotScreenEnum.symbols();
  const parent = screens.find((screen) => screen.steps.includes(step));
  return last(parent.steps) === step;
}

export function checkIfStepFirst(step) {
  const screens = CopilotScreenEnum.symbols();
  const parent = screens.find((screen) => screen.steps.includes(step));
  return first(parent.steps) === step;
}

export function getScreenByStep(step) {
  const screens = CopilotScreenEnum.symbols();
  return screens.find((screen) => screen.steps.includes(step));
}

export default CopilotStepEnum;
