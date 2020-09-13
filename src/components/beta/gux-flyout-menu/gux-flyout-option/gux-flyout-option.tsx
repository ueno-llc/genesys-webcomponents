import { Component, h, Listen, Prop, State } from '@stencil/core';

@Component({
  tag: 'gux-flyout-option'
})
export class GuxFlyoutOption {
  @State()
  active = false;

  @Prop() hasInnerOption: boolean;
  @Prop() name = 'default name';
  @Prop() secondName = 'default second name';
  @Prop() withIcon: boolean;
  @Prop() iconName = 'angle-right';

  @Listen('click')
  isActive(): void {
    this.active = !this.active;
  }

  private isMenuVisible = () =>
    this.active ? 'menu-options menu-options_active' : 'menu-options';

  private isIcon = iconName =>
    this.withIcon && (
      <gux-icon screenreaderText={iconName} icon-name={iconName} />
    );

  private optionBuilderWithInnerOption = () => (
    <div class={this.isMenuVisible()}>
      <slot>{this.name}</slot>
    </div>
  );

  render() {
    return (
      <div class="main-menu-options">
        {this.hasInnerOption ? this.optionBuilderWithInnerOption() : <slot />}
        {this.isIcon(this.iconName)}
      </div>
    );
  }
}
