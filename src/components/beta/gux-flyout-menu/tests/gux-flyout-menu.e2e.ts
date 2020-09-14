import { newE2EPage } from '@stencil/core/testing';

describe('gux-panel-frame', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<gux-flyout-menu-beta></gux-flyout-menu-beta>');
    const element = await page.find('gux-flyout-menu-beta');
    expect(element).toHaveClass('hydrated');
  });

  it('opens drop down on click', async () => {
    const page = await newE2EPage();

    await page.setContent(`
      <gux-flyout-option id="opt1" name="Option One" short-cut="Crl+Alt+A"></gux-flyout-option>
      <gux-flyout-option name="Option Two" short-cut="Crl+Alt+C"></gux-flyout-option>
      <gux-flyout-option name="Option Three" short-cut="Shift+A"></gux-flyout-option>
      <gux-flyout-option name="Option Four" short-cut="⌘A"></gux-flyout-option>
      <gux-flyout-option name="Option Five" short-cut="⌘⇧A"></gux-flyout-option>
    `);
    await page.waitForChanges();

    const element = await page.find('#opt1');
    await element.click();
    await page.waitForChanges();
    // await page.waitFor(1000);
    expect(await element.className('')).toEqual(false);
  });
});
