import React from 'react';

import { TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';
import { debounce } from 'lodash';

import { caller } from 'app/utils/lang';

import { HINT_COLOR } from '../styles/common';

import CommonModal from './CommonModal';
import IconsGrid from '../icons/IconsGrid';

const TextInput = styled(RNTextInput)`
  width: 100%;
  margin: 10px 0;
  padding: 5px 10px;
  font-size: 25;
  font-weight: 200;
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
  }

  onIconChosen(iconId) {
    caller(this.cb, iconId);
    caller(this.props.onIconChosen, iconId);
  }
}
