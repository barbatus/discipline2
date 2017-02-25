'use strict';

export const DlgType = {
  ICONS: 'icons',
  MAPS: 'maps',
};

class DlgRegistry {
  _registry = new Map();

  register(dlgId: string, dlg: IModal) {
    check.assert.not.null(this.get(dlgId), 'Dlg already registered');

    this._registry.set(dlgId, dlg);
  }

  get(dlgId: string): IModal {
    return this._registry.get(dlgId);
  }
}

const registry = new DlgRegistry();

export default registry;
