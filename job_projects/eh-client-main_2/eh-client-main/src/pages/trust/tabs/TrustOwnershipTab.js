import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Table, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';


import dateFormatter from "../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../components/AgGrid/currencyFormatter";
import {fieldTypeOwnership} from "../../../config/trust/fieldTypeOwnership"

import { GET_TRUST_OWNERSHIP, EDIT_TRUST } from '../../../store/actions';
import { store } from '../../../store/index';

// Import AG Grid
import 'ag-grid-enterprise';


import { useDispatch } from 'react-redux';
import NumberFormat from 'react-number-format';

// Import Modals
import OwnershipModal from '../modals/OwnershipModal';

// Import API Server

import PropTypes from 'prop-types';

import DeleteButton from "../../../components/AgGrid/DeleteButton";
import DateEditor from "../../../components/AgGrid/DateEditor";
import AutoCompleteEditor from "../../../components/AgGrid/AutoCompleteEditor";

import {Trusts} from '../../../services';
import {getParsedListForTrust} from '../../../utils/parsedList'
import { updateTrustList } from '../../../store/action_calls';

function OwnershipTabView(props) {

    const [rowData, setRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [trustState, setTrustState] = useState({});
    const [defaultSwitch, setDefaultSwitch] = useState(true);

    const toggleHandler = () => {
        setDefaultSwitch(false);
    };

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: true,
        sortable: false,


    }


    const dispatch = useDispatch();

    const getList = async() => {
        const data=await Trusts.getOwnerShip(props.id)
        setRowData(getParsedListForTrust(data))
    }

    const EditTrust = async(id, body) =>  {
        const data=await Trusts.updateTrust(id,body)
        if(data){
            dispatch(updateTrustList(data))
            setTrustState(data)
            setDefaultSwitch((prevState) => !prevState)
        }
    }


        const frameworkComponents = {
        btnCellRenderer: DeleteButton,
        dateEditor: DateEditor,
        autoCompleteEditor: AutoCompleteEditor,
    }

    const handleDelete = async(id) => {
        await Trusts.deleteOwnerShip(id)
        setToggle(!toggle);
    }

    const cellRendererParams = {
        clicked: function (id) {
            handleDelete(id);
            // window.location = (`${id}`);
        },
    }


    useEffect(() => {

        getList()
    }, [props.id,toggle,props.toggle,props.setToggle]);


    

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

        const handleValueChange = (event, name) => {
        const value = event.value
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

    console.log("The trust", trustState)

    return (
        <React.Fragment>
            <Row>
                <Col sm={12} className="float-right" style={{ display: "flex" }}>
                    <Form.Label>Edit <br /> Mode</Form.Label>
                    <div className="switch d-inline m-r-10">
                        <Form.Control
                            type="checkbox"
                            id="checked-tab"
                            checked={!defaultSwitch}
                            onChange={() => toggleHandler()}
                        />
                        <Form.Label htmlFor="checked-tab" className="cr" />
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

                            {/* realtor auction company etc this should link to contacts */}
                            <tr>
                                <th scope="row" width='30%'>Property Source</th>
                                <td> 
                                {
                                        defaultSwitch ? 
                                        trustState && trustState.property_source

                                        :
                                            <Form.Control className={"text-muted ml-1"}
                                                name="property_source"
                                                value={`${trustState && trustState.property_source}`}
                                                onChange={handleEdit}
                                                />
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>E&H Purchase Price</th>
                                <td>
                                    {
                                        defaultSwitch ? 
                                            <NumberFormat
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                decimalScale={2}
                                                value={`${trustState && trustState.eh_purchase_price}`}/>

                                        :
                                            <NumberFormat
                                                value={`${trustState && trustState.eh_purchase_price}`}
                                                readOnly={false}
                                                className="form-control"
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                // Name needs to be the field that is being updated
                                                onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='eh_purchase_price')}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                isNumericString={true}
                                            />
                                    }

                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>ARV</th>
                                <td>
                                    {
                                        defaultSwitch ?
                                            <NumberFormat
                                                displayType={'text'}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                decimalScale={2}  value={`${trustState && trustState.arv}`}/>

                                            :

                                            <NumberFormat
                                                value={`${trustState && trustState.arv}`}
                                                readOnly={false}
                                                className="form-control"
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                // Name needs to be the field that is being updated
                                                onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='arv')}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                isNumericString={true}
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
                                <th scope="row" width='30%'>Investor Price</th>
                                <td>
                                        <NumberFormat
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                            decimalScale={2}
                                            value={`${trustState && trustState.investor_price}`}/>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>Warranty</th>
                                <td>
                                        <NumberFormat
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                            decimalScale={2}
                                            value={`${trustState && trustState.warranty}`}/>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>EasyHomes List Price</th>
                                <td>
                                    <NumberFormat
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        value={`${trustState && trustState.eh_list_price}`}/>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" width='30%'>PI Approved Price</th>
                                <td>
                                    <NumberFormat
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        decimalScale={2}
                                        value={`${trustState && trustState.pi_approved_price}`}/>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <hr />
            <React.Fragment>
                <Card.Header>
                        <Card.Title as="h5">Ownership History</Card.Title>
                            <OwnershipModal setOwnerChange={props.setOwnerChange} id={props.id} trust={props.trust} toggle={ toggle } setToggle={ setToggle }/>

                </Card.Header>
                <div className="ag-theme-alpine" style={{ height: 400 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        frameworkComponents={frameworkComponents}
                        // sizeColsToFix={true}
                        // autoSizeColumns={'allColIds'}
                        // quickFilter={'1'}


                        // Charts
                        enableCharts={true}

                        // selection
                        rowSelection="multiple"
                        enableRangeSelection={true}
                        enableRangeHandle={true}


                        rowData={rowData}>
                        <AgGridColumn field="ownership_date" headerName="Date" flex={1} valueFormatter={dateFormatter} />
                        <AgGridColumn field="owner_name" headerName="Owner" flex={2} />
                        <AgGridColumn field="ownership" headerName="Type" flex={1.3} />
                        <AgGridColumn field="purchased_from" headerName="Purchased From" flex={1} />
                        <AgGridColumn field="sale_price" headerName="Sale Price" flex={1} valueFormatter={currencyFormatter} chartDataType='series' valueGetter={(params) => { return parseInt(params.data.sale_price)}} />
                        <AgGridColumn field="currency" headerName="Currency" flex={1} />
                        <AgGridColumn field="description" headerName="Description" flex={1} />
                        <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'btnCellRenderer'} cellRendererParams={cellRendererParams} filter={false} flex={.4} />
                    </AgGridReact>
                </div>
            </React.Fragment>
        </React.Fragment>

    );
}

OwnershipTabView.propTypes = {
    trust: PropTypes.object.isRequired,
}


export default OwnershipTabView

