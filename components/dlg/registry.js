import check from 'check-types';

import { Modal } from './interfaces';

export const DlgType = {
  ICONS: 'icons',
  MAPS: 'maps',
  TICKS: 'ticks',
};

class DlgRegistry {
  registry = new Map();

  register(dlgId: string, dlg: Modal) {
    check.assert.not.null(this.get(dlgId), 'Dlg already registered');

    this.registry.set(dlgId, dlg);
  }

  get(dlgId: string): Modal {
    return this.registry.get(dlgId);
  }
}

const registry = new DlgRegistry();
export default registry;
