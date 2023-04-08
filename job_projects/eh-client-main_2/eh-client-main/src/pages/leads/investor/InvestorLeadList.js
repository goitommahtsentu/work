import React, { useState, useEffect, useRef, } from 'react';
import {Button, Card, Form,} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

// Import AG Grid
import 'ag-grid-enterprise';
import gridOptions from "../../../components/AgGrid/gridOptions";


import {billColor} from "../../../components/AgGrid/color";

import { useHistory } from 'react-router-dom';

import {Contacts,Investors} from '../../../services'

import CreateContact from '../../contact/CreateContact'
import { updateContactList, updateInvestorLeadList } from '../../../store/action_calls';
import {connect,useDispatch} from 'react-redux'
import {cloneDeep} from 'lodash'
import ImportDragAndDrop from '../../contact/vendor/ImportDragAndDrop'
import { getInvestorLeads } from '../../../store/action_calls';
import {useLocalStorage} from '../../../utils/useLocalStorage'

const App = props => {
    const history=useHistory()
    const [rowData, setRowData] = useState([]);
    const [contactSate, setContactState] = useState([]);
    const gridRef = useRef(null);
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const [reloadInvestorLead,setReloadInvestorLead]=useState(null)
   
    useEffect(()=>{
     if(reloadInvestorLead=='reload'){
         props.getInvestorLeads()
         setReloadInvestorLead(null)
     }
 
    },[reloadInvestorLead])

    // useEffect(() => {
    //     setRowData(cloneDeep(Object.values(props.investorLeadList)))
    //     },
    //     [props.investorLeadList]);

        const endTrustIndex=useRef(0)
        useEffect(() => {
            if(!gridRef) return
              const allInvestorLeadList=cloneDeep(Object.values(props.investorLeadList))
              if(allInvestorLeadList.length==0) return
               if(rowData?.length==0) {
                   setRowData(allInvestorLeadList)
                   endTrustIndex.current=allInvestorLeadList.length
            }
               else if(endTrustIndex.current!=allInvestorLeadList.length) {
                   gridRef.current?.api?.addItems(allInvestorLeadList.slice(endTrustIndex.current,allInvestorLeadList.length))
                   endTrustIndex.current=allInvestorLeadList.length
               }
            },[props.investorLeadList,gridRef]);
    //this toggle above is how it knows to actually reload when toggle is called

    const dispatch = useDispatch()
    // Enpoint Calls for making edited dat push to the backend and update the data
    const handleUpdate = async(body) => {
        console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.contact_id
        const obj = {};
        if(body.colDef.field=="full_name"){
            const fullName=body.newValue
            obj['first_name']=fullName.split(' ')[0]
            if(fullName.split(' ').length>1) obj['last_name']=fullName.split(' ')[1]
        }
        else{
            obj[body.colDef.field] = body.newValue
        }
        console.log(obj, 'object for upload')
       let data= await Contacts.updateContact(id,obj)
       if(data){
           dispatch(updateContactList(data))
           dispatch(updateInvestorLeadList({...body.data,...obj}))

       }
       console.log('updated value',data)
    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: 'agMultiColumnFilter',
        sortable: true,
        editable: true,
        enableRowGroup: true,
        resizable: true,
        flex: 1,
        aggFunc: "last"
    }

    const cellRendererParams = {
        clicked: function (id) {
           history.push(`${id}`,{from:'/investor/list'});
        },
    }

    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };


        //quickfilter!
        const [quickfilter,setQuickfilter]=useLocalStorage('investorlead_list_filter_text','')
        useEffect(()=>{
            if(gridApi){
                gridApi.setQuickFilter(quickfilter.trim());
            }
        },[quickfilter,gridApi])
    
        function onFilterTextBoxChanged() {
            const textSearch=document.getElementById('filter-text-box').value
            setQuickfilter(textSearch)
        }
    
            const [sortConfig,setSortConfi]=useLocalStorage('investorlead_list_order',[])
            const [filterConfig,setFilterConfi]=useLocalStorage('investorlead_list_filter',[])
    
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

    const [overlay, setOverlay] = useState(false);

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
    // setOndrop(true)
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
                    {/*these Buttons do not do anything, it couple be a link to the create contact form */}

                    {/* <Button className="shadow-1 theme-bg border border-0"
                            onClick={(e) => {
                                e.preventDefault();
                                // history.push('/contact');
                            }}>
                        Create </Button> */}
                        <CreateContact  name='Investor Lead'/>

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
                    <div className="form-inline float-right" >
                    <input type="text" className="form-control " id="filter-text-box"
                           placeholder="Filter..." onInput={onFilterTextBoxChanged}
                           value={quickfilter}
                           />
                        </div>
                        <ImportDragAndDrop isInvestorLead={true}  reloadPage={()=>setReloadInvestorLead('reload')}/>
                    <AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        stopEditingWhenCellsLoseFocus={false}
                        rowClassRules={billColor}

                        onFilterChanged={onFilterChanged}
                        onSortChanged={onSortChanged}
                        onFirstDataRendered={onFirstDataRendered}
                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}
                    >
                        <AgGridColumn headerName="Investor">
                            <AgGridColumn field="id" headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                            <AgGridColumn field="full_name" headerName="Name" checkboxSelection={true} />
                            <AgGridColumn field="company" headerName="Company"  />
                        </AgGridColumn>
                        <AgGridColumn headerName="Investor Info">
                            <AgGridColumn field="primary_email" headerName="Primary Email" />
                            <AgGridColumn headerName="Primary Phone" field="primary_phone"  />
                        </AgGridColumn>
                        <AgGridColumn headerName="Address">
                            <AgGridColumn field="full_address" headerName="Address"  flex={1}   columnGroupShow="closed" />
                            <AgGridColumn field="street_1" headerName="Street"  flex={1} columnGroupShow="open"    />
                            <AgGridColumn field="city" headerName="City"  flex={1} columnGroupShow="open"    />
                            <AgGridColumn field="state" headerName="State"  flex={1} columnGroupShow="open"    />
                            <AgGridColumn field="zipcode" headerName="Zip"  flex={1}  columnGroupShow="open"   />
                        </AgGridColumn>
                    </AgGridReact>
                </div>
            </Card.Body>
        </Card>
    );
};




const mapStateToProps = state => ({
    investorLeadList: state.investorLeadReducer.investorLeadList
  })
  
  export default connect(mapStateToProps, {getInvestorLeads})(App)
