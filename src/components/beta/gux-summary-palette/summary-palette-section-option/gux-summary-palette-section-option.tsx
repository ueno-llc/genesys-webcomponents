import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'gux-summary-palette-section-option'
})
export class GuxSummaryPaletteSectionOption {
  @Prop()
  slot: string;

  @State()
  element: HTMLElement | string;

  @State()
  isDeleteElement: boolean = false;

  @State()
  defaultElement: HTMLElement = (
    <p class="gux-summary-palette-section-option">
      <span class="icon-row">
        <gux-icon
          class="delete-icon"
          icon-name="close"
          decorative
          onClick={() => this.deleteElement()}
        />
      </span>
      <slot />
    </p>
  );

  componentWillLoad() {
    this.element = this.defaultElement;
  }

  private deleteElement() {
    this.isDeleteElement = true;
    this.element = (
      <p class="gux-summary-palette-section-deleted-option">
        <span class="icon-row">
          <gux-icon
            class="undo-icon"
            icon-name="ic-undo"
            decorative
            onClick={() => this.undoDeletingElement()}
          />
        </span>
        Undo | Removed: <slot />
      </p>
    );
    setTimeout(() => {
      if (this.isDeleteElement) this.element = null;
      this.isDeleteElement = false;
    }, 5000);
  }

  private undoDeletingElement() {
    this.isDeleteElement = false;
    this.element = this.defaultElement;
  }

  render() {
    return this.element;
  }
}
