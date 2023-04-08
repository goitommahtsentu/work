// import React from "react";
// Import AG Grid
import "./Estimate.css";
import DeleteButton from "./DeleteButton";
import DateEditor from "./DateEditor";
import OpenCellRenderer from "./OpenCellRenderer";
import AutoCompleteEditor from "./AutoCompleteEditor";
import SelectEditor from './SelectEditor'
import CheckBoxEditor from './CheckBoxEditor'
import BadgeDisplayRenderer from './BadgeDisplay'
import TagDisplay from "./TagDisplay";
import TagEditor from './TagEditor'

const frameworkComponents = {
    btnCellRenderer: DeleteButton,
    dateEditor: DateEditor,
    autoCompleteEditor: AutoCompleteEditor,
    selectEditor:SelectEditor,
    checkboxEditor:CheckBoxEditor,
    openCellRenderer: OpenCellRenderer,
    badgeDisplayRenderer:BadgeDisplayRenderer,
    tagDisplay:TagDisplay,
    tagEditor:TagEditor
}

const gridOptions = {

    rowStyle:{},
    domLayout:"autoHeight",
    // sizeColsToFix:true,
    // autoSizeColumns:"allColIds",
    // quickFilter:1,
    frameworkComponents:frameworkComponents,
    tooltipShowDelay:1000,


    // Styling
    autoSizePadding: 0,
    colResizeDefault:'shift',
    suppressDragLeaveHidesColumns:true,


    // Editing
    enterMovesDown:true,
    enterMovesDownAfterEdit:true,
    undoRedoCellEditing:true,
    undoRedoCellEditingLimit:20,
    // stopEditingWhenCellsLoseFocus:false,
    // stopEditingWhenGridLosesFocus:false,

    // Charts
    enableCharts:true,

    // selection
    rowSelection:"multiple",
    enableRangeSelection:true,
    enableRangeHandle:true,
    suppressRowClickSelection:true,
    statusBar: {
        statusPanels: [
            {
                statusPanel: 'agAggregationComponent',
                statusPanelParams: {
                    // possible values are: 'count', 'sum', 'min', 'max', 'avg'
                    aggFuncs: ['sum', 'avg','count'],
                },
            },
        ],
    },
};



export default gridOptions