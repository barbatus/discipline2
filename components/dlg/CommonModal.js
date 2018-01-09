import check from 'check-types';

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';

import { commonStyles } from '../styles/common';

const styles = StyleSheet.create({
  headerContainer: {
    height: 64,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderBottomColor: 'rgba(185, 185, 185, 0.5)',
    borderBottomWidth: 1,
  },
  cancelText: {
    fontSize: 17,
    color: '#1A7CF9',
  },
});

export default class CommonModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.hide = ::this.hide;
  }

  onBeforeShown() {}

  onAfterShown() {}

  onBeforeHidden() {}

  onAfterHidden() {}

  get content() {
    return null;
  }

  show(...args) {
    check.assert.like(this.state.modalVisible, true, 'Dlg already shown');

    this.onBeforeShown(...args);
    this.setState({ modalVisible: true },
      () => this.onAfterShown(...args),
    );
  }

  hide() {
    this.onBeforeHidden();
    this.setState({ modalVisible: false },
      () => this.onAfterHidden(),
    );
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!this.state.modalVisible}
        >
          <View style={commonStyles.flexFilled}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={this.hide}>
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
            <View style={commonStyles.flexFilled}>
              {this.content}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
