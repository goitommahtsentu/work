import React, { useState, useEffect, useRef, } from 'react';
import {Button, Card,} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

// Import AG Grid
// import BtnCellRenderer from "../../components/AgGrid/OpenCellRenderer";
// import DateEditor from "../../components/AgGrid/DateEditor";
// import dateFormatter from "../../components/AgGrid/dateFormatter";
// import currencyFormatter from "../../components/AgGrid/currencyFormatter";
import 'ag-grid-enterprise';
import gridOptions from "../../components/AgGrid/gridOptions";

// Redux
// import { store } from '../../store';
import {StateList,CountryList} from '../../components/AgGrid/Options'
import {Addresses} from '../../services'
import {getParsedList} from '../../utils/parsedList'
import httpService from '../../services/httpService';

import { connect ,useDispatch} from 'react-redux';
import { updateAddressList } from '../../store/action_calls';
import { getParsedListForTrust } from '../../utils/parsedList';

const Address = props => {

    const [rowData, setRowData] = useState([]);
    const [trustSate, setTrustState] = useState([]);
    const gridRef = useRef(null);
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [dropdownState,setDropdownState]=useState({})

    const dispatch=useDispatch()
    
    useEffect(() => {
        Object.keys(props.addressList).length!==0&&setRowData(getParsedListForTrust(Object.values(props.addressList)))
    },[props.addressList]);

    // Enpoint Calls for making edited dat push to the backend and update the data
    const handleUpdate = async(body) => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        let obj = {};
        obj[body.colDef.field] = body.newValue
        if(Object.keys(dropdownState).length!==0)
        {
            console.log(dropdownState,'drd')
            obj=dropdownState
        }
       const data= await Addresses.updateAddress(id,obj)
       data&&dispatch(updateAddressList(data))
       setDropdownState({})


    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: 'agMultiColumnFilter',
        sortable: true,
        enableRowGroup: true,
        editable: true,
        resizable: true,
        flex: 1,
        aggFunc: "last"
    }

    const cellRendererParams = {
        clicked: function (id) {
            window.location = (`${id}`);
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

    return (
        <Card  style={{ height: 910 }}>
            <Card.Body>
                <div className="ag-theme-alpine" style={{ height: 600 }}>
                    {/*these Buttons do not do anything, it couple be a link to the create trust form */}
<div>
                    <Button className="shadow-1 theme-bg border border-0"
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
    </div>
                    <AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        stopEditingWhenCellsLoseFocus={false}
                        enableFillHandle={true}

                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}

                    >

                            <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                        <AgGridColumn field="street_1" headerName="Street" />
                        <AgGridColumn field="street_2" headerName="street 2"  />
                        <AgGridColumn field="city" headerName="City" />
                        <AgGridColumn 
                            headerTooltip="State"
                            field="state" 
                            headerName="State" 
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={{name:'state_name',options:StateList ,setDropdownState , field:'state'}}
                            editable={true}
                            />
                        <AgGridColumn field="county" headerName="County" />
                        <AgGridColumn field="zipcode" headerName="Zipcode"  />
                        <AgGridColumn field="country" headerName="Country"  
                        headerTooltip="Country"
                        field="country" 
                        headerName="Country" 
                        columnGroupShow="closed" 
                        cellEditor="autoCompleteEditor" 
                        cellEditorParams={{name:'id',options:CountryList ,setDropdownState , field:'country'}}
                        editable={true}
                        />

                    </AgGridReact>
                </div>
            </Card.Body>
        </Card>
    );
};





const mapStateToProps = state => ({
    addressList: state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(Address)