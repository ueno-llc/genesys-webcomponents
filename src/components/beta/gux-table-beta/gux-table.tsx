import {
  Component,
  Element,
  Event,
  EventEmitter,
  getAssetPath,
  h,
  Listen,
  Prop,
  readTask,
  State
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import tableResources from './i18n/en.json';
import {
  IColumnResizeState,
  ISortState,
  ISelectedState
} from './gux-table-constants';
import { whenEventIsFrom } from '../../../common-utils';

const COL_RESIZE_HANDLE_WIDTH = 3;

@Component({
  styleUrl: 'gux-table.less',
  tag: 'gux-table-beta'
})
export class GuxTable {
  @Element()
  root: HTMLElement;

  private resizeObserver: ResizeObserver;
  private i18n: GetI18nValue;
  private columnResizeState: IColumnResizeState | null;
  private tableId: string = this.generateTableId();
  private columnsWidths: object = {};

  /**
   * Indicates that vertical scroll is presented for table
   */
  @State()
  private isVerticalScroll: boolean = false;

  /**
   * Indicates that horizontal scroll is presented for table
   */
  @State()
  private isHorizontalScroll: boolean = false;

  /**
   * Indicates that table content scrolled to it's last column
   */
  @State()
  private isScrolledToFirstCell: boolean = true;

  /**
   * Indicates that table content scrolled to it's first column
   */
  @State()
  private isScrolledToLastCell: boolean = false;

  /**
   * Indicates if the mouse is in a position that supports starting resize
   */
  @State()
  private resizeHover: boolean = false;

  /**
   * Indicates table row density style
   */
  @Prop()
  compact: boolean = false;

  /**
   * Indicates that object table specific styles should be applied
   */
  @Prop()
  objectTable: boolean = false;

  /**
   * Represents info message that should be displayed for empty table
   */
  @Prop()
  emptyMessage: string;

  /**
   * Triggers when table row was selected/unselected
   */
  @Event() selectionChanged: EventEmitter<ISelectedState>;

  /**
   * Triggers when the sorting of the table column is changed.
   */
  @Event() sortChanged: EventEmitter<ISortState>;

  /**
   * Indicates that table should have resizable columns
   */
  @Prop()
  resizableColumns: boolean;

  @Listen('scroll', { capture: true })
  onScroll(): void {
    const scrollLeft = this.tableContainer.querySelector('.gux-table-container')
      .scrollLeft;
    const maxScrollLeft =
      this.tableContainer.querySelector('.gux-table-container').scrollWidth -
      this.tableContainer.querySelector('.gux-table-container').clientWidth;

    if (scrollLeft === 0) {
      this.isScrolledToFirstCell = true;
    } else if (maxScrollLeft - scrollLeft - this.tableScrollbarConstant === 0) {
      this.isScrolledToLastCell = true;
    }
  }

  @Listen('selectRow')
  onSelectRow(event): void {
    this.handleSelectableRows(event.target);
  }

  @Listen('mouseup', { capture: true })
  onMouseUp(): void {
    if (this.columnResizeState) {
      this.tableContainer.classList.remove('column-resizing');
      this.columnResizeState = null;
    }
  }

  @Listen('mousemove', { capture: true })
  onMouseMove(event: MouseEvent): void {
    if (this.resizableColumns) {
      if (this.columnResizeState) {
        const columnName = this.columnResizeState.resizableColumn.dataset
          .columnName;
        const columnWidth =
          this.columnResizeState.resizableColumnInitialWidth +
          (event.pageX - this.columnResizeState.columnResizeMouseStartX);

        this.columnsWidths[columnName] = `${
          columnWidth > 1 ? columnWidth : 1
        }px`;
        this.setResizableColumnsStyles();
      } else {
        this.resizeHover = false;
        whenEventIsFrom('th', event, (th: HTMLTableCellElement) => {
          const columnsLength = this.tableContainer.querySelectorAll(
            '.gux-table-container thead th'
          ).length;
          const isLastColumn = columnsLength - 1 === th.cellIndex;

          if (this.isInResizeZone(event, th) && !isLastColumn) {
            this.resizeHover = true;
          }
        });
      }
    }
  }

  @Listen('mousedown')
  onMouseDown(event: MouseEvent): void {
    whenEventIsFrom('th', event, th => {
      if (this.resizableColumns && this.isInResizeZone(event, th)) {
        const resizableColumn = th;

        this.columnResizeState = {
          resizableColumn,
          columnResizeMouseStartX: event.pageX,
          resizableColumnInitialWidth: resizableColumn.offsetWidth
        };

        this.tableContainer.classList.add('column-resizing');
      }
    });
  }

  private isInResizeZone(event: MouseEvent, header: HTMLElement): boolean {
    return (
      header.getBoundingClientRect().right - event.clientX <
      COL_RESIZE_HANDLE_WIDTH
    );
  }

  private prepareResizableColumns(): void {
    const styleElement = document.createElement('style');
    styleElement.id = `${this.tableId}-resizable-styles`;
    document.querySelector('head').appendChild(styleElement);
  }

  private get tableContainer(): HTMLElement {
    return this.root.children[0] as HTMLElement;
  }

  private get isTableEmpty(): boolean {
    return (
      !this.root.children[0] ||
      this.root.children[0].querySelectorAll('tbody tr').length < 1
    );
  }

  private get tableScrollbarConstant(): number {
    const container = this.tableContainer.querySelector(
      '.gux-table-container'
    ) as HTMLElement;
    return container ? container.offsetWidth - container.clientWidth : 0;
  }

  private get tableClasses(): string {
    return [
      'gux-table',
      this.isVerticalScroll ? 'vertical-scroll' : '',
      this.isHorizontalScroll ? 'horizontal-scroll' : ''
    ]
      .join(' ')
      .trim();
  }

  private get tableContainerClasses(): string {
    return [
      'gux-table-container',
      this.compact ? 'compact' : '',
      this.objectTable ? 'object-table' : '',
      this.columnResizeState ? 'column-resizing' : '',
      this.resizeHover ? 'column-resizing-hover' : ''
    ]
      .join(' ')
      .trim();
  }

  private generateTableId(): string {
    return `gux-table-${Math.random().toString(36).substr(2, 9)}`;
  }

  private previousColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    /**
     * Get current horizontal scroll postion
     */
    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    /**
     * Adding up all of the column widths until we get
     * to a column that is previous for the last visible
     */
    for (const column of columns) {
      const columnWidth = column.getBoundingClientRect().width;

      if (
        columnsWidth + columnWidth <
        containerWidth + Math.floor(currentScrollX - 1)
      ) {
        columnsWidth += columnWidth;
      } else {
        break;
      }
    }

    this.isScrolledToLastCell = false;

    /**
     * Manually decreasing scroll position of table container
     * for the width of last visible column
     */
    const scrollToValue = currentScrollX + containerWidth - columnsWidth;
    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(currentScrollX - scrollToValue);
  }

  private nextColumn(): void {
    const columns = Array.from(
      this.tableContainer.querySelectorAll('.gux-table-container thead th')
    );

    /**
     * Get current horizontal scroll postion
     */
    const currentScrollX = this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft;
    const containerWidth = this.root.getBoundingClientRect().width;
    let columnsWidth = 0;

    this.isScrolledToFirstCell = false;

    /**
     * Adding up all of the column widths until we get to a column
     * that overflows current viewport for the table
     */
    for (const column of columns) {
      columnsWidth += column.getBoundingClientRect().width;

      if (columnsWidth > containerWidth + currentScrollX) {
        break;
      }
    }

    /**
     * Manually increasing scroll position of table container with value,
     * where next partially visible column being fully visible
     */
    this.tableContainer.querySelector(
      '.gux-table-container'
    ).scrollLeft = Math.ceil(columnsWidth - containerWidth);
  }

  private checkHorizontalScroll(): void {
    const tableWidth = this.tableContainer
      .querySelector('.gux-table-container table')
      .getBoundingClientRect().width;
    const containerWidth = this.root.getBoundingClientRect().width;

    if (tableWidth <= containerWidth) {
      this.isHorizontalScroll = false;
    } else {
      this.isHorizontalScroll = true;
    }
  }

  private checkVerticalScroll(): void {
    const tableContainerElement = this.root.querySelector(
      '.gux-table-container'
    );
    this.isVerticalScroll =
      tableContainerElement.scrollHeight > tableContainerElement.clientHeight;
  }

  private prepareSortableColumns(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    this.setSortableColumnsStyles();

    columnsElements.forEach((column: HTMLElement) => {
      if (column.dataset.hasOwnProperty('sortable')) {
        column.onclick = (event: MouseEvent) => {
          const columnElement = event.target as HTMLElement;
          const sortDirection = columnElement.dataset.sort || '';
          let newSortDirection = null;

          switch (sortDirection) {
            case '':
              newSortDirection = 'asc';
              break;
            case 'asc':
              newSortDirection = 'desc';
              break;
          }

          this.sortChanged.emit({
            columnName: columnElement.dataset.columnName,
            sortDirection: newSortDirection
          });
        };
      }
    });
  }

  private setSortableColumnsStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.id = `${this.tableId}-sortable-styles`;

    const ascArrowIcon = getAssetPath(`./icons/ic-arrow-solid-down.svg`);
    const descArrowIcon = getAssetPath(`./icons/ic-arrow-solid-up.svg`);
    const sortAscContent = this.i18n('sortAsc');
    const sortDescContent = this.i18n('sortDesc');

    styleElement.innerHTML = `
      th[data-sortable]:hover:after{content: "${sortAscContent}";background-image: url("${ascArrowIcon}");}
      th[data-sort="asc"]:after{background-image:url("${ascArrowIcon}")!important;content:"${sortAscContent}"!important;}
      th[data-sort="desc"]:after{background-image:url("${descArrowIcon}")!important;content:"${sortDescContent}"!important;}
    `;

    document.querySelector('head').appendChild(styleElement);
  }

  private setResizableColumnsStyles(): void {
    const styleElement = document.getElementById(
      `${this.tableId}-resizable-styles`
    );
    let columnsStyles = '';

    Object.keys(this.columnsWidths).forEach((column: string) => {
      columnsStyles += `#${this.tableId} th[data-column-name="${column}"]{width:${this.columnsWidths[column]};min-width:${this.columnsWidths[column]};}`;
    });

    styleElement.innerHTML = columnsStyles;
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);

    if (!this.emptyMessage) {
      this.emptyMessage = this.i18n('emptyMessage');
    }
  }

  componentDidLoad() {
    if (this.resizableColumns) {
      this.prepareResizableColumns();
    }

    this.prepareSortableColumns();
    this.checkHorizontalScroll();
    this.checkVerticalScroll();

    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        readTask(() => {
          this.checkHorizontalScroll();
          this.checkVerticalScroll();
        });
      });
    }

    if (this.resizeObserver) {
      this.resizeObserver.observe(
        this.tableContainer.querySelector('.gux-table-container table')
      );
    }
  }

  disconnectedCallback(): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(
        this.tableContainer.querySelector('.gux-table-container table')
      );
    }

    if (this.resizableColumns) {
      document.getElementById(`${this.tableId}-resizable-styles`).remove();
      document.getElementById(`${this.tableId}-sortable-styles`).remove();
    }
  }

  private rowSelection(checkbox: HTMLGuxCheckboxElement): void {
    const currentRow: HTMLElement =
      checkbox.parentElement.parentElement.parentElement;
    if (checkbox.checked) {
      currentRow.setAttribute('data-selected-row', '');
      this.selectionChanged.emit({
        rowIds: [currentRow.getAttribute('data-row-id')],
        actionType: 'selected'
      });
    } else {
      currentRow.removeAttribute('data-selected-row');
      this.selectionChanged.emit({
        rowIds: [currentRow.getAttribute('data-row-id')],
        actionType: 'unselected'
      });
    }
  }

  private allRowsSelection(mainCheckbox: HTMLGuxCheckboxElement): void {
    mainCheckbox.checked = mainCheckbox.checked ? false : true;
    const rowsSelectionCheckboxes: NodeList = this.tableContainer.querySelectorAll(
      'tbody gux-checkbox'
    );
    const allAttributes: string[] = [];
    rowsSelectionCheckboxes.forEach((checkbox: HTMLGuxCheckboxElement) => {
      const parentTrElement: HTMLElement =
        checkbox.parentElement.parentElement.parentElement;
      allAttributes.push(parentTrElement.getAttribute('data-row-id'));
      if (mainCheckbox.checked) {
        checkbox.checked = true;
        parentTrElement.setAttribute('data-selected-row', '');
      } else {
        checkbox.checked = false;
        parentTrElement.removeAttribute('data-selected-row');
      }
    });
    this.selectionChanged.emit({
      rowIds: allAttributes,
      actionType: mainCheckbox.checked ? 'selected' : 'unselected'
    });
  }

  private handleSelectableRows(rowSelect): void {
    const bodyCheckboxes: HTMLGuxCheckboxElement[] = Array.from(
      this.tableContainer.querySelectorAll('tbody gux-row-select gux-checkbox')
    );
    const isNotAllCheckboxesSelected: boolean = !!bodyCheckboxes.find(
      (checkbox: HTMLGuxCheckboxElement) => {
        return !checkbox.checked;
      }
    );
    const currentCheckbox: HTMLGuxCheckboxElement = rowSelect.children[0];
    const mainCheckbox: HTMLGuxCheckboxElement = this.tableContainer.querySelector(
      'thead gux-row-select gux-checkbox'
    );
    mainCheckbox.checked = !isNotAllCheckboxesSelected;
    if (currentCheckbox === mainCheckbox) {
      this.allRowsSelection(currentCheckbox);
    } else {
      this.rowSelection(currentCheckbox);
    }
  }

  render() {
    return (
      <div class={this.tableClasses}>
        <div id={this.tableId} class={this.tableContainerClasses}>
          <slot name="data" />
        </div>
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToFirstCell
                ? 'gux-table-scroll-left disabled'
                : 'gux-table-scroll-left'
            }
            onClick={
              !this.isScrolledToFirstCell && this.previousColumn.bind(this)
            }
          >
            <gux-icon
              icon-name="ic-chevron-left"
              screenreader-text={this.i18n('scrollLeft')}
            />
          </button>
        )}
        {this.isHorizontalScroll && (
          <button
            class={
              this.isScrolledToLastCell
                ? 'gux-table-scroll-right disabled'
                : 'gux-table-scroll-right'
            }
            style={{ marginRight: `${this.tableScrollbarConstant}px` }}
            onClick={!this.isScrolledToLastCell && this.nextColumn.bind(this)}
          >
            <gux-icon
              icon-name="ic-chevron-right"
              screenreader-text={this.i18n('scrollRight')}
            />
          </button>
        )}
        {this.isTableEmpty && (
          <div class="empty-table">
            <h2>{this.emptyMessage}</h2>
          </div>
        )}
      </div>
    );
  }
}
