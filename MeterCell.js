'use strict';

var React = require('react-native');
var {
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} = React;

var getIcon = require('./icons/getIcon');

var MeterCell = React.createClass({

  getInitialState() {
    return { checked: false, count: 0 };
  },

  _onCheck: function() {
    this.setState({checked: true, count: 1});
  },

  render: function() {
    var infoText = (
      <Text style={styles.meterTitle} numberOfLines={1}>
        {this.props.meter.title}
      </Text>
    );
    if (this.state.checked) {
      infoText = [
        <Text style={styles.meterTitle} numberOfLines={1}>
          {this.state.count}
        </Text>,
        <Text style={styles.meterHint} numberOfLines={1}>
          {this.props.meter.title}
        </Text>
      ];
    }

    return (
      <View>
        <TouchableHighlight
          onPress={this.props.onSelect}>
          <View style={styles.row}>
            <Image
              source={getIcon(this.props.meter.iconId)}
              style={styles.icon}
            />
            <View style={styles.textContainer}>
              {infoText}
            </View>
            <TouchableOpacity onPress={this._onCheck}>
              <Image
                source={require('image!check')}
                style={this.state.checked ? [styles.btn, styles.checkBtn] : styles.btn}
              />
            </TouchableOpacity>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  meterTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  meterHint: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    color: '#C4C4C4'
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20
  },
  icon: {
    resizeMode: 'contain',
    height: 40,
    marginRight: 20,
    width: 40
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: 17.5,
    height: 35,
    width: 35
  },
  checkBtn: {
    backgroundColor: '#3DCF43'
  }
});

module.exports = MeterCell;
