import React, { useState, useEffect, useRef,useCallback } from 'react';
import {Button, Card, Form,} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import {AiOutlineDrag} from 'react-icons/ai'

// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../components/AgGrid/currencyFormatter";
import gridOptions from "../../components/AgGrid/gridOptions";

import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
// Import Endpoints
import {billColor} from "../../components/AgGrid/color";
import {useHistory} from 'react-router-dom'


import {Trusts} from '../../services'

import { getParsedListForTrust } from '../../utils/parsedList';
import httpService from '../../services/httpService';
import { connect ,useDispatch} from 'react-redux';
import { updateTrustList } from '../../store/action_calls';
import ImportDragAndDrop from './ImportDragAndDrop';
import { useLocalStorage } from '../../utils/useLocalStorage';
import {uniqBy } from 'lodash'
const App = props => {
    const history= useHistory()
    const [rowData, setRowData] = useState([]);
    const [trustSate, setTrustState] = useState([]);

    const gridRef = useRef(null);
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    const [toggle, setToggle] = useState(0);
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [dropdownState,setDropdownState]=useState({})


    const [overlay, setOverlay] = useState(false);
    const [drop, setOndrop] = useState(false);

    const dispatch=useDispatch()
    const endTrustIndex=useRef(0)

    useEffect(() => {
        if(!gridRef) return
          const allTrustList=getParsedListForTrust(Object.values(props.trustList))
          if(allTrustList.length===0) return
           if(rowData?.length===0) {
               setRowData(allTrustList)
               endTrustIndex.current=allTrustList.length
        }
           else if(endTrustIndex.current!==allTrustList.length) {
               gridRef.current?.api?.addItems(allTrustList.slice(endTrustIndex.current,allTrustList.length))
               endTrustIndex.current=allTrustList.length
           }
        },[toggle,props.trustList,gridRef]);
    //this toggle above is how it knows to actually reload when toggle is called
    const updateRowData = useCallback((id,data) => {
        var rowNode = gridRef.current.api.getRowNode(id);
        rowNode.setData(data);
      }, []);

      const getRowId = useCallback(function (params) {
        return params.data.id;
      }, []);

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
       data&&updateRowData(data.id,data)
       data&&dispatch(updateTrustList(data))
       setDropdownState({})

    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        sortable: true,
        editable: true,
        enableRowGroup: true,
        resizable: true,
        flex: 1,
        aggFunc: "last",
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        // menuTabs:'filterMenuTab',
        filter: 'agMultiColumnFilter',
    }

    const cellRendererParams = {
        clicked: function (id) {
            history.push(`${id}`, { from: '/trust/list' });
        },
    }

    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };
    //quickfilter!
    const [quickfilter,setQuickfilter]=useLocalStorage('trust_list_filter_text','')
    useEffect(()=>{
        if(gridApi){
            gridApi.setQuickFilter(quickfilter.trim());
        }
    },[quickfilter,gridApi])
    function onFilterTextBoxChanged() {
        const textSearch=document.getElementById('filter-text-box').value
        setQuickfilter(textSearch)
    }
    const valueGetterAddress = params => {
        if(params.context.addressList[params.data?.full_address]) return  params.context.addressList[params.data.full_address].display_address
        return params.data?.full_address
    };
    const valueSetterAddress = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        params.data.full_address = params.newValue;
        return true;
    };

    const [setUpState,setSetUpState]=useState([])
    useEffect(()=>{
      (async()=>{
        const data=await Trusts.getSetups()
        data&&setSetUpState(data)
      }
      )()
    },[])

    const valueGetterSetUp = params => {
        const setUp=params.context.setUpState.filter(i=>i.id===params.data?.set_up_stage_id)[0]
        if(setUp) return  setUp.stage
        return params.data?.set_up_stage_id
    };
    const valueSetterSetUp = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        params.data.set_up_stage_id = params.newValue;
        return true;
    };
    const [repairState,setRepairState]=useState([])
    useEffect(()=>{
      (async()=>{
        const data=await Trusts.getRepairStages()
        console.log({repair:data})
        data&&setRepairState(data)
      }
      )()
    },[])

    const valueGetterRepair = params => {
        const repair=params.context.repairState.filter(i=>i.id===params.data?.further_repair_stage_id)[0]
        console.log({repairState:params.context.repairState})
        if(repair) return  repair.stage
        return params.data?.further_repair_stage_id
    };
    const valueSetterRepair = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        params.data.further_repair_stage_id = params.newValue;
        return true;
    };


    useEffect(()=>{
        var dragTimer;
      document.addEventListener('dragover', function(e) {
  var dt = e.dataTransfer;
  if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
//     $("#dropzone").show();
//    console.log('dragged')
//    document.querySelector('.CSVImporter_FileSelector').style.display='unset !important'
setOverlay(true)
    window.clearTimeout(dragTimer);
  }
});
document.addEventListener('drop', function(e) {
    setOndrop(true)
    var dt = e.dataTransfer;
    if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
        // console.log(e.dataTransfer.files[0])
        if(!document.querySelector('.CSVImporter_Importer input[type="file"]')) return
        // document.querySelector('.CSVImporter_Importer input[type="file"]').files = e.dataTransfer.files
        console.log('drop')
    //    setOverlay(false)
      window.clearTimeout(dragTimer);
    }
  });
document.addEventListener('dragleave', function(e) {
  dragTimer = window.setTimeout(function() {
    // $("#dropzone").hide();
    setOverlay(false)
  }, 25);
});
    },[])

    const handleClickListner=()=>{
        console.log('click listener')
        setOverlay(false)
    }
useEffect(()=>{
    if(!document.querySelector('.CSVImporter_IconButton>span[data-type=arrowBack]')) return
    document.querySelector('.CSVImporter_IconButton>span[data-type=arrowBack]').addEventListener('click',handleClickListner)
    return ()=>{
        document.querySelector('.CSVImporter_IconButton>span[data-type=arrowBack]')?.removeEventListener('click',handleClickListner)
    }
},[document.querySelector('.CSVImporter_IconButton>span[data-type=arrowBack]')])

const [sortConfig,setSortConfi]=useLocalStorage('trust_list_order',[])
const [filterConfig,setFilterConfi]=useLocalStorage('trust_list_filter',[])

const   onSortChanged=(params)=> {
   let sortModel = params.api.getSortModel();
   setSortConfi(sortModel)
 }
 const  onFirstDataRendered=(params) =>{
   let sortModel = sortConfig;
   if (sortModel) {
     gridApi?.setSortModel(sortModel);
   }
   let filterModel=filterConfig
   if(filterModel){
       gridApi?.setFilterModel(filterModel)
   }
 }


 const onFilterChanged=(params)=>{
    let filterModel = params.api.getFilterModel();
    setFilterConfi(filterModel)
    
  }

  
    return (
        <Card  style={{ height: "100%" }}>
            {
                overlay&&<div
            style={{
                height:"100vh",
                width:'100vw',
                position:'fixed',
                top:0,
                left:0,
                backgroundColor:'gray',
                zIndex:1000,
                color:'white',
                overflow:'hidden',
            }}
            className="overlay-drag-and-drop"
            >
          <ImportDragAndDrop handleClickListner={handleClickListner} />
            <br />
            <p>Drop File Here</p>
            </div>}
            <Card.Body>
                <div className="ag-theme-alpine" style={{ height: "100%" }}>
                    {/*these Buttons do not do anything, it couple be a link to the create trust form */}
                <div style={{display:'flex',position:'relative'}}>
                    <Button className="shadow-1 theme-bg border border-0"
                            onClick={(e) => {
                                e.preventDefault();
                                history.push('/trust')
                            }}
                            style={{
                                height:'3rem'
                            }}
                            >
                        Create </Button>
                        <Button className="shadow-1 theme-bg border border-0"
                            onClick={(e) => {
                                if(!document.querySelector('.CSVImporter_Importer input[type="file"]')) return
                                document.querySelector('.CSVImporter_Importer input[type="file"]').click()
                            }}
                            style={{
                              height:'3rem'
                          }}
                            >
                        Import </Button>
                                            {/*this is the actual input for the search text*/}
                    <div className="form-block float-right" style={{position:'absolute',right:0}}>
                    <input type="text" className="form-control " id="filter-text-box"
                           placeholder="Filter..." onInput={onFilterTextBoxChanged}
                           value={quickfilter}
                           />
                        </div>
                        <br />
                        </div>
                        <ImportDragAndDrop />

                  { <AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        context={{
                            repairState,
                            setUpState,
                            addressList:Object.values(props.addressList)
                        }}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        stopEditingWhenCellsLoseFocus={false}
                        rowClassRules={billColor}

                        onFilterChanged={onFilterChanged}
                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}
                        onSortChanged={onSortChanged}
                        onFirstDataRendered={onFirstDataRendered}
                        // getRowNodeId={data => data.id}
                        getRowId={getRowId}
                        getRowNodeId={function (data) {
                            return data.id;
                        }}
                    >

                        <AgGridColumn headerName="">
                            <AgGridColumn field="id"  headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'}
                                          cellRendererParams={cellRendererParams} editable={false} sort={false}
                                          filter={false} flex={.2} minWidth={80} />
                            <AgGridColumn field="name" headerName="Trust"   tooltipField="name"    headerTooltip="Trust" checkboxSelection={true} />
                        </AgGridColumn>
                        <AgGridColumn headerName="Address"
                        >

                        <AgGridColumn 
                            headerTooltip="Address"
                            field="full_address" 
                            headerName="Address" 
                            valueGetter={valueGetterAddress} 
                            valueSetter={valueSetterAddress}
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={(params)=>({name:'display_address',options:params.context.addressList ,setDropdownState , field:'full_address'})}
                            editable={true} 
                            />
                            
                            <AgGridColumn field="street" tooltipField="street" headerName="Street"  flex={1} columnGroupShow="open"  editable={false}    />
                            <AgGridColumn field="city" tooltipField="city"  headerName="City"  flex={1} columnGroupShow="open"     editable={false} />
                            <AgGridColumn field="state" tooltipField="state"  headerName="State"  flex={1} columnGroupShow="open"  editable={false}  />
                            <AgGridColumn field="zipcode" tooltipField="zipcode"  headerName="Zip"  flex={1}  columnGroupShow="open"  editable={false} />
                        </AgGridColumn>
                        <AgGridColumn headerName="Ownership">
                            <AgGridColumn field="owner" tooltipField="owner" headerName="Investor"  headerTooltip="Investor"  columnGroupShow="closed"   editable={false} />
                            <AgGridColumn field="family" tooltipField="family" headerName="Family"  headerTooltip="Family" columnGroupShow="closed"  />
                            
                            <AgGridColumn field="trustee" headerName="Trustee" 
                            flex={.7} 
                            tooltipField="trustee" 
                            headerTooltip="Trustee"
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={{name:'trustee',options:[{id:'1',trustee:'Equity & Help'},{id:'2',trustee:'Not Under Management'}] ,setDropdownState , field:'trustee_type'}}
                            />
                        </AgGridColumn>

                        <AgGridColumn 
                            headerTooltip="Set Up"
                            field="set_up_stage_id" 
                            headerName="Set UP" 
                            valueGetter={valueGetterSetUp} 
                            valueSetter={valueSetterSetUp}
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={(params)=>({name:'stage',options:params.context.setUpState ,setDropdownState , field:'set_up_stage_id'})}
                            editable={true} 
                            />
                        {/*<AgGridColumn */}
                        {/*    headerTooltip="Repair"*/}
                        {/*    field="further_repair_stage_id" */}
                        {/*    headerName="Repair" */}
                        {/*    valueGetter={valueGetterRepair} */}
                        {/*    valueSetter={valueSetterRepair}*/}
                        {/*    columnGroupShow="closed" */}
                        {/*    cellEditor="autoCompleteEditor" */}
                        {/*    cellEditorParams={(params)=>({initial:params.value,name:'stage',options:params.context.repairState ,setDropdownState , field:'further_repair_stage_id'})}*/}
                        {/*    editable={true} */}
                        {/*    />*/}
                        <AgGridColumn headerName="Pricing">
                            <AgGridColumn field="arv" 
                            headerName="ARV" headerTooltip="ARV" columnGroupShow="open" 
                            valueFormatter={currencyFormatter}
                            aggFunc="sum"
                             flex={.8} tooltipField="arv"/>
                            <AgGridColumn field="eh_list_price"  headerName="EasyHomes List Price" 
                            headerTooltip="EasyHomes List Price" 
                            valueFormatter={currencyFormatter} aggFunc="sum" 
                            filter='agNumberColumnFilter'
                            flex={.8} tooltipField="eh_list_price"/>
                            <AgGridColumn field="pi_approved_price" tooltipField="pi_approved_price" headerName="PI Approved" headerTooltip="PI Approved" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.8}/>
                            <AgGridColumn field="warranty"  tooltipField="warranty" headerName="Warrenty"  headerTooltip="Warrenty" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.8}/>
                            <AgGridColumn field="investor_price" tooltipField="investor_price" headerName="Inv Price" headerTooltip="Inv Price"  columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={.8}/>
                        </AgGridColumn>
                        <AgGridColumn headerName="Dates">
                            <AgGridColumn field="investor_purchase_date" tooltipField="investor_purchase_date"  headerName="Inv Purchase Date" headerTooltip="Inv Purchase Date" cellEditor="dateEditor" valueFormatter={dateFormatter} aggFunc="avg"  editable={false}/>
                            <AgGridColumn field="trust_create_date"  tooltipField="trust_create_date"  headerName="Create Date"   headerTooltip="Create Date"  columnGroupShow="open"  cellEditor="dateEditor"  valueFormatter={dateFormatter} aggFunc="avg" />
                            <AgGridColumn field="deed_record_date"  tooltipField="deed_record_date"  headerName="Deed Record"  headerTooltip="Deed Record"  columnGroupShow="open"  cellEditor="dateEditor" valueFormatter={dateFormatter} aggFunc="avg" />
                            <AgGridColumn field="purchase_date"  tooltipField="purchase_date"  headerName="Purchase"   headerTooltip="Purchase"  columnGroupShow="open"  cellEditor="dateEditor" valueFormatter={dateFormatter} aggFunc="avg" />
                        </AgGridColumn>
                        <AgGridColumn headerName="Land Contract">
                            <AgGridColumn field="on_market" tooltipField="on_market" headerName="On Market" headerTooltip="Occupied?" columnGroupShow="open" flex={.6} editable={false}  />
                            <AgGridColumn field="occupied_stage" tooltipField="occupied_stage" headerName="Occupied?" headerTooltip="Occupied?" columnGroupShow="closed" flex={.6} editable={false}  />
                            <AgGridColumn field="last_days_on_market" tooltipField="last_days_on_market" headerName="DOM"  columnGroupShow="closed" flex={.5} headerTooltip="Days On Market" editable={false}/>
                            <AgGridColumn field="land_contract_name_id"  tooltipField="land_contract_name_id" headerName="LC Number" headerTooltip="LC Number" columnGroupShow="open" flex={1} editable={false}/>
                            <AgGridColumn field="loan_amount" tooltipField="loan_amount" headerName="Loan Amount"  headerTooltip="Loan Amount" columnGroupShow="open" valueFormatter={currencyFormatter} aggFunc="sum" flex={1} editable={false}/>
                        </AgGridColumn>
                    </AgGridReact>}
                </div>
            </Card.Body>
        </Card>
    );
};




const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList,
    addressList:state.addressReducer.addressList,
})

export default connect(mapStateToProps, null)(App)