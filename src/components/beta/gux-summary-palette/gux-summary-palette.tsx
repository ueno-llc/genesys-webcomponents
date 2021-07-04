import { Component, Element, h, Method, Prop, State } from '@stencil/core';

interface IAccordionSection {
  slotName: string;
}

@Component({
  styleUrl: 'gux-summary-palette.less',
  tag: 'gux-summary-palette-beta'
})
export class GuxSummaryPalette {
  @Element()
  root: HTMLElement;

  sections: IAccordionSection[] = [];

  componentWillLoad() {
    this.initializeSections();
  }

  initializeSections() {
    const children = Array.from(this.root.children);
    children.map(element => {
      const slot = element.getAttribute('slot');
      if (slot) {
        this.sections.push({
          slotName: slot
        });
      }
    });
  }

  render() {
    return (
      <div class="gux-summary-palette">
        <gux-disclosure-button position="right">
          <div slot="panel-content">
            <div class="gux-summary-palette-info">
              <gux-accordion>
                {this.sections.map(slot => (
                  <slot name={slot.slotName} />
                ))}
              </gux-accordion>
              <h2 class="title">Evaluation Summary</h2>
            </div>
          </div>
        </gux-disclosure-button>
      </div>
    );
  }
}
