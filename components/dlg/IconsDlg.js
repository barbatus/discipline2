import React from 'react';

import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';
import { debounce } from 'lodash';

import { caller, lighten } from 'app/utils';

import { HINT_COLOR } from '../styles/common';
import IconsGridBase from '../icons/IconsGrid';

import CommonModal from './CommonModal';

const TextInput = styled(RNTextInput)`
  width: 100%;
  padding: 10px;
  font-size: 25px;
  font-weight: 200;
  border-bottom-color: ${lighten(HINT_COLOR, 0.05)};
  border-bottom-width: 1px;
`;

const IconsGrid = styled(IconsGridBase)`
  padding-top: 10px;
`;

export default class IconsDlg extends CommonModal {
  cb: Function = null;

  constructor(props) {
    super(props);
    this.state = { tagsFilter: [] };
    this.onIconChosen = ::this.onIconChosen;
    this.onSearch = debounce(::this.onSearch, 250);
  }

  get content() {
    const { tagFilters } = this.state;
    return (
      <>
        <TextInput
          placeholder="Search Icon"
          placeholderTextColor={HINT_COLOR}
          onChangeText={this.onSearch}
        />
        <IconsGrid tagFilters={tagFilters} onIconChosen={this.onIconChosen} />
      </>
    );
  }

  onSearch(value: string) {
    if (value.trim()) {
      const tagFilters = value.trim().split(' ');
      this.setState({ tagFilters });
    } else {
      this.setState({ tagFilters: [] });
    }
  }

  onBeforeShown(cb: Function) {
    this.cb = cb;
  }

  onAfterHidden() {
    this.cb = null;
    this.setState({ tagFilters: [] });
  }

  onIconChosen(iconId) {
    caller(this.cb, iconId);
    caller(this.props.onIconChosen, iconId);
  }
}
