import React,{useEffect,useState} from 'react'
import { Button,Modal,Col, Form, Control, Row ,OverlayTrigger,Tooltip} from 'react-bootstrap';
import _ from 'lodash'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'


import {PhoneField,EmailField} from "../../../components/Custom/editableField";
import NumberFormat from "react-number-format";


import {SubContacts} from '../../../services'

const SubContact=({subContactId,defaultSwitch,setSubContactRefresh})=>{
    const [subContact,setSubContact]=useState({})
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true); 
    
    


    const handleClose=()=> {
        setShow(false);
        }
    const handleEdit=(e,string)=>{
        let name = string != undefined ? e.target.placeholder : e.target.name
        let value = string != undefined ? "+" + string : e.target.value
        setSubContact({...subContact,[name]:value})
    }

    const handleSave=async()=>{
            await SubContacts.updateSubcontact(subContactId,{...subContact})
            setSubContactRefresh((prevstate)=>!prevstate)
            handleClose()
    }

    
    useEffect(()=>{
    const getSubContact=async()=>{
        let data= await SubContacts.getSubContact(subContactId)
        setSubContact(data)
    }
    getSubContact()
    },[])


    return (
        <div>
            {/*this is the View Contact Button*/}
            <Button   className="btn outline btn-outline-primary px-3 ml-0 mr-1"
                variant="outline" onClick={handleShow}>
                View Contact
            </Button>
            <Modal size="lg" show={show} onHide={handleClose}  centered>
                <Modal.Header closeButton>
                    <Modal.Title> {subContact.type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form as={Row} className="justify-content-md-center">
                {/*<Col xs={3}></Col>*/}
                <Col xs={6}>
                <Form.Group className="mb-1" controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                        <Form.Control
                            readOnly={defaultSwitch}
                            name="first_name"
                            plaintext={defaultSwitch}
                            value={subContact.first_name ? subContact["first_name"] : ''}
                            placeholder="First Name"
                            onChange={(e)=>handleEdit(e)}
                            required
                        />
                </Form.Group>

                <Form.Group className="mb-1" controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        readOnly={defaultSwitch}
                        name="last_name"
                        plaintext={defaultSwitch}
                        value={subContact.last_name ? subContact["last_name"] : ''}
                        placeholder="Last Name"
                        onChange={(e)=>handleEdit(e)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-1" controlId="email">
                    <Form.Group as={Row}>
                    <Form.Label>Email</Form.Label>
                            <Col sm={4}>
                                <Form.Control
                                        required
                                        readOnly={defaultSwitch}
                                        name="email"
                                        plaintext={defaultSwitch}
                                        value={subContact.email ? subContact["email"] : ''}
                                        placeholder="Email"
                                        onChange={(e)=>handleEdit(e)}
                                        type="email" 
                                        pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
                                        />
                                  </Col>
                                        <Col sm={2} 
                                            onClick={()=>window.open(`https://mail.google.com/mail/?view=cm&source=mailto&to=${subContact.email ? subContact["email"] : ''}` ,"_blank")}    
                                            style={{ marginTop:10}}
                                            >
                                                 {
                                                    defaultSwitch&&<OverlayTrigger
                                                    overlay={
                                                    <Tooltip>
                                                        Email
                                                    </Tooltip>
                                                    }
                                                    >
                                                  <i class="fa fa-envelope fa-1x" aria-hidden="true"></i>
                                                    </OverlayTrigger>

                                                        
                                                    }
                                            </Col>

                                            </Form.Group>
                                            </Form.Group>

                    </Col>

                <Col xs={6}>
                <Form.Group className="mb-1" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        {
                           defaultSwitch ?
                           <Form.Group as={Row}>
                             <Col sm={6}>
                               <NumberFormat
                                   value={subContact.phone ? subContact["phone"] : ''}
                                   readOnly={true}
                                   className="form-control-plaintext "
                                   thousandSeparator={false}
                                   allowNegative={false}
                                   format="+# (###) ###-####"
                                   isNumericString={false}
                                   name="phone"
                               />
                               </Col>
                               <Col sm={2} 
                                            onClick={()=>window.open(`tel:${subContact.phone ? subContact["phone"] : ''}`)}    
                                            style={{ marginTop:10}}>
                                            

                               <OverlayTrigger
                               overlay={
                                  <Tooltip>
                                    Call
                                  </Tooltip>
                               }
                            >
                         <i class="fa fa-phone fa-1x" aria-hidden="true"></i>
                         </OverlayTrigger>
                         </Col>
                         </Form.Group>
                               :

                               <PhoneInput

                                   // containerClass='form-control sm small input-sm form-control-sm my-5'
                                   value={subContact.phone ? subContact["phone"] : ''}
                                   inputStyle={{
                                       width: "100%",
                                       height: 43,
                                       fontSize: 13,
                                       backgroundColor: "#F4F7FA",
                                       borderRadius: 5,
                                       paddingLeft: 45,

                                   }}

                                   name="phone"
                                   field="phone"
                                   country={'us'}
                                   // value={subContact.phone ? subContact["phone"] : ''}
                                   placeholder="phone"
                                   onChange={(string,b,e,)=>handleEdit(e,string)}
                               />
                       }
                        {/*<Form.Control*/}
                        {/*        required*/}
                        {/*        readOnly={defaultSwitch}*/}
                        {/*        name="phone"*/}
                        {/*        plaintext={defaultSwitch}*/}
                        {/*        value={subContact.phone ? subContact["phone"] : ''}*/}
                        {/*        placeholder="Phone"*/}
                        {/*        onChange={(e)=>handleEdit(e)}*/}
                        {/*/>*/}
                </Form.Group>
                <Form.Group className="mb-1" controlId="Misc">
                    <Form.Label>Misc</Form.Label>
                    <Form.Control
                            readOnly={defaultSwitch}
                            name="misc"
                            plaintext={defaultSwitch}
                            value={subContact.misc ? subContact["misc"] : ''}
                            placeholder="Misc"
                            onChange={(e)=>handleEdit(e)}
                        />
                </Form.Group>
                <Form.Group className="mb-1" controlId="phoneDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                        readOnly={defaultSwitch}
                        name="description"
                        plaintext={defaultSwitch}
                        value={subContact.description ? subContact["description"] : ''}
                        placeholder="Description"
                        onChange={(e)=>handleEdit(e)}
                        as="textarea" rows={2} 
                        />
                  </Form.Group>
                </Col>
            </Form>
        
        </Modal.Body>
        
        <Modal.Footer>
                    <Button 
                    className="shadow-1 theme-bg border border-0" 
                    onClick={handleClose}
                    >
                    Close
                    </Button>
            
                    <Button
                        className="shadow-1 theme-bg border border-0"
                        onClick={handleSave}
                        >
                    Save
                    </Button>
        </Modal.Footer>
                </Modal>
         </div>
    )
}

export default function SubContactList({
  defaultSwitch,
  subContactState,
  handleSubContactEdit,
  handleDelete,
  setSubContactRefresh
}) {


return  (
        <div>
                {
                    subContactState.map((subContact) =>
                    (
                    <Form.Group as={Row} >
{                  (subContact.type!="Email" && subContact.type!="Phone")&&<Form.Label column  sm={3} > {subContact.type}</Form.Label>}
                    {
                        (subContact.type!='Phone' && subContact.type!='Email') &&<Col >

                            <Form.Control className="mx-0"
                                readOnly={true}
                                name="first_name"
                                plaintext={true}
                                value={subContact.full_name ? subContact["full_name"] : ''}
                                // placeholder="Bob"
                                // onChange={(e)=>handleEdit(subContact.id,e)}
                            />




                        </Col>
                    }

                        {
                   subContact.type=='Phone' &&<PhoneField 
                                        field={subContact.phone ? subContact["phone"] : ''}
                                        name="phone"
                                        options={{label:'Phone'}}
                                        state={subContact}
                                        setState={(e)=>handleSubContactEdit(subContact.id,{target:{name:'phone',value:e.phone}})}
                                        defaultSwitch={defaultSwitch}
                            />
                            }



                   {
                   subContact.type=='Email' &&<EmailField 
                                field={subContact.email ? subContact["email"] : ''}
                                name="email"
                                options={{label:'Email'}}
                                state={subContact}
                                setState={(e)=>handleSubContactEdit(subContact.id,{target:{name:'email',value:e.email}})}
                                defaultSwitch={defaultSwitch}
                                />
                            }
                            {
                  (subContact.type=='Phone' || subContact.type=='Email') &&<Col style={{marginLeft:'-50px'}}>
                          <Form.Control
                                    readOnly={defaultSwitch}
                                    className="text-capitalize"
                                    name="description"
                                    plaintext={defaultSwitch}
                                    value={subContact.description ? subContact["description"] : ''}
                                    placeholder="Description"
                                    onChange={(e)=>handleSubContactEdit(subContact.id,e)}
                          />
                  </Col>
                            }


                        {
                            (subContact.type!='Phone' && subContact.type!='Email')
                            //This is where the view contact button gets placed
                            &&<Col className="ml-0"><SubContact
                                setSubContactRefresh={setSubContactRefresh}
                                subContactId={subContact.id} defaultSwitch={defaultSwitch}
                            /></Col>
                        }
                        { defaultSwitch==false&&<Col sm={1.3}
                                                     style={{
                                                         display:'flex',
                                                         justifyContent:'center',
                                                     }}>
                            <Button
                                variant="outline-danger"
                                onClick={()=>handleDelete(subContact.id)}>
                                <i className="feather icon-trash-2 fa-lg mx-0"  />
                            </Button>
                        </Col>}
                    </Form.Group>
                ))}
        </div>
    )
}
