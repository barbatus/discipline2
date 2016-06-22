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
  Image
} from 'react-native';

import { caller } from '../../utils/lang';

let IconsGrid = React.createClass({
    getInitialState: function() {
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });

      return { ds };
    },

    _getIcons(): Array<Array<UserIcon>> {
      let icons = UserIconsStore.getAll();

      let iconRows = [], iconRow = [];
      let { count } = this._getColSize();
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

      let pad = (count * 10);
      let width = ((window.width - pad) / count) >> 0;

      return { width, count };
    },

    _renderIcon(icon: UserIcon) {
      let { width } = this._getColSize();

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
      let items = icons.map(icon => {
        return this._renderIcon(icon);
      });

      return (
        <View style={styles.row}>
          {items}
        </View>
      );
    },

    render() {
      let icons = this._getIcons();

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
    paddingTop: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15
  },
  col: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  icon: {
    resizeMode: 'contain',
    width: 40,
    height: 40
  }
});

module.exports = IconsGrid;
