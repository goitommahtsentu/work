import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Table, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';


import dateFormatter from "../../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../../components/AgGrid/currencyFormatter";

import { GET_TRUST_OWNERSHIP, EDIT_TRUST } from '../../../../store/actions';
import { store } from '../../../../store';


import { useDispatch,connect } from 'react-redux';
import NumberFormat from 'react-number-format';

// Import AG Grid
import 'ag-grid-enterprise';
import {billColor} from "../../../../components/AgGrid/color";
import gridOptions from "../../../../components/AgGrid/gridOptions";

// Import Modals
import OwnershipModal from '../modals/OwnershipModal';


import DeleteButton from "../../../../components/AgGrid/DeleteButton";
import DateEditor from "../../../../components/AgGrid/DateEditor";
import AutoCompleteEditor from "../../../../components/AgGrid/AutoCompleteEditor";

import {Trusts} from '../../../../services'
import {getParsedListForTrust} from "../../../../utils/parsedList";

import {useHistory} from 'react-router-dom'
import httpService from '../../../../services/httpService';
import { updateTrustList } from '../../../../store/action_calls';

function TrustTabView(props) {

    const [rowData, setRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [trustState, setTrustState] = useState({});
    const history=useHistory()
    const [defaultSwitch, setDefaultSwitch] = useState(true);
  
    const toggleHandler = () => {
        setDefaultSwitch(false);

    };

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: true,
        sortable: false
    }



    const dispatch=useDispatch()

    const EditTrust = async(id, body) =>  {
        console.log('body data',id,body)
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


    useEffect(() => {
        const getList = async() => {
            if(Object.keys(props.trustList).length!=0){
                const data=Object.values(props.trustList)
                const filtered = data.filter((datum) => {
                    return datum.owner_id === 11;
                })
                setRowData(getParsedListForTrust(filtered))
            }
         }
        getList()
    }, [props.id,toggle,props.toggle,props.setToggle,props.trustList]);


    

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

    const cellRendererParams = {
        clicked: function (id) {
           history.push(`../trust/${id}`,{from:'/contact/list'});
        },
    }

    return (
        <React.Fragment>
            <React.Fragment>
                <Card.Header>
                    <Row>
                        <Card.Title as="h5">Related Trusts</Card.Title>
                        {/*<OverlayTrigger overlay={<Tooltip>Sell To Investor, Buy Back, Purchase, etc</Tooltip>} style={{ float: "right" }}>*/}
                        {/*    <OwnershipModal id={props.id && props.id && props.trust } trust={props._deriveCellTrustState} toggle={ toggle } setToggle={ setToggle }/>*/}
                        {/*</OverlayTrigger>*/}
                    </Row>
                </Card.Header>
                <div className="ag-theme-alpine" style={{ height: 400 }}>
                    <AgGridReact
                        defaultColDef={defaultColDef}
                        gridOptions={gridOptions}
                        // sizeColsToFix={true}
                        // autoSizeColumns={'allColIds'}
                        // quickFilter={'1'}
                        stopEditingWhenCellsLoseFocus={false}
                        rowData={rowData}
                        rowClassRules={billColor}
                        // Charts
                        enableCharts={true}

                        // selection
                        rowSelection="multiple"
                        enableRangeSelection={true}
                        enableRangeHandle={true}
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}
                       >
                        <AgGridColumn headerName="">
                            <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                            <AgGridColumn field="name" headerName="Trust"  />
                            <AgGridColumn field="full_address" headerName="Address"  flex={1}   columnGroupShow="closed" />
                        </AgGridColumn>
                        <AgGridColumn headerName="Pricing">
                            <AgGridColumn field="investor_price" headerName="Inv Price" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="warranty" headerName="Warranty" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="arv" headerName="ARV" columnGroupShow="open" valueFormatter={currencyFormatter} editable={true} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="pi_approved_price" headerName="Family Price" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                        </AgGridColumn>
                        <AgGridColumn headerName="Other">
                            <AgGridColumn field="setup_stage" headerName="Stage" editable={true} />
                            <AgGridColumn field="occupied_stage" headerName="Occupied?" columnGroupShow="open" />
                            <AgGridColumn field="purchase_date" headerName="Closing" columnGroupShow="open" valueFormatter={dateFormatter} aggFunc="avg" />
                        </AgGridColumn>
                    </AgGridReact>
                </div>
            </React.Fragment>
        </React.Fragment>

    );
}


const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList
})

export default connect(mapStateToProps, null)(TrustTabView)

