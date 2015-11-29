'use strict';

const React = require('react-native');
const {
  StyleSheet,
  View,
  Component,
  Animated
} = React;

class ScreenView extends Component {
  constructor(props) {
    super(props);

    let posX = props.posX || 0;
    this.state = {
      moveX: new Animated.Value(posX),
      opacity: new Animated.Value(1)
    };
  }

  get posX() {
    return this.state.moveX;
  }

  get opacity() {
    return this.state.opacity;
  }

  render() {
    return (
      <Animated.View style={[
          styles.viewContainer, {
            opacity: this.state.opacity,
            transform: [{
                translateX: this.state.moveX.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-400, 0, 400]
              })
            }]
          }
        ]}>
        {this.props.content}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }
});

module.exports = ScreenView;
