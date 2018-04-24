import React from 'react';

import { caller } from 'app/utils/lang';

import CommonModal from './CommonModal';
import IconsGrid from '../icons/IconsGrid';

export default class IconsDlg extends CommonModal {
  cb: Function = null;

  constructor(props) {
    super(props);
    this.onIconChosen = ::this.onIconChosen;
  }

  get content() {
    return (
      <IconsGrid onIconChosen={this.onIconChosen} />
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
