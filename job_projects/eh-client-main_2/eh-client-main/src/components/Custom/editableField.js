import {useRef} from "react";
import {Col, Form, Row,Tooltip,OverlayTrigger} from "react-bootstrap";
import AddressModal from "../../pages/address/modals/AddressModal";
import fieldDateFormatter from "./fieldDateFormatter";
import Datetime from "react-datetime";
import moment from "moment";
import NumberFormat from "react-number-format";
import ReactTags from "react-tag-autocomplete";
// Import API Url
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

//this is the basic editable text field it takes the props
//
// field={contactState.signer_name}
// name={"signer_name"}
// options={contactOptionsState.signer_name}
// state={contactState}
// setState={setContactState}
// defaultSwitch={defaultSwitch}
export const EditableField = (props) => {
    let valid = props.options === undefined

    const handleEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        props.setState({
            ...props.state,
            [name]: value
        })
    }

    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={8}>
                <Form.Control
                    readOnly={props.defaultSwitch}
                    name={props.name}
                    plaintext={props.defaultSwitch}
                    value={props.field ? props.field : ''}
                    onChange={handleEdit}
                />
            </Col>
        </Form.Group>
    )
}

// This is a date field that is not editable, so even when the edit mode is enabled the field will not edit.
//
// field={contactState.signer_name}
// name={"signer_name"}
// options={contactOptionsState.signer_name}
// state={contactState}
// setState={setContactState}
// defaultSwitch={defaultSwitch}

export const DateFieldNon = (props) => {
    let valid = props.options === undefined

    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={8}>
                        <Form.Control
                            readOnly={true}
                            plaintext={true}
                            dateFormat="MM-DD-YYYY"
                            name={props.name}
                            value={fieldDateFormatter(props.field)}
                        />
            </Col>
        </Form.Group>

    )
}


// This is a date field that is editable, same as the above but it turns into an editable field when the editing is enabled.
// it takes the date in MM/DD/YYYY. but displays it in long local format. "LL"
//
// field={contactState.signer_name}
// name={"signer_name"}
// options={contactOptionsState.signer_name}
// state={contactState}
// setState={setContactState}
// defaultSwitch={defaultSwitch}
export const DateField = (props) => {
    let valid = props.options === undefined
    const handleDates = (event, name) => {
        props.setState({
            ...props.state,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };
    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }

            <Col sm={8}>
                {
                    props.defaultSwitch ?
                        <Form.Control
                            readOnly={true}
                            plaintext={true}
                            dateFormat="MM-DD-YYYY"
                            name={props.name}
                            value={fieldDateFormatter(props.field)}
                        />

                        :
                        <Datetime
                            dateFormat="MM-DD-YYYY"
                            closeOnSelect={true}
                            timeFormat={false}
                            name="contact_create_date"
                            value={moment(props.field ? props.field : '').format("LL")}
                            onChange={event => handleDates(event, props.name)} />
                }
            </Col>
        </Form.Group>

    )
}

//this is an editable field except for it displays everything and currency both on input and output

export const CurencyField = (props) => {
    let valid = props.options === undefined
    const handleValueChange = (event, name) => {
        // console.log("Event", event, "name", name)
        const value = event.value
        props.setState({
            ...props.state,
            [name]: value
        })
    }
    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={8}>
                {
                    props.defaultSwitch ?
                        <NumberFormat
                            value={props.field ? props.field : ''}
                            readOnly={true}
                            className="form-control-plaintext"
                            thousandSeparator={true}
                            prefix={'$'}
                            decimalScale={2}
                            name="insured_amount"
                        />
                        :
                        <NumberFormat
                            value={props.field ? props.field : ''}
                            readOnly={false}
                            className="form-control"
                            thousandSeparator={true}
                            prefix={'$'}
                            // Name needs to be the field that is being updated
                            onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name=props.name)}
                            decimalScale={2}
                            fixedDecimalScale={true}
                        />
                }
            </Col>
        </Form.Group>
    )
}

export const SelectField = (props) => {
    let valid = props.options === undefined

    const handleEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        props.setState({
            ...props.state,
            [name]: value
        })
    }

    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={8}>
                {/* -------------------- /api/contact/contact/ - repair_stage_id -------------------- */}
                {props.defaultSwitch ?

                    <Form.Control
                        readOnly={true}
                        plaintext={true}
                        value={props.fieldwritten ? props.fieldwritten : ''}
                    />

                    :
                    <Form.Control
                        disabled={props.defaultSwitch}
                        plaintext={props.defaultSwitch}
                        name={props.label}
                        value={props.field ? props.field : ''}
                        onChange={handleEdit}
                        as="select">
                        {[
                            {
                                "value": "1",
                                "display_name": "Arabic"
                            },
                            {
                                "value": "2",
                                "display_name": "Bengali"
                            },
                            {
                                "value": "3",
                                "display_name": "English"
                            },
                            {
                                "value": "4",
                                "display_name": "French"
                            },
                            {
                                "value": "5",
                                "display_name": "German"
                            },
                            {
                                "value": "6",
                                "display_name": "Hindi"
                            },
                            {
                                "value": "7",
                                "display_name": "Japanese"
                            },
                            {
                                "value": "8",
                                "display_name": "Javanese"
                            },
                            {
                                "value": "9",
                                "display_name": "Korean"
                            },
                            {
                                "value": "10",
                                "display_name": "Malay"
                            },
                            {
                                "value": "11",
                                "display_name": "Mandarin"
                            },
                            {
                                "value": "12",
                                "display_name": "Marathi"
                            },
                            {
                                "value": "13",
                                "display_name": "Portuguese"
                            },
                            {
                                "value": "14",
                                "display_name": "Punjabi"
                            },
                            {
                                "value": "15",
                                "display_name": "Russian"
                            },
                            {
                                "value": "16",
                                "display_name": "Spanish"
                            },
                            {
                                "value": "17",
                                "display_name": "Tamil"
                            },
                            {
                                "value": "18",
                                "display_name": "Telugu"
                            },
                            {
                                "value": "19",
                                "display_name": "Vietnamese"
                            },
                            {
                                "value": "20",
                                "display_name": "Wu"
                            }
                        ].map(data => (
                            <option value={data.value} key={data.value}>{data.display_name}</option>
                        ))
                        }
                    </Form.Control>
                }
            </Col>
        </Form.Group>
    )
}

export const AddressField = (props) => {

    const handleEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        props.setState({
            ...props.state,
            [name]: value
        })
    }

    return (
        <Form.Group as={Row}>
            <Form.Label className={"mb-n5"} column sm={4}>Address</Form.Label>
            {props.defaultSwitch ?
                <Col sm={8}>
                    <Form.Control
                        readOnly={true}
                        plaintext={true}
                        value={props.full_address ? props.full_address : ''}
                    />
                </Col>
                :

                <Col sm={7}>
                    <Form.Control
                        disabled={props.defaultSwitch}
                        plaintext={props.defaultSwitch}
                        type="address_id"
                        name="address_id"
                        value={props.field ? props.field : ''}
                        onChange={handleEdit}
                        as="select"
                    >
                        <option value=""></option>
                        {props.addressState &&
                        props.addressState.map(data => (
                            <option value={data.id}
                                    key={data.id}>{data.display_address}</option>
                        ))
                        }
                    </Form.Control>
                </Col>
            }
                {props.defaultSwitch ? <Col/>:
                <Col sm={1}>
                <AddressModal id={props.state.id} newAddress={id => props.newAddress(id)} />
                </Col>
            }
        </Form.Group>
    )
}

export const PhoneField = (props) => {
    let valid = props.options === undefined
    const handleValueChange = (e,string) => {
        console.log("Event", e, "name", string)
        let name =  props.name
        let value =  "+" + string
        props.setState({
            ...props.state,
            [name]:  value
        })
    }

    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={valid?8:6}>



                {
                    props.defaultSwitch ?
                        <NumberFormat
                            value={props.field ? props.field : ''}
                            readOnly={true}
                            className="form-control-plaintext"
                            thousandSeparator={false}
                            allowNegative={false}
                            format="+# (###) ###-####"
                            isNumericString={false}
                            name="insured_amount"
                        />
                        :
                        <PhoneInput
                            inputStyle={{
                                width: "100%",
                                height: 43,
                                fontSize: 13,
                                backgroundColor: "#F4F7FA",
                                borderRadius: 5,
                                paddingLeft: 45,
                            }}

                            field={props.name}
                            country={'us'}
                            value={props.field ? props.field : ''}
                            // value={subContact.phone ? subContact["phone"] : ''}
                            placeholder="phone"
                            onChange={(string,b,e,)=>handleValueChange(e,string)}
                        />
                }
            </Col>
            {props.field&&props.defaultSwitch&&<Col sm={1} 
                onClick={()=>window.open(`tel:${props.field}`)}    
                style={{ marginTop:10,marginLeft:valid?'-25px':'-10px'}}>
                <OverlayTrigger
                overlay={
                    <Tooltip>
                        Call
                    </Tooltip>
                }
                >
            <i class="fa fa-phone fa-1x" aria-hidden="true"></i>
            </OverlayTrigger>
              
           </Col>}
        </Form.Group>
    )
}

export const EmailField = (props) => {
    let valid = props.options === undefined

    const handleEdit = (event) => {
        console.log("Event", event)
        const { name, value } = event.target
        props.setState({
            ...props.state,
            [name]: value
        })
    }

    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-n5"} column sm={4}>{props.options.label}</Form.Label>
            }
            <Col sm={valid?8:6}>
                <Form.Control
                    readOnly={props.defaultSwitch}
                    name={props.name}
                    plaintext={props.defaultSwitch}
                    defaultValue={props.field ? props.field : ''}
                    onChange={handleEdit}
                    placeholder="name@example.com"
                />
            </Col>
            {props.field&&props.defaultSwitch&&<Col sm={1} 
                onClick={()=>window.open(`https://mail.google.com/mail/?view=cm&source=mailto&to=${props.field}` ,"_blank")}    
                style={{ marginTop:10,marginLeft:'-20px'}}>
                       <OverlayTrigger
                        overlay={
                        <Tooltip>
                            Email
                        </Tooltip>
                        }
                        >
                        <i class="fa fa-envelope fa-1x" aria-hidden="true"></i>
                        </OverlayTrigger>
                </Col>
}
        </Form.Group>
    )
}

//this field displays a muted switch when the field is not editable then shows editable switches otherwise,
// it will display the label to the far right and the switch to the far right.

export const SwitchField = (props) => {
    let valid = props.options === undefined

    const handleEdit = (event) => {
        // console.log("Event", event)
        const { name } = event.target
        props.setState({
            ...props.state,
            [name]: !props.field
        })
    }
    // console.log("asfdgasdgf",props.options.read_only)
    return (
        <div>
            { valid ? " ":
                <Form.Label >{props.options.label}</Form.Label>
            }



            <div className="switch  m-l-10 float-right">

         { props.defaultSwitch?(
            <Form.Control
                    type="checkbox"
                    id={props.name}
                    name={props.name}
                    defaultChecked={props.field}
                    onChange={handleEdit}
                    disabled={true}
                />
          ):(
                <Form.Control
                    type="checkbox"
                    id={props.name}
                    name={props.name}
                    defaultChecked={props.field}
                    onChange={handleEdit}
                />
          )}

<Form.Label htmlFor={props.name} className="cr float-right" />
            </div>
        </div>
    )
}

export const TagsField = ({
   tags,
   suggestions,
   onDelete,
   onAddition,
   defaultSwitch,
    options

}) => {
    let valid = options === undefined
    const reactTags = useRef()
    return (
        <Form.Group as={Row}>
            { valid ? " ":
                <Form.Label className={"mb-0 mt-0"} column sm={4}>{options.label}</Form.Label>
            }
            <Col sm={8}>
            {
            defaultSwitch?(<div  className=" mt-2">
            {tags.map(tag=><span className="react-tags bootstrap-tagsinput p-1 mx-1">{tag.name}</span>)}
            </div>
            )
            :
            <ReactTags
               classNames={{ root: 'react-tags bootstrap-tagsinput', selectedTag: 'react-tags__selected-tag btn-primary' }}
                ref={reactTags}
                tags={tags}
                suggestions={suggestions}
                minQueryLength={0}
                onDelete={onDelete}
                onAddition={onAddition}
             />
            }
            </Col>
    </Form.Group>
            
    )
}