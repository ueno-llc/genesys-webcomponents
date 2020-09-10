import {
  Component,
  State,
  Prop,
  Listen,
  JSX,
  EventEmitter,
  h
} from '@stencil/core';

@Component({
  tag: 'gux-flyout-option-menu'
})
export class GuxFlyoutOptionMenu {
  @State()
  active = false;

  @Prop() hasInnerOption: boolean;
  @Prop() name = 'default name';
  @Prop() secondName = 'default second name';

  @Listen('mouseover')
  @Listen('click')
  isActive(): void {
    this.active = true;
  }

  @Listen('mouseout')
  isLeave() {
    this.active = false;
  }

  private isMenuVisible = () =>
    this.active ? 'menu-options menu-options_active' : 'menu-options';

  private optionBuilderWithInnerOption = () => (
    <div class="menu-inner-option">
      <slot>{this.name}</slot>
      {this.optionBuilder(this.secondName)}
    </div>
  );

  private optionBuilder = (name?: string) => (
    <gux-flyout-option class={this.isMenuVisible()}>
      {name ? name : this.name}
    </gux-flyout-option>
  );

  render() {
    return (
      <div class="main-menu-options">
        {this.hasInnerOption
          ? this.optionBuilderWithInnerOption()
          : this.optionBuilder()}
      </div>
    );
  }
}
