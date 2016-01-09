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

const Easing = require('Easing');

const ScreenView = require('./ScreenView');

const NewTrackerSlide = require('../trackers/NewTrackerSlide');
const TrackerTypesSlide = require('../trackers/TrackerTypesSlide');

const Trackers = require('../../trackers/Trackers');

const { commonDef, commonStyles } = require('../styles/common');

class NewTrackerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trackerTypeId: null
    }

    this._typeOp = new Animated.Value(1);
    this._newSlideX = new Animated.Value(0);
    this._newSlideOp = new Animated.Value(1);
    this._typeSlideX = new Animated.Value(1);
  }

  moveLeft(callback) {
    this.setState({
      trackerTypeId: null
    });

    this._newTrackerView.posX.setValue(1);
    this._newTrackerView.opacity.setValue(1);

    this._setNewTrackerBtns();

    Animated.timing(this._newTrackerView.posX, {
      duration: 1000,
      toValue: 0,
      easing: Easing.inOut(Easing.sin)
    }).start(callback);
  }

  moveRight(callback) {
    Animated.timing(this._newTrackerView.posX, {
      duration: 1000,
      toValue: 1,
      easing: Easing.inOut(Easing.linear)
    }).start(callback);
  }

  setOpacity(value, animated, callback) {
    if (animated) {
      Animated.timing(this._newTrackerView.opacity, {
        duration: 1000,
        toValue: value
      }).start(() => {
        this.refs.newTrackerSlide.reset();

        if (callback) {
          callback();
        }
      });
    } else {
      this.refs.newTrackerSlide.reset();
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
    let leftAnim = Easing.inOut(Easing.linear);
    let rightAnim = Easing.inOut(Easing.sin);

    // On the way back.
    if (leftX === 0) {
      leftAnim = Easing.inOut(Easing.sin);
      rightAnim = Easing.inOut(Easing.linear);
    }

    Animated.parallel([
      Animated.timing(this._newSlideX, {
        duration: 1000,
        toValue: leftX,
        easing: leftAnim
      }),
      Animated.timing(this._typeSlideX, {
        duration: 1000,
        toValue: rightX,
        easing: rightAnim
      }),
    ]).start(callback);
  }

  _onAccept() {
    let tracker = this.refs.newTrackerSlide.tracker;

    if (this.props.onAccept) {
      this.props.onAccept(tracker);
    }
  }

  _onTypeChange() {
    this._setTrackerTypeBtns();
    this._moveSlides(-1, 0);
  }

  _onBack() {
    this.setState({
      trackerTypeId: this._typeSlide.typeId
    }, () => {
      this._setNewTrackerBtns();
      this._moveSlides(0, 1);
    });
  }

  render() {
    return (
      <ScreenView
        ref='newTrackerView'
        posX={this.props.posX}
        content={
          <View style={commonStyles.flexFilled}>
            <Animated.View
              shouldRasterizeIOS={true}
              style={[
                styles.slideContainer, {
                  opacity: this._newSlideOp,
                  transform: [{
                      translateX: this._newSlideX.interpolate({
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
                  opacity: this._typeOp,
                  transform: [{
                      translateX: this._typeSlideX.interpolate({
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
  slideContainer: {
    ...commonDef.absoluteFilled
  }
});

module.exports = NewTrackerView;
