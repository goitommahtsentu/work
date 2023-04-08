import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Card, Table, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import axios from 'axios';


import dateFormatter from "../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../components/AgGrid/currencyFormatter";

import { GET_TRUST_OWNERSHIP, EDIT_TRUST } from '../../../store/actions';
import { store } from '../../../store';


import { useDispatch,connect } from 'react-redux';
import NumberFormat from 'react-number-format';

// Import AG Grid
import 'ag-grid-enterprise';
import {billColor} from "../../../components/AgGrid/color";
import gridOptions from "../../../components/AgGrid/gridOptions";


// Import API Server

import {getTrust} from '../../../store/action_calls';
import { API_SERVER } from '../../../config/constant';


import DeleteButton from "../../../components/AgGrid/DeleteButton";
import DateEditor from "../../../components/AgGrid/DateEditor";
import AutoCompleteEditor from "../../../components/AgGrid/AutoCompleteEditor";

import {Trusts} from '../../../services'
import {getParsedListForTrust} from "../../../utils/parsedList";

import {useHistory} from 'react-router-dom'
import httpService from '../../../services/httpService';
function TrustTabView(props) {

    const [rowData, setRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [trustState, setTrustState] = useState([]);
    const [performingState, setPerformingState] = useState([]);
    const [vacantState, setVacantState] = useState([]);
    const [prevTrust,setPrevTrusts]=useState([])
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
    const dispatch = useDispatch();

    const tokenConfig = () => {
        const token = store.getState().account.token


        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        return config
    }



    const EditTrust = (id, body) =>  {
    
        axios.put(`${API_SERVER}api/trust/trust/${id}/`, JSON.stringify(body), tokenConfig())
            .then(res => {
                setTrustState(res.data)
                setDefaultSwitch((prevState) => !prevState)
                console.log("After update", res.data)

                dispatch({
                    type: EDIT_TRUST,
                    payload: res.data
                });
                getTrust(id)
            }).catch(err => {
                console.log(err)
            }
            )
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
        console.log('props.id',props.id)
        if(!props.id) return
        const source=httpService.getSource()
        const getList = () => {
            if(Object.keys(props.trustList).length!=0){
                const data=Object.values(props.trustList)
            const prevTrusts=data.filter(trust=>trust.past_owners.includes(props.id))
            setPrevTrusts(getParsedListForTrust(prevTrusts))
            const filtered = data.filter((datum) => {
                return datum.owner_id === props.id;
            })
            console.log('filtered',filtered)
            if(filtered.length!=0){
                const tmpVacant=[]
                const tmpPerforming=[]
                filtered.map(trust=>{
                    if(trust.occupied_stage_id==1){
                        tmpPerforming.push(trust)
                    }
                    if(trust.occupied_stage_id==2){
                        tmpVacant.push(trust)
                    }
        
                })
               setVacantState(getParsedListForTrust(tmpVacant))
               setPerformingState(getParsedListForTrust(tmpPerforming))
            }
            setRowData(getParsedListForTrust(filtered))
        }
    }
        getList()
        return () => source.cancel();
    }, [props.id,toggle,props.toggle,props.setToggle,props.trustList]);


    
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
                        <Card.Title as="h5"> Performing</Card.Title>
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
                        rowData={performingState}
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

            <React.Fragment>
                <Card.Header>
                    <Row>
                        <Card.Title as="h5">Vacant</Card.Title>
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
                        rowData={vacantState}
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

            <React.Fragment>
                <Card.Header>
                    <Row>
                        <Card.Title as="h5">Previous Trusts</Card.Title>
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
                        rowData={prevTrust}
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