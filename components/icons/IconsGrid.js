/* eslint react/no-multi-comp: 0 */

import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

import UserIconsStore, { UserIcon } from 'app/icons/UserIconsStore';

import { IS_IPHONE5, SCREEN_WIDTH } from '../styles/common';

const styles = StyleSheet.create({
  grid: {
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  col: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  icon: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});

const Icon = React.memo(({ icon, width, onIconChosen }) => (
  <TouchableOpacity
    style={styles.col}
    onPress={() => onIconChosen(icon.id)}
  >
    <Image source={icon.png} style={[styles.icon, { width }]} />
  </TouchableOpacity>
));

Icon.propTypes = {
  width: PropTypes.number.isRequired,
  icon: PropTypes.shape({
    id: PropTypes.string,
    png: PropTypes.number,
  }).isRequired,
  onIconChosen: PropTypes.func.isRequired,
};

function getColSize() {
  const count = IS_IPHONE5 ? 4 : 5;
  const pad = count * 0;
  const width = Math.floor((SCREEN_WIDTH - pad) / count);

  return { width, count };
}

function getIconRows(): Array<UserIcon[]> {
  const icons = UserIconsStore.getAll();
  const iconRows = [];
  const { count } = getColSize();
  for (let row = 0; row < icons.length; row += count) {
    iconRows.push({ icons: icons.slice(row, row + count), key: String(row) });
  }

  return iconRows;
}

export default class IconsGrid extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    onIconChosen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    style: null,
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.rows = getIconRows();
  }

  renderIcon(icon: UserIcon) {
    const { onIconChosen } = this.props;
    const { width } = getColSize();

    return (
      <Icon
        key={icon.id}
        icon={icon}
        width={width}
        onIconChosen={onIconChosen}
      />
    );
  }

  renderRow(row) {
    return (
      <View key={row.key} style={styles.row}>
        {row.icons.map((icon) => this.renderIcon(icon))}
      </View>
    );
  }

  render() {
    return (
      <FlatList
        data={this.rows}
        renderItem={({ item }) => this.renderRow(item)}
        style={[styles.grid, this.props.style]}
      />
    );
  }
}
