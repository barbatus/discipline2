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

import {trackerStyles} from '../../styles/trackerStyles';

import BaseTrackerView from './BaseTrackerView';

import {slideWidth, slideHeight} from '../../styles/slideStyles';

export default class TrackerView extends BaseTrackerView {
  render() {
    const { backImg, onTap, onEdit, iconId, controls, footer } = this.props;

    return (
      <Animated.View style={[
          trackerStyles.innerView,
          this.props.style
        ]}>
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
              this._renderBody(backImg)
            }
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }

  _renderBody(backImg) {
    let { controls, footer } = this.props;

    let body = (
      <View style={{flex: 0.55}}>
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

const styles = StyleSheet.create({
  backImg: {
    flex: 0.55,
    width: undefined,
    height: undefined,
    backgroundColor:'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover'
  }
});
