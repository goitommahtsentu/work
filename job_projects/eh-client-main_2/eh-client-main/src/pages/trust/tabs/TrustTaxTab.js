import React, { useState, useEffect } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { Card, Form, Col, Row, Table,} from "react-bootstrap";

import NumberFormat from "react-number-format";
import { fieldTypeBills } from '../../../config/trust/fieldTypeBills.js'

// Import Modals
import AddTaxFundsModal from "../modals/AddTaxFundsModal";
import TaxBillModal from "../modals/TaxBillModal";

// Import AG Grid
import 'ag-grid-enterprise';
import DeleteButton from "../../../components/AgGrid/DeleteButton";
import "../../../components/AgGrid/Estimate.css";
import DateEditor from "../../../components/AgGrid/DateEditor";
import dateFormatter from "../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../components/AgGrid/currencyFormatter";
import AutoCompleteEditor from "../../../components/AgGrid/AutoCompleteEditor";
import { TAX } from "../../../components/AgGrid/Options";
import checkBoxRenderer from "../../../components/AgGrid/checkBoxRenderer";
import {billColor} from "../../../components/AgGrid/color";



import {Bills} from '../../../services'
import { getParsedListForTrust } from "../../../utils/parsedList.js";

function TaxTabView(props) {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [taxState, setTaxState] = useState({});
  const [toggle, setToggle] = useState(0);

  // This is for the Edit switch
  const [FamSwitch, setFamSwitch] = useState(false);

  
  const getList = async() => {
    const data=await Bills.getBillsForTrust(props.id,'tax')
        setRowData(getParsedListForTrust(data))

  }

  const toggleHandler = () => {
    setFamSwitch((prevState) => !prevState);
  };

  // these are the AG grid Col Parameters
  const defaultColDef = {
    filter: true,
    sortable: false,
    editable: true,
  };

  useEffect(() => {
    getList()
  }, [props.id, toggle]);


  // Enpoint Calls
  const handleUpdate =(body) => {
    const id = body.data.id;
    const obj = {};
    obj[body.colDef.field] = body.newValue;
    console.log("obj", obj)
    Bills.updateBill(id,obj)
  };

  const frameworkComponents = {
    btnCellRenderer: DeleteButton,
    dateEditor: DateEditor,
    autoCompleteEditor: AutoCompleteEditor,
  };

  const handleDelete = async(id) => {
    await Bills.deleteBill(id)
    setToggle(!toggle);
  };

  const cellRendererParams = {
    clicked: function (id) {
      handleDelete(id);
      // window.location = (`${id}`);
    },
  };


  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const gridOptions = {

    rowStyle:{},
    onGridReady:onGridReady,
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

  const getRunningTotal = (params) => {
    const { id, credit, debit, estimate } = params?.data;
    let result;
    if (estimate) {
      result = "Estimate";
    }

    const filteredRow = rowData.filter((row) => row.estimate !== true);

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

          const prevTot = prevRunningTotal.innerHTML.replace(/[^0-9.-]+/g, "")



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
      <Row>
        <Col md={6}>
          <Table hover className="table-columned">
            <tbody>
              <tr>
                {/*This is a calculated field and read only*/}
                <th scope="row" width="30%">
                  Estimated Monthly Tax
                </th>
                <td>
                  <NumberFormat
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    decimalScale={2}
                    value={`${props.trust && props.trust.current_monthly_tax}`}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={6}>
          <Table hover className="table-columned">
            <tbody>
              <tr>
                {/*This is a calculated field and read only*/}
                <th scope="row" width="30%">
                  Estimated Annual Tax
                </th>
                <td>
                  <NumberFormat
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"$"}
                    decimalScale={2}
                    value={`${props.trust && props.trust.current_annual_tax}`}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <hr />
      <Card.Header>
        <Card.Title as="h5">Taxes</Card.Title>
        <TaxBillModal
          id={props.id && props.id}
          toggle={toggle}
          setToggle={setToggle}
        />
        <AddTaxFundsModal
          id={props.id && props.id}
          toggle={toggle}
          setToggle={setToggle}
        />
      </Card.Header>

      <div className="ag-theme-alpine" style={{ height: "100%" }}>
        <AgGridReact
          gridOptions={gridOptions}
          frameworkComponents={frameworkComponents}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleUpdate}
          rowData={rowData}
          rowClassRules={billColor}
          getRowNodeId={function (data) {
              return data.id;
            }}
        >
          <AgGridColumn
            field="date_received"
            headerName="Date"
            flex={1}
            cellEditor="dateEditor"
            valueFormatter={dateFormatter}
          />
          <AgGridColumn
            field="due_date"
            headerName="Due Date"
            flex={1}
            cellEditor="dateEditor"
            valueFormatter={dateFormatter}
          />
          <AgGridColumn field="entity_name" headerName="Entity Name" flex={1.5} />
          <AgGridColumn
            field="bill_type"
            headerName="Type"
            flex={1.5}
            cellEditor="autoCompleteEditor"
            cellEditorParams={{ options: TAX }}
          />
          <AgGridColumn
            field="debit"
            headerName="Debit"
            flex={1}
            valueFormatter={currencyFormatter}
            valueGetter={(params) => { return parseInt(params.data.debit)}}
          />
          <AgGridColumn
            field="credit"
            headerName="Credit"
            flex={1}
            valueFormatter={currencyFormatter}
            valueGetter={(params) => { return parseInt(params.data.credit)}}
          />
          <AgGridColumn
            editable={false}
            headerName="Balance"
            field="running_total"
            flex={1}
            valueGetter={(params) => getRunningTotal(params)}
            valueFormatter={currencyFormatter}
          />
          <AgGridColumn
              headerName="Paid"
              suppressMenu={true}
              field="paid_bill"
              flex={.7}
              cellRenderer={checkBoxRenderer}
            />
          <AgGridColumn
            editable={false}
            field="id"
            headerName=""
            suppressMenu={true}
            cellRenderer={"btnCellRenderer"}
            cellRendererParams={cellRendererParams}
            filter={false}
            flex={0.4}
          />
        </AgGridReact>
      </div>
    </React.Fragment>
  );
}

export default TaxTabView;
