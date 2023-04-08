import React, { useState, useEffect, useRef, } from 'react';
import {Button, Card} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../components/AgGrid/currencyFormatter";
import gridOptions from "../../components/AgGrid/gridOptions";
import { rtpColor } from "../../components/AgGrid/color";

import checkBoxRenderer from "../../components/AgGrid/checkBoxRenderer";

import {Trusts,Investors} from '../../services';
import { getParsedListForTrust ,getInvestorsName} from '../../utils/parsedList';
import { connect,useDispatch } from 'react-redux';
import { updateTrustList } from '../../store/action_calls';

const TrustRTP = props => {

    const [rowData, setRowData] = useState([]);
    const [trustSate, setTrustState] = useState([]);
    const [investorsName, setInvestorsName] = useState([]);
    const [isInvestorsNameReady, setIsInvestorsNameReady] = useState(false);
    const gridRef = useRef(null);
    const [dropdownState,setDropdownState]=useState({})
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const [setupStage,setSetupStage]=useState([])
   

    const dispatch=useDispatch()

useEffect(()=>{
  const getInvestors=async()=>{
      const data=await Investors.getInvestors()
      setInvestorsName(getInvestorsName(data))
      setIsInvestorsNameReady(prev=>!prev)
  }
  getInvestors()
},[])
    //this is a magical filtered get, it is filtering the whole json file by one of the calculated fields.
    
    useEffect(() => {
        const getData=async()=>{
            const data=await Trusts.getRtpTrusts()
            setRowData(getParsedListForTrust(data))
        }
        getData()
     },[]);



    // Enpoint Calls for making edited dat push to the backend and update the data
    const handleUpdate = async(body) => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        let obj = {};
        obj[body.colDef.field] = body.newValue
        console.log(Object.keys(dropdownState).length,'drd')
        if(Object.keys(dropdownState).length!==0)
        {
            console.log(dropdownState,'drd')
            obj=dropdownState
        }
        const data=await Trusts.updateTrust(id,obj)
        data&&dispatch(updateTrustList(data))
        setDropdownState({})
    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: 'agMultiColumnFilter',
        sortable: true,
        enableRowGroup: true,
        resizable: true,
        flex: 1,
        aggFunc: "last"
    }

    const cellRendererParams = {
        clicked: function (id) {
            window.location = (`trust/${id}`);
        },
    }

    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };
    //quickfilter!
    function onFilterTextBoxChanged() {
        gridApi.setQuickFilter(document.getElementById('filter-text-box').value);
    }


    const valueGetterInvestor = params => {
        if(props.investorList[params.data.assigned_investor_id]) return  props.investorList[params.data.assigned_investor_id].full_name
        return params.data.assigned_investor_id
    };
    const valueSetterInvestor = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        params.data.assigned_investor_id = params.newValue;
        return true;
    };

    const valueGetterAddress = params => {
        if(props.addressList[params.data.full_address]) return  props.addressList[params.data.full_address].display_address
        return params.data.full_address
    };
    const valueSetterAddress = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        params.data.full_address = params.newValue;
        return true;
    };

    useEffect(()=>{
        const getStages=async()=>{
            const data=await Trusts.getSetups()
            setSetupStage(data)
        }
        getStages()
    },[])


    return (
        <Card  style={{ height: 910 }}>
            <Card.Body>
                <div className="ag-theme-alpine" style={{ height: 600 }}>
                    {/*these Buttons do not do anything, it couple be a link to the create trust form */}

                    <Button className="shadow-1 theme-bg border border-0 "
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href='/trust';
                            }}>
                        Create </Button>
                    {/*this is the actual input for the search text*/}
                    <div className="form-inline float-right" >
                    <input type="text" className="form-control " id="filter-text-box"
                           placeholder="Filter..." onInput={onFilterTextBoxChanged}/>
                        </div>
                   {setupStage.length!=0&&<AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        stopEditingWhenCellsLoseFocus={false}

                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}

                        getRowNodeId={function (data) {
                            return data.id;
                        }}
                        rowClassRules={rtpColor}
                    >

                        <AgGridColumn headerName="">
                            <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                            <AgGridColumn field="name" headerName="Trust"  />
                            <AgGridColumn 
                             valueGetter={valueGetterInvestor} 
                             valueSetter={valueSetterInvestor}
                             field="assigned_investor_id" headerName="Assigned Investor" columnGroupShow="closed" 
                             cellEditor="autoCompleteEditor" 
                             cellEditorParams={{name:'full_name',options:Object.values(props.investorList) ,setDropdownState , field:'assigned_investor_id'}}
                             editable={true} />
                        </AgGridColumn>
                        <AgGridColumn headerName="Address">
                            <AgGridColumn 
                            field="full_address" 
                            headerName="Address" 
                            valueGetter={valueGetterAddress} 
                            valueSetter={valueSetterAddress}
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={{name:'display_address',options:Object.values(props.addressList) ,setDropdownState , field:'full_address'}}
                            editable={true} 
                            />
                            <AgGridColumn field="street" headerName="Street"  flex={1} columnGroupShow="open"  flex={1.2}  />
                            <AgGridColumn field="city" headerName="City"  flex={1} columnGroupShow="open" flex={.9}   />
                            <AgGridColumn field="state" headerName="State"  flex={1} columnGroupShow="open" flex={.6}   />
                            <AgGridColumn field="zipcode" headerName="Zip"  flex={1}  columnGroupShow="open" flex={.6}  />
                        </AgGridColumn>
                        <AgGridColumn headerName="Pricing">
                            <AgGridColumn field="investor_price" headerName="Inv Price" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="warranty" headerName="Warranty" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="arv" headerName="ARV" columnGroupShow="open" valueFormatter={currencyFormatter} editable={true} aggFunc="sum" flex={.7}/>
                            <AgGridColumn field="pi_approved_price" headerName="Family Price" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.7}/>
                        </AgGridColumn>
                        <AgGridColumn headerName="Other">
                            <AgGridColumn 
                                field="setup_stage" 
                                headerName="Stage" 
                                cellEditor="autoCompleteEditor" 
                                cellEditorParams={{name:'stage',options:setupStage ,setDropdownState , field:'set_up_stage_id'}}
                                editable={true}
                                 />
                            <AgGridColumn field="easy_homes_notes" headerName="Notes" editable={true} />
                            <AgGridColumn field="occupied_stage" headerName="Occupied?" columnGroupShow="open" />
                            <AgGridColumn field="qual_home" headerName="Qual" columnGroupShow="open" suppressMenu={true} cellRenderer={checkBoxRenderer} flex={.5}/>
                            <AgGridColumn field="sold_to_investor" headerName="Sold" columnGroupShow="open"  suppressMenu={true} cellRenderer={checkBoxRenderer} flex={.5}/>
                            <AgGridColumn field="purchase_date" headerName="Closing" columnGroupShow="open" valueFormatter={dateFormatter} aggFunc="avg" />
                        </AgGridColumn>
                    </AgGridReact>
}
                </div>
            </Card.Body>
        </Card>
    );
};


const mapStateToProps = state => ({
    addressList:state.addressReducer.addressList,
    investorList: state.investorReducer.investorList
})

export default connect(mapStateToProps, null)(TrustRTP)