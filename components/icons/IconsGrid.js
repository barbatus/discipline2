'use strict';

const React = require('react-native');

const UserIconsStore = require('../../icons/UserIconsStore');

const {
  TouchableHighlight,
  TouchableOpacity,
  View,
  StyleSheet,
  ListView,
  Image
} = React;

let IconsGrid = React.createClass({
    getInitialState: function() {
      let ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      });

      return { ds };
    },

    _getIcons() {
      let icons = UserIconsStore.getAll();

      let rows = [], row = [];
      let index = 1;
      for (let icon of icons) {
        row.push(icon);
        if (index % 4 === 0) {
          rows.push(row);
          row = [];
        }
        index++;
      }

      if (row.length) {
        rows.push(row);
      }

      return rows;
    },

    _onIconChosen(icon) {
      if (this.props.onIconChosen) {
        this.props.onIconChosen(icon.id);
      }
    },

    _renderIcon(icon) {
      return (
        <TouchableOpacity
          style={styles.col}
          onPress={
            this._onIconChosen.bind(this, icon)
          }>
          <Image
            source={icon.png}
            style={styles.icon}
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
    marginBottom: 20
  },
  col: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5
  },
  icon: {
    resizeMode: 'contain',
    height: 38
  }
});

module.exports = IconsGrid;
