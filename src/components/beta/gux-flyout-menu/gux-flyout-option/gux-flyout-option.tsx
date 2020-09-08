import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Prop
} from '@stencil/core';

@Component({
  tag: 'gux-flyout-option'
})
export class GuxFlyoutOption {
  @Element()
  root: HTMLElement;
  slotContent: HTMLElement;

  @Prop()
  value: string;

  /**
   * The content of this attribute represents the value to be displayed,
   * If this attribute is omitted, the value is taken from the text content of the slot.
   * This attribute takes precedence over slot value
   */
  @Prop()
  text: string;

  /**
   * Occurs when the item has been selected.
   */
  @Event()
  selectedChanged: EventEmitter<string>;

  /**
   * Occurs when the item has been focused.
   */
  @Event()
  onFocus: EventEmitter<string>;

  componentWillLoad() {
    if (!this.text) {
      this.text = this.root.textContent;
    }
  }

  hostData() {
    return {
      tabindex: '0'
    };
  }

  render() {
    return <slot />;
  }
}
