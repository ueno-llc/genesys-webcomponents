import { newSpecPage } from '@stencil/core/testing';
import { GuxSummaryPalette } from '../gux-summary-palette';

describe('gux-summary-palette', () => {
  let component: GuxSummaryPalette;

  beforeEach(async () => {
    const page = await newSpecPage({
      components: [GuxSummaryPalette],
      html: `<gux-summary-palette-beta></gux-summary-palette-beta>`,
      language: 'en'
    });

    component = page.rootInstance;
  });

  describe('Class Logic', () => {
    let firstSection;
    let secondSection;
    let thirdSection;

    beforeEach(async () => {
      firstSection = {
        slotName: 'First',
        slotRef: 'DummyRef1'
      };
      secondSection = {
        slotName: 'Second',
        slotRef: 'DummyRef2'
      };
      thirdSection = {
        slotName: 'Third',
        slotRef: 'DummyRef3'
      };
      component.sections = [firstSection, secondSection, thirdSection];
    });

    it('getSectionByName', () => {
      const section = component.getSectionByName(firstSection.slotName);
      expect(section).toEqual(firstSection);
    });

    it('getPreviousSlot', () => {
      expect(component.getPreviousSlot(firstSection.slotName)).toEqual(
        thirdSection.slotRef
      );
      expect(component.getPreviousSlot(thirdSection.slotName)).toEqual(
        secondSection.slotRef
      );
    });

    it('getNextSlot', () => {
      expect(component.getNextSlot(thirdSection.slotName)).toEqual(
        firstSection.slotRef
      );
      expect(component.getNextSlot(firstSection.slotName)).toEqual(
        secondSection.slotRef
      );
    });
  });
});
