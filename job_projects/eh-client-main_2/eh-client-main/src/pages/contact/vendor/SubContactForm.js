import React,{useState,useRef} from 'react'
import { Button,Modal, Col, Form,  Row } from 'react-bootstrap';


// Import API Url
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { ToastContainer, toast } from 'react-toastify';
import {SubContacts} from '../../../services'
import 'react-toastify/dist/ReactToastify.css';

function checkPhoneFormat(phone){
  return /^[\+][0-9]{10,11}$/im.test(phone)
}

const EmailForm=({handleChange,form,validated})=><Form
              validated={validated}
              noValidate ref={form}>
            <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control 
            required
             onChange={handleChange} 
             name="email"
            size="lg" 
            type="email" 
            pattern="/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/"
            placeholder="name@example.com" 
            />

<Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="emailDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
            onChange={handleChange} 
            name="description"

            as="textarea" rows={3} />
            </Form.Group>
</Form>


const PhoneForm=({ handleChange,form,validated})=><Form
validated={validated}
noValidate ref={form}>
<Form.Group className="mb-3" controlId="phoneNumber">
<Form.Label>Phone Number</Form.Label>
<PhoneInput
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
    onChange={(string,b,e,)=>handleChange(e,string)}
/>

<Form.Control.Feedback type="invalid">
            Please provide a valid phone.
  </Form.Control.Feedback>
</Form.Group>
<Form.Group className="mb-3" controlId="phoneDescription">
<Form.Label>Description</Form.Label>
<Form.Control
onChange={handleChange} 
name="description"
as="textarea" rows={3} />
</Form.Group>
</Form>

const FullForm=({handleChange,form,validated})=><Form
validated={validated}
noValidate ref={form}>
   <Form.Group className="mb-1" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
            onChange={handleChange} 
            name="first_name"
            type="text" 
            placeholder="Enter First Name" 
            required
            />
            <Form.Control.Feedback type="invalid">
            Please provide a valid first name.
          </Form.Control.Feedback>
   </Form.Group>

   <Form.Group className="mb-1" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
            onChange={handleChange}
            name="last_name"
            type="text" 
            placeholder="Enter Last Name" 
            />

          <Form.Control.Feedback type="invalid">
                      Please provide a valid last name.
          </Form.Control.Feedback>
   </Form.Group>

   <Form.Group className="mb-1" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
            onChange={handleChange} 
            name="email"         
            type="email" 
            pattern="/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/"
            placeholder="name@example.com" 
            />
            <Form.Control.Feedback type="invalid">
            Please provide a valid email.
          </Form.Control.Feedback>
   </Form.Group>
    <Form.Group className="mb-1" controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <PhoneInput
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
            onChange={(string,b,e,)=>handleChange(e,string)}
        />
        <Form.Control.Feedback type="invalid">
            Please provide a valid phone.
        </Form.Control.Feedback>
    </Form.Group>
<Form.Group className="mb-1" controlId="Misc">
            <Form.Label>Misc</Form.Label>
            <Form.Control 
            onChange={handleChange} 
            name="misc"
            type="text" 
            placeholder="Enter Misc" 
            />
</Form.Group>
<Form.Group className="mb-1" controlId="phoneDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control 
        onChange={handleChange} 
        name="description"
        as="textarea" rows={2} />
</Form.Group>
</Form>

export default function SubContactForm({contactId,setSubContactRefresh}) {
    const [show, setShow] = useState(false);
    const [subContact,setSubContact]=useState({})
    const [selected,setSelected]=useState("3")
    const handleClose = () =>{
      setShow(false)
      setDisable(false)
      setValidated(false)
      setSelected("3")
      setSubContact({})
    } ;
    const handleShow = () => setShow(true);
    const [validated, setValidated] = useState(false);
    const [disable,setDisable]=useState(false)
    const form=useRef()

    const createSubContact=async()=>{
        const data={
            ...subContact,
            type_choice:selected,
            contact_id:contactId
        }
       const returnData= await SubContacts.createSubContact(data)
       if(typeof returnData === 'string' || returnData instanceof String) return  toast.error(" "+returnData+" \n "+checkPhoneFormat(data.text_phone)?"Phone Formate Should be +1##########  Format":'', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }

    const handleSubmit=async()=>{
        if(form.current.checkValidity()){
          setDisable(true)
          await createSubContact()
          setSubContactRefresh((prevState)=>!prevState)
          setDisable(false)
          setValidated(false);
          handleClose()
        }else{
          setValidated(true);
        }
    }
    const handleChange=(e,string)=>{
        console.log("dsfg",e,string)
        setSelected(string != undefined ? "+" +string : e.target.value)
         // setSelected(e.target.value)
         setValidated(false);
         setSubContact({})
    }
    const handleFormChange=(e,string)=>{
        console.log("dsfg",e,string)
     const name = string != undefined ? e.target.placeholder : e.target.name
     const value = string != undefined ? "+" + string : e.target.value
      setSubContact({...subContact,[name]:value})
    }
    return (
        <div>
          <ToastContainer />
            <Form.Group as={Row} className='justify-space-between ' >
<Form.Label column sm={4}> Sub Contact </Form.Label>
<Col xs={6} >
<Button    variant="primary outlined" onClick={handleShow}>
     Add <i className="feather icon-plus fa-lg mx-0"  />
       </Button> 
</Col>
</Form.Group>
  
        <Modal show={show} onHide={handleClose}  centered>
          <Modal.Header closeButton>
            <Modal.Title>Add SubContact Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Form>
                <Form.Group as={Row}    className="justify-content-sm-center">
                    {/* <Form.Label className={"mb-n5"} column sm={4}>Create Subcontact</Form.Label> */}
                    <Col sm={7}></Col>
                    <Col sm={4} className="mt-3">
<Form.Control as="select"
value={selected}

onChange={handleChange}
>         
          <option value="" selected="">--------</option>
          <option value="1">Co-Applicant</option>
          <option value="2">Email</option>
          <option value="3">Phone</option>
          <option value="4">Child</option>
          <option value="5">Relative</option>
          <option value="6">Emergency Contact</option>
          <option value="7">Work</option>
          <option value="8">Misc</option>
        </Form.Control>

                    </Col>
                    <Col sm={8} >
                       {selected=="3"?<PhoneForm handleChange={handleFormChange} form={form} validated={validated}/> :selected=="2"?<EmailForm handleChange={handleFormChange} form={form} validated={validated}/>:<FullForm  handleChange={handleFormChange} form={form} validated={validated}/>}
                    </Col>
                </Form.Group>

            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button 
            disabled={disable}
            className="shadow-1 theme-bg border border-0" 
            onClick={handleClose}>
              Close
            </Button>
      
            <Button
                disabled={disable}
                className="shadow-1 theme-bg border border-0"
                onClick={handleSubmit}
                >
              Save
                {
                    disable&& <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                }
                           
            </Button>
          </Modal.Footer>
        </Modal>
        </div>
    )
}
