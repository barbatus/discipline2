import React, { PureComponent } from 'react';

import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';

import registry, { DlgType } from 'app/components/dlg/registry';

import { getIcon, UserIconsStore } from 'app/icons/icons';

import { trackerStyles, propsStyles } from '../../styles/trackerStyles';

const styles = StyleSheet.create({
  changeIconBox: {
    borderWidth: 1,
    borderColor: '#D4D4D4',
    padding: 3,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 15,
  },
  changeIconText: {
    fontSize: 16,
    color: '#C4C4C4',
    fontWeight: '300',
  },
});

export default class TrackerIcon extends PureComponent {
  static propTypes = {
    input: PropTypes.shape({
      value: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.onIconEdit = ::this.onIconEdit;
  }

  getMainIcon(iconId) {
    const userIcon = UserIconsStore.get(iconId);
    if (userIcon) {
      return userIcon.pngLarge;
    }
    return getIcon('oval');
  }

  onIconEdit() {
    const dlg = registry.get(DlgType.ICONS);
    const { input } = this.props;
    dlg.show((iconId) => {
      input.onChange(iconId);
      dlg.hide();
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={[propsStyles.barContainer]}>
          <TouchableOpacity
            style={styles.changeIconBox}
            onPress={this.onIconEdit}
          >
            <Text style={styles.changeIconText}>
              Change Icon
            </Text>
          </TouchableOpacity>
        </View>
        <View style={propsStyles.iconContainer}>
          <Image
            source={this.getMainIcon(this.props.input.value)}
            style={trackerStyles.mainIcon}
          />
        </View>
      </View>
    );
  }
}
