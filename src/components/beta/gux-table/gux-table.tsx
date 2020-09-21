import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Prop,
  readTask,
  State
} from '@stencil/core';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import tableResources from './i18n/en.json';
import { IColumnResizeState } from './gux-table-constants';

@Component({
  styleUrl: 'gux-table.less',
  tag: 'gux-table'
})
export class GuxTable {
  @Element()
  root: HTMLElement;

  private resizeObserver: ResizeObserver;
  private i18n: GetI18nValue;
  private columnResizeState: IColumnResizeState | null;

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
   * Indicates columns in order they should be displayed
   */
  @Prop()
  columnOrder: string;

  /**
   * Indicates that table should have resizable columns
   */
  @Prop()
  resizableColumns: boolean;

  /**
   * Indicates that additional column for rows selection should be displayed
   */
  @Prop()
  selectableRows: boolean = false;

  /**
   * Triggers when the sorting of the table column is changed.
   */
  @Event() sortChanged: EventEmitter;

  /**
   * Triggers when table row was selected/unselected
   */
  @Event() selectionChanged: EventEmitter;

  @Listen('scroll', { capture: true })
  onScroll(): void {
    const scrollLeft = this.tableContainer.querySelector('.gux-table-container')
      .scrollLeft;
    const maxScrollLeft =
      this.tableContainer.querySelector('.gux-table-container').scrollWidth -
      this.tableContainer.querySelector('.gux-table-container').clientWidth;

    if (scrollLeft === 0) {
      this.isScrolledToFirstCell = true;
    } else if (maxScrollLeft - scrollLeft - this.tableScrollbarConstant <= 5) {
      this.isScrolledToLastCell = true;
    }
  }

  @Listen('mouseup', { capture: true })
  onMouseUp(): void {
    if (this.columnResizeState) {
      this.tableContainer.classList.remove('column-resizing');

      /**
       * We need to use setTimeout here to prevent firing 'click' event logic, which
       * change sort direction. It happens when user resize column and release
       * mouse button outside of gux-column-resize div element
       */
      setTimeout(() => {
        this.columnResizeState = null;
      });
    }
  }

  @Listen('mousemove', { capture: true })
  onMouseMove(event: MouseEvent): void {
    if (this.columnResizeState) {
      this.columnResizeState.resizableColumn.style.minWidth =
        this.columnResizeState.resizableColumnInitialWidth +
        (event.pageX - this.columnResizeState.columnResizeMouseStartX) +
        'px';
      this.columnResizeState.resizableColumn.style.width =
        this.columnResizeState.resizableColumnInitialWidth +
        (event.pageX - this.columnResizeState.columnResizeMouseStartX) +
        'px';
    }
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
      this.objectTable ? 'object-table' : ''
    ]
      .join(' ')
      .trim();
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

  private setRowsCellsNames(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const rowsElements = Array.from(
      this.tableContainer.querySelectorAll('tbody tr')
    );

    rowsElements.map(row => {
      Array.from(row.querySelectorAll('td')).forEach(
        (cell: HTMLElement, cellIndex: number) => {
          cell.setAttribute(
            'data-column-name',
            columnsElements[cellIndex].getAttribute('data-column-name')
          );
        }
      );
    });
  }

  private prepareResizableColumns(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    ).slice(0, -1);

    const resizeElement = document.createElement('div');
    resizeElement.setAttribute('class', 'gux-column-resize');

    columnsElements.forEach((column: HTMLElement) => {
      const columnResizeElement = resizeElement.cloneNode(true);

      columnResizeElement.addEventListener('mouseover', () => {
        this.tableContainer.classList.add('column-resizing-hover');
      });
      columnResizeElement.addEventListener('mouseleave', () => {
        this.tableContainer.classList.remove('column-resizing-hover');
      });

      columnResizeElement.addEventListener('mousedown', (event: MouseEvent) => {
        const currentElement = event.target as HTMLElement;
        const resizableColumn = currentElement.parentNode as HTMLElement;

        this.columnResizeState = {
          resizableColumn,
          columnResizeMouseStartX: event.pageX,
          resizableColumnInitialWidth: resizableColumn.clientWidth - 12 - 24
        };

        this.tableContainer.classList.add('column-resizing');
      });

      column.appendChild(columnResizeElement);
    });
  }

  private prepareSortableColumns(): void {
    const columnsElements = Array.from(
      this.tableContainer.querySelectorAll('thead th')
    );
    const downArrow = document.createElement('gux-icon');
    const upArrow = document.createElement('gux-icon');
    const sortingHiglight = document.createElement('div');

    downArrow.setAttribute('icon-name', 'ic-arrow-solid-down');
    downArrow.setAttribute('class', 'gux-column-sort-arrow-down');
    downArrow.setAttribute('decorative', '');
    upArrow.setAttribute('icon-name', 'ic-arrow-solid-up');
    upArrow.setAttribute('class', 'gux-column-sort-arrow-up');
    upArrow.setAttribute('decorative', '');
    sortingHiglight.setAttribute('class', 'gux-column-sort-highlight');

    columnsElements.forEach((column: HTMLElement) => {
      if (column.dataset.hasOwnProperty('sortable')) {
        column.appendChild(downArrow.cloneNode(true));
        column.appendChild(upArrow.cloneNode(true));
        column.appendChild(sortingHiglight.cloneNode(true));
        column.onclick = (event: MouseEvent) => {
          if (!this.columnResizeState) {
            const columnElement = event.target as HTMLElement;
            const sortDirection = columnElement.dataset.sortDirection || '';

            switch (sortDirection) {
              case '':
                columnElement.setAttribute('data-sort-direction', 'asc');
                break;
              case 'asc':
                columnElement.setAttribute('data-sort-direction', 'desc');
                break;
              case 'desc':
                columnElement.removeAttribute('data-sort-direction');
                break;
            }

            this.sortChanged.emit({
              columnName: columnElement.dataset.columnName,
              sortDirection: columnElement.dataset.sortDirection || null
            });
          }
        };
      }
    });
  }

  private reorderColumns(): void {
    const columnOrder = this.columnOrder.split(' ');
    const tableHead = this.tableContainer.querySelector('thead tr');
    const tableBody = this.tableContainer.querySelectorAll('tbody tr');
    const reorderedColumns = [];

    columnOrder.forEach((columnName: string) => {
      reorderedColumns.push(
        Array.from(tableHead.children).find(el => {
          return el.getAttribute('data-column-name') === columnName;
        })
      );
    });

    tableHead.innerHTML = '';
    reorderedColumns.forEach((column: HTMLElement) => {
      tableHead.appendChild(column);
    });

    tableBody.forEach((row: HTMLElement) => {
      const reorderedRowCells = [];

      columnOrder.forEach((columnName: string) => {
        reorderedRowCells.push(
          Array.from(row.children).find((cell: HTMLElement) => {
            return cell.getAttribute('data-column-name') === columnName;
          })
        );
      });

      row.innerHTML = '';
      reorderedRowCells.forEach((cell: HTMLElement) => {
        row.appendChild(cell);
      });
    });
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

  private handleRowSelection(event: CustomEvent): void {
    const checkboxElement = event.target as HTMLElement;
    const currentRow = checkboxElement.parentElement
      .parentElement as HTMLTableRowElement;

    if (event.detail) {
      currentRow.setAttribute('data-selected-row', '');

      this.selectionChanged.emit({
        rowsIndices: [currentRow.rowIndex - 1],
        actionType: 'selected'
      });
    } else {
      currentRow.removeAttribute('data-selected-row');

      this.selectionChanged.emit({
        rowsIndices: [currentRow.rowIndex - 1],
        actionType: 'unselected'
      });
    }

    const rowsSelectionCheckboxes = Array.from(
      this.tableContainer.querySelectorAll('tbody gux-checkbox')
    );
    const isAllCheckboxesSelected = rowsSelectionCheckboxes.every(
      (checkbox: HTMLGuxCheckboxElement) => {
        return checkbox.checked;
      }
    );
    const isSomeCheckboxUnselected = rowsSelectionCheckboxes.some(
      (checkbox: HTMLGuxCheckboxElement) => {
        return !checkbox.checked;
      }
    );

    const allRowsSelectionCheckbox = this.tableContainer.querySelector(
      'thead gux-checkbox'
    ) as HTMLGuxCheckboxElement;
    if (isAllCheckboxesSelected) {
      allRowsSelectionCheckbox.checked = true;
    } else if (allRowsSelectionCheckbox.checked && isSomeCheckboxUnselected) {
      allRowsSelectionCheckbox.checked = false;
    }
  }

  private handleAllRowsSelection(event: CustomEvent): void {
    const rowSelectionCells = Array.from(
      this.tableContainer.querySelectorAll('td[data-cell-row-selection]')
    );
    const tableRows = Array.from(
      this.tableContainer.querySelectorAll('tbody tr')
    );

    if (event.detail) {
      rowSelectionCells.forEach((cell: HTMLElement) => {
        cell.children[0].setAttribute('checked', '');
      });
      tableRows.forEach((row: HTMLElement) => {
        row.setAttribute('data-selected-row', '');
      });

      this.selectionChanged.emit({
        rowsIndices: [...Array(rowSelectionCells.length).keys()],
        actionType: 'selected'
      });
    } else {
      rowSelectionCells.forEach((cell: HTMLElement) => {
        cell.children[0].removeAttribute('checked');
      });
      tableRows.forEach((row: HTMLElement) => {
        row.removeAttribute('data-selected-row');
      });

      this.selectionChanged.emit({
        rowsIndices: [...Array(rowSelectionCells.length).keys()],
        actionType: 'unselected'
      });
    }
  }

  private prepareSelectableRows(): void {
    const tableHead = this.tableContainer.querySelector('thead tr');
    const tableBody = this.tableContainer.querySelectorAll('tbody tr');
    const rowsSelectionCheckbox = document.createElement('gux-checkbox');
    const rowsSelectionColumn = document.createElement('th');

    rowsSelectionColumn.setAttribute('data-cell-row-selection', '');
    rowsSelectionColumn.appendChild(rowsSelectionCheckbox);
    tableHead.prepend(rowsSelectionColumn);

    rowsSelectionCheckbox.addEventListener(
      'check',
      this.handleAllRowsSelection.bind(this)
    );

    tableBody.forEach((row: HTMLElement) => {
      const rowSelectionCell = document.createElement('td');
      const rowSelectionCheckbox = document.createElement('gux-checkbox');
      rowSelectionCell.setAttribute('data-cell-row-selection', '');
      rowSelectionCell.appendChild(rowSelectionCheckbox);
      row.prepend(rowSelectionCell);

      rowSelectionCheckbox.addEventListener(
        'check',
        this.handleRowSelection.bind(this)
      );
    });
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
    if (!this.emptyMessage) {
      this.emptyMessage = this.i18n('emptyMessage');
    }

    this.setRowsCellsNames();

    if (this.columnOrder) {
      this.reorderColumns();
    }

    if (this.selectableRows && this.objectTable) {
      this.prepareSelectableRows();
    }

    this.prepareSortableColumns();

    if (this.resizableColumns) {
      this.prepareResizableColumns();
    }

    setTimeout(() => {
      this.checkHorizontalScroll();
      this.checkVerticalScroll();

      if (!this.resizeObserver && window.ResizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          readTask((): void => {
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
    });
  }

  disconnectedCallback(): void {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(
        this.tableContainer.querySelector('.gux-table-container table')
      );
    }
  }

  render() {
    return (
      <div class={this.tableClasses}>
        <div class={this.tableContainerClasses}>
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
