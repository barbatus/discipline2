import React, { PureComponent } from 'react';
import { TouchableOpacity, Image, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import debounce from 'lodash/debounce';

import { getIcon } from 'app/icons/icons';

import styles from './styles';

export class NavButton extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    iconStyle: Image.propTypes.style,
    icon: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    style: null,
    iconStyle: null,
    onPress: null,
  };

  render() {
    const onPress = this.props.onPress ? debounce(this.props.onPress, 16) : null;
    const { copilot } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={this.props.style}>
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

export const NavLeftButton = pure(NavLeftButtonFn);

const NavRightButtonFn = (props) => (
  <NavButton
    {...props}
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />
);

export const NavRightButton = pure(NavRightButtonFn);

const NavAddButtonFn = (props) => (
  <NavButton
    {...props}
    icon="new"
    iconStyle={styles.newIcon}
    style={styles.navBarRightButton}
  />
);

export const NavAddButton = pure(NavAddButtonFn);

const NavBackButtonFn = (props) => (
  <NavButton
    {...props}
    icon="back"
    iconStyle={styles.backIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavBackButton = pure(NavBackButtonFn);

const NavMenuButtonFn = (props) => (
  <NavButton
    {...props}
    icon="menu"
    iconStyle={styles.menuIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavMenuButton = pure(NavMenuButtonFn);

const NavCancelButtonFn = (props) => (
  <NavButton
    {...props}
    icon="cancel"
    iconStyle={styles.cancelIcon}
    style={styles.navBarLeftButton}
  />
);

export const NavCancelButton = pure(NavCancelButtonFn);

const NavAcceptButtonFn = (props) => (
  <NavButton
    {...props}
    icon="accept"
    style={styles.navBarRightButton}
  />
);

export const NavAcceptButton = pure(NavAcceptButtonFn);
