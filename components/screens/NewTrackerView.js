'use strict';

const React = require('react-native');
const {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Component,
  Animated
} = React;

const {
  NavCancelButton,
  NavAcceptButton,
  NavBackButton
} = require('../nav/buttons');

const ScreenView = require('./ScreenView');

const NewTrackerSlide = require('../trackers/NewTrackerSlide');
const TrackerTypesSlide = require('../trackers/TrackerTypesSlide');

const Trackers = require('../../trackers/Trackers');

class NewTrackerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trackerTypeId: null,
      newSlideX: new Animated.Value(0),
      newSlideOp: new Animated.Value(1),
      typeSlideX: new Animated.Value(1),
      typeOp: new Animated.Value(1)
    }
  }

  moveLeft(callback) {
    this._newTrackerView.posX.setValue(1);
    this._newTrackerView.opacity.setValue(1);

    Animated.timing(this._newTrackerView.posX, {
      duration: 1000,
      toValue: 0
    }).start(() => {
      this._setNewTrackerBtns();

      if (callback) {
        callback();
      }
    });
  }

  moveRight(callback) {
    Animated.timing(this._newTrackerView.posX, {
      duration: 1000,
      toValue: 1
    }).start(callback);
  }

  setOpacity(value, animated, callback) {
    if (animated) {
      Animated.timing(this._newTrackerView.opacity, {
        duration: 1000,
        toValue: value
      }).start(callback);
    } else {
      this._newTrackerView.opacity.setValue(value);
    }
  }

  _getCancelBtn(onPress) {
    return (
      <NavCancelButton onPress={onPress} />
    );
  }

  _getAcceptBtn(onPress) {
    return (
      <NavAcceptButton onPress={onPress.bind(this)} />
    );
  }

  _getBackBtn(onPress) {
    return (
      <NavBackButton onPress={onPress.bind(this)} />
    );
  }

  _setNewTrackerBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('New Tracker');
      navBar.setButtons(
        this._getCancelBtn(this.props.onCancel),
        this._getAcceptBtn(this._onAccept));
    }
  }

  _setTrackerTypeBtns() {
    let { navBar } = this.context;

    if (navBar) {
      navBar.setTitle('Choose Type');
      navBar.setButtons(
        this._getBackBtn(this._onBack), <View />);
    }
  }

  get _newTrackerView() {
    return this.refs.newTrackerView;
  }

  get _typeSlide() {
    return this.refs.typeSlide;
  }

  _moveSlides(leftX, rightX, callback) {
    Animated.parallel([
      Animated.timing(this.state.newSlideX, {
        duration: 1000,
        toValue: leftX
      }),
      Animated.timing(this.state.typeSlideX, {
        duration: 1000,
        toValue: rightX
      }),
    ]).start(callback.bind(this));
  }

  _onAccept() {
    let tracker = this.refs.newTrackerSlide.tracker;

    if (this.props.onAccept) {
      this.props.onAccept(tracker);
    }
  }

  _onTypeChange() {
    this._moveSlides(-1, 0, this._setTrackerTypeBtns);
  }

  _onBack() {
    this.setState({
      trackerTypeId: this._typeSlide.typeId
    }, () => {
      this._moveSlides(0, 1, this._setNewTrackerBtns);
    });
  }

  render() {
    return (
      <ScreenView
        ref='newTrackerView'
        posX={this.props.posX}
        content={
          <View style={styles.content}>
            <Animated.View
              shouldRasterizeIOS={true}
              style={[
                styles.slideContainer, {
                  opacity: this.state.newSlideOp,
                  transform: [{
                      translateX: this.state.newSlideX.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [-400, 0, 400]
                    })
                  }]
                }
              ]}>
              <NewTrackerSlide
                ref='newTrackerSlide'
                typeId={this.state.trackerTypeId}
                onTypeChange={this._onTypeChange.bind(this)}
              />
            </Animated.View>
            <Animated.View
              shouldRasterizeIOS={true}
              style={[
                styles.slideContainer, {
                  opacity: this.state.typeOp,
                  transform: [{
                      translateX: this.state.typeSlideX.interpolate({
                        inputRange: [-1, 0, 1],
                        outputRange: [-400, 0, 400]
                    })
                  }]
                }
              ]}>
              <TrackerTypesSlide ref='typeSlide' />
            </Animated.View>
          </View>
        } />
    );
  }
};

NewTrackerView.contextTypes = {
  navBar: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  slideContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  }
});

module.exports = NewTrackerView;
