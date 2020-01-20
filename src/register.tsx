import * as React from 'react';
import addons, { types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';

import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

import { Panel } from './panel';

export default function register(type: types) {
  addons.register(ADDON_ID, api => {
    addons.add(PANEL_ID, {
      type,
      title: 'Mock Panel',
      render: ({ active, key }) => (
        <AddonPanel active={active} key={key}>
          <Panel />
        </AddonPanel>
      ),
      paramKey: PARAM_KEY,
    });
  });
}
