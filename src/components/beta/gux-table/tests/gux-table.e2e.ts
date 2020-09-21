import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('gux-table', () => {
  let page: E2EPage;
  let element: E2EElement;

  beforeEach(async () => {
    page = await newE2EPage();
  });

  it('renders', async () => {
    await page.setContent(`
      <gux-table>
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </gux-table>
    `);
    element = await page.find('gux-table');
    expect(element).toHaveClass('hydrated');
  });

  it('should show horizontal scroll buttons', async () => {
    await page.setContent(`
      <gux-table>
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>E-mail</th>
              <th>Biography</th>
              <th>Date of birth</th>
              <th>Office</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th data-cell-numeric>Age</th>
              <th data-cell-action>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
              <td>test@testmail.test</td>
              <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
              <td>05/10/1980</td>
              <td>San Francisco</td>
              <td>Developer</td>
              <td>Javascript</td>
              <td>1500</td>
              <td data-cell-numeric>25</td>
              <td data-cell-action>Delete</td>
            </tr>
          </tbody>
        </table>
      </gux-table>
    `);
    const leftScrollButton = await page.find('.gux-table-scroll-left');
    const rightScrollButton = await page.find('.gux-table-scroll-right');
    expect(leftScrollButton).toBeTruthy();
    expect(rightScrollButton).toBeTruthy();
  });

  it('should have sortable column', async () => {
    await page.setContent(`
      <gux-table>
        <table slot="data">
          <thead>
            <tr>
              <th data-column-name="first-name" data-sortable>First name</th>
              <th>Last name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>Doe</td>
            </tr>
          </tbody>
        </table>
      </gux-table>
    `);
    const sortableColumn = await page.find('th[data-column-name="first-name"]');
    await sortableColumn.click();
    expect(sortableColumn.getAttribute('data-sort-direction')).toEqual('asc');
    await sortableColumn.click();
    expect(sortableColumn.getAttribute('data-sort-direction')).toEqual('desc');
    await sortableColumn.click();
    expect(sortableColumn.getAttribute('data-sort-direction')).toEqual(null);
  });

  it('should have empty table block', async () => {
    await page.setContent(`
      <gux-table>
        <table slot="data">
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th data-cell-numeric>Age</th>
              <th data-cell-action>Action</th>
            </tr>
          </thead>
        </table>
      </gux-table>
    `);
    const emptyTableBlock = await page.find('.empty-table');
    expect(emptyTableBlock).toBeTruthy();
  });
});
