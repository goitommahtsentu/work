import React, { useState, useEffect, useRef, } from 'react';
import {Button, Card} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import {useHistory} from 'react-router-dom'
// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../components/AgGrid/currencyFormatter";
import gridOptions from "../../components/AgGrid/gridOptions";
import { rtpColor } from "../../components/AgGrid/color";

import checkBoxRenderer from "../../components/AgGrid/checkBoxRenderer";

import {Trusts,Investors,Situations,Todos} from '../../services';

import { getParsedListForTrust ,getInvestorsName} from '../../utils/parsedList';
import { connect,useDispatch,useSelector } from 'react-redux';
import { updateTrustList } from '../../store/action_calls';
import { fetchNextData } from '../../utils/recursiveCall';

const MyTasks = props => {
    const history= useHistory()
    const [rowData, setRowData] = useState([]);
    const [investorsName, setInvestorsName] = useState([]);
    const [isInvestorsNameReady, setIsInvestorsNameReady] = useState(false);
    const gridRef = useRef(null);
    const [dropdownState,setDropdownState]=useState({})
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const [setupStage,setSetupStage]=useState([])
   
    const [situationOptions,setSituationOptions]=useState([])

    useEffect(()=>{
    const getOptions=async()=>{
        const data=await Situations.getOptions()
        data&&setSituationOptions(data)
    }
    getOptions()
    },[])
    const dispatch=useDispatch()
const storeInvestors=(investor)=>{
    setInvestorsName(prev=>[...prev,...getInvestorsName(investor)])
}
useEffect(()=>{
  const getInvestors=async()=>{
      const data=await Investors.getInvestors()
      storeInvestors(data.results)
      await fetchNextData(data.next,storeInvestors)
      setIsInvestorsNameReady(prev=>!prev)
  }
  getInvestors()
},[])
    //this is a magical filtered get, it is filtering the whole json file by one of the calculated fields.
    const user = useSelector(state => state.account.user.user);
    useEffect(() => {
        // if(Object.keys(props.trustList).length!=0){
        //     const data=Object.values(props.trustList)
        //     const filtered = data.filter((datum) => {
        //         return datum.owner === null;
        //     })
        //     //
        //     setRowData(getParsedListForTrust(filtered))
        // }
       if(!user.id) return
        const getMytodos=async()=>{
            const data=await Todos.getTodos('assigned_employee',user.id,{})
            setRowData(data)
        }
        getMytodos()
     },[user.id]);



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
        const data=await Situations.updateSituation(id,obj)
        data&&setRowData(prev=>prev.map(row=>row.id==data.id?data:row))
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
            history.push(`/situations/${id}`);
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
    useEffect(()=>{
        const getStages=async()=>{
            const data=await Trusts.getSetups()
            setSetupStage(data)
        }
        getStages()
    },[])

    const valueGetterTrust = params => {
        if(props.trustList[params.data.trust_id]) return  props.trustList[params.data.trust_id].name
        return params.data.trust_id
    };

    const valueSetterTrust = params => {
        params.data.trust_id = params.newValue;
        return true;
    };

    const valueGetterEntity = params => {
        if(props.contactList[params.data.related_entity_id]) return  props.contactList[params.data.related_entity_id].full_name
        return params.data.related_entity_id
    };

    const valueSetterEntity = params => {
        params.data.related_entity_id = params.newValue;
        return true;
    };

    const valueGetterAddress = params => {
        if(props.addressList[params.data.address]) return  props.addressList[params.data.address].display_address
        return params.data.address
    };

    const valueSetterAddress = params => {
        params.data.address = params.newValue;
        return true;
    };

    const handleNewSits = async(id) => {
        // console.log("New Line Created For Trust Id", props.id)
        const obj = {};
        obj["trust_id"] = props.id
        const data=await Situations.createSits(obj)
       if(data) setRowData(prevState=>[data,...prevState])
    }
  

    const valueGetterSituationType = params => {
        const value=situationOptions.filter(options=>options.value==params.data.situation_type)
        if(value.length>0){
            return value[0].display_name
        }
        return params.data.situation_type
    };

    const valueSetterSituationType = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        console.log("hello")
        params.data.situation_type = params.newValue;
        return true;
    };


    return (
        <Card  style={{ height: 910 }}>
            <Card.Body>
                <div className="ag-theme-alpine" style={{ height: 600 }}>
                    {/*these Buttons do not do anything, it couple be a link to the create trust form */}

                    <Button className="shadow-1 theme-bg border border-0 "
                            onClick={() => {
                                gridApi.applyTransaction({ add:[{}]});
                                handleNewSits()
                            }}
                            
                            >
                        Add </Button>
                    {/*this is the actual input for the search text*/}
                    <div className="form-inline float-right" >
                    <input type="text" className="form-control " id="filter-text-box"
                           placeholder="Filter..." onInput={onFilterTextBoxChanged}/>
                        </div>
                   {Object.values(props.trustList).length!==0&&situationOptions.length>0&&<AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        // stopEditingWhenCellsLoseFocus={false}

                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}

                        getRowNodeId={function (data) {
                            return data.id;
                        }}
                        rowClassRules={rtpColor}
                    >
                     <AgGridColumn field="id"  headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                            <AgGridColumn 
                            //  valueGetter={valueGetterInvestor} 
                            //  valueSetter={valueSetterInvestor}
                             field="title" 
                             headerName="Title" 
                             columnGroupShow="closed" 
                            //  cellEditor="autoCompleteEditor" 
                            //  cellEditorParams={{name:'full_name',options:Object.values(props.investorList) ,setDropdownState , field:'assigned_investor_id'}}
                             editable={true} />
                            <AgGridColumn 
                            //  valueGetter={valueGetterInvestor} 
                            //  valueSetter={valueSetterInvestor}
                             field="create_date" 
                             headerName="Created Date" 
                             columnGroupShow="closed" 
                             valueFormatter={dateFormatter}
                            //  cellEditor="autoCompleteEditor" 
                            //  cellEditorParams={{name:'full_name',options:Object.values(props.investorList) ,setDropdownState , field:'assigned_investor_id'}}
                             editable={false} />
                        <AgGridColumn 
                            //  valueGetter={valueGetterInvestor} 
                            //  valueSetter={valueSetterInvestor}
                             field="updated_on" 
                             headerName="Updated Date" 
                             columnGroupShow="closed" 
                             valueFormatter={dateFormatter}
                            //  cellEditor="autoCompleteEditor" 
                            //  cellEditorParams={{name:'full_name',options:Object.values(props.investorList) ,setDropdownState , field:'assigned_investor_id'}}
                             editable={false} />
                        <AgGridColumn 
                            valueGetter={valueGetterTrust} 
                            valueSetter={valueSetterTrust}
                            field="trust_id" 
                            headerName="Trust" 
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={{name:'name',options:Object.values(props.trustList) ,setDropdownState , field:'trust_id'}}
                            editable={true} 
                            />

                    <AgGridColumn   
                        field="situation_type" 
                        valueGetter={valueGetterSituationType} 
                        valueSetter={valueSetterSituationType}
                        columnGroupShow="closed" 
                        cellEditor="selectEditor" 
                        cellEditorParams={{name:'display_name',
                        options:situationOptions
                        ,setDropdownState , field:'situation_type'}}
                        editable={true}        
                        headerName="Situation Type" 
                        flex={1}/>

                         <AgGridColumn 
                          headerName="Handled"
                          suppressMenu={true}
                          field="handled"
                          flex={.7}
                          cellRenderer={checkBoxRenderer}                       
                        />
                            <AgGridColumn 
                            valueGetter={valueGetterEntity} 
                            valueSetter={valueSetterEntity}
                            field="related_entity_id" 
                            headerName="Related Entity" 
                            columnGroupShow="closed" 
                            cellEditor="autoCompleteEditor" 
                            cellEditorParams={{name:'full_name',options:Object.values(props.contactList) ,setDropdownState , field:'related_entity_id'}}
                            editable={true} 
                            />
                            <AgGridColumn 
                            field="address" 
                            headerName="Address" 
                            columnGroupShow="closed" 
                            editable={false} 
                            />
                    </AgGridReact>
}
                </div>
            </Card.Body>
        </Card>
    );
};


const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList,
    addressList:state.addressReducer.addressList,
    contactList: state.contactReducer.contactList
})

export default connect(mapStateToProps, null)(MyTasks)