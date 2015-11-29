'use strict';

const React = require('react-native');
const {
  TouchableOpacity,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Component
} = React;

const { cellStyles } = require('./cellStyles');

const { TrackerType } = require('../../depot/consts');

class TrackerTypesCell extends Component {
  constructor(props) {
    super(props);
    this._types = TrackerType.symbols();
    this.state = {
      type: this._types[0]
    };
  }

  _onTypeChosen(type) {
    let typeEnum = TrackerType.fromValue(type);
    this.setState({
      type: typeEnum
    });
  }

  get chosenType() {
    return this.state.type.valueOf();
  }

  _renderTypes() {
    return (
      <View style={styles.types}>
        {
          this._types.map(type => {
            return (
                <TouchableOpacity
                onPress={this._onTypeChosen.bind(this, type.valueOf())}
                style={this.state.type === type ?
                  [styles.type, styles.selected] : styles.type}>
                <View style={styles.typeIconContainer}>
                  <Image source={getIcon(type.valueOf())}
                    style={[styles.typeIcon]} />
                </View>
                <View style={styles.typeTitleContainer}>
                  <Text style={styles.typeTitle}>
                    {type.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    );
  }

  render() {
    return (
      <View style={cellStyles.cell}>
        <View style={cellStyles.container}>
          <View style={cellStyles.innerView}>
            <View style={[
                cellStyles.headerContainer,
                styles.headerContainer
              ]}>
              <Text style={styles.title}>
                {this.state.type.title}
              </Text>
            </View>
            <View style={[
                cellStyles.bodyContainer,
                styles.bodyContainer
              ]}>
              <Text style={styles.desc}>
                {this.state.type.desc}
              </Text>
            </View>
            <View style={[
                cellStyles.footerContainer,
                styles.footerContainer
              ]}>
              {this._renderTypes()}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styleDef = {
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  }
};

const styles = StyleSheet.create({
  headerContainer: {
    ...styleDef.centered,
    flex: 0.3,
    justifyContent: 'flex-start'
  },
  bodyContainer: {
    ...styleDef.centered,
    justifyContent: 'flex-start'
  },
  footerContainer: {
    flex: 0.20
  },
  title: {
    fontSize: 28,
    color: '#4A4A4A',
    paddingTop: 20
  },
  desc: {
    fontSize: 17,
    color: '#9B9B9B',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  types: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5'
  },
  type: {
    flex: 0.33,
    flexDirection: 'column',
    //borderTopWidth: 1,
    //borderTopColor: '#B9B9B9'
    borderTopWidth: 4,
    borderColor: 'trasparent',
    shadowColor: 'rgba(185, 185, 185, 0.4)',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: {
      height: -1,
      width: 0
    },
  },
  typeIconContainer: {
    ...styleDef.centered,
    flex: 0.75,
  },
  typeTitleContainer: {
    ...styleDef.centered,
    justifyContent: 'flex-start',
    flex: 0.25,
  },
  typeTitle: {
    fontSize: 12
  },
  typeIcon: {
    resizeMode: 'contain',
    height: 40
  },
  selected: {
    borderTopWidth: 4,
    borderTopColor: '#1A7CF9',
    backgroundColor: '#E6E6E6'
  }
});

module.exports = TrackerTypesCell;
