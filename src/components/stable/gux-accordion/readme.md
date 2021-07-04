# gux-accordion



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                               | Type     | Default |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------- |
| `headingLevel` | `heading-level` | The heading level within the page the accordion section headers should be set to. heading-level="3" woudl be equivalent to an h3 element. | `number` | `null`  |


## Methods

### `close(slot: string) => Promise<void>`

Closes a section.

#### Returns

Type: `Promise<void>`



### `open(slot: string) => Promise<void>`

Opens a section.

#### Returns

Type: `Promise<void>`



### `toggle(slot: string) => Promise<void>`

Toggles a section.

#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [gux-summary-palette-beta](../../beta/gux-summary-palette)

### Depends on

- [gux-icon](../gux-icon)

### Graph
```mermaid
graph TD;
  gux-accordion --> gux-icon
  gux-summary-palette-beta --> gux-accordion
  style gux-accordion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
