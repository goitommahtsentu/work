import React, { useState, useEffect,useCallback } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Tabs, Tooltip, } from 'react-bootstrap';

import moment from 'moment';
import PropTypes from 'prop-types';

import SubContact from './SubContactForm'
import SubContactList from './SubContactList'

import Gallery from '../../../components/Gallery/SimpleGallery';
import {
    AddressField,
    EditableField,
    SelectField,
    SwitchField,
    TagsField, PhoneField, EmailField
} from "../../../components/Custom/editableField";

// Import Tab Views

import WalletTabView from './tabs/ContactWallet';
import TrustTabView from './tabs/TrustTab';
import ContactImagesTab from '../ImagesTab';

// no Image Found
import NoImages from '../../../assets/images/person-photo-placeholder.jpg';


// Import Chatter
import Chatter from '../Chatter';


import { useDispatch,connect } from 'react-redux';
import {updateContactList,updateAddressList} from '../../../store/action_calls'

import { Link,useHistory } from 'react-router-dom';
import _ from 'lodash'

import {FormsAdvance} from '../../../views/forms/FormsAdvance.js'
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import ContactDocumentTab from "../tabs/ContactDocumentTab";

import {Contacts,SubContacts,Lanes,Images, Addresses} from '../../../services'
import httpService from '../../../services/httpService'

import {FaEnvelope} from 'react-icons/fa'

import {getNextItem ,getPrevItem } from '../../../utils/parsedList'
import {cloneDeep} from 'lodash'
import { fetchNextData } from '../../../utils/recursiveCall';

const style = {
    select: {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        color: 'black',
        textIndent: '0px',
        textOverflow: ''
    }
}

const ContactFormView = props => {
    const [startDate, setStartDate] = useState(new Date());
    const history=useHistory()
    // This is for the Edit swtich
    const [defaultSwitch, setDefaultSwitch] = useState(true);
    const [contactState, setContactState] = useState({});
    const [contactOptionsState, setContactOptionsState] = useState({});
    const [addressState, setAddressState] = useState([])
    const [stageState, setStageState] = useState([])
    const [changeState, setChangeState] = useState([])
    const [imagesState, setImagesState] = useState([])
    const [otherState, setOtherState] = useState([{ id: 0, photo: NoImages, empty: true }])
    const [toggle, setToggle] = useState(0);
    const [onContactPhotoChanges,setOnContactPhotoChanges]=useState(false)
    function sortList(list) {
        return list.slice().sort((first, second) => first.sequence - second.sequence);
      }

    // Sub contact states
    const [subContactState, setSubContactState] = useState([]);
    const [edited,setEditted]=useState([])


// tags states and methods
const dispatch=useDispatch()

        const [tags,setTags]=useState([])

        const [suggestions,setSuggestions]=useState([])
      

        const onDelete = useCallback((tagIndex) => {
        setTags(tags.filter((_, i) => i !== tagIndex))
        setSuggestions([...suggestions,tags[tagIndex]])
        }, [tags])

        const onAddition = useCallback((newTag) => {
        setTags([...tags, newTag])
        setSuggestions(suggestions.filter((i) => i.id != newTag.id))
        }, [tags])


       
      
        const handleTagsSave=async()=>{
            let tagsArray=tags.map(i=>i.id)
            ////console.log("tags array",tagsArray)
           if(!_.isEqual(contactState.tag_ids,tagsArray)){
                await Contacts.updateTags(props.match.params.id,{...contactState,tag_ids:tagsArray})
           }
        }



    // Sub Contact methods

    const handleSubContactEdit=(id,e,string)=>{
        let name = string != undefined ? e.target.placeholder : e.target.name
        let value = string != undefined ? "+" + string : e.target.value
        let index=_.findIndex(subContactState, function(o) { return o.id ===id; });
        let newSubContacts=[... subContactState]
        newSubContacts[index]={... newSubContacts[index],[name]:value}
        setSubContactState(newSubContacts)
        let indexEdited=_.findIndex(edited, function(o) { return o.id ===id; });
        let newEdited=[... edited]
        if(indexEdited==-1){
            newEdited.push({id:id,[name]:value})
            setEditted(newEdited)
        }
        else{
            newEdited[indexEdited]={... newEdited[indexEdited],id:id,[name]:value}
            setEditted(newEdited)
        }
    }


     
    const handleDelete=async(id)=>{
        ////console.log(id)
        await SubContacts.deleteSubContact(id);
        let index=_.findIndex(subContactState, function(o) { return o.id ==id; });
        ////console.log(index)
        let newSubContacts=[...subContactState]
        newSubContacts.splice(index,1)
        ////console.log( newSubContacts.splice(index,1))
        setSubContactState(newSubContacts)
        
    }



 const handleSave=async()=>{
        for (let edit of edited){
            ////console.log(edit)
            let index=_.findIndex(subContactState, function(o) { return o.id ===edit.id; });
            await SubContacts.updateSubcontact(edit.id,{...subContactState[index],...edit})
        }
    }


    const toggleHandler = () => {
        setDefaultSwitch((prevState) => !prevState);

    };

    // for ContentEditable


    //    api/contact/contact/1/
    const newAddress = id => {
        setContactState({
            ...contactState,
            "address_id": id
        })
    }

    const EditContact = async(id, body) => {
      const data=  await Contacts.updateContact(id,body)
      if(!data) return
      setContactState(data)
       dispatch(updateContactList(data))
      setDefaultSwitch((prevState) => !prevState)
    }


    const getStage = async() => {
        const data=await Lanes.getStage()
        setStageState(data)

    }

    const onEdit = id => {
        EditContact(id, contactState)
        handleSave()
        handleTagsSave()
    }

    const prevContact  = () =>  {
        let i = props.match.params.id
        let id = i - 1
        let newId=getPrevItem(id,props.contactList)
        history.push(`${newId}`)

    }

    const nextContact  = () =>  {
        let i = props.match.params.id
        let id = ++i
        let newId=getNextItem(id,props.contactList)
        history.push(`${newId}`)
    }

    const handleEdit = (event) => {
        const { name, value } = event.target
        setContactState({
            ...contactState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        const value = event.value
        setContactState({
            ...contactState,
            [name]: value
        })
    }


    const handleDates = (event, name) => {
        setContactState({
            ...contactState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    useEffect(() => {
        getStage()
     }, [props.match.params.id])

     useEffect(() => {
         if(!props.match.params.id) return
        (async()=>{
            const data=await Contacts.getContactChanges(props.match.params.id)
            console.log({rdb:data})
            data.changes&&setChangeState(data.changes)
            })()
     }, [props.match.params.id])


useEffect(() => {
    (async()=>{
    const data=await Contacts.getContact(props.match.params.id)
    data&&setContactState(data)
    })()
}, [props.match.params.id,defaultSwitch]);

    const [refreshSubContact,setSubContactRefresh]=useState(false)
    const storeSubContact=(subcontact)=>{
        setSubContactState(prev=>[...prev,...subcontact])
    }
    useEffect(() => {
        const getSubContacts=async()=>{
          let data=  await SubContacts.getSubContacts(props.match.params.id) 
          if(!data) return 
          setSubContactState([])
          storeSubContact(data.results)
          await fetchNextData(data.next,storeSubContact)
        }
        getSubContacts()
      }, [props.match.params.id,refreshSubContact])

      useEffect(()=>{
        const source=httpService.getSource()
    const getTags=async()=>{
        let data= await Contacts.getTags(source)
        if(!contactState.tag_ids) return
        setTags(data.filter((i) => contactState.tag_ids.includes(i.id)))
        setSuggestions(data.filter((i) => !contactState.tag_ids.includes(i.id)))
        
    }
    getTags()
    return () => source.cancel();
    },[contactState.tag_ids])

    // useEffect(() => {
    //     setContactState(props.contact)
    // }, [props.contact])
    const storeImageResults=(images)=>{
        const allImages=sortList(images)
        setImagesState(prev=>[...prev,...allImages]);
     }

    useEffect(()=>{
        const  getImages=async()=>{
          const data=await Images.getImagesForContact(props.match.params.id)
          if(!data) return
          storeImageResults(data.results)
          fetchNextData(data.next,storeImageResults)
         }
        getImages()
       },[onContactPhotoChanges])


    useEffect(() => {
        if (imagesState.length > 0 && !otherState.empty) {
            setOtherState([])
            let temp = []
            imagesState.map(data => {
                if (data.contact_photo) {
                    temp.push(data)
                }
            })
            temp.length==0?setOtherState([imagesState[0]]):setOtherState(temp);
        }
    }, [imagesState])

    
    useEffect(()=>{
        Object.keys(props.addressList).length!=0&&setAddressState(Object.values(props.addressList))
    },[props.addressList]);
    

    useEffect(()=>{

        return ()=>{
          if ( history.location.state?.from) {
              let state = { ...history.location.state };
              history.replace({ ...history.location,state: {...history.location.state,from:state.from}});
          }
        }
    },[])

//console.log("farms", props.contact.photos,"cool farms", otherState)
    return (
        <React.Fragment>
            <Breadcrumb
            from={history.location.state?.from}
            />
            <Row>
                <Col md={12} lg={9} xl={9}>
                    <Card>
                        <Card.Header>
                            <Row>
                                <Col md={1} style={{
                                    minWidth: 180,
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    margin:10, 
                                    // overflow : 'hidden',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Gallery
                                        images={
                                            otherState.map((data, index) => {
                                                //console.log("fat larry", data)
                                                if (index === 0) {
                                                    return ({ src: data.photo, thumbnail: data.photo, useForDemo: true })
                                                } else {
                                                    return ({ src: data.photo })
                                                }
                                            })
                                        }
                                        backdropClosesModal
                                        singleItem
                                    />
                                </Col>
                                <Col className="float-left">
                                    {/* -------------------- /api/contact/contact/ - name -------------------- */}
                                    <h2>{contactState && contactState.full_name}</h2>
                                    <Button className=" bg-light text-dark border border-0 btn-sm" onClick={prevContact}>prev</Button>
                                    <Button className=" bg-light text-dark border border-0 btn-sm" onClick={nextContact}>next</Button>
                                </Col>
                                <Col className="float-right">
                                    <div className="float-right" style={{ display: "flex" }}>
                                        <Form.Label>Edit <br /> Mode</Form.Label>
                                        <div className="switch d-inline m-r-10">
                                            <Form.Control
                                                type="checkbox"
                                                id="checked-default"
                                                checked={defaultSwitch === false}
                                                onChange={() => toggleHandler()}
                                            />
                                            <Form.Label htmlFor="checked-default" className="cr" />
                                        </div>
                                        {!defaultSwitch ?
                                            <OverlayTrigger overlay={<Tooltip>Save Edited Contact</Tooltip>} style={{ float: "right" }}>
                                                <Button className="shadow-1 theme-bg border border-0" onClick={() => onEdit(contactState.id)}>
                                                    Save
                                                </Button>
                                            </OverlayTrigger>
                                            :
                                            <OverlayTrigger overlay={<Tooltip>Create New Contact</Tooltip>} style={{ float: "right" }}>

                                                <Link to="/contact">
                                                    <Button className="shadow-1 theme-bg border border-0">
                                                        Create
                                                    </Button>
                                                </Link>

                                            </OverlayTrigger>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} >
                                    <Form>
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Name</Form.Label>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                    readOnly={defaultSwitch}
                                                    name="first_name"
                                                    plaintext={defaultSwitch}
                                                    value={contactState.first_name ? contactState["first_name"] : ''}
                                                    onChange={handleEdit}
                                                />
                                            </Col>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                <Form.Control
                                                    readOnly={defaultSwitch}
                                                    name="last_name"
                                                    plaintext={defaultSwitch}
                                                    value={contactState.last_name ? contactState["last_name"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                                        </Form.Group>
                                        {/*this is a field that will become editable*/}
                                        <EditableField field={contactState.company}
                                                       name={"company"}
                                                       options={{label:'Company'}}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <AddressField field={contactState.address_id}
                                                      addressState={addressState}
                                                      full_address={contactState.full_address}
                                                      state={contactState}
                                                      setState={setContactState}
                                                      defaultSwitch={defaultSwitch}
                                                      newAddress={newAddress}
                                        />
                                        <EditableField field={contactState.signer_name}
                                                       name={"signer_name"}
                                                       options={{label:"Signer Name"}}
                                                    //    options={contactOptionsState.signer_name}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Created by</Form.Label>
                                            <Form.Control
                                                readOnly={true}
                                                plaintext={true}
                                                value={contactState.created_by ? contactState["created_by"] : ''}
                                            />
                                        </Form.Group>
                                        {/* <SelectField field={contactState.tag_ids}
                                                       name={"tag_ids"}
                                                       options={contactOptionsState.tag_ids}
                                                       fieldDisplay={contactState.tag_ids}
                                                       state={contactState}
                                                       setState={setContactState}
                                                       defaultSwitch={true}
                                        /> */}
                                   
                                        <TagsField
                                                    tags={tags}
                                                    suggestions={suggestions}
                                                    onDelete={onDelete}
                                                    onAddition={onAddition}
                                                    defaultSwitch={defaultSwitch}
                                                    options={{label:"Tags"}}
                                                    // options={contactOptionsState.tags}

                                        />

                                        {/*<EditableField field={contactState.age}*/}
                                        {/*               name={"age"}*/}
                                        {/*               options={contactOptionsState.age}*/}
                                        {/*               state={contactState}*/}
                                        {/*               setState={setContactState}*/}
                                        {/*               defaultSwitch={defaultSwitch}*/}
                                        {/*/>*/}
                                        <SelectField field={contactState.language}
                                                     label="language"
                                                     options={{label:"Language"}}
                                                    //  options={contactOptionsState.language}
                                                     fieldwritten={contactState.language_choices}
                                                     state={contactState}
                                                     setState={setContactState}
                                                     defaultSwitch={defaultSwitch}
                                        />
                                        
                                         <PhoneField 
                                                  field={contactState.text_phone}
                                                   name="text_phone"
                                                   options={{label:'Phone'}}
                                                   state={contactState}
                                                   setState={setContactState}
                                                   defaultSwitch={defaultSwitch}
                                        />
                                     
                                     
                                        <EmailField field={contactState.primary_email}
                                                   name="primary_email"
                                                   options={{label:'Email'}}
                                                //    options={contactOptionsState.primary_email}
                                                   state={contactState}
                                                   setState={setContactState}
                                                   defaultSwitch={defaultSwitch}
                                        />
                                        <Row className="ml-n4">
                                            <Col className="mr-n4">
                                                <Col md={12}>
                                                    <SwitchField field={contactState.family_bool}
                                                                 defaultSwitch={defaultSwitch}
                                                                 name={"family_bool"}
                                                                 options={{label:'Family'}}
                                                        //    options={contactOptionsState.family_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.family_lead_bool}
                                                                 name={"family_lead_bool"}
                                                                 options={{label:'Family Lead'}}
                                                                 defaultSwitch={defaultSwitch}
                                                        //    options={contactOptionsState.family_lead_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.investor_lead_bool}
                                                                 name={"investor_lead_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Investor Lead'}}
                                                        //    options={contactOptionsState.investor_lead_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.investor_bool}
                                                                 name={"investor_bool"}
                                                                 options={{label:'Investor'}}
                                                                 defaultSwitch={defaultSwitch}
                                                        //    options={contactOptionsState.investor_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.vendor_bool}
                                                                 name={"vendor_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Vendor'}}
                                                        //    options={contactOptionsState.vendor_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>


                                                </Col>
                                            <Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.property_contractor_bool}
                                                                 name={"property_contractor_bool"}
                                                                 options={{label:'Contractor'}}
                                                                 defaultSwitch={defaultSwitch}
                                                        //    options={contactOptionsState.property_contractor_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>

                                                <Col md={12}>
                                                    <SwitchField field={contactState.property_source_bool}
                                                                 name={"property_source_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Prop Source'}}
                                                        //    options={contactOptionsState.property_source_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.is_company_bool}
                                                                 name={"is_company_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Company'}}
                                                        //    options={contactOptionsState.is_company_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={contactState.ambassador_bool}
                                                                 name={"ambassador_bool"}
                                                                 options={{label:'Ambassador'}}
                                                                 defaultSwitch={defaultSwitch}
                                                        //    options={contactOptionsState.ambassador_bool}
                                                                 state={contactState}
                                                                 setState={setContactState}
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col md={6}>
                        <SubContact
                        contactId={props.match.params.id}
                        setSubContactRefresh={setSubContactRefresh}
                        />
                        <SubContactList  
                         setSubContactRefresh={setSubContactRefresh}
                         subContactState={subContactState}
                         handleSubContactEdit={handleSubContactEdit}
                         handleDelete={handleDelete}
                        defaultSwitch={defaultSwitch} 
                        />

                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {/* Tabs Section */}
                    <Card >
                        <Card.Body style={{ boxShadow: "none !important" }}>
                            <Tabs variant="pills" defaultActiveKey="wallet" style={{ boxShadow: "none " }}>
                                {/* Other Bills */}
                                <Tab eventKey="wallet" title="WALLET">
                                    <WalletTabView contact={contactState} id={props.match.params.id} />
                                </Tab>

                                <Tab eventKey="trusts" title="RELATED TRUSTS">
                                    <TrustTabView contact={contactState} id={props.match.params.id} />
                                </Tab>

                                {/* Documents Tab */}
                                <Tab eventKey="documents" title="DOCUMENTS">
                                    { Object.keys(contactState).length !== 0 && <ContactDocumentTab
                                        name="contact_id"
                                        contact={contactState}
                                        id={props.match.params.id}
                                        // owner={trustState.owner_id ? trustState["owner_id"] : null }
                                    />
                                    }
                                </Tab>

                                {/* Images Tab */}
                                <Tab eventKey="images" title="IMAGES">
                                    <ContactImagesTab setOnContactPhotoChanges={setOnContactPhotoChanges} contact={contactState} id={props.match.params.id}  />
                                </Tab>

                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
                <Chatter id={props.match.params.id} changes={changeState} />
            </Row>
        </React.Fragment>
    );
};


const mapStateToProps = state => ({
    contactList: state.contactReducer.contactList,
    addressList:state.addressReducer.addressList,
    contactOptions: state.contactReducer.contactOptions
})

export default connect(mapStateToProps, null)(ContactFormView)