const React = require('react-native');
const {
  View,
  Text,
  Image,
  Component
} = React;

const styles = require('./styles');

class NavTitle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let navTitle = (
      <View style={styles.navTitle}>
        <Text style={styles.navTitleText}>
          {this.props.title}
        </Text>
      </View>
    );

    return navTitle;
  }
}

module.exports = NavTitle;
