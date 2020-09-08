import { Component, Element, h } from '@stencil/core';

@Component({
  styleUrl: 'gux-flyout-menu.less',
  tag: 'gux-flyout-menu-beta'
})
export class GuxFlyoutMenu {
  @Element()
  root: HTMLElement;

  render() {
    return (
      <div class="gux-flyout-menu-content">
        <slot />
      </div>
    );
  }
}
