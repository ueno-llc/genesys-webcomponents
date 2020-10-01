import { Component, h, Listen, Event, Prop, EventEmitter } from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-option.less',
  tag: 'gux-flyout-option-beta'
})
export class GuxFlyoutOption {
  @Prop() withIcon: boolean;
  @Prop({ mutable: true })
  @Prop()
  shortCut: string;
  @Prop() keyCode?: string;
  @Prop() secondKeyCode?: string;
  @Prop() thirdKeyCode?: string;

  selectedValue: boolean;

  @Event()
  shortcutEvent: EventEmitter;

  @Listen('keydown')
  keyHandler(e) {
    if (
      e.keyCode === this.keyCode &&
      this.secondKeyCode &&
      e.keyCode === this.secondKeyCode &&
      this.thirdKeyCode &&
      e.keyCode === this.thirdKeyCode
    ) {
      this.selectedValue = !this.selectedValue;
      this.shortcutEvent.emit();
    }
  }

  private isIcon = () =>
    this.withIcon ? (
      <gux-icon screenreaderText="angle-right" icon-name="angle-right" />
    ) : (
      <span> {this.shortCut} </span>
    );

  render() {
    return (
      <div class="gux-flyout-option-container">
        <slot name="title" />
        <slot name="submenu" />
        {this.isIcon()}
      </div>
    );
  }
}
