import React, { PureComponent } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';

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
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    active: PropTypes.bool.isRequired,
    responsive: PropTypes.bool.isRequired,
    enabled: PropTypes.bool,
  };

  static defaultProps = {
    enabled: true,
  };

  opacity = new Animated.Value(1);

  responsive = true;

  constructor(props) {
    super(props);
    this.onPress = ::this.onPress;
  }

  componentDidUpdate({ enabled, active }) {
    if (active !== this.props.active) {
      this.enable();
      return;
    }
    if (enabled !== this.props.enabled) {
      /* eslint-disable-next-line */
      (enabled ? this.enable() : this.disable());
    }
  }

  onPress() {
    if (!this.responsive) return;

    this.disable();
    this.props.onPress();
  }

  disable() {
    this.responsive = false;
    this.opacity.setValue(0.4);
  }

  enable() {
    this.responsive = true;
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
