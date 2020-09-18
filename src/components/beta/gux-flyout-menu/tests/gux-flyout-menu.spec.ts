import { newSpecPage } from '@stencil/core/testing';
import { GuxFlyoutMenu } from '../gux-flyout-menu';
import { GuxFlyoutOption } from '../gux-flyout-option/gux-flyout-option';

describe('GuxFlyoutMenu', () => {
  let component: GuxFlyoutMenu;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxFlyoutMenu, GuxFlyoutOption],
      html: `
        <gux-flyout-menu-beta>
          <gux-flyout-option
            name="Option One"
            short-cut="Crl+Alt+A"
            key-code="19"
            second-key-code="34"
            third-key-code="11"
          ></gux-flyout-option>
          <gux-flyout-option name="Option Two" short-cut="Crl+Alt+C"></gux-flyout-option>
          <gux-flyout-option name="Option Three" short-cut="Shift+A"></gux-flyout-option>
        </gux-flyout-menu-beta>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxFlyoutMenu);
  });
});
