import React, { PureComponent } from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ViewPropTypes,
} from 'react-native';

import PropTypes from 'prop-types';

import Tracker from 'app/model/Tracker';
import { getIcon, UserIconsStore } from 'app/icons/icons';

import { trackerDef, trackerStyles } from '../../styles/trackerStyles';

const flex = 1 - trackerDef.headerContainer.flex;

const styles = StyleSheet.create({
  backImg: {
    flex,
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  wrapper: {
    flex,
  },
});

export default class TrackerView extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    bodyStyle: ViewPropTypes.style,
    footerStyle: ViewPropTypes.style,
    tracker: PropTypes.instanceOf(Tracker),
    onTap: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    backImg: PropTypes.string,
    bodyControls: PropTypes.element.isRequired,
    footerControls: PropTypes.element.isRequired,
  };

  static defaultProps = {
    style: null,
    bodyStyle: null,
    footerStyle: null,
    tracker: null,
    backImg: null,
  };

  getMainIcon(iconId) {
    const userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
  }

  renderContent(backImg) {
    const { bodyControls, footerControls, bodyStyle, footerStyle } = this.props;

    const content = [
      <View key="body" style={[trackerStyles.bodyContainer, bodyStyle]}>
        {bodyControls}
      </View>,
      <View key="footer" style={[trackerStyles.footerContainer, footerStyle]}>
        {footerControls}
      </View>,
    ];

    return backImg ? (
      <Image source={backImg} style={styles.backImg}>
        {content}
      </Image>
    ) : (
      <View style={styles.wrapper}>
        {content}
      </View>
    );
  }

  render() {
    const { tracker, style, backImg, onTap, onEdit } = this.props;
    const { title, iconId } = tracker;
    return (
      <Animated.View style={[trackerStyles.innerView, style]}>
        <TouchableWithoutFeedback onPress={onTap}>
          <View style={{ flex: 1 }}>
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
            {this.renderContent(backImg)}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}
