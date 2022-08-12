import React, { PureComponent } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { getIcon } from 'app/icons/icons';

import styles from './styles';

export class NavButton extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    iconStyle: Image.propTypes.style,
    icon: PropTypes.string.isRequired,
    copilot: PropTypes.object,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    style: null,
    iconStyle: null,
    onPress: null,
    copilot: null,
  };

  render() {
    const onPress = this.props.onPress
      ? debounce(this.props.onPress, 16)
      : null;
    const { copilot } = this.props;
    return (
      <TouchableOpacity
        hitSlop={{ left: 15, right: 15 }}
        style={this.props.style}
        onPress={onPress}>
        <Image
          {...copilot}
          source={getIcon(this.props.icon)}
          style={[styles.navBarIcon, this.props.iconStyle]}
        />
      </TouchableOpacity>
    );
  }
}

const NavLeftButtonFn = (props) => (
  <NavButton
    {...props}
    iconStyle={styles.newIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavLeftButton = React.memo(NavLeftButtonFn);

const NavRightButtonFn = (props) => (
  <NavButton
    {...props}
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />
);

export const NavRightButton = React.memo(NavRightButtonFn);

const NavAddButtonFn = (props) => (
  <NavButton
    {...props}
    icon="new"
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />
);

export const NavAddButton = React.memo(NavAddButtonFn);

const NavBackButtonFn = (props) => (
  <NavButton
    {...props}
    icon="back"
    iconStyle={styles.backIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavBackButton = React.memo(NavBackButtonFn);

const NavMenuButtonFn = (props) => (
  <NavButton
    {...props}
    icon="menu"
    iconStyle={styles.menuIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavMenuButton = React.memo(NavMenuButtonFn);

const NavCancelButtonFn = (props) => (
  <NavButton
    {...props}
    icon="cancel"
    iconStyle={styles.cancelIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavCancelButton = React.memo(NavCancelButtonFn);

const NavAcceptButtonFn = (props) => (
  <NavButton {...props} icon="accept" style={styles.navBarRightButton} />
);

export const NavAcceptButton = React.memo(NavAcceptButtonFn);
