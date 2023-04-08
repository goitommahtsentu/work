import React, { useState, useEffect } from 'react';
import { Button, Col, Form,Modal, OverlayTrigger, Row,  Tooltip } from 'react-bootstrap';
import moment from 'moment';
import { useHistory } from 'react-router-dom';




// Import Endpoints
import {
    AddressField,
    DateField,
    EditableField,
    EmailField,
    SelectField, SwitchField
} from "../../components/Custom/editableField";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import {Contacts,Addresses} from '../../services'
import {connect,useDispatch} from 'react-redux'
import httpService from '../../services/httpService'
import {updateContactList,updateFamilyLeadList,updateFamilyList,updateInvestorList} from '../../store/action_calls'
const CreateReact = props => {

    const [contactState, setContactState] = useState({language:"3"});
    const [contactOptionsState, setContactOptionsState] = useState({});
    const [addressState, setAddressState] = useState([])
    const [isLarge, setIsLarge] = useState(false);
    const [hovered,setHovered]=useState(false)
    const history = useHistory();
    const [disable, setDisable] = useState(false);

    // This will allow new values entered in the modal to go in
    const newAddress = id => {
        setContactState({
            ...contactState,
            "address_id": id
        })
    }

    const clear=()=>{
        if(props.name=='Investor'){
            setContactState({ 'investor_bool':true,language:"3"})
        } 
        else if(props.name=='Family Lead'){
            setContactState({ 'family_lead_bool':true,language:"3"})
        }
        else if(props.name=='Investor Lead'){
            setContactState({ 'investor_lead_bool':true,language:"3"})
        }
        else{
            setContactState({language:"3"})
        }
        setIsLarge(false)
        setDisable(false)
     }
    
    const dispatch = useDispatch()
    const CreateContact = async(body) => {
       const data=await Contacts.createContact(body)
       if(typeof data === 'string' || data instanceof String) return
       dispatch(updateContactList(data))
       if(data.related_types?.investor){
           dispatch(updateInvestorList({
               ...data,
               id:data.related_types.investor_bool,
               contact_id:data.id
           }))
       }else if(data.related_types?.family){
        dispatch(updateFamilyList({
            ...data,
            id:data.related_types.family_bool,
            contact_id:data.id
        }))
    }else if(data.related_types?.family_lead){
        dispatch(updateFamilyLeadList({
            ...data,
            id:data.related_types.family_lead_bool,
            contact_id:data.id
        }))
    }else if(data.related_types?.investor_lead){
        dispatch(updateFamilyLeadList({
            ...data,
            id:data.related_types.investor_lead_bool,
            contact_id:data.id
        }))
    }
       clear()
       if(props.isSituation) return
       history.replace(`/contact/${data.id}`)
    }


    // useEffect(() => {
    //     setContactState(props.contact)
    // }, [props.contact])

    useEffect(() => {
        const source=httpService.getSource()
        const getAddress=async()=>{
         const options=await Contacts.getOptions(source)
         options&&setContactOptionsState(options.actions?.POST?options.actions.POST:{})
        }
        getAddress()
        return () => source.cancel();
    }, [])


useEffect(()=>{
    Object.keys(props.addressList).length!=0&&setAddressState(Object.values(props.addressList))
},[props.addressList]);



    const handleDates = (event, name) => {
        // console.log("From date", moment(event._d).format("MM/DD/YYYY"))
        // console.log("From name", name)


        setContactState({
            ...contactState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    const handleEdit = (event) => {
        console.log("Event", event)
        const { name, value } = event.target
        setContactState({
            ...contactState,
            [name]: value
        })
    }

    const onSubmit = async() => {
        setDisable(true)
        onCancel()
        await CreateContact(contactState)
    }
  const onCancel=()=>{
     clear()
  }
  const CreateButton=(navbar,name)=>{
            return  navbar?(
                <div onClick={() => setIsLarge(true)}>
                <ul style={{
                    color:hovered?'#1dc4e9':"#a9b7d0", cursor:hovered?'pointer':'', marginLeft:-10, marginTop:6.2,listStyleType: hovered?'disc':''}}>
                <li href="#"  onMouseOver={()=>setHovered(true)} onMouseOut={()=>setHovered(false)}>
                 	&thinsp;&thinsp;&thinsp;Create {name}
                </li>
                </ul>
               </div>
               ):
                (
                <OverlayTrigger overlay={<Tooltip>Create {name}</Tooltip>} style={{ float: "right" }}>
                <Button className={props.isNavbar?"transparent":"shadow-1 theme-bg border border-0"} size="md" onClick={() => setIsLarge(true)}>
                Create {name}
                </Button>
                </OverlayTrigger>
                )
  }
    useEffect(() => {
        if(props.name=='Investor'){
            setContactState({ 'investor_bool':true,language:"3"})
        } 
        else if(props.name=='Family Lead'){
            setContactState({ 'family_lead_bool':true,language:"3"})
        } else if(props.name=='Investor Lead'){
            setContactState({ 'investor_lead_bool':true,language:"3"})
        }
    }, [props.name])

    return (
        <React.Fragment>
            {props.isSituation?(
                    <Button className=" bg-transparent m-1 border-0" size="sm" onClick={() => setIsLarge(true)} style={{ float: "right" }}>
                        <i className="feather icon-plus fa-2x text-dark mx-n3" />
                </Button>
            ):CreateButton(props.isNavbar,props.name)}
        <Modal size="lg" show={isLarge} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title as="h5">{props.isSituation?props.title:props.isInvestor?"Create Investor":"Create Contact"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={10} >
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Name</Form.Label>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                    readOnly={false}
                                                    name="first_name"
                                                    plaintext={false}
                                                    value={contactState.first_name ? contactState["first_name"] : ''}
                                                    onChange={handleEdit}
                                                />
                                            </Col>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                <Form.Control
                                                    readOnly={false}
                                                    name="last_name"
                                                    plaintext={false}
                                                    value={contactState.last_name ? contactState["last_name"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} controlId="phoneNumber">
                                        <Form.Label  column sm={4}>Phone Number</Form.Label>
                                        <Col sm={8}>
                                        <PhoneInput
                                            inputStyle={{
                                                width: "100%",
                                                height: 43,
                                                fontSize: 13,
                                                borderRadius: 5,
                                                paddingLeft: 45,
                                            }}
                                            name="text_phone"
                                            field="text_phone"
                                            country={'us'}
                                            // value={subContact.phone ? subContact["phone"] : ''}
                                            placeholder="phone"
                                            inputProps={{
                                                name: 'text_phone',
                                                autoFocus: true
                                              }}
                                            onChange={(phone)=>{
                                                handleEdit({target:{name:'text_phone',value:`+${phone}`}}) 
                                                }}
                                        />
                                        </Col>
                                        <Form.Control.Feedback type="invalid">
                                                    Please provide a valid phone.
                                        </Form.Control.Feedback>
                                        </Form.Group>
                                        {/*this is a field that will become editable*/}
                                        <EditableField field={contactState.company}
                                                       name={"company"}
                                                       options={{label:'Company'}}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={false}
                                        />
                                        <AddressField field={contactState.address_id}
                                                      addressState={addressState}
                                                      full_address={contactState.full_address}
                                                      state={contactState}
                                                      setState={setContactState}
                                                      defaultSwitch={false}
                                                      newAddress={newAddress}
                                        />
                                        {/*<EditableField field={contactState.signer_name}*/}
                                        {/*               name={"signer_name"}*/}
                                        {/*               options={props.contactOptions.signer_name}*/}
                                        {/*               state={contactState}*/}
                                        {/*               setState={setContactState}*/}
                                        {/*/>*/}
                                        {/*<SelectField field={contactState.tag_ids}*/}
                                        {/*               name={"tag_ids"}*/}
                                        {/*               options={props.contactOptions.tag_ids}*/}
                                        {/*               fieldDisplay={contactState.tag_ids}*/}
                                        {/*               state={contactState}*/}
                                        {/*               setState={setContactState}*/}
                                        {/*               defaultSwitch={false}*/}
                                        {/*/>*/}
                                        <EditableField field={contactState.age}
                                                       name={"age"}
                                                       options={{label:'Age'}}
                                                    //    options={props.contactOptions.age}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={false}
                                        />
                                        <SelectField field={contactState.language}
                                                     label="language"
                                                    //  options={{label:'Language'}}
                                                      options={contactOptionsState.language}
                                                     fieldwritten={contactState.language_choices}
                                                     state={contactState}
                                                     setState={setContactState}
                                                     defaultSwitch={false}
                                        />
                                        <EmailField field={contactState.primary_email}
                                                       name={"primary_email"}
                                                       options={{label:'Primary Email'}}
                                                    //    options={props.contactOptions.primary_email}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={false}
                                        />
                                        <Row>
                                            <Col md={4}>
                                                <SwitchField field={contactState.family_bool}
                                                       name={"family_bool"}
                                                       options={{label:'Family'}}
                                                    //    options={props.contactOptions.family_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={contactState.investor_lead_bool}
                                                       name={"investor_lead_bool"}
                                                       options={{label:'Investor Lead'}}
                                                    //    options={props.contactOptions.investor_lead_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={props.isInvestor?props.isInvestor:contactState.investor_bool}
                                                       name={"investor_bool"}
                                                       options={{label:'Investor'}}
                                                    //    options={props.contactOptions.investor_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <SwitchField field={contactState.family_lead_bool}
                                                       name={"family_lead_bool"}
                                                       options={{label:'Family Lead'}}
                                                    //    options={props.contactOptions.family_lead_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={contactState.ambassador_bool}
                                                       name={"ambassador_bool"}
                                                       options={{label:'Ambassador'}}
                                                    //    options={props.contactOptions.ambassador_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={contactState.property_contractor_bool}
                                                       name={"property_contractor_bool"}
                                                       options={{label:'Property Contractor'}}
                                                    //    options={props.contactOptions.property_contractor_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <SwitchField field={contactState.property_source_bool}
                                                       name={"property_source_bool"}
                                                       options={{label:'Propery Source'}}
                                                    //    options={props.contactOptions.property_source_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={contactState.is_company_bool}
                                                       name={"is_company_bool"}
                                                       options={{label:'is company'}}
                                                    //    options={props.contactOptions.is_company_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                            <Col md={4}>
                                                <SwitchField field={contactState.vendor_bool}
                                                       name={"vendor_bool"}
                                                       options={{label:'Vendor'}}
                                                    //    options={props.contactOptions.vendor_bool}
                                                       state={contactState}
                                                       setState={setContactState}
                                                />
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                </Row>
        </Modal.Body>
                <Modal.Footer>
                <Row>
                    <Col className="float-right">
                        <div className="float-right" style={{ display: "flex" }}>

                         <OverlayTrigger overlay={<Tooltip>Create New Contact</Tooltip>} style={{ float: "right" }}>

                                <Button className="shadow-1 theme-bg border border-0"
                                 disabled={disable}
                                onClick={onCancel}>
                                    cancel
                                </Button>

                            </OverlayTrigger>
                            <OverlayTrigger overlay={<Tooltip>Create New Contact</Tooltip>} style={{ float: "right" }}>

                                <Button className="shadow-1 theme-bg border border-0" 
                                 disabled={disable}
                                onClick={onSubmit}>
                                    Save
                                    {
                                 disable&& <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                              }
                                </Button>

                            </OverlayTrigger>
                            

                        </div>
                    </Col>
                </Row>
        </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}


const mapStateToProps = state => ({
    addressList:state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(CreateReact)