import { Component, Element, h, Prop } from '@stencil/core';

@Component({
  tag: 'gux-summary-palette-section'
})
export class GuxSummaryPaletteSection {
  @Element()
  root: HTMLElement;

  @Prop()
  checkBox: string;

  @Prop()
  options: boolean = false;

  private getCheckbox(): HTMLElement {
    if (this.checkBox) {
      return (
        <div class="checkbox-row">
          <gux-checkbox>{this.checkBox}</gux-checkbox>
        </div>
      );
    }
  }

  private getOptions(): HTMLElement {
    if (this.options) {
      return (
        <gux-radio-group
          class="options-row"
          name="food-selection"
          aria-labelledby="food-header"
        >
          <gux-radio value="pooled">Pooled</gux-radio>
          <gux-radio value="individual">Per Individual</gux-radio>
        </gux-radio-group>
      );
    }
  }

  render() {
    return (
      <div class="gux-summary-palette-section-option-row">
        <div>
          <slot />
          {this.getOptions()}
        </div>
        {this.getCheckbox()}
      </div>
    );
  }
}
