import React, { PureComponent } from 'react';

import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 70,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D9DADB',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  btnText: {
    fontSize: 15,
    color: '#9B9B9B',
    fontWeight: '100',
  },
});

export default class StartStopBtn extends PureComponent {
  opacity = new Animated.Value(1);

  hInterval = null;

  responsive = true;

  constructor(props) {
    super(props);
    this.state = {
      responsive: props.responsive,
    };
    this.onPress = ::this.onPress;
  }

  componentWillReceiveProps({ active }) {
    if (this.props.active !== active) {
      if (active) {
        this.startOnPress();
        return;
      }
      this.stopOnPress();
    }
  }

  componentDidUpdate() {
    this.stopOnPress();
  }

  onPress() {
    if (!this.responsive) return;

    this.startOnPress();
    this.props.onPress();
  }

  startOnPress() {
    if (this.hInterval) return;

    this.responsive = false;
    this.opacity.setValue(this.opacity._value / 2);
    this.hInterval = setInterval(() => {
      this.opacity.setValue(1.5 - this.opacity._value);
    }, 500);
  }

  stopOnPress() {
    this.responsive = true;
    this.opacity.setValue(1);
    clearInterval(this.hInterval);
    this.hInterval = null;
  }

  render() {
    const { active, responsive } = this.props;
    return (
      <TouchableOpacity
        style={styles.button}
        disabled={!responsive}
        onPress={this.onPress}
      >
        <Animated.View style={{ opacity: this.opacity }}>
          <Text style={styles.btnText}>
            {active ? 'STOP' : 'START' }
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
