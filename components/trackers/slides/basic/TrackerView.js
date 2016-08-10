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
  TouchableWithoutFeedback
} from 'react-native';

import {trackerDef, trackerStyles} from '../../styles/trackerStyles';

import BaseTrackerView from './BaseTrackerView';

import {slideWidth, slideHeight} from '../../styles/slideStyles';

export default class TrackerView extends BaseTrackerView {
  render() {
    const {
      style, title, backImg, iconId,
      controls, footer, onTap, onEdit
    } = this.props;

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
                  {this.props.title}
                </Text>
              </View>
            </View>
            {
              this._renderContent(backImg)
            }
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  _renderContent(backImg) {
    let { controls, footer } = this.props;

    let body = (
      <View style={styles.wrapper}>
        <View style={trackerStyles.bodyContainer}>
          {controls}
        </View>
        <View style={trackerStyles.footerContainer}>
          {footer}
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
    resizeMode: 'cover'
  },
  wrapper: {
    flex
  }
});
