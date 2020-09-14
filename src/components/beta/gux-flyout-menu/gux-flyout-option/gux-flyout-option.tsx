import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'gux-flyout-option'
})
export class GuxFlyoutOption {
  @Prop() name = 'default name';
  @Prop() withIcon: boolean;
  @Prop() iconName = 'angle-right';
  @Prop() shortCut: string;

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
