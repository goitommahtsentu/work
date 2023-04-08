import React, { useState, useEffect,useCallback } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Tabs, Tooltip, } from 'react-bootstrap';

import moment from 'moment';

import Gallery from '../../components/Gallery/SimpleGallery';
import {
    AddressField,
    EditableField,
    CurencyField,
    SelectField
    , TagsField, PhoneField, EmailField
} from "../../components/Custom/editableField";

// Import Tab Views

import WalletTabView from '../contact/vendor/tabs/ContactWallet';
import TrustTabView from './tabs/TrustTab';
import ContactImagesTab from '../contact/ImagesTab';

// no Image Found
import NoImages from '../../assets/images/person-photo-placeholder.jpg';


// Import Chatter
import Chatter from '../contact/Chatter';


import SubContact from '../contact/vendor/SubContactForm'
import SubContactList from '../contact/vendor/SubContactList'



import { Link,useHistory } from 'react-router-dom';
import _ from 'lodash'

import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';

import ContactDocumentTab from "../contact/tabs/ContactDocumentTab";
import {Contacts,SubContacts,Lanes,Images,Investors,Families} from '../../services'
import httpService from '../../services/httpService';

import {connect,useDispatch} from 'react-redux'
import { updateContactList,updateFamilyList } from '../../store/action_calls';
import { getNextItem,getPrevItem } from '../../utils/parsedList';
import {cloneDeep} from 'lodash'
import { fetchNextData } from '../../utils/recursiveCall';

const style = {
    select: {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        color: 'black',
        textIndent: '0px',
        textOverflow: ''
    }
}

const FamilyFormView = props => {
    const [startDate, setStartDate] = useState(new Date());
    const history=useHistory()
    // This is for the Edit swtich
    const [defaultSwitch, setDefaultSwitch] = useState(true);
    const [familyState, setFamilyState] = useState({});
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
            if(!familyState.tag_ids) return
            setTags(data.filter((i) => familyState.tag_ids.includes(i.id)))
            setSuggestions(data.filter((i) => !familyState.tag_ids.includes(i.id)))
            
        }
        getTags()
        return () => source.cancel();
        },[familyState.tag_ids])
      
        const handleTagsSave=async()=>{
            let tagsArray=tags.map(i=>i.id)
            console.log("tags array",tagsArray)
           if(!_.isEqual(familyState.tag_ids,tagsArray)){
                await Contacts.updateTags(familyState.contact_id,{...familyState,tag_ids:tagsArray})
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
    console.log(defaultSwitch)

    // for ContentEditable
   



    const newAddress = id => {
        setFamilyState({
            ...familyState,
            "address_id": id
        })
    }
    console.log("Contact State", familyState)
    
    const dispatch = useDispatch()
    const EditContact = async(id, body) => {
      const data=  await Contacts.updateContact(id,body)
      if(!data) return
      dispatch(updateContactList(data))
      dispatch(updateFamilyList(body))
      setDefaultSwitch((prevState) => !prevState)
    }


 

    const onEdit = id => {
        handleTagsSave()
        EditContact(id, familyState)
        handleSave()
    }

    const prevContact  = () =>  {
        let i = props.match.params.id
        let id = i - 1
        let newId=getPrevItem(id,props.familyList)
        history.push(`${newId}`)
    }

    const nextContact  = () =>  {
        let i = props.match.params.id
        let id = ++i
        let newId=getNextItem(id,props.familyList)
        history.push(`${newId}`)
    }

    const handleEdit = (event) => {
        console.log("Event", event)
        const { name, value } = event.target
        setFamilyState({
            ...familyState,
            [name]: value
        })
    }

    const handleValueChange = (event, name) => {
        // console.log("Event", event, "name", name)
        const value = event.value
        setFamilyState({
            ...familyState,
            [name]: value
        })
    }


    const handleDates = (event, name) => {
        setFamilyState({
            ...familyState,
            [name]: moment(event._d).format("YYYY-MM-DD")
        })
    };

    useEffect(() => {
        (props.match.params.id&&Object.keys(props.familyList).length!=0)&&setFamilyState(props.familyList[parseInt(props.match.params.id)])
   }, [props.match.params.id,props.familyList]);

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
          let data=  await SubContacts.getSubContacts(familyState.contact_id)  
          storeSubContact(data.results)
          await fetchNextData(data.next,storeSubContact)
        }
        getSubContacts()
      }, [familyState.contact_id,refreshSubContact])

      const storeImageResults=(images)=>{
        const allImages=sortList(images)
        setImagesState(prev=>[...prev,...allImages]);
     }
    useEffect(()=>{
        const  getImages=async()=>{
          const data=await Images.getImagesForContact(familyState.contact_id)
          if(!data) return
          storeImageResults(data.results)
          await fetchNextData(data.next,storeImageResults)
         }
        getImages()
       },[familyState.contact_id,onContactPhotoChanges])


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
                                    <h2>{familyState && familyState.full_name}</h2>
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
                                                <Button className="shadow-1 theme-bg border border-0" onClick={() => onEdit(familyState.contact_id)}>
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
                                                    value={familyState.first_name ? familyState["first_name"] : ''}
                                                    onChange={handleEdit}
                                                />
                                            </Col>
                                            <Col sm={4}>
                                                {/* -------------------- /api/contact/contact/ - beneficiary_id -------------------- */}
                                                <Form.Control
                                                    readOnly={defaultSwitch}
                                                    name="last_name"
                                                    plaintext={defaultSwitch}
                                                    value={familyState.last_name ? familyState["last_name"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                                        </Form.Group>
                                        {/*this is a field that will become editable*/}
                                        <EditableField field={familyState?.company}
                                                       name={"company"}
                                                       options={{label:'Company'}}
                                                       state={familyState}
                                                       setState={setFamilyState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <AddressField field={familyState.address_id}
                                                      addressState={addressState}
                                                      full_address={familyState.full_address}
                                                      state={familyState}
                                                      setState={setFamilyState}
                                                      defaultSwitch={defaultSwitch}
                                                      newAddress={newAddress}
                                        />
                                        <EditableField field={familyState?.signer_name}
                                                       name={"signer_name"}
                                                       options={{label:'Signer Name'}}
                                                       state={familyState}
                                                       setState={setFamilyState}
                                                       defaultSwitch={defaultSwitch}
                                        />
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Created by</Form.Label>
                                            <Form.Control
                                                readOnly={true}
                                                plaintext={true}
                                                value={familyState.created_by ? familyState["created_by"] : ''}
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
                                        <SelectField field={familyState?.language}
                                                     label="language"
                                                     options={{label:"Language"}}
                                                     fieldwritten={familyState?.language_choices}
                                                     state={familyState}
                                                     setState={setFamilyState}
                                                     defaultSwitch={defaultSwitch}
                                        />
                                         <PhoneField field={familyState?.text_phone}
                                                   label="text_phone"
                                                   options={{label:'Phone'}}
                                                   state={familyState}
                                                   setState={setFamilyState}
                                                   defaultSwitch={defaultSwitch}
                                        />
                                         <EmailField field={familyState?.primary_email}
                                            label="primary_email"
                                            name='primary_email'
                                            options={{label:'Email'}}
                                            state={familyState}
                                            setState={setFamilyState}
                                            defaultSwitch={defaultSwitch}
                                            />
                                    </Form>
                                </Col>
                                <Col md={6}>
                        <SubContact
                        contactId={familyState.contact_id}
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
                                    <WalletTabView contact={familyState} id={familyState.contact_id} />
                                </Tab>

                                <Tab eventKey="trusts" title="TRUSTS">
                                {familyState.contact_id&& <TrustTabView contact={familyState}  id={familyState.contact_id} />}
                                </Tab>

                                {/* Documents Tab */}
                                <Tab eventKey="documents" title="DOCUMENTS">
                                    { Object.keys(familyState).length !== 0 && <ContactDocumentTab
                                        contact={familyState}
                                        name="family_id"
                                        id={familyState.id}
                                        // owner={familyState.owner_id ? trustState["owner_id"] : null }
                                    />
                                    }
                                </Tab>

                                {/* Images Tab */}
                                <Tab eventKey="images" title="IMAGES">
                                {familyState.contact_id&& <ContactImagesTab setOnContactPhotoChanges={setOnContactPhotoChanges} contact={familyState}  id={familyState.contact_id} />}
                                </Tab>

                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
                <Chatter  id={familyState.contact_id} changes={familyState.changes} />
            </Row>
        </React.Fragment>
    );
};


const mapStateToProps = state => ({
    addressList:state.addressReducer.addressList,
    familyList: state.familyReducer.familyList
})

export default connect(mapStateToProps, null)(FamilyFormView)