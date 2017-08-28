/*MIT License

Copyright (c) 2017 Israel Barth Rubio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

/// <summary>
/// Function to perform a binary search over an array of elements.
/// </summary>
/// <param name="p_searchElement">Javascript element to be searched for.</param>
Array.prototype.binaryIndexOf = function(p_searchElement) {
    'use strict';
 
    var v_minIndex = 0;
    var v_maxIndex = this.length - 1;
    var v_currentIndex;
    var v_currentElement;
 
    while(v_minIndex <= v_maxIndex) {
        v_currentIndex = (v_minIndex + v_maxIndex) / 2 | 0;
        v_currentElement = this[v_currentIndex];
 
        if(v_currentElement < p_searchElement) {
            v_minIndex = v_currentIndex + 1;
        }
        else if(v_currentElement > p_searchElement) {
            v_maxIndex = v_currentIndex - 1;
        }
        else {
            return v_currentIndex;
        }
    }
 
    return -1;
}

/// <summary>
/// Function that removes duplicates from an array.
/// </summary>
/// <returns>New array without duplicates</returns>
Array.prototype.unique = function() {
    var v_object = {};
    var i;
    var v_lenght = this.length;
    var v_return = [];

    for(i = 0; i < v_lenght; i += 1) {
        v_object[this[i]] = this[i];
    }

    for(i in v_object) {
        v_return.push(v_object[i]);
    }

    return v_return;
};

/// <summary>
/// Converts a number to a formatted string.
/// </summary>
/// <param name="p_number">The number to be formatted.</param>
/// <paramref name="p_number">Takes an integer or a float.
/// <returns>Formatted number as string</returns>
function numberToString(p_number) {
    p_number += '';
    var v_x = p_number.split('.');
    var v_x1 = v_x[0];
    var v_x2 = v_x.length > 1 ? '.' + v_x[1] : '';

    var v_regex = /(\d+)(\d{3})/;

    while(v_regex.test(v_x1)) {
        v_x1 = v_x1.replace(v_regex, '$1' + ',' + '$2');
    }

    return v_x1 + v_x2;
}

/// <summary>
/// Creates a new grid object instance.
/// </summary>
/// <param name="p_containerDivId">The grid container.</param>
/// <paramref name="p_containerDivId">Takes a dom element id.
/// <param name="p_draggableRows">If rows index can be changed.</param>
/// <paramref name="p_draggableRows">Takes a boolean.
/// <returns>Grid javscript object instance</returns>
function startGrid(p_containerDivId, p_draggableRows) {
    var v_gridObject = {
        //Set of functions to be called after some operations in grid component. After starting the grid component, you should replace the callbacks as you want.
        callbacks: {
            /// <summary>
            /// Function called after a grid cell data is changed.
            /// </summary>
            /// <param name="p_component">The grid component where changes were made.</param>
            /// <paramref name="p_component">Takes a javascript object.
            /// <param name="p_row">The grid row number where changes were made.</param>
            /// <paramref name="p_row">Takes an integer.
            /// <param name="p_column">The grid column number where changes were made.</param>
            /// <paramref name="p_column">Takes an integer.
            /// <param name="p_oldValue">The previous value in the grid cell.</param>
            /// <param name="p_newValue">The new value in the grid cell.</param>
            /// <param name="p_dataMode">If the index is to be applied in all data or in rendered(filtered) data.</param>
            /// <paramref name="p_dataMode">Takes a string between 'all' and 'rendered'.
            /// <param name="p_isFiltered">If the cell belongs to a row that is filtered after its value has changed.</param>
            /// <paramref name="p_isFiltered">Takes a boolean.
            afterChangeCellData: null,
            /// <summary>
            /// Function called after this grid is rendered.
            /// </summary>
            /// <param name="p_component">This grid object.</param>
            /// <paramref name="p_component">Grid javascript object instance.
            afterRenderGrid: null,
            /// <summary>
            /// Function called after a grid cell is rendered.
            /// </summary>
            /// <param name="p_component">This grid object.</param>
            /// <paramref name="p_component">Grid javascript object instance.
            /// <param name="p_cellDiv">The grid cell rendered.</param>
            /// <paramref name="p_cellDiv">Grid cell div element.
            /// <param name="p_row">The grid row number where changes were made.</param>
            /// <paramref name="p_row">Takes an integer.
            /// <param name="p_column">The grid column number where changes were made.</param>
            /// <paramref name="p_column">Takes an integer.
            afterRenderCell: null,
            /// <summary>
            /// Function called after this a row is moved (drag n drop).
            /// </summary>
            /// <param name="p_component">This grid object.</param>
            /// <paramref name="p_component">Grid javascript object instance.
            /// <param name="p_sourceIndex">From where the row was cutted.</param>
            /// <paramref name="p_sourceIndex">Takes an integer.
            /// <param name="p_targetIndex">To where the row was dropped.</param>
            /// <paramref name="p_targetIndex">Takes an integer.
            afterMoveRow: null,
            /// <summary>
            /// Function called after a selection changes in the grid.
            /// </summary>
            /// <param name="p_component">This grid object.</param>
            /// <paramref name="p_component">Grid javascript object instance.
            /// <param name="p_selection">This grid object.</param>
            /// <paramref name="p_selection">Grid selection control object.
            afterSelectCells: null,
            /// <summary>
            /// Function called after a column is resized.
            /// </summary>
            /// <param name="p_component">This grid object.</param>
            /// <paramref name="p_component">Grid javascript object instance.
            /// <param name="p_column">The index of the column from what width was changed.</param>
            /// <paramref name="p_column">Takes an integer.
            /// <param name="p_newWidth">New column width in pixels.</param>
            /// <paramref name="p_newWidth">Takes a string.
            afterResizeColumn: null
        },
        //Column objects in a array. Do not modify it manually.
        columns: [],
        //Some grid configs. Do not modify it manually.
        configs: {
            draggableRows: false,
            headerHeight: 28,
            cellHeight: 24,
            cellWidth: 28,
            draggableRows: p_draggableRows
        },
        //Some grid controls. Do not modify it manually.
        controls: {
            currentScrollIndex: 0,
            editCell: {
                isEditing: false,
                editCellDiv: null,
                editCellInput: null,
                editCellCombobox: null,
                editCellDatepicker: null,
                row: -1,
                column: -1
            },
            filterColumn: {
                tree: null,
                column: null,
                filterColumnDiv: null,
                input: null,
                headerCellDiv: null,
                okFilterButton: null,
                clearAllFilters: false
            },
            resizeColumn: {
                index: -1,
                startWidth: 0,
                resizeDiv: null
            },
            selection: {
                isSelecting: false,
                selected: false,
                startRow: -1,
                startColumn: -1,
                endRow: -1,
                endColumn: -1,
                selectionDiv: null
            }
        },
        //Grid data object. Do not modify it manually.
        data: {
            //All grid data.
            all: {
                raw: {
                    //columns: [],
                    rows: []
                },
                string: {
                    //columns: [],
                    rows: []
                }
            },
            //Just grid data that is filtered. If no filters are applied, it's just like "all"
            rendered: {
                raw: {
                    //columns: [],
                    rows: []
                },
                string: {
                    //columns: [],
                    rows: []
                }
            }
        },
        //Grid dom elements.
        elements: {
            comboboxDiv: null,
            componentDiv: document.getElementById(p_containerDivId),
            containerDiv: null,
            dataGroupDiv: null,
            draggableRowsGroupDiv: null,
            filterDiv: null,
            headerContainerDiv: null,
            headerCornerDiv: null,
            headerGroupDiv: null,
            selectionDiv: null
        },
        /// <summary>
        /// This should be called to insert rows in the grid.
        /// </summary>
        /// <param name="p_data">Variable containing row data.</param>
        /// <paramref name="p_data">Takes a javascript array. Array must contain as many elements as there are columns in the grid. Each element type must match its column type.
        addRow: function(p_data) {
            if(p_data.length != this.columns.length) {
                return;
            }
            
            var v_rawRow = [];
            v_rawRow.filteredByColumns = [];

            var v_stringRow = [];
            v_stringRow.filteredByColumns = [];

            for(var i = 0; i < p_data.length; i++) {
                var v_rawValue = p_data[i];

                if(this.columns[i].type == 'combobox') {
                    if(v_rawValue == '') {
                        return;
                    }

                    var v_find = this.columns[i].source.find(function(p_element) {
                        return p_element.text == v_rawValue;
                    });

                    if(v_find == null || v_find.length == 0) {
                        return;
                    }
                }
                else if(this.columns[i].type == 'integer') {
                    if(v_rawValue == '') {
                        v_rawValue = 0;
                    }
                    else {
                        v_rawValue = parseInt(v_rawValue);
                    }

                    if(isNaN(v_rawValue)) {
                        return;
                    }
                }
                else if(this.columns[i].type == 'float') {
                    if(v_rawValue == '') {
                        v_rawValue = parseFloat('0').toFixed(2);
                    }
                    else {
                        v_rawValue = parseFloat(v_rawValue).toFixed(2);
                    }

                    if(isNaN(v_rawValue)) {
                        return;
                    }
                }
                else if(this.columns[i].type == 'datepicker') {
                    if(v_rawValue != '' && !moment(v_rawValue, 'MM-DD-YYYY').isValid()) {
                        return;
                    }
                }

                var v_rawCell = {
                    value: v_rawValue,
                    cssText: ''
                };

                v_rawRow.push(v_rawCell);

                var v_stringCell = {
                    value: String(v_rawValue),
                    cssText: ''
                };

                v_stringRow.push(v_stringCell);
            }

            var v_isFiltered = true;

            for(var i = 0; i < v_stringRow.length; i++) {
                if(this.columns[i].hasFilter) {
                    if(this.columns[i].filter.isFiltered) {
                        if(this.columns[i].filter.selectedValues.indexOf(v_stringRow[i].value) == -1) {
                            v_isFiltered = false;
                        }
                        else {
                            v_rawRow.filteredByColumns.push(i);
                            v_stringRow.filteredByColumns.push(i);
                        }
                    }
                    else {
                        v_rawRow.filteredByColumns.push(i);
                        v_stringRow.filteredByColumns.push(i);
                        this.columns[i].filter.selectedValues.push(v_stringRow[i].value);
                    }
                }
            }

            this.data.all.raw.rows.push(v_rawRow);
            this.data.all.string.rows.push(v_stringRow);

            if(v_isFiltered) {
                this.data.rendered.raw.rows.push(v_rawRow);
                this.data.rendered.string.rows.push(v_stringRow);
            }

            /*for(var i = 0; i < v_rawRow.length; i++) {
                //this.data.all.raw.columns[i].push(v_rawRow[i]);
                //this.data.all.string.columns[i].push(v_stringRow[i]);

                if(v_isFiltered) {
                    //this.data.rendered.raw.columns[i].push(v_rawRow[i]);
                    //this.data.rendered.string.columns[i].push(v_stringRow[i]);

                    //if(this.columns[i].filter.selectedValues.indexOf(v_stringRow[i].value) == -1) {
                        this.columns[i].filter.selectedValues.push(v_stringRow[i].value);
                    //}
                }
            }*/
        },
        /// <summary>
        /// This should be called to insert columns in the grid.
        /// </summary>
        /// <param name="p_name">The column name to be displayed in the grid.</param>
        /// <paramref name="p_name">Takes a string.
        /// <param name="p_type">The column type.</param>
        /// <paramref name="p_type">Takes a string between 'combobox', 'datepicker', 'integer', 'float' and 'text'.
        /// <param name="p_width">The columns width.</param>
        /// <paramref name="p_width">Takes an integer representing how many pixels it should have in width.
        /// <param name="p_disabled">If data in this column should be read only.</param>
        /// <paramref name="p_disabled">Takes a boolean.
        /// <param name="p_hasFilter">If this columns may be filtered.</param>
        /// <paramref name="p_hasFilter">Takes a boolean.
        /// <param name="p_comboboxSource">The combobox source values.</param>
        /// <paramref name="p_comboboxSource">Takes an array with the combobox options, each with the following structure: {text, value}. Will be used just if the column type is 'combobox'.
        /// <param name="p_hasSummary">If we should calculate total and subtotal for this column in the header.</param>
        /// <paramref name="p_hasSummary">Takes a boolean. Will be used just if the column type is either 'integer' or 'float'.
        addColumn: function(p_name, p_type, p_width, p_disabled, p_hasFilter, p_comboboxSource, p_hasSummary) {
            var v_column = {
                name: p_name,
                type: p_type,
                width: p_width,
                disabled: p_disabled,
                hasFilter: p_hasFilter
            };

            if(v_column.hasFilter) {
                v_column.filter = {
                    possibleValues: [],
                    selectedValues: [],
                    selectedValuesDict: {},
                    previousSelectedValues: [],
                    isFiltered: false
                };
            }

            if(v_column.type == 'combobox') {
                v_column.source = p_comboboxSource;

                v_column.source.getValueByText = function(p_text) {
                    for(var i = 0; i < this.length; i++) {
                        if(this[i].text == p_text) {
                            return this[i].value;
                        }
                    }

                    return null;
                };
            }

            //Used for summary porpuses. Will be created for every column, but used just in integer or float ones, when required.
            var v_totalCell = document.createElement('div');
            v_totalCell.classList.add('grid-summary-cell');
            v_totalCell.style.width = v_column.width;
            v_totalCell.style.height = this.configs.cellHeight + 'px';
            v_totalCell.style.lineHeight = this.configs.cellHeight + 'px';
            this.elements.totalGroupDiv.appendChild(v_totalCell);

            //Used for summary porpuses. Will be created for every column, but used just in integer or float ones, when required.
            var v_subtotalCell = document.createElement('div');
            v_subtotalCell.classList.add('grid-summary-cell');
            v_subtotalCell.style.width = v_column.width;
            v_subtotalCell.style.height = this.configs.cellHeight + 'px';
            v_subtotalCell.style.lineHeight = this.configs.cellHeight + 'px';
            this.elements.subtotalGroupDiv.appendChild(v_subtotalCell);

            if(v_column.type == 'integer' || v_column.type == 'float') {
                v_column.hasSummary = p_hasSummary;

                if(p_hasSummary) {
                    v_totalCell.title = 'Total';
                    v_subtotalCell.title = 'Subtotal';

                    this.elements.totalGroupDiv.style.height = this.configs.headerHeight + 'px';
	                this.elements.subtotalGroupDiv.style.height = this.configs.headerHeight + 'px';
	                this.elements.dataGroupDiv.style.paddingTop = (this.configs.headerHeight * 3) + 'px';
                    this.elements.draggableRowsGroupDiv.style.paddingTop = (this.configs.headerHeight * 3) + 'px';
                }
            }

            this.columns.push(v_column);

            //this.data.all.raw.columns.push([]);
            //this.data.all.string.columns.push([]);
            //this.data.rendered.raw.columns.push([]);
            //this.data.rendered.string.columns.push([]);

            var v_headerCell = document.createElement('div');
            v_headerCell.classList.add('grid-header-cell');
            v_headerCell.style.width = v_column.width;
            v_headerCell.style.height = this.configs.headerHeight + 'px';
            v_headerCell.style.lineHeight = this.configs.headerHeight + 'px';
            v_headerCell.innerHTML = v_column.name;

            if(v_column.hasFilter) {
                var v_img = document.createElement('img');
                v_img.src = 'img/filter.png'
                v_img.title = 'Click to filter column ' + v_column.name + '.';
                v_img.classList.add('img-grid-header-filter');

                v_img.addEventListener(
                    'click',
                    function(p_component, p_headerCell, p_column, p_event) {
                        p_component.buildFilterDiv(p_headerCell, p_column);
                    }.bind(v_img, this, v_headerCell, v_column)
                );

                v_headerCell.appendChild(v_img);
            }
            
            var v_redimCell = document.createElement('div');
            v_redimCell.style.height = this.configs.headerHeight + 'px';
            v_redimCell.classList.add('grid-header-cell-redim');
            v_redimCell.title = 'Click and drag to redimension column ' + v_column.name + '.';

            v_redimCell.addEventListener(
                'mousedown',
                function(p_component, p_index, p_event) {
                    var v_resizeReturn = document.createElement('div');
                    //v_resizeReturn.classList.add('grid-resize-return');
                    v_resizeReturn.id = 'grid-horizontal-resize-line';

                    var horizontalResizeLine = function(p_event) {
                        document.getElementById('grid-horizontal-resize-line').style.left = p_event.pageX + 'px';
                    }

                    document.body.addEventListener(
                        'mousemove',
                        horizontalResizeLine
                    )

                    v_resizeReturn.addEventListener(
                        'mouseup',
                        function(p_component, p_event) {
                            p_component.controls.resizeColumn.resizeDiv.parentNode.removeChild(p_component.controls.resizeColumn.resizeDiv);

                            var v_widthDiff = p_event.screenX - p_component.controls.resizeColumn.startWidth;

                            //Resizing column header div
                            var v_headerCell = p_component.elements.headerGroupDiv.childNodes[p_component.controls.resizeColumn.index];
                            var v_totalCell = p_component.elements.totalGroupDiv.childNodes[p_component.controls.resizeColumn.index];
                            var v_subtotalCell = p_component.elements.subtotalGroupDiv.childNodes[p_component.controls.resizeColumn.index];
                            var v_newWidth = parseInt(v_headerCell.style.width, 10) + v_widthDiff;

                            if(v_newWidth > 0) {
                                //Resize header cells
                                v_headerCell.style.width = v_newWidth + 'px';
                                v_totalCell.style.width = v_newWidth + 'px';
                                v_subtotalCell.style.width = v_newWidth + 'px';

                                if(p_component.configs.draggableRows) {
					                p_component.elements.containerDiv.style.width = (p_component.elements.headerGroupDiv.offsetWidth + 1) + p_component.configs.cellWidth + 'px';
					            }
                                else {
                                    p_component.elements.containerDiv.style.width = (p_component.elements.headerGroupDiv.offsetWidth + 1) + 'px';
                                }

                                //Resize data cells
                                for(var i = 0; i < p_component.elements.dataGroupDiv.childNodes.length; i++) {
                                    p_component.elements.dataGroupDiv.childNodes[i].childNodes[p_component.controls.resizeColumn.index].style.width = v_newWidth + 'px';                  
                                }

                                //Refreshing selection
                                if(p_component.controls.selection.selected) {
                                    p_component.selectCellRange(
                                        p_component.controls.selection.startRow,
                                        p_component.controls.selection.startColumn,
                                        p_component.controls.selection.endRow,
                                        p_component.controls.selection.endColumn
                                    );
                                }
                            }

                            document.body.removeEventListener(
		                        'mousemove',
		                        horizontalResizeLine
		                    )

                            if(p_component.callbacks.afterResizeColumn != null) {
                                p_component.callbacks.afterResizeColumn(p_component, p_component.controls.resizeColumn.index, v_newWidth);
                            }
                        }.bind(v_resizeReturn, p_component)
                    );

                    document.body.appendChild(v_resizeReturn);
                    
                    p_component.controls.resizeColumn.startWidth = p_event.screenX;
                    p_component.controls.resizeColumn.index = p_index;
                    p_component.controls.resizeColumn.resizeDiv = v_resizeReturn;
                }.bind(v_redimCell, this, this.columns.indexOf(v_column))
            );

            v_headerCell.appendChild(v_redimCell);
            this.elements.headerGroupDiv.appendChild(v_headerCell);

            this.elements.containerDiv.style.width = this.elements.headerContainerDiv.offsetWidth + 'px';
        },
        /// <summary>
        /// Builds the filter container div for a specified column.
        /// </summary>
        /// <param name="p_headerCell">The column header div.</param>
        /// <paramref name="p_headerCell">Takes the dom element corresponding to the desired column header.
        /// <param name="p_column">The column object from the grid.</param>
        /// <paramref name="p_column">Takes a grid column javascript object instance.
        buildFilterDiv: function(p_headerCell, p_column, p_event) {
            this.controls.filterColumn.headerCell = p_headerCell;
            this.controls.filterColumn.column = p_column;
            this.controls.filterColumn.clearAllFilters = false;

            //Save previous filtered values
            p_column.filter.previousSelectedValues = []; 

            for(var i = 0; i < p_column.filter.selectedValues.length; i++) {
                p_column.filter.previousSelectedValues.push(p_column.filter.selectedValues[i]);
            }

            //Adjust filter container position
            var v_rect = p_headerCell.getBoundingClientRect();

            this.controls.filterColumn.filterColumnDiv.style.top = (v_rect.top + p_headerCell.offsetHeight + document.body.scrollTop - 1) + 'px';
            this.controls.filterColumn.filterColumnDiv.style.left = (v_rect.left - 1) + 'px';
            this.controls.filterColumn.filterColumnDiv.style.display = 'block';

            this.controls.filterColumn.filterColumnDiv.innerHTML = '';

            //Create button to clear all filters in the grid
            var v_clearAllFiltersDiv = document.createElement('div');
            v_clearAllFiltersDiv.classList.add('grid-filter-column-item');
            v_clearAllFiltersDiv.innerHTML = '<img style="float: left; margin-left: 5px; margin-right: 5px;" src="img/clear.png" />Clean all table filters';

            v_clearAllFiltersDiv.addEventListener(
                'click',
                function(p_component, p_event) {
                    p_component.controls.filterColumn.clearAllFilters = true;
                    p_component.controls.filterColumn.okFilterButton.click();
                }.bind(v_clearAllFiltersDiv, this)
            );

            var v_someColumnFiltered = false;

            for(var i = 0; i < this.elements.headerGroupDiv.childNodes.length && !v_someColumnFiltered; i++) {
                if(this.elements.headerGroupDiv.childNodes[i].classList.contains('grid-header-cell-filtered')) {
                    v_someColumnFiltered = true;
                    break;
                }
            }

            if(!v_someColumnFiltered) {//If there isn't any column filtered, disable "clear all filters" button
                if(!v_clearAllFiltersDiv.classList.contains('grid-filter-column-item-disabled')) {
                    v_clearAllFiltersDiv.classList.add('grid-filter-column-item-disabled')
                }
            }
            else {
                if(v_clearAllFiltersDiv.classList.contains('grid-filter-column-item-disabled')) {
                    v_clearAllFiltersDiv.classList.remove('grid-filter-column-item-disabled')
                }
            }

            this.controls.filterColumn.filterColumnDiv.appendChild(v_clearAllFiltersDiv);

            //Create input to type text and filter tree
            var v_filterTreeInputDiv = document.createElement('div');
            v_filterTreeInputDiv.classList.add('grid-filter-column-item-double');
            this.controls.filterColumn.filterColumnDiv.appendChild(v_filterTreeInputDiv);

            var v_filterTreeInput = document.createElement('input');
            v_filterTreeInput.type = 'text';
            v_filterTreeInput.classList.add('form-control');
            v_filterTreeInput.placeholder = 'Search...';
            v_filterTreeInput.style.width = '97%';

            v_filterTreeInput.addEventListener(
                'keyup',
                function(p_component, p_event) {
                    if(p_event.keyCode == 13) {//Enter
                        p_component.controls.filterColumn.okFilterButton.click();
                    }
                    else if(p_event.keyCode == 27) {//Esc
                        this.value = '';
                        p_component.buildFilterTree(this.value);
                    }
                    else {
                        p_component.buildFilterTree(this.value);
                    }
                }.bind(v_filterTreeInput, this)
            );

            this.controls.filterColumn.input = v_filterTreeInput;
            v_filterTreeInputDiv.appendChild(v_filterTreeInput);

            //Create tree container
            var v_filterTreeContainerDiv = document.createElement('div');
            v_filterTreeContainerDiv.id = this.elements.componentDiv.id + '_grid-filter-tree-container';
            v_filterTreeContainerDiv.style.height = '228px';
            v_filterTreeContainerDiv.style.overflowY = 'auto';
            v_filterTreeContainerDiv.style.overflowX = 'hidden';
            v_filterTreeContainerDiv.style.textAlign = 'left';
            v_filterTreeContainerDiv.classList.add('grid-filter-column-item-double');
            v_filterTreeContainerDiv.classList.add('grid-filter-tree-container');
            this.controls.filterColumn.filterColumnDiv.appendChild(v_filterTreeContainerDiv);

            var v_filterButtonsContainerDiv = document.createElement('div');
            v_filterButtonsContainerDiv.classList.add('grid-filter-column-item-double');
            this.controls.filterColumn.filterColumnDiv.appendChild(v_filterButtonsContainerDiv);

            //Create button to cancel grid filtering
            var v_cancelFilteringButton = document.createElement('button');
            v_cancelFilteringButton.innerHTML = 'Cancel';
            v_cancelFilteringButton.style.float = 'right';
            v_cancelFilteringButton.style.marginRight = '5px';
            v_cancelFilteringButton.style.marginTop = '6px';

            v_cancelFilteringButton.addEventListener(
                'click',
                function(p_component, p_event) {
                    p_component.controls.filterColumn.filterColumnDiv.innerHTML = '';
                    p_component.controls.filterColumn.filterColumnDiv.style.display = 'none';
                }.bind(v_cancelFilteringButton, this)
            );

            v_filterButtonsContainerDiv.appendChild(v_cancelFilteringButton);

            //Create button to confirm grid filtering
            var v_okFilterButton = document.createElement('button');
            v_okFilterButton.innerHTML = 'Ok';
            v_okFilterButton.style.float = 'right';
            v_okFilterButton.style.marginRight = '5px';
            v_okFilterButton.style.marginTop = '6px';

            v_okFilterButton.addEventListener(
                'click',
                function(p_component, p_event) {
                    //If it's a "clear all filters" call, skip code block below
                    if(!p_component.controls.filterColumn.clearAllFilters) {
                        p_component.controls.filterColumn.column.filter.selectedValues = [];

                        //If we're adding selected values in actual tree to previous filter
                        if(p_component.controls.filterColumn.tree.childNodes[1].tag.id == 'include' && p_component.controls.filterColumn.tree.childNodes[1].tag.checked) {
                            for(var i = 0; i < p_component.controls.filterColumn.column.filter.previousSelectedValues.length; i++) {
                                    p_component.controls.filterColumn.column.filter.selectedValues.push(p_component.controls.filterColumn.column.filter.previousSelectedValues[i]);
                            }
                        }

                        //Get all tree selected values
                        for(var i = 0; i < p_component.controls.filterColumn.tree.childNodes.length; i++) {
                            if(p_component.controls.filterColumn.tree.childNodes[i].tag.type == 'item' && p_component.controls.filterColumn.tree.childNodes[i].tag.checked) {
                                p_component.controls.filterColumn.column.filter.selectedValues.push(p_component.controls.filterColumn.tree.childNodes[i].tag.value);
                            }
                        }
                    }
                    else {
                        var v_isFilteredList = [];

                        for(var i = 0; i < p_component.columns.length; i++) {
	                        if(p_component.columns[i].hasFilter && (p_component.columns[i].filter.isFiltered || p_component.columns[i] == p_component.controls.filterColumn.column)) {
                                p_component.columns[i].filter.selectedValues = [];
                                v_isFilteredList.push(i);
                            }
	                    }

                        for(var i = 0; i < p_component.data.all.raw.rows.length; i++) {
                            for(var j = 0; j < v_isFilteredList.length; j++) {
                                p_component.columns[v_isFilteredList[j]].filter.selectedValues.push(p_component.data.all.string.rows[i][v_isFilteredList[j]].value);

                                if(p_component.data.all.raw.rows[i].filteredByColumns.indexOf(v_isFilteredList[j])) {
	                                p_component.data.all.raw.rows[i].filteredByColumns.push(v_isFilteredList[j]);
	                                p_component.data.all.string.rows[i].filteredByColumns.push(v_isFilteredList[j]);
                                }
                            }
                        }

                        for(var i = 0; i < v_isFilteredList.length; i++) {
                            p_component.columns[v_isFilteredList[i]].filter.selectedValues = p_component.columns[v_isFilteredList[i]].filter.selectedValues.unique();
                        }

	                    for(var i = 0; i < p_component.elements.headerGroupDiv.childNodes.length; i++) {
	                        if(p_component.elements.headerGroupDiv.childNodes[i].classList.contains('grid-header-cell-filtered')) {
	                            p_component.elements.headerGroupDiv.childNodes[i].classList.remove('grid-header-cell-filtered')
	                        }
	                    }
                    }

                    //Converts to a better search engine 
                    p_component.controls.filterColumn.column.filter.selectedValues = p_component.controls.filterColumn.column.filter.selectedValues.unique();

                    for(var i = 0; i < p_component.columns.length; i++) {
                        if(p_component.columns[i].hasFilter) {
                            p_component.columns[i].filter.selectedValues = p_component.columns[i].filter.selectedValues.unique();

				            p_component.columns[i].filter.selectedValuesDict = p_component.columns[i].filter.selectedValues.reduce(
				                function(p_dict, p_key) {
				                    p_dict[p_key.toLowerCase()] = 1;
				                    return p_dict;
				                },
				                {}
				            );
                        }
                    }

                    //Get new grid data, apllying all filters (old existing filters on other columns and the new one on actual column)
                    p_component.data.rendered.raw.rows = [];
                    p_component.data.rendered.string.rows = [];

                    for(var i = 0; i < p_component.data.all.string.rows.length; i++) {
                        var v_filtered = true;

                        for(var j = 0; j < p_component.columns.length; j++) {
                            if(p_component.columns[j].hasFilter && (p_component.columns[j].filter.isFiltered || p_component.columns[j] == p_component.controls.filterColumn.column)) {
                                var v_indexOf = p_component.data.all.string.rows[i].filteredByColumns.indexOf(j);

                                if(typeof p_component.columns[j].filter.selectedValuesDict[p_component.data.all.string.rows[i][j].value.toLowerCase()] === 'undefined') {
                                    v_filtered = false;

                                    if(v_indexOf != -1) {
                                        p_component.data.all.raw.rows[i].filteredByColumns.splice(v_indexOf, 1);
                                        p_component.data.all.string.rows[i].filteredByColumns.splice(v_indexOf, 1);
                                    }
                                }
                                else {
                                    if(v_indexOf == -1) {
                                        p_component.data.all.raw.rows[i].filteredByColumns.push(j);
                                        p_component.data.all.string.rows[i].filteredByColumns.push(j);
                                    }
                                }
                            }
                        }

                        if(v_filtered) {
                            p_component.data.rendered.raw.rows.push(p_component.data.all.raw.rows[i]);
                            p_component.data.rendered.string.rows.push(p_component.data.all.string.rows[i]);
                        }
                    }

                    //If some filter was applied to this column or not
                    if(p_component.controls.filterColumn.column.filter.selectedValues.length < p_component.controls.filterColumn.column.filter.possibleValues.length) {
                        if(!p_component.controls.filterColumn.headerCell.classList.contains('grid-header-cell-filtered')) {
                            p_component.controls.filterColumn.headerCell.classList.add('grid-header-cell-filtered')
                        }

                        p_component.controls.filterColumn.column.filter.isFiltered = true;
                    }
                    else {
                        if(p_component.controls.filterColumn.headerCell.classList.contains('grid-header-cell-filtered')) {
                            p_component.controls.filterColumn.headerCell.classList.remove('grid-header-cell-filtered')
                        }

                        p_component.controls.filterColumn.column.filter.isFiltered = false;
                    }

                    p_component.controls.filterColumn.filterColumnDiv.innerHTML = '';
                    p_component.controls.filterColumn.filterColumnDiv.style.display = 'none';

                    p_component.render();
                    p_component.calculateSummary();
                }.bind(v_okFilterButton, this)
            );

            this.controls.filterColumn.okFilterButton = v_okFilterButton;
            v_filterButtonsContainerDiv.appendChild(v_okFilterButton);

            //Check possible values for this filter tree
            var v_filterColumns = [];

            for(var i = 0; i < this.columns.length; i++) {
                if(this.columns[i].hasFilter && this.columns[i].filter.isFiltered && this.columns[i] != p_column) {
                    v_filterColumns.push(i);
                }
            }

            var v_possibleRows = [];

            for(var i = 0; i < this.data.all.string.rows.length; i++) {
                v_possibleRows.push(this.data.all.string.rows[i]);
            }

            v_possibleRows = v_possibleRows.filter(function(p_row) {
                for(var i = 0; i < v_filterColumns.length; i++) {
                    if(p_row.filteredByColumns.indexOf(v_filterColumns[i]) == -1) {
                        return false;
                    }
                }

                return true;
            });

            p_column.filter.possibleValues = [];

            var v_columnIndex = this.columns.indexOf(p_column);

            for(var i = 0; i < v_possibleRows.length; i++) {
                p_column.filter.possibleValues.push(v_possibleRows[i][v_columnIndex].value);
            }

            p_column.filter.possibleValues = p_column.filter.possibleValues.unique();

            //If we must order by date, by number or by text
            if(p_column.type == 'datepicker') {
                var v_compare = function(p_date1, p_date2) {
                    var v_date1Value = 0;

                    if(p_date1.length >= 10) {
                        v_date1Value = new Date(p_date1.substring(6, 10) + '-' + p_date1.substring(3, 5) + '-' + p_date1.substring(0, 2)).getTime();
                    }

                    var v_date2Value = 0;

                    if(p_date2.length >= 10) {
                        v_date2Value = new Date(p_date2.substring(6, 10) + '-' + p_date2.substring(3, 5) + '-' + p_date2.substring(0, 2)).getTime();
                    }

                    return v_date1Value - v_date2Value;
                };

                p_column.filter.possibleValues.sort(v_compare);
            }
            else if(p_column.type == 'integer') {
                var v_compare = function(p_integer1, p_integer2) {
                    var v_integer1Value = parseInt(p_integer1);
                    var v_integer2Value = parseInt(p_integer2);

                    return v_integer1Value - v_integer2Value;
                };

                p_column.filter.possibleValues.sort(v_compare);
            }
            else if(p_column.type == 'float') {
                var v_compare = function(p_float1, p_float2) {
                    var v_float1Value = parseFloat(p_float1);
                    var v_float2Value = parseFloat(p_float2);

                    return v_float1Value - v_float2Value;
                };

                p_column.filter.possibleValues.sort(v_compare);
            }
            else {
                p_column.filter.possibleValues.sort();
            }

            this.buildFilterTree('');
        },
        /// <summary>
        /// Builds the filter tree inside the filter container div.
        /// </summary>
        /// <param name="p_text">The text to filter tree values.</param>
        /// <paramref name="p_text">Takes a string.
        buildFilterTree: function(p_text) {
            var v_filterTreeContainerDiv = document.getElementById(this.elements.componentDiv.id + '_grid-filter-tree-container');
            v_filterTreeContainerDiv.innerHTML = '';

            //Gets possible values for this filter tree
            for(var i = 0; i < this.controls.filterColumn.column.filter.possibleValues.length; i++) {
                this.controls.filterColumn.column.filter.possibleValues[i] = this.controls.filterColumn.column.filter.possibleValues[i].toLowerCase();
            }

            //Just possible values that matches the given text
            var v_matchValues = this.controls.filterColumn.column.filter.possibleValues.filter(function(p_value) {
                return p_value.indexOf(p_text) != -1;
            });

            var v_filterTree = startList(v_filterTreeContainerDiv.id);

            this.controls.filterColumn.tree = v_filterTree;

            v_filterTree.callbacks.afterRenderNode = function(p_component, p_node) {
                switch(p_node.tag.type) {
                    case 'control': {
                        switch(p_node.tag.id) {
                            case 'all': {
                                var v_checkBoxAll = document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_all');

                                if(v_checkBoxAll != null) {
						            v_checkBoxAll.addEventListener(
						                'click',
						                function(p_component, p_node, p_event) {
	                                        p_node.tag.checked = this.checked;

					                        for(var i = 0; i < p_component.childNodes.length; i++) {
					                            if(p_component.childNodes[i].tag.type == 'item') {
	                                                p_component.childNodes[i].tag.checked = this.checked;

	                                                if(p_component.childNodes[i].controls.rendered) {
                                                        var v_checkBox = document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_' + p_component.childNodes[i].tag.id);

						                                if(v_checkBox != null) {
                                                            v_checkBox.checked = this.checked;
                                                        }
	                                                }
					                            }
					                        }
						                }.bind(v_checkBoxAll, p_component, p_node)
	                                );

	                                v_checkBoxAll.checked = p_node.tag.checked;
                                }

                                break;
                            }
                            case 'include': {
				                var v_checkBoxInclude = document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_include');

                                if(v_checkBoxInclude != null) {
	                                v_checkBoxInclude.addEventListener(
	                                    'click',
	                                    function(p_component, p_node, p_event) {
	                                        p_node.tag.checked = this.checked;
	                                    }.bind(v_checkBoxInclude, p_component, p_node)
	                                );

	                                v_checkBoxInclude.checked = p_node.tag.checked;
                                }
                                
                                break;
                            }
                        }

                        break;
                    }
                    case 'item': {
                        var v_checkBox = document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_' + p_node.tag.id);

                        if(v_checkBox != null) {
			                v_checkBox.value = p_node.tag.value;

			                document.getElementById(p_component.elements.componentDiv.id + '_label_tree_filter_' + p_node.tag.id).innerHTML = p_node.tag.value;

			                v_checkBox.addEventListener(
			                    'click',
			                    function(p_component, p_node, p_event) {
	                                p_node.tag.checked = this.checked;

			                        if(this.checked) {
			                            var v_numChecked = 0;
			                            var v_numItems = 0;

			                            //Checks if all items are selected
			                            for(var i = 0; i < p_component.childNodes.length; i++) {
			                                if(p_component.childNodes[i].tag.type == 'item') {
			                                    v_numItems++;
	                                                  
			                                    if(p_component.childNodes[i].tag.checked) {
			                                        v_numChecked++;
			                                    }
			                                }
			                            }

			                            if(v_numChecked == v_numItems) {
			                                p_component.childNodes[0].tag.checked = true;

		                                    if(p_component.childNodes[0].controls.rendered) {
		                                        document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_all').checked = true;
		                                    }
			                            }
			                        }
			                        else {
			                            //If a item was unchecked then we guarantee that not all items are selected      
		                                p_component.childNodes[0].tag.checked = false;

	                                    if(p_component.childNodes[0].controls.rendered) {
	                                        document.getElementById(p_component.elements.componentDiv.id + '_input_checkbox_tree_filter_all').checked = false;
	                                    }
			                        }
			                    }.bind(v_checkBox, p_component, p_node)
			                );

	                        v_checkBox.checked = p_node.tag.checked;
                        }
                        
                        break;
                    }
                }
            };

            var v_node = v_filterTree.createNode('<input id="' + v_filterTreeContainerDiv.id + '_input_checkbox_tree_filter_all" type="checkbox" value="all"/>(Select all results)');

            v_node.tag = {
                id: 'all',
                type: 'control',
                checked: false
            };

            if(p_text != null && p_text != '' && p_text.length > 0) {
                var v_node = v_filterTree.createNode('<input id="' + v_filterTreeContainerDiv.id + '_input_checkbox_tree_filter_include" type="checkbox" value="include"/>(Add actual selection to the filter)');

                v_node.tag = {
                    id: 'include',
                    type: 'control',
                    checked: false
                };
            }

            //Converts to a better performance search engine
            this.controls.filterColumn.column.filter.selectedValues = this.controls.filterColumn.column.filter.selectedValues.unique();

            var v_selectedValuesDict = this.controls.filterColumn.column.filter.selectedValues.reduce(
                function(p_dict, p_key) {
					p_dict[p_key.toLowerCase()] = 1;
					return p_dict;
				},
                {}
            );

            this.controls.filterColumn.column.filter.selectedValuesDict = v_selectedValuesDict;

            var v_numChecked = 0;

            for(var i = 0; i < v_matchValues.length; i++) {
                var v_node = v_filterTree.createNode('<input id="' + v_filterTreeContainerDiv.id + '_input_checkbox_tree_filter_' + i + '" type="checkbox"/><label id="' + v_filterTreeContainerDiv.id + '_label_tree_filter_' + i + '"></label>');

                v_node.tag = {
                    id: i,
                    type: 'item',
                    checked: false,
                    value: v_matchValues[i]
                };

                if(typeof v_selectedValuesDict[v_matchValues[i]] !== 'undefined') {
                    v_node.tag.checked = true;
                    v_numChecked++;
                }
            }

            if(v_numChecked == v_matchValues.length) {
                v_filterTree.childNodes[0].tag.checked = true;
            }

            //If some text was typed in the input area, select all filtered items in the tree
            if(p_text != null && p_text != '' && p_text.length > 0) {
                for(var i = 1; i < v_filterTree.childNodes.length; i++) {
                    if(v_filterTree.childNodes[i].tag.type == 'item') {
                        v_filterTree.childNodes[i].tag.checked = true;
                    }
                }

                v_filterTree.childNodes[0].tag.checked = true;
            }

            v_filterTree.render();
        },
        /// <summary>
        /// Calculates total and subtotal for each column that has summary activated.
        /// </summary>
        calculateSummary: function() {
            var v_hasSummaryList = [];
            var v_totalList = [];
            var v_subtotalList = [];

            for(var i = 0; i < this.columns.length; i++) {
                if(this.columns[i].hasSummary) {
                    v_hasSummaryList.push(i);
                }

                v_totalList.push(0);
                v_subtotalList.push(0);
            }

            for(var i = 0; i < this.data.all.raw.rows.length; i++) {
                for(var j = 0; j < v_hasSummaryList.length; j++) {
                    if(this.columns[v_hasSummaryList[j]].type == 'integer') {
                        v_totalList[v_hasSummaryList[j]] += this.data.all.raw.rows[i][v_hasSummaryList[j]].value;
                    }
                    else if(this.columns[v_hasSummaryList[j]].type == 'float') {
                        v_totalList[v_hasSummaryList[j]] += parseFloat(this.data.all.raw.rows[i][v_hasSummaryList[j]].value);
                    }
                }
            }

            for(var i = 0; i < this.data.rendered.raw.rows.length; i++) {
                for(var j = 0; j < v_hasSummaryList.length; j++) {
                    if(this.columns[v_hasSummaryList[j]].type == 'integer') {
                        v_subtotalList[v_hasSummaryList[j]] += this.data.rendered.raw.rows[i][v_hasSummaryList[j]].value;
                    }
                    else if(this.columns[v_hasSummaryList[j]].type == 'float') {
                        v_subtotalList[v_hasSummaryList[j]] += parseFloat(this.data.rendered.raw.rows[i][v_hasSummaryList[j]].value);
                    }
                }
            }

            for(var i = 0; i < v_hasSummaryList.length; i++) {
                if(this.columns[v_hasSummaryList[i]].type == 'integer') {
                    this.elements.totalGroupDiv.childNodes[v_hasSummaryList[i]].innerHTML = numberToString(v_totalList[v_hasSummaryList[i]]);
                    this.elements.subtotalGroupDiv.childNodes[v_hasSummaryList[i]].innerHTML = numberToString(v_subtotalList[v_hasSummaryList[i]]);
                }
                else if(this.columns[v_hasSummaryList[i]].type == 'float') {
                    this.elements.totalGroupDiv.childNodes[v_hasSummaryList[i]].innerHTML = numberToString(v_totalList[v_hasSummaryList[i]].toFixed(2));
                    this.elements.subtotalGroupDiv.childNodes[v_hasSummaryList[i]].innerHTML = numberToString(v_subtotalList[v_hasSummaryList[i]].toFixed(2));
                }
            }
        },
        /// <summary>
        /// Cancels cell content editing.
        /// </summary>
        cancelCellEdit: function() {
            this.controls.editCell.isEditing = false;
            this.elements.componentDiv.style.overflow = 'auto';
            this.controls.editCell.editCellDiv.style.display = 'none';
            this.controls.editCell.editCellCombobox.style.display = 'none';

            if(this.columns[this.controls.editCell.column].type == 'datepicker') {
                this.controls.editCell.editCellDatepicker.destroy();
            }
        },
        /// <summary>
        /// Clear grid data.
        /// </summary>
        clearData: function() {
            this.data.all.raw.rows = [];
            this.data.all.string.rows = [];
            this.data.rendered.raw.rows = [];
            this.data.rendered.string.rows = [];
            this.render();
        },
        /// <summary>
        /// Clear grid selection.
        /// </summary>
        clearSelection: function() {
            if(!this.controls.selection.isSelecting) {
                this.controls.selection.selected = false;
                this.controls.selection.startRow = -1;
                this.controls.selection.startColumn = -1;
                this.controls.selection.selected = -1;
                this.controls.selection.selected = -1;
                this.controls.selection.selectionDiv.style.display = 'none';
            }

            this.controls.selection.isSelecting = false;
        },
        /// <summary>
        /// Create a icon on cell divs of combobox or datepicker type.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        createComboboxImg: function(p_row, p_column) {
            var v_cellDiv = this.getCellDivAt(p_row, p_column);

            if(v_cellDiv == null) {
                return;
            }

            var v_img = document.createElement('img');
            v_img.classList.add('grid-cell-open-img');
            v_img.src = 'img/open.png';
            v_cellDiv.appendChild(v_img);

            v_img.addEventListener(
                'click',
                function(p_component, p_row, p_column, p_event) {
                    if(!p_component.controls.editCell.isEditing) {
                        p_component.startCellEdit(p_row, p_column);
                    }
                }.bind(v_img, this, p_row, p_column)
            );

            this.elements.componentDiv.style.overflow = 'auto';
        },
        /// <summary>
        /// Removes content of cells under grid selection.
        /// </summary>
        deleteSelectedCells: function() {
            var v_minRow = Math.min(this.controls.selection.startRow, this.controls.selection.endRow);
            var v_minColumn = Math.min(this.controls.selection.startColumn, this.controls.selection.endColumn);
            var v_maxRow = Math.max(this.controls.selection.startRow, this.controls.selection.endRow);
            var v_maxColumn = Math.max(this.controls.selection.startColumn, this.controls.selection.endColumn);

            for(var i = v_minRow; i <= v_maxRow; i++) {
                for(var j = v_minColumn; j <= v_maxColumn; j++) {
                    var v_cellDiv = this.getCellDivAt(i, j);

                    if(v_cellDiv != null && !v_cellDiv.v_disabled) {
                        this.updateCellDataAt(i, j, '', 'rendered', false)
                    }
                }
            }

            this.render();
        },
        /// <summary>
        /// Turns a cell into read only.
        /// </summary>
        /// <param name="p_cellDiv">The cell to be disabled.</param>
        /// <paramref name="p_cellDiv">Takes a cell dom element.
        disableCellDiv: function(p_cellDiv) {
            p_cellDiv.classList.add('grid-cell-disabled');
            p_cellDiv.v_disabled = true;
        },
        /// <summary>
        /// Turns a cell into read only.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        disableCellDivAt: function(p_row, p_column) {
            var v_cellDiv = this.getCellDivAt(p_row, p_column);

            if(v_cellDiv != null) {
                v_cellDiv.classList.add('grid-cell-disabled');
                v_cellDiv.v_disabled = true;
            }
        },
        /// <summary>
        /// Turns a cell into not read only.
        /// </summary>
        /// <param name="p_cellDiv">The cell to be enabled.</param>
        /// <paramref name="p_cellDiv">Takes a cell dom element.
        enableCellDiv: function(p_cellDiv) {
            p_cellDiv.classList.add('grid-cell-disabled');
            p_cellDiv.v_disabled = false;
        },
        /// <summary>
        /// Turns a cell into not read only.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        enableCellDivAt: function(p_row, p_column) {
            var v_cellDiv = this.getCellDivAt(p_row, p_column);

            if(v_cellDiv != null) {
                v_cellDiv.classList.remove('grid-cell-disabled');
                p_cellDiv.v_disabled = false;
            }
        },
        /// <summary>
        /// Stops editing a cell content.
        /// </summary>
        endCellEdit: function() {
            if(!this.controls.editCell.isEditing) {
                return;
            }

            this.controls.editCell.isEditing = false;
            this.controls.editCell.editCellDiv.style.display = 'none';

            var v_cellDiv = this.getCellDivAt(this.controls.editCell.row, this.controls.editCell.column);

            if(v_cellDiv.v_renderer == 'combobox') {
                this.controls.editCell.editCellCombobox.style.display = 'none';
            }
            else if(v_cellDiv.v_renderer == 'datepicker') {
                this.controls.editCell.editCellDatepicker.destroy();
            }

            this.updateCellDataAt(this.controls.editCell.row, this.controls.editCell.column, this.controls.editCell.editCellInput.value, 'rendered', false);
            this.render();
            this.elements.dataGroupDiv.focus();
        },
        /// <summary>
        /// Fix selection div position after a select occurs.
        /// </summary>
        fixSelectPosition: function() {
            var v_containerHeight = this.elements.componentDiv.clientHeight;
            var v_containerTop = this.elements.componentDiv.scrollTop;
            var v_pos = this.controls.selection.endRow * this.configs.cellHeight;
            var v_diffTop = v_pos - v_containerTop;
            var v_diffBottom = this.configs.headerHeight + this.configs.cellHeight - v_containerTop - v_containerHeight + v_pos;

            if(v_diffTop < 0) {
                this.elements.componentDiv.scrollTop += v_diffTop;
            }
            else if(v_diffBottom > 0) {
                this.elements.componentDiv.scrollTop += v_diffBottom;
            }

            var v_containerWidth = this.elements.componentDiv.clientWidth;
            var v_containerLeft = this.elements.componentDiv.scrollLeft;

            //TODO: verificar questão de row header depois

            var v_cellDiv = this.getCellDivAt(this.controls.selection.endRow, this.controls.selection.endColumn);

            if(v_cellDiv == null) {
                return;
            }

            var v_cellLeft = v_cellDiv.offsetLeft;
            var v_cellWidth = v_cellDiv.offsetWidth;
            var v_diffLeft = v_cellLeft - v_containerLeft;
            var v_diffRight = v_cellWidth - v_containerLeft - v_containerWidth + v_cellLeft;

            if(v_diffLeft < 0) {
                this.elements.componentDiv.scrollLeft += v_diffLeft;
            }
            else if(v_diffRight > 0) {
                this.elements.componentDiv.scrollLeft += v_diffRight;
            }
        },
        /// <summary>
        /// Returns cell dom element at a specified index.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        getCellDivAt: function(p_row, p_column) {
            if(p_row - this.controls.currentScrollIndex < 0) {
                return null;
            }
            else if(p_row - this.controls.currentScrollIndex >= this.elements.dataGroupDiv.childNodes.length) {
                return null;
            }

            return this.elements.dataGroupDiv.childNodes[p_row - this.controls.currentScrollIndex].childNodes[p_column];
        },
        /// <summary>
        /// Returns cell cssText at a specified index.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        getStyleAt: function(p_row, p_column) {
            return this.data.rendered.raw.rows[p_row][p_column].cssText;
        },
        /// <summary>
        /// Move the selection div in response to user interactions by keyboard.
        /// </summary>
        /// <param name="p_direction">The row index of the cell.</param>
        /// <paramref name="p_direction">Takes a string in 'ArrowLeft', 'ArrowRight', 'ArrowUp' or 'ArrowDown'.
        /// <param name="p_shiftPressed">Indicates if shift key is pressed while moving selector.</param>
        /// <paramref name="p_shiftPressed">Takes a boolean.
        moveSelector: function(p_direction, p_shiftPressed) {
            if(!p_shiftPressed) {
                if(p_direction == 'ArrowLeft' && this.controls.selection.startColumn > 0) {
                    this.controls.selection.startColumn -= 1;
                    this.controls.selection.endColumn = this.controls.selection.startColumn;
                    this.controls.selection.endRow = this.controls.selection.startRow;
                }
                else if(p_direction == 'ArrowRight' && this.controls.selection.endColumn < this.elements.headerGroupDiv.childNodes.length - 1) {
                    this.controls.selection.startColumn += 1;
                    this.controls.selection.endColumn = this.controls.selection.startColumn;
                    this.controls.selection.endRow = this.controls.selection.startRow;
                }
                else if(p_direction == 'ArrowUp' && this.controls.selection.startRow > 0) {
                    this.controls.selection.startRow -= 1;
                    this.controls.selection.endRow = this.controls.selection.startRow;
                    this.controls.selection.endColumn = this.controls.selection.startColumn;
                }
                else if(p_direction == 'ArrowDown' && this.controls.selection.endRow < this.data.rendered.raw.rows.length - 1) {
                    this.controls.selection.startRow += 1;
                    this.controls.selection.endRow = this.controls.selection.startRow;
                    this.controls.selection.endColumn = this.controls.selection.startColumn;
                }
            }
            else {
                if(p_direction == 'ArrowLeft' && this.controls.selection.endColumn > 0) {
                    this.controls.selection.endColumn -= 1;
                }
                else if(p_direction == 'ArrowRight' && this.controls.selection.endColumn < this.elements.headerGroupDiv.childNodes.length - 1) {
                    this.controls.selection.endColumn += 1;
                }
                else if(p_direction == 'ArrowUp' && this.controls.selection.endRow > 0) {
                    this.controls.selection.endRow -= 1;
                }
                else if(p_direction == 'ArrowDown' && this.controls.selection.endRow < this.data.rendered.raw.rows.length - 1) {
                    this.controls.selection.endRow += 1;
                }

            }

            this.selectCellRange(this.controls.selection.startRow, this.controls.selection.startColumn, this.controls.selection.endRow, this.controls.selection.endColumn);
            this.fixSelectPosition();
        },
        /// <summary>
        /// Render the grid table.
        /// </summary>
        /// <param name="p_startRow">The row where render should start.</param>
        /// <paramref name="p_startRow">Takes an integer or null.
        render: function(p_startRow) {
            if(p_startRow != null) {
                var v_newScroll = p_startRow * this.configs.cellHeight;
                this.elements.componentDiv.scrollTop = v_newScroll;
            }
            else {
                var v_startRow = this.controls.currentScrollIndex;

                this.elements.dataGroupDiv.innerHTML = '';

                if(this.configs.draggableRows) {
                    this.elements.draggableRowsGroupDiv.innerHTML = '';
                }

                var v_numRows = (parseInt(this.elements.componentDiv.offsetHeight) / parseInt(this.configs.cellHeight));
                v_numRows += 7;

                var v_allowDrag = false;

                if(this.data.rendered.raw.rows.length == this.data.all.raw.rows.length) {
                    v_allowDrag = true;
                }

                for(var i = v_startRow; i < v_startRow + v_numRows; i++) {
                    if (i >= this.data.rendered.raw.rows.length) {
                        break;
                    }

                    if(this.configs.draggableRows) {
	                    var v_draggableRowDiv = document.createElement('div');
                        v_draggableRowDiv.style.height = this.configs.cellHeight + 'px';
                        v_draggableRowDiv.classList.add('grid-row-header');
                        this.elements.draggableRowsGroupDiv.appendChild(v_draggableRowDiv);

                        if(v_allowDrag) {
	                        var v_img = document.createElement('img');
	                        v_img.classList.add('grid-row-move-img');
	                        v_img.src = 'img/move.png';
                            v_img.title = 'Click here to move this row.';

	                        v_img.addEventListener(
	                            'dragstart',
	                            function(p_event) {
	                                return false;
	                            }
	                        );

	                        v_img.addEventListener(
	                            'click',
	                            function(p_component, p_row, p_event) {
	                                var v_cloneRow = p_component.elements.dataGroupDiv.childNodes[p_row].cloneNode(true);
	                                v_cloneRow.classList.add('grid-dragging-row');

	                                document.body.addEventListener(
	                                    'mousemove',
	                                    function(p_cloneRow, p_event) {
	                                        p_cloneRow.style.left = p_event.pageX + 5 + 'px';
	                                        p_cloneRow.style.top = p_event.pageY + 'px';
	                                    }.bind(document.body, v_cloneRow)
	                                );

					                document.body.appendChild(v_cloneRow);
	                                
					                p_component.elements.draggableRowsGroupDiv.childNodes[p_row].classList.add('grid-ghost');
					                p_component.elements.dataGroupDiv.childNodes[p_row].classList.add('grid-ghost');

	                                p_component.elements.draggableRowsGroupDiv.classList.add('grid-row-header-group-dragging');

	                                var v_dragRowFunction = function(p_component, p_row, p_event) {
	                                    if(p_event.target.classList.contains('grid-row-move-target-img')) {
	                                        var v_targetIndex = p_event.target.index; 

	                                        if(p_row > v_targetIndex) {
	                                            v_targetIndex++;
	                                        }

	                                        var v_rawRow = p_component.data.all.raw.rows.splice(p_row, 1)[0];
	                                        p_component.data.all.raw.rows.splice(v_targetIndex, 0, v_rawRow);

	                                        var v_rawRow = p_component.data.rendered.raw.rows.splice(p_row, 1)[0];
	                                        p_component.data.rendered.raw.rows.splice(v_targetIndex, 0, v_rawRow);

	                                        var v_stringRow = p_component.data.all.string.rows.splice(p_row, 1)[0];
	                                        p_component.data.all.string.rows.splice(v_targetIndex, 0, v_stringRow);

	                                        var v_stringRow = p_component.data.rendered.string.rows.splice(p_row, 1)[0];
	                                        p_component.data.rendered.string.rows.splice(v_targetIndex, 0, v_stringRow);

	                                        p_component.render();

	                                        setTimeout(
	                                            function() {
	                                                p_component.selectCellRange(v_targetIndex, 0, v_targetIndex, p_component.data.rendered.string.rows[v_targetIndex].length - 1);
	                                            },
	                                            10
	                                        );

	                                        if(p_component.callbacks.afterMoveRow != null) {
	                                            p_component.callbacks.afterMoveRow(p_component, p_row, v_targetIndex);
	                                        }
	                                    }

	                                    p_component.elements.draggableRowsGroupDiv.classList.remove('grid-row-header-group-dragging');

	                                    document.body.querySelector('.grid-dragging-row').remove();

	                                    var v_gridGhostList = document.querySelectorAll('.grid-ghost');

	                                    for(var i = 0; i < v_gridGhostList.length; i++) {
	                                        v_gridGhostList[i].classList.remove('grid-ghost');
	                                    }

	                                    document.removeEventListener(
	                                        'click',
	                                        v_dragRowFunction
	                                    );
	                                }.bind(v_dragRowFunction, p_component, p_row)

	                                setTimeout(
	                                    function() {
	                                        document.addEventListener(
	                                            'click',
	                                            v_dragRowFunction
	                                        );
	                                    },
	                                    10
	                                );
	                            }.bind(v_img, this, i)
	                        );

	                        v_draggableRowDiv.appendChild(v_img);

	                        var v_img = document.createElement('img');
	                        v_img.classList.add('grid-row-move-target-img');
	                        v_img.style.bottom = '-8px';
	                        v_img.index = i;
	                        v_img.src = 'img/drag_target.png';
                            v_img.title = 'Click here to drop this row at this place.'

	                        v_img.addEventListener(
	                            'dragstart',
	                            function(p_event) {
	                                return false;
	                            }
	                        );

	                        v_draggableRowDiv.appendChild(v_img);

	                        if(i == 0) {
	                            var v_img = document.createElement('img');
	                            v_img.classList.add('grid-row-move-target-img');
	                            v_img.style.top = '-8px';
	                            v_img.index = i - 1;
	                            v_img.src = 'img/drag_target.png';
                                v_img.title = 'Click here to drop this row at this place.'

	                            v_img.addEventListener(
		                            'dragstart',
		                            function(p_event) {
		                                return false;
		                            }
		                        );

	                            v_draggableRowDiv.appendChild(v_img);
	                        }
                        }
	                }

                    var v_rowGroupDiv = document.createElement('div');
                    v_rowGroupDiv.style.height = this.configs.cellHeight + 'px';
                    v_rowGroupDiv.classList.add('grid-row-group');
                    this.elements.dataGroupDiv.appendChild(v_rowGroupDiv);

                    for(var j = 0; j < this.elements.headerGroupDiv.childNodes.length; j++) {
                        var v_cellDiv = document.createElement('div');
                        v_cellDiv.classList.add('grid-cell');
                        v_cellDiv.style.height = this.configs.cellHeight + 'px';
                        v_cellDiv.style.lineHeight = this.configs.cellHeight + 'px';
                        v_cellDiv.style.width = this.elements.headerGroupDiv.childNodes[j].style.width;

                        if(this.columns[j].type == 'integer' || this.columns[j].type == 'float') {
                            v_cellDiv.innerHTML = numberToString(this.data.rendered.raw.rows[i][j].value);
                        }
                        else {
                            v_cellDiv.innerHTML = this.data.rendered.raw.rows[i][j].value;
                        }

                        if(this.data.rendered.raw.rows[i][j].cssText != null && typeof this.data.redenred.raw.rows[i][j].cssText == 'string') {
                            v_cellDiv.style.cssText = this.data.redenred.raw.rows[i][j].cssText;
                        }

                        v_cellDiv.v_renderer = this.columns[j].type;

                        if(this.columns[j].disabled) { 
                            v_cellDiv.classList.add('grid-cell-disabled');
                            v_cellDiv.v_disabled = true;
                        }
                        else {
                            v_cellDiv.v_disabled = false;
                        }

                        if(this.columns[j].type == 'integer' || this.columns[j].type == 'float') {
                            v_cellDiv.classList.add('grid-cell-numeric');
                        }

                        v_cellDiv.addEventListener(
                            'mousedown',
                            function(p_component, p_row, p_column, p_event) {
                                if(p_event.button == 0 || !p_component.selectionContains(p_row, p_column)) {
                                    p_component.controls.selection.isSelecting = true;
                                }

                                p_component.selectCellRange(p_row, p_column, p_row, p_column);
                                p_component.fixSelectPosition();
                            }.bind(v_cellDiv, this, i, j)
                        );

                        v_cellDiv.addEventListener(
                            'mouseenter',
                            function(p_component, p_row, p_column, p_event) {
                                if(p_event.button == 0) {
                                    if(p_component.controls.selection.isSelecting && (p_row != p_component.controls.selection.endRow || p_column != p_component.controls.selection.endColumn)) {
                                        p_component.selectCellRange(p_component.controls.selection.startRow, p_component.controls.selection.startColumn, p_row, p_column);
                                    }
                                }
                            }.bind(v_cellDiv, this, i, j)
                        );

                        v_cellDiv.addEventListener(
                            'mouseup',
                            function(p_component, p_row, p_column, p_event) {
                                if(p_event.button == 0) {
                                    p_component.controls.selection.isSelecting = false;
                                }
                            }.bind(v_cellDiv, this, i, j)
                        );

                        v_cellDiv.addEventListener(
                            'dblclick',
                            function(p_component, p_row, p_column, p_event) {
                                p_component.startCellEdit(p_row, p_column);
                            }.bind(v_cellDiv, this, i, j)
                        );

                        v_rowGroupDiv.appendChild(v_cellDiv);

                        if(this.columns[j].type== 'combobox' || this.columns[j].type == 'datepicker') {
                            this.createComboboxImg(i, j);
                        }

                        if(this.callbacks.afterRenderCell != null) {
                            this.callbacks.afterRenderCell(this, v_cellDiv, i, j);
                        }
                    }
                }

                this.elements.containerDiv.style.height = ((this.configs.cellHeight * this.data.rendered.raw.rows.length) + this.elements.headerContainerDiv.offsetHeight) + 'px';

                if(this.callbacks.afterRenderGrid != null) {
                    this.callbacks.afterRenderGrid(this);
                }
            }
        },
        /// <summary>
        /// Selects a cell range in the grid.
        /// </summary>
        /// <param name="p_startRow">The row index where selection starts.</param>
        /// <paramref name="p_startRow">Takes an integer.
        /// <param name="p_startColumn">The column index where selection starts.</param>
        /// <paramref name="p_startColumn">Takes an integer.
        /// <param name="p_endRow">The row index where selection ends.</param>
        /// <paramref name="p_endRow">Takes an integer.
        /// <param name="p_endColumn">The column index where selection ends.</param>
        /// <paramref name="p_endColumn">Takes an integer.
        selectCellRange: function(p_startRow, p_startColumn, p_endRow, p_endColumn) {
            this.controls.selection.startRow = p_startRow;
            this.controls.selection.startColumn = p_startColumn;
            this.controls.selection.endRow = p_endRow;
            this.controls.selection.endColumn = p_endColumn;
            this.controls.selection.selected = true;

            var v_relativeRowStart  = this.controls.selection.startRow - this.controls.currentScrollIndex;
            var v_relativeRowEnd = this.controls.selection.endRow - this.controls.currentScrollIndex;

            if((v_relativeRowStart < this.elements.dataGroupDiv.childNodes.length && v_relativeRowStart >= 0) || (v_relativeRowEnd < this.elements.dataGroupDiv.childNodes.length && v_relativeRowEnd >= 0) || (v_relativeRowStart < 0 && v_relativeRowEnd > this.elements.dataGroupDiv.childNodes.length)) {
                var v_startCell = this.getCellDivAt(this.controls.selection.startRow, this.controls.selection.startColumn);
                var v_endCell = this.getCellDivAt(this.controls.selection.endRow, this.controls.selection.endColumn);

                if(v_startCell == null || v_endCell == null) {
                    return;
                }

                var v_top;
                var v_left;
                var v_width;
                var v_height;

                if(v_startCell.offsetTop < v_endCell.offsetTop) {
                    v_top = v_startCell.offsetTop;
                    v_height = v_endCell.offsetTop + v_endCell.offsetHeight - v_startCell.offsetTop;
                }
                else {
                    v_top = v_endCell.offsetTop;
                    v_height = v_startCell.offsetTop + v_startCell.offsetHeight - v_endCell.offsetTop;
                }

                if(v_startCell.offsetLeft < v_endCell.offsetLeft) {
                    v_left = v_startCell.offsetLeft;
                    v_width = v_endCell.offsetLeft + v_endCell.offsetWidth - v_startCell.offsetLeft;
                }
                else {
                    v_left = v_endCell.offsetLeft;
                    v_width = v_startCell.offsetLeft + v_startCell.offsetWidth - v_endCell.offsetLeft;
                }


                this.elements.selectionDiv.style.top = (v_top - 1) + 'px';
                this.elements.selectionDiv.style.left = (v_left - 1) + 'px';
                this.elements.selectionDiv.style.width = (v_width + 1) + 'px';
                this.elements.selectionDiv.style.height = (v_height + 1) + 'px';
                this.elements.selectionDiv.style.display = 'block';
            }
            else {
                this.elements.selectionDiv.style.display = 'none';
            }

            if(this.callbacks.afterSelectCells != null) {
                this.callbacks.afterSelectCells(this, this.controls.selection);
            }
        },
        /// <summary>
        /// Sets cell cssText at a specified index.
        /// </summary>
        /// <param name="p_row">The row index of the cell.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell.</param>
        /// <paramref name="p_column">Takes an integer.
        /// <param name="p_cssText">The css to be applied to the cell.</param>
        /// <paramref name="p_cssText">Takes a string.
        setStyleAt: function(p_row, p_column, p_cssText) {
            this.data.rendered.raw.rows[p_row][p_column].cssText = p_cssText;
            this.data.rendered.string.rows[p_row][p_column].cssText = p_cssText;
        },
        /// <summary>
        /// Starts editing a cell in the grid.
        /// </summary>
        /// <param name="p_row">The row index of the cell to be edited.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell to be edited.</param>
        /// <paramref name="p_column">Takes an integer.
        startCellEdit: function(p_row, p_column) {
            if(this.controls.editCell.isEditing) {
                return;
            }

            this.controls.editCell.editCellInput.readOnly = false;

            var v_cellDiv = this.getCellDivAt(p_row, p_column);

            if(!v_cellDiv.v_disabled) {
                this.selectCellRange(p_row, p_column, p_row, p_column);

                this.controls.editCell.isEditing = true;
                this.controls.editCell.row = p_row;
                this.controls.editCell.column = p_column;
                //this.controls.editCell.editCellDiv = v_cellDiv;

                this.controls.editCell.editCellInput.value = this.data.rendered.raw.rows[p_row][p_column].value;

                this.controls.editCell.editCellDiv.style.top = (v_cellDiv.offsetTop - 1) + 'px';
                this.controls.editCell.editCellDiv.style.left = (v_cellDiv.offsetLeft - 1) + 'px';
                this.controls.editCell.editCellDiv.style.width = (v_cellDiv.offsetWidth + 1) + 'px';
                this.controls.editCell.editCellDiv.style.height = (v_cellDiv.offsetHeight + 1) + 'px';
                this.controls.editCell.editCellDiv.style.display = 'block';

                this.controls.editCell.editCellInput.focus();

                if(v_cellDiv.v_renderer == 'combobox') {
                    this.controls.editCell.editCellInput.readOnly = true;
                    this.elements.containerDiv.style.overflow = 'hidden';
                    this.controls.editCell.editCellCombobox.innerHTML = '';

                    for(var i = 0; i < this.columns[p_column].source.length; i++) {
                        var v_editCellComboboxItem = document.createElement('div');
                        v_editCellComboboxItem.classList.add('grid-edit-cell-combobox-item');
                        v_editCellComboboxItem.innerHTML = this.columns[p_column].source[i].text;
                        v_editCellComboboxItem.v_value = this.columns[p_column].source[i].value;
                        this.controls.editCell.editCellCombobox.appendChild(v_editCellComboboxItem);

                        v_editCellComboboxItem.addEventListener(
                            'click',
                            function(p_component, p_event) {
                                p_component.controls.editCell.editCellInput.value = this.innerHTML;
                            }.bind(v_editCellComboboxItem, this)
                        );
                    }

                    var v_rect = v_cellDiv.getBoundingClientRect();

                    this.controls.editCell.editCellCombobox.style.top = (v_rect.top + v_cellDiv.offsetHeight + document.body.scrollTop - 1) + 'px';
                    this.controls.editCell.editCellCombobox.style.left = (v_rect.left - 1) + 'px';
                    this.controls.editCell.editCellCombobox.style.minWidth = (v_cellDiv.offsetWidth + 1) + 'px';
                    this.controls.editCell.editCellCombobox.style.display = 'block';
                }
                else if(v_cellDiv.v_renderer == 'datepicker') {
                    this.elements.containerDiv.style.overflow = 'hidden';

                    this.controls.editCell.editCellDatepicker = new Pikaday({
                        field: this.controls.editCell.editCellInput,
                        format: 'MM/DD/YYYY',
                        i18n: {
                            previousMonth: 'Mês Anterior', 
                            nextMonth: 'Próximo Mês', 
                            months: [
                                'Janeiro',
                                'Fevereiro',
                                'Março',
                                'Abril',
                                'Maio',
                                'Junho',
                                'Julho',
                                'Agosto',
                                'Setembro',
                                'Outubro',
                                'Novembro',
                                'Dezembro'
                            ],
                            weekdays: [
                                'Domingo',
                                'Segunda',
                                'Terça',
                                'Quarta',
                                'Quinta',
                                'Sexta',
                                'Sábado'
                            ],
                            weekdaysShort: [
                                'Dom',
                                'Seg',
                                'Ter',
                                'Qua',
                                'Qui',
                                'Sex',
                                'Sáb'
                            ]
                        }
                    });

                    this.controls.editCell.editCellDatepicker._o.onSelect = function(p_component, p_date) {
                        p_component.controls.editCell.editCellInput.value = this.getMoment().format('MM/DD/YYYY');
                        p_component.endCellEdit();
                        
                        document.removeEventListener(
                            'click',
                            document.endEditCellFunction
                        );

                        setTimeout(
                            function() {
                                p_component.elements.dataGroupDiv.focus();
                            },
                            10
                        );
                    }.bind(this.controls.editCell.editCellDatepicker, this)

                    setTimeout(
                        function(p_component) {
                            p_component.controls.editCell.editCellDatepicker.show();
                        }.bind(this, this),
                        10
                    );
                }

                document.endEditCellFunction = function(p_component) {
                    p_component.endCellEdit();
                    document.removeEventListener(
                        'click',
                        document.endEditCellFunction
                    );
                }.bind(document.endEditCellFunction, this)

                setTimeout(
                    function() {
                        document.addEventListener(
                            'click',
                            document.endEditCellFunction
                        );
                    },
                    10
                );
            }
            else {
                this.controls.editCell.isEditing = false;
            }
        },
        /// <summary>
        /// Updates a cell content.
        /// </summary>
        /// <param name="p_row">The row index of the cell that value will be changed.</param>
        /// <paramref name="p_row">Takes an integer.
        /// <param name="p_column">The column index of the cell that value will be changed.</param>
        /// <paramref name="p_column">Takes an integer.
        /// <param name="p_newValue">The new cell content.</param>
        /// <paramref name="p_newValue">Takes a string.
        /// <param name="p_dataMode">If the index is to be applied in all data or in rendered(filtered) data.</param>
        /// <paramref name="p_dataMode">Takes a string between 'all' and 'rendered'.
        /// <param name="p_preventCallback">If we should avoid calling 'afterChangeCellData' callback.</param>
        /// <paramref name="p_preventCallback">Takes a boolean.
        updateCellDataAt: function(p_row, p_column, p_newValue, p_dataMode, p_preventCallback) {
            var v_oldValue = '';

            if(p_dataMode == 'rendered') {
                v_oldValue = this.data.rendered.raw.rows[p_row][p_column].value;
            }
            else if(p_dataMode == 'all') {
                v_oldValue = this.data.all.raw.rows[p_row][p_column].value;
            }

            var v_newValue = p_newValue;
           
            if(this.columns[p_column].type == 'combobox') {
                if(v_newValue == '') {
                    return;
                }

                var v_find = this.columns[p_column].source.find(function(p_element) {
                    return p_element.text == p_newValue;
                });

                if(v_find == null || v_find.length == 0) {
                    return;
                }
            }
            else if(this.columns[p_column].type == 'integer') {
                if(v_newValue == '') {
                    v_newValue = 0;
                }
                else {
                    v_newValue = parseInt(v_newValue);
                }

                if(isNaN(v_newValue)) {
                    return;
                }
            }
            else if(this.columns[p_column].type == 'float') {
                if(v_newValue == '') {
                    v_newValue = parseFloat('0').toFixed(2);
                }
                else {
                    v_newValue = parseFloat(v_newValue).toFixed(2);
                }

                if(isNaN(v_newValue)) {
                    return;
                }
            }
            else if(this.columns[p_column].type == 'datepicker') {
                if(v_newValue != '' && !moment(v_newValue, 'MM-DD-YYYY').isValid()) {
                    return;
                }
            }

            if(v_oldValue != v_newValue) {
                var v_isFiltered = null;

                if(p_dataMode == 'rendered') {
                    v_isFiltered = true;

                    this.data.rendered.raw.rows[p_row][p_column].value = v_newValue;
                    this.data.rendered.string.rows[p_row][p_column].value = String(v_newValue);

                    //Check if the new value is in the column filter, if it's the case (If we should remove the row from rendered ones)
                    if(this.columns[p_column].hasFilter) {
                        if(this.columns[p_column].filter.isFiltered) {
                            if(this.columns[p_column].filter.selectedValues.indexOf(String(v_newValue)) == -1) {
                                v_isFiltered = false;

                                var v_rawIndexOf = this.data.rendered.raw.rows[p_row].filteredByColumns.indexOf(p_column);

                                if(v_rawIndexOf != -1) {
                                    this.data.rendered.raw.rows[p_row].filteredByColumns.splice(v_rawIndexOf, 1);
                                }

                                var v_stringIndexOf = this.data.rendered.string.rows[p_row].filteredByColumns.indexOf(p_column);

                                if(v_stringIndexOf != -1) {
                                    this.data.rendered.string.rows[p_row].filteredByColumns.splice(v_stringIndexOf, 1);
                                }
                            }
                        }
                    }
	            }
	            else if(p_dataMode == 'all') {
                    v_isFiltered = true;

	                this.data.all.raw.rows[p_row][p_column].value = v_newValue;
	                this.data.all.string.rows[p_row][p_column].value = String(v_newValue);

                    //Check if the new value is in the column filter, if it's the case (If we should include the row among rendered ones)
                    if(this.data.all.raw.rows[p_row].filteredByColumns.indexOf(p_column) == -1) {
                        v_isFiltered = false;

	                    if(this.columns[p_column].hasFilter) {
	                        if(this.columns[p_column].filter.isFiltered) {
	                            if(this.columns[p_column].filter.selectedValues.indexOf(String(v_newValue)) != -1) {
                                    v_isFiltered = true;

                                    this.data.all.raw.rows[p_row].filteredByColumns.push(p_column);
                                    this.data.rendered.raw.rows.push(this.data.all.raw.rows[p_row]);

                                    this.data.all.string.rows[p_row].filteredByColumns.push(p_column);
                                    this.data.rendered.string.rows.push(this.data.all.string.rows[p_row]);
	                            }
	                        }
	                    }
                    }
	            }

                if(!p_preventCallback && this.callbacks.afterChangeCellData != null) {
                    this.callbacks.afterChangeCellData(this, p_row, p_column, v_oldValue, v_newValue, p_dataMode, v_isFiltered);
                }
            }
        }
    };

    var v_gridContainerDiv = document.createElement('div');
    v_gridContainerDiv.classList.add('grid-container');
    v_gridContainerDiv.v_componentObject = v_gridObject;
    v_gridObject.elements.containerDiv = v_gridContainerDiv;

    var v_headerContainerDiv = document.createElement('div');
    v_headerContainerDiv.classList.add('grid-header-container');
    //v_headerContainerDiv.style.height = v_gridObject.configs.headerHeight + 'px';
    v_gridObject.elements.headerContainerDiv = v_headerContainerDiv;
    v_gridContainerDiv.appendChild(v_headerContainerDiv);

    var v_totalGroupDiv = document.createElement('div');
    v_totalGroupDiv.classList.add('grid-summary-group');
    v_totalGroupDiv.style.height = '0px';
    v_gridObject.elements.totalGroupDiv = v_totalGroupDiv;
    v_headerContainerDiv.appendChild(v_totalGroupDiv);

    var v_subtotalGroupDiv = document.createElement('div');
    v_subtotalGroupDiv.classList.add('grid-summary-group');
    v_subtotalGroupDiv.style.height = '0px';
    v_gridObject.elements.subtotalGroupDiv = v_subtotalGroupDiv;
    v_headerContainerDiv.appendChild(v_subtotalGroupDiv);

    if(v_gridObject.configs.draggableRows) {
        var v_headerCornerDiv = document.createElement('div');
        v_headerCornerDiv.classList.add('grid-header-corner');
        v_headerCornerDiv.style.width = v_gridObject.configs.cellWidth + 1 + 'px';
        v_headerCornerDiv.style.height = v_gridObject.configs.headerHeight + 'px';
        v_gridObject.elements.headerCornerDiv = v_headerCornerDiv; 
        v_headerContainerDiv.appendChild(v_headerCornerDiv);

        var v_headerCornerInsideDiv = document.createElement('div');
        v_headerCornerInsideDiv.classList.add('grid-header-corner-inside');
        v_headerCornerInsideDiv.style.width = v_gridObject.configs.cellWidth + 1 + 'px';
        v_headerCornerInsideDiv.style.height = v_gridObject.configs.headerHeight + 'px';
        v_headerCornerDiv.appendChild(v_headerCornerInsideDiv);

        var v_draggableRowsGroupDiv = document.createElement('div');
        v_draggableRowsGroupDiv.classList.add('grid-row-header-group');
        v_draggableRowsGroupDiv.style.width = v_gridObject.configs.cellWidth + 1 + 'px';
        v_draggableRowsGroupDiv.style.paddingTop = v_gridObject.configs.headerHeight + 'px';
        v_gridObject.elements.draggableRowsGroupDiv = v_draggableRowsGroupDiv;
        v_gridContainerDiv.appendChild(v_draggableRowsGroupDiv); 
    }

    var v_headerGroupDiv = document.createElement('div');
    v_headerGroupDiv.classList.add('grid-header-group');
    v_headerGroupDiv.style.height = v_gridObject.configs.headerHeight + 'px';
    v_gridObject.elements.headerGroupDiv = v_headerGroupDiv;
    v_headerContainerDiv.appendChild(v_headerGroupDiv);

    if(v_gridObject.configs.draggableRows) {
        v_headerGroupDiv.style.marginLeft = v_gridObject.configs.cellWidth + 'px';
    }

    var v_dataGroupDiv = document.createElement('div');
    v_dataGroupDiv.classList.add('grid-data-group');
    v_dataGroupDiv.style.paddingTop = v_gridObject.configs.headerHeight + 'px';
    v_dataGroupDiv.setAttribute('tabindex', '0');
    v_gridObject.elements.dataGroupDiv = v_dataGroupDiv;
    v_gridContainerDiv.appendChild(v_dataGroupDiv);

    v_dataGroupDiv.addEventListener(
        'keyup',
        function(p_event) {
            p_event.preventDefault();
            p_event.stopPropagation();
        }
    );

    if(v_gridObject.configs.draggableRows) {
        v_dataGroupDiv.style.paddingLeft = v_gridObject.configs.cellWidth + 'px';
    }

    if(typeof gridCopyFunction == 'undefined' || gridCopyFunction == null) {//global window variable
        gridCopyFunction = function(p_event) {
            if(p_event.path.length > 0) {
                var v_found = false;

                for(var k = 0; k < p_event.path.length && !v_found; k++) {                    
                    if(typeof p_event.path[k].activeElement != 'undefined' && typeof p_event.path[k].activeElement.classList != 'undefined') {
                        if(p_event.path[k].activeElement.classList.length > 0) {//Maybe it's a grid container
                            for(var i = 0; i < p_event.path[k].activeElement.classList.length && !v_found; i++) {
                                if(p_event.path[k].activeElement.classList[i] == 'grid-data-group') {
                                    v_found = true;
                                }
                            }

                            if(v_found) {
                                var v_component = p_event.path[k].activeElement.parentNode.v_gridObject; 
                                var v_selection = p_event.path[k].activeElement.parentNode.v_gridObject.controls.selection;

                                var v_startRow = v_selection.startRow;
                                var v_endRow = v_selection.endRow;

                                if(v_startRow > v_endRow) {
                                    v_startRow = v_selection.endRow;
                                    v_endRow = v_selection.startRow;
                                }

                                var v_startColumn = v_selection.startColumn;
                                var v_endColumn = v_selection.endColumn;

                                if(v_startColumn > v_endColumn) {
                                    v_startColumn = v_selection.endColumn;
                                    v_endColumn = v_selection.startColumn;
                                }

                                var v_string = '';

                                for(var i = v_startRow; i <= v_endRow; i++) {
                                    for(var j = v_startColumn; j <= v_endColumn; j++) {
                                        v_string += v_component.data.rendered.string.rows[i][j].value + '\t';
                                    }

                                    v_string = v_string.slice(0, -1) + '\r\n';
                                }

                                p_event.clipboardData.setData('text/plain', v_string);
                                p_event.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
                            }
                        }
                    }
                }
            }
        }
    }

    document.removeEventListener('copy', gridCopyFunction);
    document.addEventListener('copy', gridCopyFunction);

    if(typeof gridPasteFunction == 'undefined' || gridPasteFunction == null) {//global window variable
        gridPasteFunction = function(p_event) {
            if(p_event.path.length > 0) {
                var v_found = false;

                for(var k = 0; k < p_event.path.length && !v_found; k++) {                    
                    if(typeof p_event.path[k].activeElement != 'undefined' && typeof p_event.path[k].activeElement.classList != 'undefined') {
                        if(p_event.path[k].activeElement.classList.length > 0) {//Maybe it's a grid container
                            for(var i = 0; i < p_event.path[k].activeElement.classList.length && !v_found; i++) {
                                if(p_event.path[k].activeElement.classList[i] == 'grid-data-group') {
                                    v_found = true;
                                }
                            }

                            if(v_found) {                               
                                var v_component = p_event.path[k].activeElement.parentNode.v_gridObject;
                                var v_selection = p_event.path[k].activeElement.parentNode.v_gridObject.controls.selection;
                                var v_startRow = v_selection.startRow;
                                var v_startColumn = v_selection.startColumn;
                                var v_lines;

                                if(p_event.clipboardData.getData('text/plain').indexOf('\r\n') != -1) {
                                    v_lines = p_event.clipboardData.getData('text/plain').split('\r\n');
                                }
                                else {
                                    v_lines = p_event.clipboardData.getData('text/plain').split('\n');
                                }

                                for(var i = 0; i < v_lines.length - 1; i++) {
                                    var v_cells = v_lines[i].split('\t');

                                    for(var j = 0; j < v_cells.length; j++) {
                                        if(!v_component.columns[v_startColumn + j].disabled) {
                                            v_component.updateCellDataAt(v_startRow + i, v_startColumn + j, v_cells[j], 'rendered', false);
                                        }
                                    }
                                }

                                v_component.render();
                                p_event.preventDefault();
                            }
                        }
                    }
                }
            }
        }
    }

    document.removeEventListener('paste', gridPasteFunction);
    document.addEventListener('paste', gridPasteFunction);

    v_dataGroupDiv.addEventListener(
        'keydown',
        function(p_component, p_event) {
            if(p_event.code == 'KeyC' && (p_event.ctrlKey || p_event.metaKey)) {
                event.preventDefault();
                event.stopPropagation();
                document.execCommand('copy');
            }   
            else if(p_event.code == 'KeyV' && (p_event.ctrlKey || p_event.metaKey)) {
                document.execCommand('paste');
            }
            else {
                p_event.preventDefault();
                p_event.stopPropagation();

                if(p_event.code == 'ArrowLeft' || p_event.code == 'ArrowRight' || p_event.code == 'ArrowUp' || p_event.code == 'ArrowDown') {
                    if(!event.shiftKey) {
                        p_component.moveSelector(p_event.code, false);
                    }
                    else {
                        p_component.moveSelector(p_event.code, true);
                    }
                }
                else if(p_event.code == 'KeyA' && p_event.ctrlKey) {
                    p_component.selectCellRange(
                        0,
                        0,
                        p_component.data.rendered.raw.rows.length - 1,
                        p_component.data.rendered.raw.columns.length - 1
                    );

                }
                else if(p_event.keyCode == 113 || p_event.keyCode == 13) {//Enter or f2
                    p_component.startCellEdit(p_component.controls.selection.startRow, p_component.controls.selection.startColumn);
                }
                else if(p_event.keyCode == 46) {//Delete
                    p_component.deleteSelectedCells();
                }
                else if((p_event.keyCode >= 65 && p_event.keyCode <= 90) || (p_event.keyCode >= 48 && p_event.keyCode <= 57) || (p_event.keyCode >= 96 && p_event.keyCode <= 111)) {//Some valid key for editing
                    p_component.startCellEdit(p_component.controls.selection.startRow, p_component.controls.selection.startColumn);
                    p_component.controls.editCell.editCellInput.value = p_event.key;
                }
            }
        }.bind(v_dataGroupDiv, v_gridObject)
    );

    var v_selectionDiv = document.createElement('div');
    v_selectionDiv.classList.add('grid-selection');
    v_gridObject.elements.selectionDiv = v_selectionDiv;
    v_gridObject.controls.selection.selectionDiv = v_selectionDiv;
    v_gridContainerDiv.appendChild(v_selectionDiv);

    var v_editCellDiv = document.createElement('div');
    v_editCellDiv.classList.add('grid-edit-cell');
    v_editCellDiv.style.display = 'none';
    v_gridObject.controls.editCell.editCellDiv = v_editCellDiv;
    v_gridContainerDiv.appendChild(v_editCellDiv);

    var v_editCellInput = document.createElement('input');
    v_editCellInput.classList.add('grid-edit-cell-input');
    v_editCellInput.style.height = v_gridObject.configs.cellHeight + 'px';
    v_gridObject.controls.editCell.editCellInput = v_editCellInput;
    v_editCellDiv.appendChild(v_editCellInput);

    v_editCellInput.addEventListener(
        'keydown',
        function(p_component, p_event) {
            if(p_event.code == 'NumpadEnter' || p_event.code == 'Enter' || p_event.code == 'ArrowDown') {
                p_component.endCellEdit();
                p_component.moveSelector('ArrowDown', false);
                
                document.removeEventListener(
                    'click',
                    document.endEditCellFunction
                );

                p_event.preventDefault();
                p_event.stopPropagation();
            }
            else if(p_event.code == 'ArrowUp') {
                p_component.endCellEdit();
                p_component.moveSelector('ArrowUp', false);
                
                document.removeEventListener(
                    'click',
                    document.endEditCellFunction
                );

                p_event.preventDefault();
                p_event.stopPropagation();
            }
            else if(p_event.code == 'ArrowLeft') {
                /*TODO: verificar isso depois*/
            }
            else if(p_event.code == 'ArrowRight') {
                /*TODO: verificar isso depois*/
            }
            else if(p_event.code == 'Escape') {
                p_component.cancelCellEdit();

                document.removeEventListener(
                    'click',
                    document.endEditCellFunction
                );

                p_component.elements.dataGroupDiv.focus();
            }
            else if(p_event.code == 'Tab') {
                p_component.endCellEdit();
                p_component.moveSelector('ArrowRight', false);

                document.removeEventListener(
                    'click',
                    document.endEditCellFunction
                );

                p_event.preventDefault();
                p_event.stopPropagation();
            }
        }.bind(v_editCellInput, v_gridObject)
    );

    v_editCellInput.addEventListener(
        'click',
        function(p_event) {
            p_event.preventDefault();
            p_event.stopPropagation();
        }
    );

    var v_editCellCombobox = document.createElement('div');
    v_editCellCombobox.classList.add('grid-edit-cell-combobox');
    v_gridObject.controls.editCell.editCellCombobox = v_editCellCombobox;
    document.body.appendChild(v_editCellCombobox);

    var v_filterColumnDiv = document.createElement('div');
    v_filterColumnDiv.classList.add('grid-filter-column');
    v_filterColumnDiv.style.minWidth = '275px';
    v_filterColumnDiv.style.maxWidth = '275px';
    v_filterColumnDiv.style.minHeight = '350px';
    v_filterColumnDiv.style.maxHeight = '350px';
    v_gridObject.controls.filterColumn.filterColumnDiv = v_filterColumnDiv;
    document.body.appendChild(v_filterColumnDiv);

    //Hide Filter div
    document.body.addEventListener(
        'click',
        function(p_component, p_event) {
            var v_found = false;

            var v_current = p_event.target;

            while(v_current != null && !v_found) {
                if(v_current.classList != null) {
                    if(v_current.classList.contains('img-grid-header-filter') || v_current.classList.contains('grid-filter-column')) {
                        v_found = true;
                    }
                }

                v_current = v_current.parentElement;
            }

            if(!v_found) {
                p_component.controls.filterColumn.filterColumnDiv.style.display = 'none';
            }
        }.bind(document.body, v_gridObject)
    );

    //Clicking outside of grid container
    document.body.addEventListener(
        'click',
        function(p_component, p_event) {
            var v_found = false;

            for(var i = 0; i < p_event.path.length; i++) {
                if(p_event.path[i].className == 'grid-container' || p_event.path[i].className == 'grid-edit-cell-combobox-item') {
                    v_found = true;
                    break
                }
            }

            if(!v_found) {
                p_component.clearSelection();
            }
        }.bind(document.body, v_gridObject)
    );

    v_gridObject.elements.componentDiv.appendChild(v_gridContainerDiv);

    v_gridObject.elements.componentDiv.addEventListener(
        'scroll',
        function(p_component, p_event) {
            p_component.elements.headerContainerDiv.style.marginTop = p_event.target.scrollTop + 'px';

            if(p_component.configs.draggableRows) {
                p_component.elements.headerCornerDiv.style.marginLeft = p_event.target.scrollLeft + 'px';
                p_component.elements.draggableRowsGroupDiv.style.marginLeft = p_event.target.scrollLeft + 'px';
            }

            var v_quotient = Math.floor(p_event.target.scrollTop / p_component.configs.cellHeight);
            var v_remainder = p_event.target.scrollTop % p_component.configs.cellHeight;
            var v_levelDiff = Math.abs(p_component.controls.currentScrollIndex - v_quotient);

            if(v_levelDiff >= 1) {
                var v_hasSummary = false;

                for(var i = 0; i < p_component.columns.length && !v_hasSummary; i++) {
                    if(p_component.columns[i].hasSummary) {
                        v_hasSummary = true;
                    }
                }

                if(v_hasSummary) {
                    p_component.elements.dataGroupDiv.style.paddingTop = ((v_quotient * p_component.configs.cellHeight) + (p_component.configs.headerHeight * 3)) + 'px';

                    if(p_component.configs.draggableRows) {
	                    p_component.elements.draggableRowsGroupDiv.style.paddingTop = ((v_quotient * p_component.configs.cellHeight) + (p_component.configs.headerHeight * 3)) + 'px';
	                }
                }
                else {
                    p_component.elements.dataGroupDiv.style.paddingTop = ((v_quotient * p_component.configs.cellHeight) + p_component.configs.headerHeight) + 'px';

                    if(p_component.configs.draggableRows) {
	                    p_component.elements.draggableRowsGroupDiv.style.paddingTop = ((v_quotient * p_component.configs.cellHeight) + p_component.configs.headerHeight) + 'px';
	                }
                }

                p_component.controls.currentScrollIndex = v_quotient;
                p_component.render();
            }

            if(p_component.controls.selection.selected && !p_component.controls.selection.isSelecting) {
                p_component.selectCellRange(p_component.controls.selection.startRow, p_component.controls.selection.startColumn, p_component.controls.selection.endRow, p_component.controls.selection.endColumn);
            }
        }.bind(v_gridObject.elements.componentDiv, v_gridObject)
    );

    v_gridObject.elements.containerDiv.v_gridObject = v_gridObject;

    return v_gridObject;
}
