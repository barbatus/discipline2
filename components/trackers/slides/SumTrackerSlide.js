import React from 'react';
import {
  Alert,
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import { getIcon } from 'app/icons/icons';
import Keyboard from 'app/utils/Keyboard';
import { caller } from 'app/utils/lang';
import { IS_IPHONE5 } from 'app/components/styles/common';
import { SumTracker } from 'app/model/Tracker';

import { trackerDef, trackerStyles } from '../styles/trackerStyles';
import { SLIDE_WIDTH } from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

const WIDGET_WIDTH = SLIDE_WIDTH - 40;

const FONT_SIZE = IS_IPHONE5 ? 40 : 50;

const BTN_SIZE = IS_IPHONE5 ? 40 : 45;

const INPUT_WIDTH = WIDGET_WIDTH;

const INPUT_HEIGHT = IS_IPHONE5 ? 50 : 60;

const styles = StyleSheet.create({
  controlsContainer: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    width: WIDGET_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DADADA',
    paddingBottom: 10,
    marginBottom: 10,
  },
  textContainer: {
    width: WIDGET_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sumInput: {
    height: INPUT_HEIGHT,
    width: INPUT_WIDTH,
    paddingRight: BTN_SIZE + 10,
    fontSize: FONT_SIZE,
    color: '#4A4A4A',
    textAlign: 'center',
    fontWeight: '200',
  },
  circleBtnSm: {
    width: BTN_SIZE,
    height: BTN_SIZE,
  },
  sumText: {
    fontSize: 40,
    color: '#9B9B9B',
    fontWeight: '200',
  },
  circleBtn: {
    position: 'absolute',
    right: 0,
    top: 7.5,
  },
});

export default class SumTrackerSlide extends TrackerSlide {
  static propTypes = {
    tracker: PropTypes.instanceOf(SumTracker).isRequired,
  };

  undoAlertOn: boolean;

  constructor(props) {
    super(props);
    this.onPlus = ::this.onPlus;
    this.onChangeText = ::this.onChangeText;
  }

  get trackerProps() {
    return SumTracker.properties;
  }

  cancelEdit(callback) {
    super.cancelEdit(callback);
    Keyboard.dismiss();
  }

  saveEdit(callback) {
    super.saveEdit(callback);
    Keyboard.dismiss();
  }

  showEdit(callback) {
    super.showEdit(callback);
    Keyboard.dismiss();
  }

  collapse(callback) {
    super.collapse(callback);
    Keyboard.dismiss();
  }

  shake() {
    const { tracker } = this.props;
    if (this.undoAlertOn || !tracker.lastTick) return;

    this.undoAlertOn = true;
    const onHide = () => this.undoAlertOn = false;
    Alert.alert('Do you want to undo?', null,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: onHide,
        },
        {
          text: 'Yes',
          style: 'ok',
          onPress: () => {
            caller(this.props.onUndo);
            onHide();
          },
        },
      ],
      { cancelable: false },
    );
  }

  onTap() {
    super.onTap();
    Keyboard.dismiss();
  }

  get bodyControls() {
    const { tracker, responsive } = this.props;
    return (
      <View style={[trackerStyles.controls, styles.controlsContainer]}>
        <View style={styles.inputContainer}>
          <TextInput
            editable={responsive}
            keyboardType="numeric"
            placeholder="Enter value"
            placeholderTextColor={trackerDef.hintText.color}
            style={styles.sumInput}
            onChangeText={this.onChangeText}
            value={this.state.added}
            onSubmitEditing={this.onPlus}
          />
          <TouchableOpacity
            style={styles.circleBtn}
            disabled={!responsive}
            onPress={this.onPlus}
          >
            <Image
              source={getIcon('plus_sm')}
              style={[trackerStyles.circleBtnSm, styles.circleBtnSm]}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.sumText}>=</Text>
          <Text style={styles.sumText}>
            { tracker.props.showBuck ? '$' : null }
            {tracker.value}
          </Text>
        </View>
      </View>
    );
  }

  get footerControls() {
    return (
      <Text style={trackerStyles.footerText}>
        Shake to undo
      </Text>
    );
  }

  onPlus() {
    Keyboard.dismiss();
    const { onTick } = this.props;
    const added = parseFloat(this.state.added);
    if (added) {
      caller(onTick, added);
      this.setState({ added: '' });
    }
  }

  onChangeText(sumAdded) {
    this.setState({
      added: sumAdded,
    });
  }
}
