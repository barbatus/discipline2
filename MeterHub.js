'use strict';

var React = require('react-native');
var {
  View,
  ListView,
  StyleSheet
} = React;

var MeterCell = require('./MeterCell');
var MeterScreen = require('./MeterScreen');
var depot = require('./depot/depot');

var MeterHub = React.createClass({
  componentDidMount() {
    this._loadInitialState().done();
  },

  async _loadInitialState() {
    var hasTestData = await depot.hasTestData();
    if (!hasTestData) {
      await depot.initTestData();
    }
    var result = await depot.meters.get_all();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(result)
    });
  },

  getInitialState() {
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    return {
      dataSource: ds
    };
  },

  renderRow(meter: Object) {
    return (
      <MeterCell
        key={meter.id}
        onSelect={() => this.selectMeter(meter)}
        meter={meter}
      />
    );
  },

  selectMeter(meter: Object) {
    this.props.navigator.push({
      title: meter.title,
      component: MeterScreen,
      passProps: {meter}
    });
  },

  renderSeparator(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean) {
    var style = styles.rowSeparator;
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

  render() {
    var listView =
      <ListView
        ref='listview'
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.separator} />
        {listView}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4
  },
});

module.exports = MeterHub;
