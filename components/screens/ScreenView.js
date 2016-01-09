'use strict';

const React = require('react-native');
const {
  StyleSheet,
  View,
  Component,
  Animated
} = React;

const { commonStyles } = require('../styles/common');

class ScreenView extends Component {
  constructor(props) {
    super(props);

    let posX = props.posX || 0;
    let opacity = posX === 0 ? 1 : 0;
    this._moveX = new Animated.Value(posX);
    this._opacity = new Animated.Value(opacity);
  }

  get posX() {
    return this._moveX;
  }

  get opacity() {
    return this._opacity;
  }

  render() {
    return (
      <Animated.View
        shouldRasterizeIOS={true}
        style={[
          commonStyles.absoluteFilled, {
            opacity: this._opacity,
            transform: [{
              translateX: this._moveX.interpolate({
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

ScreenView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

module.exports = ScreenView;
