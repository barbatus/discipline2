'use strict';

import React from 'react';

import Dimensions from 'Dimensions';
const window = Dimensions.get('window');

import UserIconsStore from '../../icons/UserIconsStore';

import {
  TouchableHighlight,
  TouchableOpacity,
  View,
  StyleSheet,
  ListView,
  Image,
} from 'react-native';

import {caller} from '../../utils/lang';

const IconsGrid = React.createClass({
    getInitialState: function() {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });
      return { ds };
    },

    _getIcons(): Array<Array<UserIcon>> {
      const icons = UserIconsStore.getAll();

      let iconRow = [];
      const iconRows = [];
      const { count } = this._getColSize();
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
    },

    _onIconChosen(icon) {
      caller(this.props.onIconChosen, icon.id);
    },

    _getColSize() {
      let count = 5;

      // For iPhone 5.
      if (window.width <= 320) {
        count = 4;
      }

      const pad = (count * 0);
      const width = ((window.width - pad) / count) >> 0;

      return { width, count };
    },

    _renderIcon(icon: UserIcon) {
      const { width } = this._getColSize();

      return (
        <TouchableOpacity
          key={icon.id}
          style={styles.col}
          onPress={
            this._onIconChosen.bind(this, icon)
          }>
          <Image
            source={icon.png}
            style={[styles.icon, { width }]}
          />
        </TouchableOpacity>
      );
    },

    _renderRow: function(icons) {
      const items = icons.map(icon => {
        return this._renderIcon(icon);
      });

      return (
        <View style={styles.row}>
          {items}
        </View>
      );
    },

    render() {
      const icons = this._getIcons();
      return (
        <ListView
          dataSource={this.state.ds.cloneWithRows(icons)}
          renderRow={this._renderRow}
          style={[styles.grid, this.props.style]}
        />
      );
    }
});

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

export default IconsGrid;
