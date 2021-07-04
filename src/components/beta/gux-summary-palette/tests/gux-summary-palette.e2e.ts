import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-summary-palette', () => {
  let page: E2EPage;
  let element: E2EElement;
  beforeEach(async () => {
    page = await newE2EPage();
  });
  it('renders', async () => {
    await page.setContent(`
    <gux-summary-palette-beta></gux-summary-palette-beta>
    `);
    element = await page.find('gux-summary-palette');
    expect(element).toHaveClass('hydrated');
  });
});
