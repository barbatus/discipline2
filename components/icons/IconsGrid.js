import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
  ViewPropTypes,
} from 'react-native';
import Dimensions from 'Dimensions';
import PropTypes from 'prop-types';

import UserIconsStore, { UserIcon } from 'app/icons/UserIconsStore';

const window = Dimensions.get('window');

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
  }

  getIconRows(): Array<UserIcon[]> {
    const icons = UserIconsStore.getAll();

    const iconRows = [];
    const { count } = this.getColSize();
    for (let row = 0; row < icons.length; row += count) {
      iconRows.push({ icons: icons.slice(row, row + count), key: String(row) });
    }

    return iconRows;
  }

  getColSize() {
    let count = 5;

    // For iPhone 5.
    if (window.width <= 320) {
      count = 4;
    }

    const pad = count * 0;
    const width = Math.floor((window.width - pad) / count);

    return { width, count };
  }

  renderIcon(icon: UserIcon) {
    const { onIconChosen } = this.props;
    const { width } = this.getColSize();

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
      <View style={styles.row}>
        {row.icons.map((icon) => this.renderIcon(icon))}
      </View>
    );
  }

  render() {
    const rows = this.getIconRows();
    return (
      <FlatList
        data={rows}
        renderItem={({item}) => this.renderRow(item)}
        style={[styles.grid, this.props.style]}
      />
    );
  }
}
