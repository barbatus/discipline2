import React from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

import { getIcon } from 'app/icons/icons';

import Keyboard from 'app/utils/keyboard';

import { caller } from 'app/utils/lang';

import { isPhone5 } from 'app/components/styles/common';

import { trackerDef, trackerStyles } from '../styles/trackerStyles';

import { slideWidth } from '../styles/slideStyles';

import TrackerSlide from './TrackerSlide';

const WIDGET_WIDTH = slideWidth - 40;

const FONT_SIZE = isPhone5() ? 40 : 50;

const BTN_SIZE = isPhone5() ? 40 : 45;

const INPUT_WIDTH = WIDGET_WIDTH;

const INPUT_HEIGHT = isPhone5() ? 50 : 60;

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
  constructor(props) {
    super(props);
    this.onPlus = ::this.onPlus;
    this.onChangeText = ::this.onChangeText;
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
    caller(this.props.onUndo);
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
            keyboardType={'numeric'}
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
            $ {tracker.value}
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
