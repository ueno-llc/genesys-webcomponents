import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs/polymer';
import { storiesOf } from '@storybook/polymer';
import { html, render } from 'lit-html';
import { withReadme } from 'storybook-readme';

import README from '../readme.md';

storiesOf('Genesys Components', module).add(
  'Gux Advanced Dropdown',
  withReadme(README, () => {
    const el = document.createElement('div');
    render(
      html`
        <h2>Basic samples</h2>
        <gux-advanced-dropdown></gux-advanced-dropdown>
        <h2>Interactive sample</h2>
        <gux-advanced-dropdown
          id='interactive'
          first=${text('first', 'blob')}
          last=${text('last', 'Blop')}
          middle=${text('middle', 'Blop')}
        >
        </gux-advanced-dropdown>
      `,
      el
    );
    setTimeout(() => {
      const it = document.getElementById('interactive');
      it.addEventListener('custom', e => action('custom')(e.detail));
    }, 100);
    document.getElementsByTagName('html')[0].className =
      'gux-' + select('theme', ['dark', 'default'], 'default') + '-theme';
    return el;
  })
);
