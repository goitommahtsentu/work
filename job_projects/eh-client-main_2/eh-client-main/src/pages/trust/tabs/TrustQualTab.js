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

import ChatterQual from "../ChatterQual"

import Todo from '../../../components/To-Do/BasicToDo'
import { Users } from '../../../services';
const TrustQualTab = props => {
    const [sitsRowData, setSitsRowData] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);
    const [dropdownState,setDropdownState]=useState({})
    const [situationOptions,setSituationOptions]=useState([])

    useEffect(()=>{
    const getOptions=async()=>{
        const data=await Situations.getOptions()
        data&&setSituationOptions(data)
    }
    getOptions()
    },[])
// loads users
const [employeesState,setEmployeesState]=useState([])
    useEffect(()=>{
       (async()=>{
           const data=await Users.getEmployees()
           data&&setEmployeesState(data)
       })()
        },[])
        console.log({employeesState})

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
    return (
        <React.Fragment>
            <Row>
            <Col md={6}>
                    <ChatterQual
                        id={props.id} 
                        owner={props.owner} 
                        vendor={props.vendor}    
                    />
            </Col>
            <Col md={6}>
                   <Todo name='trust_id' value={props.id} employees={employeesState} />
            </Col>

            </Row>
        </React.Fragment>
    );
}


const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList
})

export default connect(mapStateToProps, null)(TrustQualTab)
