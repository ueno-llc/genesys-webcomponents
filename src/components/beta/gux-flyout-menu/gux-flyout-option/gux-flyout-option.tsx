import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'gux-flyout-option'
})
export class GuxFlyoutOption {
  @Prop() hasInnerOption: boolean;
  @Prop() name = 'default name';
  @Prop() secondName = 'default second name';
  @Prop() withIcon: boolean;
  @Prop() iconName = 'angle-right';

  private isIcon = iconName =>
    this.withIcon && (
      <gux-icon screenreaderText={iconName} icon-name={iconName} />
    );

  private optionBuilderWithInnerOption = () => <slot>{this.name}</slot>;

  render() {
    return (
      <div class="main-menu-options">
        {this.hasInnerOption ? this.optionBuilderWithInnerOption() : <slot />}
        {this.isIcon(this.iconName)}
      </div>
    );
  }
}
