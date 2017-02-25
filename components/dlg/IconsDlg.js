'use strict';

import React from 'react';

import CommonModal from './CommonModal';

import IconsGrid from '../icons/IconsGrid';

import { caller } from '../../utils/lang';

export default class IconsDlg extends CommonModal {
  _cb: Function = null;

  get content() {
    return <IconsGrid ref="iconsGrid" onIconChosen={::this._onIconChosen} />;
  }

  onBeforeShown(cb: Function) {
    this._cb = cb;
  }

  onAfterHidden() {
    this._cb = null;
  }

  _onIconChosen(iconId) {
    caller(this._cb, iconId);
    caller(this.props.onIconChosen, iconId);
  }
}
