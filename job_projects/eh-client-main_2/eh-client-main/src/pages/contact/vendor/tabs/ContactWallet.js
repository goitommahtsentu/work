import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Button, Card, Form, OverlayTrigger, Tooltip, Col, Row, Table } from 'react-bootstrap';



// Import AG Grid
import 'ag-grid-enterprise';
import DeleteButton from "../../../../components/AgGrid/DeleteButton";
import "../../../../components/AgGrid/Estimate.css";
import DateEditor from "../../../../components/AgGrid/DateEditor";
import dateFormatter from "../../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../../components/AgGrid/currencyFormatter";
import AutoCompleteEditor from "../../../../components/AgGrid/AutoCompleteEditor";
import { BILL } from "../../../../components/AgGrid/Options";
// import gridOptions from "../../../components/AgGrid/gridOptions";
import { billColor } from "../../../../components/AgGrid/color";

import checkBoxRenderer from "../../../../components/AgGrid/checkBoxRenderer";

import {Bills} from '../../../../services'

const WalletTabView = props => {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [billsData, setBillsData] = useState([]);
    const [toggle, setToggle] = useState(0);

    // This is for the Edit switch
    const [FamSwitch, setFamSwitch] = useState(false);

    const toggleHandler = () => {
        setFamSwitch((prevState) => !prevState);
    };

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: true,
        sortable: false,
        editable: true,
    }

  
      const getList = async() => {
        const data=await Bills.getBills(props.id)
        setRowData(data)
        return data
      }

    useEffect(() => {
        getList()
    }, [props.id,toggle]);


    // Enpoint Calls
    const handleUpdateBills = body => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        const obj = {};
        obj[body.colDef.field] = body.newValue
        Bills.updateBill(id,obj)
    }

    const frameworkComponents = {
        btnCellRenderer: DeleteButton,
        dateEditor: DateEditor,
        autoCompleteEditor: AutoCompleteEditor,
    }

    const handleDelete = async(id) => {
        await Bills.deleteBill(id)
        setToggle(!toggle);

    }

    const cellRendererParams = {
        clicked: function (id) {
            handleDelete(id);
            // window.location = (`${id}`);
        },
    }

    const onGridReady = (params) => {
    setGridApi(params.api);
  };

const gridOptions = {


    rowStyle:{},
    domLayout:"autoHeight",
    // sizeColsToFix:true,
    // autoSizeColumns:"allColIds",
    // quickFilter:1,

    // Styling
    autoSizePadding: 0,
    colResizeDefault:'shift',
    suppressDragLeaveHidesColumns:true,


    // Editing

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


    const getRunningTotal = (params) => {
        const { id, credit, debit,  } = params?.data;
        let result;
        const filteredRow = rowData.filter((row) => row.estimate != true);

        filteredRow.map((row, index) => {
            if (row.id === id) {
                if (index === 0) {
                    result = credit - debit;

                } else {
                    // first Running total
                    // Cal second running total
                    // cal 3rd running total
                    const allRunningTotalNode = document.querySelectorAll(
                        '[col-id="running_total"]'
                    );

                    const allRunningTotalArr = Array.from(allRunningTotalNode);
                    allRunningTotalArr.shift();

                    const filteredRunningTotal = allRunningTotalArr.filter(
                        (runningTotal) => runningTotal.innerHTML !== "Estimate"
                    );
                    const prevRunningTotal =
                        index === 0 ? credit - debit : filteredRunningTotal[index - 1];

                    const prevTot = prevRunningTotal.innerHTML.replace(/[^0-9.-]+/g,"")



                    const total =
                        Number(prevTot) +
                        Number(params.data.credit) -
                        Number(params.data.debit);
                    result = total;
                }
            }
        });

        return result;
    };

    return (
        <React.Fragment>
            <Card.Header>
                <Card.Title as="h5">Other Bills</Card.Title>
                <div className="switch d-inline m-r-10 float-right">
                    <Form.Control
                        type="checkbox"
                        id="billsswitch"
                        famswitch={FamSwitch}
                        onChange={() => toggleHandler}
                    />
                    <Form.Label htmlFor="billsswitch" className="cr" />
                    <Form.Label className="ml-2">Show Full Accounting</Form.Label>
                </div>
            </Card.Header>
            <div className="ag-theme-alpine" style={{ height: '100%' }}>
                <AgGridReact
                    gridOptions={gridOptions}

                    frameworkComponents={frameworkComponents}
                    defaultColDef={defaultColDef}

                    onCellValueChanged={handleUpdateBills}
                    getRowNodeId={function (data) {
                        return data.id;
                    }}
                    rowClassRules={billColor}

                    rowData={rowData}>
                    <AgGridColumn field="date" headerName="Date" flex={1} cellEditor="dateEditor" valueFormatter={dateFormatter}/>
                    <AgGridColumn field="entity" headerName="Entity Name" flex={1} />
                    <AgGridColumn field="category" headerName="Type" flex={1} cellEditor="autoCompleteEditor" cellEditorParams={{options: BILL}}/>
                    <AgGridColumn field="debit" headerName="Debit" flex={1} valueFormatter={currencyFormatter} />
                    <AgGridColumn field="credit" headerName="Credit" flex={1} valueFormatter={currencyFormatter} />
                    <AgGridColumn headerName="Running total" field="running_total" flex={1} valueGetter={(params,rowData) => getRunningTotal(params,rowData)} valueFormatter={currencyFormatter}/>
                    <AgGridColumn
                        headerName="Paid"
                        suppressMenu={true}
                        field="paid_bill"
                        flex={.7}
                        cellRenderer={checkBoxRenderer}
                    />
                    <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'btnCellRenderer'} cellRendererParams={cellRendererParams} sort={false} flex={.5} />
                </AgGridReact>
            </div>
        </React.Fragment>
    );
}

export default WalletTabView;
