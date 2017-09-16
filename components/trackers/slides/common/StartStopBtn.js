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

  responsive = true;

  constructor(props) {
    super(props);
    this.state = {
      responsive: props.responsive,
    };
    this.onPress = ::this.onPress;
    const flicker = new Animated.timing(this.opacity,
      { duration: 800, toValue: 0.4, useNativeDriver: true });
    this.flickerAnim = Animated.loop(flicker);
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
    this.responsive = false;
    this.flickerAnim.start();
  }

  stopOnPress() {
    this.responsive = true;
    this.flickerAnim.stop();
    this.opacity.setValue(1);
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
            {active ? 'STOP' : 'START'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}
