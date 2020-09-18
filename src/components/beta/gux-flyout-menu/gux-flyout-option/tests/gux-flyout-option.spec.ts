import { newSpecPage } from '@stencil/core/testing';
import { GuxFlyoutOption } from '../gux-flyout-option';

describe('GuxFlyoutOption', () => {
  let component: GuxFlyoutOption;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxFlyoutOption],
      html: `
        <gux-flyout-option
          name="Option One"
          short-cut="Crl+Alt+A"
          key-code="19"
          second-key-code="34"
          third-key-code="11"
        ></gux-flyout-option>
      `,
      language: 'en'
    });

    component = page.rootInstance;
  });

  it('should build', async () => {
    expect(component).toBeInstanceOf(GuxFlyoutOption);
  });

  describe('Methods', () => {
    it('should change selected value', () => {
      component.keyCode = 'test';
      component.secondKeyCode = 'test';
      component.thirdKeyCode = 'test';
      const mockedEvent = {
        keyCode: 'test',
        secondKeyCode: 'test',
        thirdKeyCode: 'test'
      };

      component.keyHandler(mockedEvent);

      expect(component.selectedValue).toBeTruthy();

      component.keyHandler(mockedEvent);

      expect(component.selectedValue).toBeFalsy();
    });
  });
});
