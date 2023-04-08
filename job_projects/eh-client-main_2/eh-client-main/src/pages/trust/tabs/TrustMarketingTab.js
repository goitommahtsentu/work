import React, {useEffect, useState} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import { Button, Card, Form, OverlayTrigger, Tooltip, Row, Col, Table } from 'react-bootstrap';


// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../../components/AgGrid/dateFormatter";
import DateEditor from "../../../components/AgGrid/DateEditor";


import DeleteButton from "../../../components/AgGrid/DeleteButton";


import {Trusts} from '../../../services';


const MarketingTab = props => {
    const [HistoryRowData, setHistoryRowData] = useState([]);
    const [ReportRowData, setReportRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [gridApi2, setGridApi2] = useState(null);
    // these are the AG grid Col Perameters
    const defaultColDef = {
        filter: true,
        sortable: false,
        editable: true,

    }


    useEffect(() => {

        const getMarketingReport=async()=>{
            const data=await Trusts.getMarketingReport(props.id)
            setReportRowData(data)
        }
        getMarketingReport()
        const getMarketingHistory=async()=>{
            const data=await Trusts.getMarketingHistory(props.id)
            setHistoryRowData(data)
        }
        getMarketingHistory()
    }, [props.id,toggle,props.toggle,props.setToggle]);

        const frameworkComponents = {
        btnCellRenderer: DeleteButton,
            dateEditor: DateEditor,
    }



    const handleHistoryDelete = async(id) => {
        await Trusts.deleteMarketingHistory(id)
        setToggle(prev=>!prev);
    }

    const handleReportDelete = async(id) => {
        await Trusts.deleteMarketingReport(id)
        setToggle(prev=>!prev);
    }

    const cellRendererParams = {
        clicked: function (id) {
            handleHistoryDelete(id);
            // window.location = (`${id}`);
        },
    }

    const cellRendererParams2 = {
        clicked: function (id) {
            handleReportDelete(id);
            // window.location = (`${id}`);
        },
    }

    const tokenConfig = {
        headers: {
            'Content-Type': 'application/json'
        },
    }

    // Endpoint Calls the button which adds a new row
    const handleNewHistory = async(id) => {
        // console.log("New Line Created For Trust Id", props.id)
        const obj = {};
        obj["trust_id"] = props.id
        const data=await Trusts.postMarketingHistory(obj)
       if(data) setHistoryRowData(prevState=>[data,...prevState])
    }
    // Endpoint Calls the button which adds a new row
        const handleNewReport = async(id) => {
        // console.log("New Line Created For Trust Id", props.id)
        const obj = {};
        obj["trust_id"] = props.id
        const data=await Trusts.postMarketingReport(obj)
        if(data) setReportRowData(prevState=>[data,...prevState])
    }

    // Endpoint Calls for making edited info push to the backend and update the data
    const handleUpdateHistory = async(body) => {
            console.log("obj", body)
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        const obj = {};
        obj[body.colDef.field] = body.newValue
        await Trusts.editMarketingHistory(id,obj)
    }

    const gridOptions1 = {


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

        const gridOptions2 = {


    domLayout:"autoHeight",
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

    // Endpoint Calls for making edited info push to the backend and update the data
    const handleUpdateReport = async(body) => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        console.log("obj", body)
        const id = body.data.id
        const obj = {};
        // obj[body.colDef.field] = body.newValue
        obj[body.colDef.field] = body.newValue
        await Trusts.editMarketingReport(id,obj)
    }

    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };

    const handleGridReady2 = params => {
        setGridApi2(params.api);
        setColumnApi(params.columnApi);
    };

    return (
        <React.Fragment>
            <React.Fragment>
                <Card.Header>
                    <Card.Title as="h5">Marketing History</Card.Title>
                    <Button className="shadow-1 theme-bg border border-0 btn-sm"
                            onClick={() => {
                                gridApi.applyTransaction({ add:[{}]});
                                handleNewHistory()
                            }}
                    >
                        Add a Row
                    </Button>
                </Card.Header>
                <div id className="ag-theme-alpine" >
                    <AgGridReact
                        // gridOptions={gridOptions}
                        domLayout={"autoHeight"}
                        frameworkComponents={frameworkComponents}
                        defaultColDef={defaultColDef}
                        onGridReady={handleGridReady}

                        rowStyle={{}}
                        domLayout={"autoHeight"}
                        // sizeColsToFix={true}
                        // autoSizeColumns={"allColIds"}
                        // quickFilter={1}

                        gridOptions={gridOptions2}
                        // Styling
                        autoSizePadding={ 0}
                        colResizeDefault={'shift'}
                        suppressDragLeaveHidesColumns={true}


                        // Editing

                        undoRedoCellEditing={true}
                        undoRedoCellEditingLimit={20}
                        // stopEditingWhenCellsLoseFocus:false,
                        // stopEditingWhenGridLosesFocus:false,

                        // Charts
                        enableCharts={true}

                        // selection
                        rowSelection={"multiple"}
                        enableRangeSelection={true}
                        enableRangeHandle={true}
                        suppressRowClickSelection={true}


                        // Editing
                        onCellValueChanged={handleUpdateHistory}
                        // This is Important ^^^^^^^^ for the data actually updating

                        rowData={HistoryRowData}>
                        <AgGridColumn field="on_market_date" headerName="On the Market" flex={1} cellEditor="dateEditor" valueFormatter={dateFormatter}/>
                        <AgGridColumn field="off_market_date" headerName="Off The Market"  flex={1} cellEditor="dateEditor" valueFormatter={dateFormatter}/>
                        <AgGridColumn field="days_on_market" headerName="Days On Market" flex={1}/>
                        <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'btnCellRenderer'} cellRendererParams={cellRendererParams} filter={false} width={50} />
                    </AgGridReact>
                </div>
        </React.Fragment>

            <React.Fragment>
                <Card.Header>
                    <Card.Title as="h5">Marketing Report</Card.Title>
                    <Button className="shadow-1 theme-bg border border-0 btn-sm"
                        onClick={() => {
                            gridApi2.applyTransaction({ add:[{}]});
                            handleNewReport()
                        }}
                    >
                        Add a Row
                    </Button>
                </Card.Header>
                    <div id className="ag-theme-alpine" style={{height: '100%'}}>
                        <AgGridReact
                            defaultColDef={defaultColDef}
                            frameworkComponents={frameworkComponents}
                            gridOptions={gridOptions1}
                            onGridReady={handleGridReady2}
                            // Editing
                            onCellValueChanged={handleUpdateReport}
                            rowData={ReportRowData}>
                            <AgGridColumn field="report_date" headerName="Date" flex={1} valueFormatter={dateFormatter} cellEditor="dateEditor"/>
                            <AgGridColumn field="zillow_visits" headerName="Zillow Visits"  flex={1}/>
                            <AgGridColumn field="reaches" headerName="Reaches" flex={1}/>
                            <AgGridColumn field="applications" headerName="Applications"  flex={1}/>
                            <AgGridColumn field="contracts" headerName="Contracts" flex={1}/>
                            <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'btnCellRenderer'} cellRendererParams={cellRendererParams2} filter={false} width={50} />
                        </AgGridReact>
                    </div>
            </React.Fragment>

        </React.Fragment>
    );
}

export default MarketingTab;
