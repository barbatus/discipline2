// @flow
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { type Step } from 'react-native-copilot';

import CoSteps, { checkIfStepLast, checkIfStepFirst } from './steps';

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 3,
    overflow: 'hidden',
  },
  tooltipText: {},
  tooltipContainer: {
    flex: 1,
  },
  button: {
    padding: 10,
  },
  buttonText: {
    color: '#27ae60',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

const Button = (props) => (
  <View style={[styles.button]}>
    <Text style={[styles.buttonText]} {...props} />
  </View>
);

type Props = {
  handleNext: Function,
  handlePrev: Function,
  handleStop: Function,
  currentStep: Step,
};

const Tooltip = ({
  handleNext,
  handlePrev,
  handleStop,
  currentStep,
}: Props) => {
  const stepEnum = CoSteps.fromValue(currentStep.name);
  const isLastStep = checkIfStepLast(stepEnum);
  const isFirstStep = checkIfStepFirst(stepEnum);
  return (
    <View>
      <View style={styles.tooltipContainer}>
        <Text style={styles.tooltipText}>{currentStep.text}</Text>
      </View>
      <View style={styles.bottomBar}>
        {!isLastStep ? (
          <TouchableOpacity onPress={handleStop}>
            <Button>Skip</Button>
          </TouchableOpacity>
        ) : null}
        {!isFirstStep ? (
          <TouchableOpacity onPress={handlePrev}>
            <Button>Previous</Button>
          </TouchableOpacity>
        ) : null}
        {!isLastStep ? (
          <TouchableOpacity onPress={handleNext}>
            <Button>Next</Button>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleStop}>
            <Button>Ok</Button>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Tooltip;
