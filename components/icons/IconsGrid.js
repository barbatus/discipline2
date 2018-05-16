import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ListView,
  Image,
} from 'react-native';
import Dimensions from 'Dimensions';
import PropTypes from 'prop-types';
import { withHandlers } from 'recompose';

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

const IconFn = ({ icon, width, onIconChosen }) => (
  <TouchableOpacity
    style={styles.col}
    onPress={onIconChosen}
  >
    <Image source={icon.png} style={[styles.icon, { width }]} />
  </TouchableOpacity>
);

IconFn.propTypes = {
  width: PropTypes.number.isRequired,
  icon: PropTypes.shape({
    id: PropTypes.string,
    png: PropTypes.number,
  }).isRequired,
  onIconChosen: PropTypes.func.isRequired,
};

const Icon = withHandlers({
  onIconChosen: ({ onIconChosen, icon }) => (event) => {
    event.preventDefault();
    onIconChosen(icon.id);
  },
})(IconFn);

export default class IconsGrid extends PureComponent {
  static propTypes = {
    style: ListView.propTypes.style,
    onIconChosen: PropTypes.func.isRequired,
  }

  static defaultProps = {
    style: null,
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = { ds };
    this.renderRow = this.renderRow.bind(this);
  }

  getIcons(): Array<UserIcon[]> {
    const icons = UserIconsStore.getAll();

    let iconRow = [];
    const iconRows = [];
    const { count } = this.getColSize();
    icons.forEach((icon, index) => {
      iconRow.push(icon);
      if ((index + 1) % count === 0) {
        iconRows.push(iconRow);
        iconRow = [];
      }
    });

    if (iconRow.length) {
      iconRows.push(iconRow);
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

  renderRow(icons) {
    const items = icons.map((icon) => this.renderIcon(icon));

    return (
      <View style={styles.row}>
        {items}
      </View>
    );
  }

  render() {
    const icons = this.getIcons();
    return (
      <ListView
        dataSource={this.state.ds.cloneWithRows(icons)}
        renderRow={this.renderRow}
        style={[styles.grid, this.props.style]}
      />
    );
  }
}
