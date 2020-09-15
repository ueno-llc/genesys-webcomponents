import { Component, h, Listen, Event, Prop, EventEmitter } from '@stencil/core';

@Component({
  tag: 'gux-flyout-option'
})
export class GuxFlyoutOption {
  @Prop() name = 'default name';
  @Prop() withIcon: boolean;
  @Prop() iconName = 'angle-right';
  @Prop() shortCut: string;
  @Prop() keyCode?: string;
  @Prop() secondKeyCode?: string;
  @Prop() thirdKeyCode?: string;

  @Event() shortcutEvent: EventEmitter;

  @Listen('keydown')
  keyHandler(e) {
    if (
      e.keyCode === this.keyCode &&
      this.secondKeyCode &&
      e.keyCode === this.secondKeyCode &&
      this.thirdKeyCode &&
      e.keyCode === this.thirdKeyCode
    ) {
      this.shortcutEvent.emit();
    }
  }

  private isIcon = iconName =>
    this.withIcon ? (
      <gux-icon screenreaderText={iconName} icon-name={iconName} />
    ) : (
      <span> {this.shortCut} </span>
    );

  render() {
    return (
      <div class="main-menu-options">
        <slot>{this.name}</slot>
        {this.isIcon(this.iconName)}
      </div>
    );
  }
}
