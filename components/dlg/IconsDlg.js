import React from 'react';

import CommonModal from './CommonModal';

import IconsGrid from '../icons/IconsGrid';

import { caller } from '../../utils/lang';

export default class IconsDlg extends CommonModal {
  cb: Function = null;

  constructor(props) {
    super(props);
    this.onIconChosen = ::this.onIconChosen;
  }

  get content() {
    return (
      <IconsGrid
        ref="iconsGrid"
        onIconChosen={this.onIconChosen}
      />
    );
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
