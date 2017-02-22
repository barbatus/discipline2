'use strict';

import React from 'react';

import {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

import {getIcon} from '../../../../icons/icons';

import {trackerDef, trackerStyles} from '../../styles/trackerStyles';

import BaseTrackerView from './BaseTrackerView';

import {slideWidth, slideHeight} from '../../styles/slideStyles';

export default class TrackerView extends BaseTrackerView {
  render() {
    const { tracker, style, backImg, onTap, onEdit } = this.props;
    const { title, iconId } = tracker;

    return (
      <Animated.View style={[trackerStyles.innerView, style]}>
        <TouchableWithoutFeedback style={{flex: 1}} onPress={onTap}>
          <View style={{flex: 1}}>
            <View style={trackerStyles.headerContainer}>
              <View style={trackerStyles.barContainer}>
                <TouchableOpacity onPress={onEdit}>
                  <Image
                    source={getIcon('info')}
                    style={trackerStyles.infoIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={trackerStyles.iconContainer}>
                <Image
                  source={this.getMainIcon(iconId)}
                  style={trackerStyles.mainIcon}
                />
              </View>
              <View style={trackerStyles.titleContainer}>
                <Text style={trackerStyles.titleText}>
                  {title}
                </Text>
              </View>
            </View>
            { this._renderContent(backImg) }
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  _renderContent(backImg) {
    const {
      bodyControls, footerControls,
      bodyStyle, footerStyle,
    } = this.props;

    const body = (
      <View style={styles.wrapper}>
        <View style={[trackerStyles.bodyContainer, bodyStyle]}>
          {bodyControls}
        </View>
        <View style={[trackerStyles.footerContainer, footerStyle]}>
          {footerControls}
        </View>
      </View>
    );

    return backImg ? (
      <Image source={backImg} style={styles.backImg}>
        { body }
      </Image>
    ) : body;
  }
};

const flex = trackerDef.bodyContainer.flex +
             trackerDef.footerContainer.flex;
const styles = StyleSheet.create({
  backImg: {
    flex: flex,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  wrapper: {
    flex,
  },
});
