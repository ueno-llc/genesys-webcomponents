# gux-radio

A radio button component, intended to be used in conjunction with the `gux-radio-group` component.  Labels should be provided through the component's main slot.

## Example Usage

See documentation for the `gux-radio-group` documentation for a more thourough example.

```
<gux-radio value="pizza">I like pizza!</gux-radio>
```

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                            | Type      | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------------------------ | --------- | ----------- |
| `checked`  | `checked`  | Whether or not this radio is checked.                                                                  | `boolean` | `false`     |
| `disabled` | `disabled` | Whether or not the radio is disabled.                                                                  | `boolean` | `false`     |
| `name`     | `name`     | The radio group name for this radio button.  Automatically inherited/overwritten by a gux-radio-group. | `string`  | `undefined` |
| `value`    | `value`    | The form value to use for the radio button.                                                            | `string`  | `undefined` |


## Events

| Event   | Description                                         | Type                   |
| ------- | --------------------------------------------------- | ---------------------- |
| `check` | Fired when the checked status of the radio changes. | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [gux-summary-palette-section](../../beta/gux-summary-palette/summary-palette-section)

### Graph
```mermaid
graph TD;
  gux-summary-palette-section --> gux-radio
  style gux-radio fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
