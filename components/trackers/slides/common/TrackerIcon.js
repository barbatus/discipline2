import React, { PureComponent } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { walkthroughable } from 'react-native-copilot';

import { getIcon, UserIconsStore } from 'app/icons/icons';

import registry, { DlgType } from 'app/components/dlg/registry';
import CopilotStepEnum from 'app/components/copilot/steps';
import CopilotStep from 'app/components/copilot/CopilotStep';

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

const CopilotButton = walkthroughable(TouchableOpacity);

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
          <CopilotStep step={CopilotStepEnum.ADD_ICON}>
            <CopilotButton
              style={styles.changeIconBox}
              onPress={this.onIconEdit}
            >
              <Text style={styles.changeIconText}>
                Change Icon
              </Text>
            </CopilotButton>
          </CopilotStep>
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
