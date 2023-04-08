import React, { useState, useEffect,useCallback } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Tabs, Tooltip, } from 'react-bootstrap';

import moment from 'moment';

import Gallery from '../../../components/Gallery/SimpleGallery';
import {
    AddressField,
    EditableField,
    CurencyField,
    SwitchField,
    SelectField
    , TagsField, PhoneField, EmailField
} from "../../../components/Custom/editableField";

// Import Tab Views

import WalletTabView from '../../../pages/contact/vendor/tabs/ContactWallet';
// import TrustTabView from './tabs/TrustTab';
import ContactImagesTab from '../../../pages/contact/ImagesTab';

// no Image Found
import NoImages from '../../../assets/images/person-photo-placeholder.jpg';


// Import Chatter
import Chatter from '../../../pages/contact/Chatter';


import SubContact from '../../../pages/contact/vendor/SubContactForm'
import SubContactList from '../../../pages/contact/vendor/SubContactList'



import { Link,useHistory } from 'react-router-dom';
import _ from 'lodash'

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

import ContactDocumentTab from "../../../pages/contact/tabs/ContactDocumentTab";
import {Contacts,SubContacts,Lanes,Images,Investors,Addresses} from '../../../services'
import httpService from '../../../services/httpService';

import {connect,useDispatch} from 'react-redux'
import {FamilyLeads} from '../../../services/'
import { updateFamilyLeadList,updateContactList } from '../../../store/action_calls';

import { getNextItem,getPrevItem } from '../../../utils/parsedList';
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

const FamilyLeadFormView = props => {
    const [startDate, setStartDate] = useState(new Date());
    const history=useHistory()
    // This is for the Edit swtich
    const [defaultSwitch, setDefaultSwitch] = useState(true);
    const [familyLeadState, setFamilyLeadState] = useState({});
    const [addressState, setAddressState] = useState([])
    const [stageState, setStageState] = useState([])
    const [imagesState, setImagesState] = useState([])
    const [otherState, setOtherState] = useState([{ id: 0, photo: NoImages, empty: true }])
    const [onContactPhotoChanges,setOnContactPhotoChanges]=useState(false)
    function sortList(list) {
        return list.slice().sort((first, second) => first.sequence - second.sequence);
      }

    // Sub contact states
    const [subContactState, setSubContactState] = useState([]);
    const [edited,setEditted]=useState([])


// tags states and methods

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


        useEffect(()=>{
            const source=httpService.getSource()
        const getTags=async()=>{
            let data= await Contacts.getTags(source)
            if(!familyLeadState.tag_ids) return
            setTags(data.filter((i) => familyLeadState.tag_ids.includes(i.id)))
            setSuggestions(data.filter((i) => !familyLeadState.tag_ids.includes(i.id)))
            
        }
        getTags()
        return () => source.cancel();
        },[familyLeadState.tag_ids])
      
        const handleTagsSave=async()=>{
            let tagsArray=tags.map(i=>i.id)
            console.log("tags array",tagsArray)
           if(!_.isEqual(familyLeadState.tag_ids,tagsArray)){
                await Contacts.updateTags(props.match.params.id,{...familyLeadState,tag_ids:tagsArray})
           }
        }



    // Sub Contact methods

    const handleSubContactEdit=(id,e,string)=>{
// console.log("subcontact maybe", e )
        let name = string != undefined ? e.target.placeholder : e.target.name
        let value = string != undefined ? "+" + string : e.target.value

        // let {name,value}=e.target
        console.log("subcontact", value, name)
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
        console.log(id)
        await SubContacts.deleteSubContact(id);
        let index=_.findIndex(subContactState, function(o) { return o.id ==id; });
        console.log(index)
        let newSubContacts=[...subContactState]
        console.log( newSubContacts.splice(index,1))
        setSubContactState(newSubContacts)
        
    }



 const handleSave=async()=>{
        for (let edit of edited){
            console.log(edit)
            let index=_.findIndex(subContactState, function(o) { return o.id ===edit.id; });
            await SubContacts.updateSubcontact(edit.id,{...subContactState[index],...edit})
        }
    }


    const toggleHandler = () => {
        setDefaultSwitch((prevState) => !prevState);

    };

    const newAddress = id => {
        setFamilyLeadState({
            ...familyLeadState,
            "address_id": id
        })
    }
    console.log("Contact State", familyLeadState)
    
    const dispatch = useDispatch()
    const EditContact = async(id, body) => {
      const data=  await Contacts.updateContact(id,body)
      if(!data) return
      dispatch(updateContactList(data))
     dispatch(updateFamilyLeadList(body))
      setDefaultSwitch((prevState) => !prevState)
    }


 

    const onEdit = id => {
        EditContact(id, familyLeadState)
        handleSave()
        handleTagsSave()
    }

    const prevContact  = () =>  {
        let i = props.match.params.id
        let id = i - 1
        let newId=getPrevItem(id,props.familyLeadList)
        history.push(`${newId}`)
    }

    const nextContact  = () =>  {
        let i = props.match.params.id
        let id = ++i
        let newId=getNextItem(id,props.familyLeadList)
        history.push(`${newId}`)
    }

    const handleEdit = (event) => {
        console.log("Event", event)
        const { name, value } = event.target
        setFamilyLeadState({
            ...familyLeadState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        // console.log("Event", event, "name", name)
        const value = event.value
        setFamilyLeadState({
            ...familyLeadState,
            [name]: value
        })
    }


    const handleDates = (event, name) => {
        setFamilyLeadState({
            ...familyLeadState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    useEffect(() => {
        (props.match.params.id&&Object.keys(props.familyLeadList).length!=0)&&setFamilyLeadState(props.familyLeadList[parseInt(props.match.params.id)])
   }, [props.match.params.id,props.familyLeadList]);


    useEffect(()=>{
        const getStage = async() => {
            const data=await Lanes.getStage()
            setStageState(data)
        }
        getStage()
    },[])

    const [refreshSubContact,setSubContactRefresh]=useState(false)

    const storeSubContact=(subcontact)=>{
        setSubContactState(prev=>[...prev,...subcontact])
    }

    useEffect(() => {
        const getSubContacts=async()=>{
          let data=  await SubContacts.getSubContacts(familyLeadState.contact_id)  
          if(!data) return 
          storeSubContact(data.results)
          await fetchNextData(data.next,storeSubContact)
        }
        getSubContacts()
      }, [familyLeadState.contact_id,refreshSubContact])


      const storeImageResults=(images)=>{
        const allImages=sortList(images)
        setImagesState(prev=>[...prev,...allImages]);
     }

    useEffect(()=>{
        const  getImages=async()=>{
          const data=await Images.getImagesForContact(familyLeadState.contact_id)
          if(!data) return
          storeImageResults(data.results)
          fetchNextData(data.next,storeImageResults)
         }
        getImages()
       },[familyLeadState.contact_id,onContactPhotoChanges])


    useEffect(() => {
        // console.log("Image State for thumb", imagesState)
        // console.log("Other State for thumb", otherState)
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
        Object.keys(props.addressList).length!=0&&setAddressState(cloneDeep(Object.values(props.addressList)))
    },[props.addressList]);
    


    useEffect(()=>{

        return ()=>{
          if ( history.location.state?.from) {
              let state = { ...history.location.state };
              history.replace({ ...history.location,state: {...history.location.state,from:state.from}});
          }
        }
    },[])

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
                                                console.log("fat larry", data)
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
                                    <h2>{familyLeadState && familyLeadState.full_name}</h2>
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
                                                <Button className="shadow-1 theme-bg border border-0" onClick={() => onEdit(familyLeadState.contact_id)}>
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
                                                    value={familyLeadState.first_name ? familyLeadState["first_name"] : ''}
                                                    onChange={handleEdit}
                                                />
                                            </Col>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                <Form.Control
                                                    readOnly={defaultSwitch}
                                                    name="last_name"
                                                    plaintext={defaultSwitch}
                                                    value={familyLeadState.last_name ? familyLeadState["last_name"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                                        </Form.Group>
                                        {/*this is a field that will become editable*/}
                                        <EditableField field={familyLeadState?.company}
                                                       name={"company"}
                                                       options={{label:'Company'}}
                                                       state={familyLeadState}
                                                       setState={setFamilyLeadState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <AddressField field={familyLeadState.address_id}
                                                      addressState={addressState}
                                                      full_address={familyLeadState.full_address}
                                                      state={familyLeadState}
                                                      setState={setFamilyLeadState}
                                                      defaultSwitch={defaultSwitch}
                                                      newAddress={newAddress}
                                        />
                                        <EditableField field={familyLeadState?.signer_name}
                                                       name={"signer_name"}
                                                       options={{label:'Signer Name'}}
                                                       state={familyLeadState}
                                                       setState={setFamilyLeadState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Created by</Form.Label>
                                            <Form.Control
                                                readOnly={true}
                                                plaintext={true}
                                                value={familyLeadState.created_by ? familyLeadState["created_by"] : ''}
                                            />
                                        </Form.Group>
                                        <TagsField
                                                    tags={tags}
                                                    suggestions={suggestions}
                                                    onDelete={onDelete}
                                                    onAddition={onAddition}
                                                    defaultSwitch={defaultSwitch}
                                                    options={{label:"Tags"}}
                                        />
                                       <SelectField field={familyLeadState?.language}
                                                     label="language"
                                                     options={{label:"Language"}}
                                                     fieldwritten={familyLeadState?.language_choices}
                                                     state={familyLeadState}
                                                     setState={setFamilyLeadState}
                                                     defaultSwitch={defaultSwitch}
                                        />
                                         <PhoneField field={familyLeadState?.text_phone}
                                                   label="text_phone"
                                                   options={{label:'Phone'}}
                                                   state={familyLeadState}
                                                   setState={setFamilyLeadState}
                                                   defaultSwitch={defaultSwitch}
                                        />
                                         <EmailField field={familyLeadState?.primary_email}
                                            label="primary_email"
                                            name='primary_email'
                                            options={{label:'Email'}}
                                            state={familyLeadState}
                                            setState={setFamilyLeadState}
                                            defaultSwitch={defaultSwitch}
                                            />
                                    </Form>
                                    <Row className="ml-n4">
                                            <Col className="mr-n4">
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.family_bool}
                                                                 defaultSwitch={defaultSwitch}
                                                                 name={"family_bool"}
                                                                 options={{label:'Family'}}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.family_lead_bool}
                                                                 name={"family_lead_bool"}
                                                                 options={{label:'Family Lead'}}
                                                                 defaultSwitch={defaultSwitch}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.investor_lead_bool}
                                                                 name={"investor_lead_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Investor Lead'}}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.investor_bool}
                                                                 name={"investor_bool"}
                                                                 options={{label:'Investor'}}
                                                                 defaultSwitch={defaultSwitch}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.vendor_bool}
                                                                 name={"vendor_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Vendor'}}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>


                                                </Col>
                                            <Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.property_contractor_bool}
                                                                 name={"property_contractor_bool"}
                                                                 options={{label:'Contractor'}}
                                                                 defaultSwitch={defaultSwitch}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>

                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.property_source_bool}
                                                                 name={"property_source_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Prop Source'}}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.is_company_bool}
                                                                 name={"is_company_bool"}
                                                                 defaultSwitch={defaultSwitch}
                                                                 options={{label:'Company'}}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                                <Col md={12}>
                                                    <SwitchField field={familyLeadState.ambassador_bool}
                                                                 name={"ambassador_bool"}
                                                                 options={{label:'Ambassador'}}
                                                                 defaultSwitch={defaultSwitch}
                                                                 state={familyLeadState}
                                                                 setState={setFamilyLeadState}
                                                    />
                                                </Col>
                                            </Col>
                                        </Row>
                                </Col>
                                <Col md={6}>
                        <SubContact
                        contactId={familyLeadState.contact_id}
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
                                    <WalletTabView contact={familyLeadState} id={familyLeadState.contact_id} />
                                </Tab>
                                {/* Documents Tab */}
                                <Tab eventKey="documents" title="DOCUMENTS">
                                    { Object.keys(familyLeadState).length !== 0 && <ContactDocumentTab
                                        contact={familyLeadState}
                                        name="family_lead_id"
                                        id={familyLeadState.id}
                                        // owner={trustState.owner_id ? trustState["owner_id"] : null }
                                    />
                                    }
                                </Tab>

                                {/* Images Tab */}
                                <Tab eventKey="images" title="IMAGES">
                                {familyLeadState.contact_id&& <ContactImagesTab setOnContactPhotoChanges={setOnContactPhotoChanges} contact={familyLeadState}  id={familyLeadState.contact_id} />}
                                </Tab>

                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
                <Chatter  id={familyLeadState.contact_id}  changes={familyLeadState.changes} />
            </Row>
        </React.Fragment>
    );
};


const mapStateToProps = state => ({
    addressList:state.addressReducer.addressList,
    familyLeadList: state.familyLeadReducer.familyLeadList
})

export default connect(mapStateToProps, null)(FamilyLeadFormView)