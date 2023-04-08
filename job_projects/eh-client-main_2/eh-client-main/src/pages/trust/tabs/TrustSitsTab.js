import React, {useEffect, useState, useRef} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import { Button, Card, Form, OverlayTrigger, Tooltip, Row, Col, Table } from 'react-bootstrap';


// Import AG Grid
import 'ag-grid-enterprise';
import DateEditor from "../../../components/AgGrid/DateEditor";

import gridOptions from "../../../components/AgGrid/gridOptions"

import checkBoxRenderer from "../../../components/AgGrid/checkBoxRenderer";

import {Situations, Trusts} from '../../../services';
import { connect } from 'react-redux';
import {billColor} from "../../../components/AgGrid/color";
import {useHistory} from 'react-router-dom'

const SitsTab = props => {
    const [sitsRowData, setSitsRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [dropdownState,setDropdownState]=useState({})
    const [situationOptions,setSituationOptions]=useState([])


    const history=useHistory()
    useEffect(()=>{
    const getOptions=async()=>{
        const data=await Situations.getOptions()
        data&&setSituationOptions(data)
    }
    getOptions()
    },[])

    const gridRef = useRef(null);

    // these are the AG grid Col Perameters
    const defaultColDef = {
        flex:1,
        filter: true,
        sortable: false,
        editable: true,
        wrapText: true,
        autoHeight: true,

    }


    useEffect(() => {
        const getSits=async()=>{
            const data=await Situations.getSituations(props.id)
            setSitsRowData(data)
        }
        getSits()
    }, [props.id,toggle,props.toggle,props.setToggle]);







    // Endpoint Calls the button which adds a new row
    const handleNewSits = async(id) => {
        // console.log("New Line Created For Trust Id", props.id)
        const obj = {};
        obj["trust_id"] = props.id
        const data=await Situations.createSits(obj)
       if(data) setSitsRowData(prevState=>[data,...prevState])
    }
  
    // Endpoint Calls for making edited info push to the backend and update the data
    const handleUpdateSits = async(body) => {
            console.log("obj", body)
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        let obj = {};
        obj[body.colDef.field] = body.newValue
        if(Object.keys(dropdownState).length!==0)
        {
            obj=dropdownState
        }
        await Situations.updateSituation(id,obj)
        setDropdownState({})
    }

 

 
  const valueGetterContact = params => {
    if(props.contactList[params.data.related_entity_id]) return  props.contactList[params.data.related_entity_id].full_name
    return params.data.related_entity_id
};
const valueSetterContact = params => {
    // setDropdownState({assigned_investor_id:params.newValue})
    console.log("hello")
    params.data.related_entity_id = params.newValue;
    return true;
};


const valueGetterSituationType = params => {
    const value=situationOptions.filter(options=>options.value==params.data.situation_type)
    if(value.length>0){
        return value[0].display_name
    }
    return params.data.situation_type
};


    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };

    const valueSetterSituationType = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        console.log("hello")
        params.data.situation_type = params.newValue;
        return true;
    };


    const valueGetterHandled = params => {
        return params.data.handled?'Yes':'No'
    };

    const valueSetterHandled = params => {
        params.data.handled = params.newValue;
        return true;
    };

    const cellRendererParams = {
        clicked: function (id) {
            history.push(`/situations/${id}`);
        },
    }

  const  handleDeleteSituation=async(id)=>{
      setSitsRowData(prev=>prev.filter(i=>i.id!=id))
      await Situations.handleDeleteSituation(id)
  }

    const cellRendererParamsDelete = {
        clicked: function (id) {
         handleDeleteSituation(id)
        },
    }
    return (
            <React.Fragment>
                <Card.Header>
                    <Card.Title as="h5">Sits</Card.Title>
                    <Button className="shadow-1 theme-bg border border-0 btn-sm"
                            onClick={() => {
                                gridApi.applyTransaction({ add:[{}]});
                                handleNewSits()
                            }}
                    >
                        Add a Row
                    </Button>
                </Card.Header>
                <div id className="ag-theme-alpine" >
                    {situationOptions.length>0&&<AgGridReact
                        gridOptions={gridOptions}
                        defaultColDef={defaultColDef}
                        onGridReady={handleGridReady}
                        ref={gridRef}
                        // Editing
                        onCellValueChanged={handleUpdateSits}
                        // This is Important ^^^^^^^^ for the data actually updating
                        rowData={sitsRowData}
                        getRowNodeId={function (data) {
                            return data.id;
                          }}
                          rowClassRules={billColor}
                        >
                       <AgGridColumn field="id"  headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} 
                       filter={false} flex={1}/>
                        <AgGridColumn field="issue" headerName="Issue" flex={1}/>
                        <AgGridColumn field="notes" headerName="Notes"  flex={1} />
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
                          field="handled"
                          flex={.7}
                          cellRenderer={checkBoxRenderer}                       
                        />
                        <AgGridColumn 
                        field="related_entity_id" 
                        valueGetter={valueGetterContact} 
                        valueSetter={valueSetterContact}
                        columnGroupShow="closed" 
                        cellEditor="autoCompleteEditor" 
                        cellEditorParams={{name:'full_name',
                        options:Object.values(props.contactList) ,setDropdownState , field:'related_entity_id'}}
                        headerName="Related Entity" 
                        editable={true}
                        />
                        <AgGridColumn
                            field="next_todo_title"
                            headerName="Next Task"
                            columnGroupShow="closed"
                            editable={false}
                            />
                       <AgGridColumn
                            field="next_todo_employee"
                            headerName="Next Assigned To"
                            columnGroupShow="closed"
                            editable={false}
                            />
                       <AgGridColumn
                            field="last_completed_todo_date"
                            headerName="Last Completed"
                            columnGroupShow="closed"
                            editable={false}
                            />
                   <AgGridColumn
                   field="id"
                   headerName=""
                   suppressMenu={true}
                   cellRenderer={'btnCellRenderer'}
                   cellRendererParams={cellRendererParamsDelete}
                   editable={false}
                   sort={false}
                   filter={false}
                   flex={1}/>
                    </AgGridReact>
                    }
                </div>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList
})

export default connect(mapStateToProps, null)(SitsTab)
