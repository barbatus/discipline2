import check from 'check-types';
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';

import { commonStyles } from '../styles/common';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    margin: 0,
    height: 0,
  },
  headerContainer: {
    height: 64,
    paddingTop: 15,
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
    this.onModalShown = ::this.onModalShown;
  }

  get content() {
    return null;
  }

  onBeforeShown() {}

  onAfterShown() {}

  onBeforeHidden() {}

  onAfterHidden() {}

  onModalShown() {}

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
    const { modalVisible } = this.state;
    return (
      <Modal
        style={styles.modal}
        isVisible={modalVisible}
        hasBackdrop={false}
        hideModalContentWhileAnimating
        onModalShow={this.onModalShown}
      >
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
      </Modal>
    );
  }
}
