import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Button, Card, Form, OverlayTrigger, Tooltip, Row, Col, Table, } from 'react-bootstrap';

import NumberFormat from "react-number-format";

// Import AG Grid
import 'ag-grid-enterprise';
import "../../../components/AgGrid/Estimate.css";
import DateEditor from "../../../components/AgGrid/DateEditor";
import dateFormatter from "../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../components/AgGrid/currencyFormatter";
import AutoCompleteEditor from "../../../components/AgGrid/AutoCompleteEditor";
import { INSURANCE } from "../../../components/AgGrid/Options";
import {billColor} from "../../../components/AgGrid/color";

// Import Modals
import InsurancePaymentModal from '../modals/InsurancePaymentModal';
import DeleteButton from "../../../components/AgGrid/DeleteButton";



import { useDispatch } from 'react-redux';




import {Trusts,Bills} from '../../../services';

import { getParsedListForTrust } from '../../../utils/parsedList.js';
import httpService from '../../../services/httpService';
import { updateTrustList } from '../../../store/action_calls';

const InsuranceTabView = props => {
    const [rowData, setRowData] = useState([]);
    const [insuranceData, setInsuranceData] = useState([]);
    const [toggle, setToggle] = useState(0);

    // This is for the Edit switch
    const [FamSwitch, setFamSwitch] = useState(false);

    const toggleHandler = () => {
        setFamSwitch((prevState) => !prevState);
    };


    const [trustState, setTrustState] = useState({});

    const [defaultSwitch, setDefaultSwitch] = useState(true);

    const SwitchToggleHandler = () => {
        setDefaultSwitch(false);

    };

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: true,
        sortable: false,
        editable: true,
    }

    const tokenConfig = {
        headers: {
            'Content-Type': 'application/json'
        },
    }
    
      const getList = async() => {
       const data=await Bills.getBillsForTrust(props.id,'ins')
       setRowData(getParsedListForTrust(data))
      }

    useEffect(() => {
        const source=httpService.getSource()
        const getInsuranceData=async()=>{
            const data=await Trusts.getTrust(props.id,source)
            setInsuranceData(data)
        }
        getInsuranceData()
        getList()
        return () => source.cancel();
    }, [props.id,toggle]);

    // Enpoint Calls
    const handleUpdate = async(body) => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        const obj = {};
        obj[body.colDef.field] = body.newValue
        await Bills.updateBill(id,obj)
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

    const dispatch = useDispatch();

    const gridOptions = {

    rowStyle:{},
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


    const EditTrust = async(id, body) =>  {
        const data= await Trusts.updateTrust(id,body)
        if(data){
            dispatch(updateTrustList(data))
            setTrustState(data)
            setDefaultSwitch((prevState) => !prevState)
        }
    }

    useEffect(() => {
        setTrustState(props.trust)
    }, [props.trust])

    const handleEdit = (event) => {
        const { name, value } = event.target
        setTrustState({
            ...trustState,
            [name]: value
        })
    }

    const onEdit = () => {
        EditTrust(trustState.id, trustState)
    }

    const onDiscard = () => {
        setDefaultSwitch((prevState) => !prevState)
    }

    // console.log("The trust", trustState)

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

                    const prevTot = prevRunningTotal.innerHTML.replace(/[^0-9.-]+/g,"")



                    const total =
                        Number(prevTot) +
                        Number(params.data.credit) -
                        Number(params.data.debit);
                    console.log("Prevtot",prevTot.replace(/[^0-9.-]+/g,""))
                    result = total;
                }
            }
        });

        return result;
    };

    return (
        <React.Fragment>
            <Row>
                <Col sm={12} className="float-right" style={{ display: "flex" }}>
                    <Form.Label>Edit <br /> Mode</Form.Label>
                    <div className="switch d-inline m-r-10">
                        <Form.Control
                            type="checkbox"
                            id="ins-tab"
                            checked={!defaultSwitch}
                            onChange={() => SwitchToggleHandler()}
                        />
                        <Form.Label htmlFor="ins-tab" className="cr" />
                    </div>

                    {!defaultSwitch &&
                        <OverlayTrigger overlay={<Tooltip>Save Edited Trust</Tooltip>} style={{ float: "right" }}>
                            <Button className="shadow-1 theme-bg border border-0" onClick={onEdit}>
                                Save
                            </Button>
                        </OverlayTrigger>
                    }
                    {!defaultSwitch &&
                        <OverlayTrigger overlay={<Tooltip>Discard Changes</Tooltip>} style={{ float: "right" }}>
                            <Button className="shadow-1 theme-bg border border-0" onClick={onDiscard}>
                                Discard
                            </Button>
                        </OverlayTrigger>
                    }
                </Col>
                <Col md={6}>
                    <Table hover className="table-columned" >
                        <tbody>
                            <tr>
                                {/*This is an editable field that only accepts currency. should have USD masking on it*/}
                                <th scope="row" width='30%'>Daily Insurance Rate</th>
                                <td >
                                    {
                                        defaultSwitch ? 
                                            <NumberFormat
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                decimalScale={2}
                                                value={`${trustState && trustState.daily_insurance_rate}`}/>

                                        :
                                            <Form.Control className={"text-muted ml-1"}
                                                name="daily_insurance_rate"
                                                type="number"
                                                step="any"
                                                value={`${trustState && trustState.daily_insurance_rate}`}
                                                onChange={handleEdit}
                                                />
                                    }
                                </td>
                                <th scope="row" width='5%'>Per</th>
                                {/*this is a selection field options: (Day, Sqft Per Day) Day Is Default*/}
                                <td> {
                                        defaultSwitch ?
                                        trustState && trustState.rate_type
                                        :
                                            <Form.Control
                                                    name="insurance_rate_choice"
                                                    defaultvalue={trustState && trustState.insurance_rate_choice}
                                                    onChange={handleEdit}
                                                    as="select">
                                                <option value=""></option>
                                                    {   props.trustOptions.insurance_rate_choice &&
                                                        props.trustOptions.insurance_rate_choice.choices.map(data => (
                                                            <option value={data.value} key={data.value}>{data.display_name}</option>
                                                        ))
                                                    }

                                                </Form.Control>

                                    }
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>Insurance Company</th>
                                <td>
                                    {
                                        defaultSwitch ? 
                                        trustState && trustState.insurance_company

                                        :
                                            <Form.Control className={"text-muted ml-1"}
                                                name="insurance_company"
                                                value={trustState && trustState.insurance_company}
                                                onChange={handleEdit}
                                                />
                                                
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col md={6}>
                    <Table hover className="table-columned" >
                        <tbody>
                            <tr>
                                <th scope="row" width='30%'>Estimated Monthly Ins</th>
                                <td>
                                    <NumberFormat
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                    decimalScale={2}
                                    value={`${trustState && trustState.current_monthly_insurance}`}
                                    fixedDecimalScale={true}/>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>Policy Number</th>
                                <td>
                                
                                    {
                                        defaultSwitch ? 
                                        trustState && trustState.policy_number

                                        :
                                            <Form.Control className={"text-muted ml-1"}
                                                name="policy_number"
                                                type="number"
                                                step="any"
                                                value={`${trustState && trustState.policy_number}`}
                                                onChange={handleEdit}
                                                />
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <hr />
            <Card.Header>
                <Card.Title as="h5">Insurance</Card.Title>
                <InsurancePaymentModal id={props.id && props.id} toggle={ toggle } setToggle={ setToggle }/>
                <div className="switch d-inline m-r-10 float-right">
                    <Form.Control
                        type="checkbox"
                        id="insswitch"
                        famswitch={FamSwitch}
                        onChange={() => toggleHandler}
                    />
                    <Form.Label htmlFor="insswitch" className="cr" />
                    <Form.Label>Show Full Accounting</Form.Label>
                </div>
            </Card.Header>
            <div className="ag-theme-alpine" style={{ height: '100%' }}>
                <AgGridReact
                    gridOptions={gridOptions}

                    frameworkComponents={frameworkComponents}
                    defaultColDef={defaultColDef}

                    // Editing
                    onCellValueChanged={handleUpdate}
                    rowClassRules={billColor}

                    rowData={rowData}>
                    <AgGridColumn field="date_received" headerName="Date" flex={1} cellEditor="dateEditor" valueFormatter={dateFormatter} />
                    <AgGridColumn field="entity_name" headerName="Entity Name" flex={1} />
                    <AgGridColumn field="bill_type" headerName="Type" flex={1} cellEditor="autoCompleteEditor" cellEditorParams={{options: INSURANCE}}/>
                    <AgGridColumn field="debit" headerName="Debit" flex={1} valueFormatter={currencyFormatter} />
                    <AgGridColumn field="credit" headerName="Credit" flex={1} valueFormatter={currencyFormatter} />
                    <AgGridColumn headerName="Running total" field="running_total" flex={1} valueGetter={(params) => getRunningTotal(params)} valueFormatter={currencyFormatter}/>
                    <AgGridColumn field="estimate" hide={true} />
                    <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'btnCellRenderer'} cellRendererParams={cellRendererParams} filter={false} flex={.5} />
                </AgGridReact>
            </div>
        </React.Fragment>
    );
}


export default InsuranceTabView
