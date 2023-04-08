import React, { useState, useEffect,useRef } from 'react';
import {
   Button,
   Card,
   Col,
   Form,
   OverlayTrigger,
   Row,
   Tab,
   Tabs,
   Tooltip,
} from 'react-bootstrap';
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';


// no Image Found
import NoImages from '../../assets/images/trust-photo-placeholder.jpg';

import { Link, useHistory } from 'react-router-dom';

import {Situations, Todos} from '../../services'

import { getTrusts,getContacts } from '../../store/action_calls';

import { useDispatch,connect,useSelector } from 'react-redux';
import Todo from '../../components/To-Do/BasicToDo'
import {Users} from '../../services/'
import Chatter from './ChatterSituation'
import { Typeahead } from 'react-bootstrap-typeahead';
import { FaExternalLinkAlt } from 'react-icons/fa';
import CreateContact from '../contact/CreateContact'
import CreateTrustModal from './CreateTrustModal';
import ReactTags from 'react-tag-autocomplete'

const TrustSituationDetails = props => {
    const history=useHistory()
    const user = useSelector(state => state.account.user);
   // This is for the Edit swtich
   const [situationsState, setSituationsState] = useState({});
   const [situationsStateOption, setSituationsStateOption] = useState([]);

   const [autoCompletedTrust,setAutoCompletedTrust]=useState([])
   const [autoCompletedEntities,setAutoCompletedEntities]=useState([])
   const [autoCompletedInvestor,setAutoCompletedInvvestor]=useState([])
   const dispatch=useDispatch()
   const [employeesState,setEmployeesState]=useState([])
   useEffect(()=>{
      (async()=>{
          const data=await Users.getEmployees()
          data&&setEmployeesState(data)
      })()
       },[])

   useEffect(()=>{

    if(!props.match.params.id) return
    (async()=>{
    const data=await Situations.getSituation(props.match.params.id)
    data&&setSituationsState(data)
    })()

},[props.match.params.id])

useEffect(()=>{
    (async()=>{
    const data=await Situations.getOptions()
    data&&setSituationsStateOption(data)
    })()

},[])

// useEffect(()=>{
// props.getTrusts()
// props.getContacts()
// },[])

// This is for the Edit swtich
const [defaultSwitch, setDefaultSwitch] = useState(true);
const toggleHandler = () => {
      setDefaultSwitch(prevState => !prevState);
      if(defaultSwitch){
          setAutoCompletedEntities(Object.values(props.contactList).filter(i=>i.id===situationsState.related_entity_id))
          setAutoCompletedTrust(Object.values(props.trustList).filter(i=>i.id===situationsState.trust_id))
          setAutoCompletedInvvestor(Object.values(props.investorList).filter(i=>i.id===situationsState.investor_id))
      }
};

const EditTrust = async(id, body) => {
    const data=await Situations.updateSituation(id,{...body,tag_ids:tags.map(tag=>tag.id)})
    if(data){
        setSituationsState(data)
        // dispatch(updateTrustList(data))
    }
    setDefaultSwitch(prevState => !prevState);
};

const onEdit = id => {
    EditTrust(id,situationsState)
 };
 const handleEdit = event => {
    const { name, value } = event.target;
    setSituationsState({
       ...situationsState,
       [name]: value,
    });
 };

//tags

const [tags,setTags]=useState([])
const [suggestions,setSuggestions]=useState([])
const [suggestionsAll,setSuggestionsAll]=useState([])

useEffect(()=>{
    (async()=>{
const data=await Situations.getSituationTags()
data&&setSuggestionsAll(data)
 })()
},[])


    useEffect(()=>{
    if(!situationsState.tag_ids) return
    setTags(prev=>{
       const tags= suggestionsAll.filter(sug=>situationsState.tag_ids.includes(sug.id))
       return tags
    })
    },[situationsState.tag_ids,suggestionsAll])

    useEffect(()=>{
        if(!situationsState.tag_ids) return
        setSuggestions(suggestionsAll.filter(sug=>!situationsState.tag_ids.includes(sug.id)))
        },[situationsState.tag_ids,suggestionsAll])


    // useEffect(()=>{
    //     if(!situationsState.tag_ids) return
    //     setSuggestions(prev=>prev.filter(sug=>!situationsState.tag_ids.includes(sug.id)))
    //     },[situationsState.tag_ids])
    


const  reactTags = useRef()

const onDelete =(i)=> {

    setTags(prevTags=>{
    const item=prevTags.filter((tag,index)=>index===i)
    setSuggestions(prev=>[...prev,...item])
    return prevTags.filter((tag,index)=>index!==i)
})
}

const onAddition= async(tag) =>{
//   const data=
 console.log({tag})
 const isTagNew=suggestions.filter(sug=>sug.name===tag.name.trim())[0]
 if(isTagNew){
     setTags(prev=>[...prev,tag])
     setSuggestions(prev=>prev.filter(i=>i.id!==tag.id))
 return
    }
const data=await Situations.addSituationTag({name:tag.name})
data&&setTags(prev=>[...prev,data])

}

    return (
        <>
            <Breadcrumb
            from={history.location.state?.from}
            />
 
                        <Row>
                        <Col sm={12} md={9} lg={9} xl={9}>
                    <Card>
                        <Card.Header>
                           { defaultSwitch?<h1>{situationsState.issue}</h1>:(
                               <Col xs={6}>
                                  <Form.Control
                                  name='issue'
                                  value={situationsState.issue ? situationsState["issue"] : ''}
                                  onChange={handleEdit}
                              />
                               </Col>
                           )}
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
                                        {!defaultSwitch &&<OverlayTrigger overlay={<Tooltip>Save Edited Trust</Tooltip>} style={{ float: "right" }}>
                                                <Button className="shadow-1 theme-bg border border-0" onClick={() => onEdit(situationsState.id)}>
                                                    Save
                                                </Button>
                                            </OverlayTrigger>
                                        }
                                        </div>
                                                </Col>
                        </Card.Header>
                        <Card.Body>
                        <Row>
                        <Col md={6}>
                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Address</Form.Label>
                                            <Col sm={5}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                    disabled={true}
                                                    plaintext={true}
                                                    readOnly={true}
                                                    name='address'
                                                    value={situationsState.address ? situationsState["address"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                        </Form.Group>

                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Handled</Form.Label>
                                            <Col sm={5}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                              {  
                                               defaultSwitch?<Form.Control
                                                    name="owner"
                                                    disabled={true}
                                                    plaintext={true}
                                                    readOnly={true}
                                                    value={situationsState.handled ?'Yes' : 'No'}
                                                    onChange={handleEdit}
                                                />:(
                                                    <div className="switch d-inline m-r-10">
                                                    <Form.Control
                                                        type="checkbox"
                                                        id="checked-handled"
                                                        name='handled'
                                                        checked={situationsState.handled}
                                                        onChange={(e)=>setSituationsState({...situationsState,handled:!situationsState.handled})}
                                                    />
                                                    <Form.Label htmlFor="checked-handled" className="cr" />
                                                </div>
                                                )}

                                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                                                <Row>
                                            <Form.Label className={"mb-n5"} column sm={4}>Trust</Form.Label>
                                            <Col sm={defaultSwitch?5:7}  style={{paddingRight:0}}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}

                                            {   defaultSwitch?(<Form.Control
                                                type="trust_id"
                                                name="trust_id"
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                readOnly={defaultSwitch}
                                                value={situationsState.trust_id ? situationsState["trust_id"] : ''}
                                                onChange={handleEdit}
                                                as="select">
                                                    <option><h1></h1></option>
                                                {Object.values(props.trustList)&&
                                                    Object.values(props.trustList)?.map(data => (
                                                        <option value={data.id} key={data.id}>{data.name}</option>
                                                    ))
                                                }
                                            </Form.Control>):(<Typeahead
                                                    id="assigned_vendor"
                                                    name="trust"
                                                    labelKey="name"
                                                    onChange={(trust)=>{
                                                        console.log({trust})
                                                        trust.length!==0&&handleEdit({target:{name:'trust_id',value:trust[0].id}})
                                                        setAutoCompletedTrust(trust)
                                                    }
                                                }
                                                    options={Object.values(props.trustList)}
                                                    placeholder="Choose an entity..."
                                                    selected={autoCompletedTrust}
                                            />)}
                                            </Col>
                                         
                                            {  defaultSwitch&&<Col sm={2} 
                                            onClick={()=>situationsState.trust_id&&history.push(`../trust/${situationsState.trust_id}`)}    
                                            style={{ display:'flex', alignItems:'center'}}>
                                            {
                                            (situationsState.trust_id || situationsState.trust_id===0) &&defaultSwitch&&<FaExternalLinkAlt />
                                                
                                        }
                                            </Col>}

                                            <Col sm={1} 
                                              style={{ display:'flex', alignItems:'center'}}>
                                            {
                                              !defaultSwitch&&<CreateTrustModal />                                                
                                        }
                                            </Col>

                                                </Row>
                                         
                        </Form.Group>

                        <Form.Group as={Row}>
                                                <Row>
                                            <Form.Label className={"mb-n5"} column sm={4}>Investor</Form.Label>
                                            <Col sm={defaultSwitch?5:7} style={{paddingRight:0}}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}

                                                {   defaultSwitch?( <Form.Control
                                                type="investor_id"
                                                name="investor_id"
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                readOnly={defaultSwitch}
                                                value={situationsState.investor_id ? situationsState["investor_id"] : ''}
                                                onChange={handleEdit}
                                                as="select">
                                                    <option></option>
                                                {Object.values(props.investorList)&&
                                                    Object.values(props.investorList)?.map(data => (
                                                        <option value={data.id} key={data.id}>{data.full_name}</option>
                                                    ))
                                                }
                                            </Form.Control>):(<Typeahead
                                                    id="investor_id"
                                                    name="investor"
                                                    labelKey="full_name"
                                                    onChange={(trust)=>{
                                                        console.log({trust})
                                                        trust.length!=0&&handleEdit({target:{name:'investor_id',value:trust[0].id}})
                                                        setAutoCompletedInvvestor(trust)
                                                    }
                                                }
                                                    options={Object.values(props.investorList)}
                                                    placeholder="Choose an investor..."
                                                    selected={autoCompletedInvestor}
                                            />)}
                                            </Col>
                                         
                                            {  defaultSwitch&&<Col sm={2} 
                                            onClick={()=>situationsState.investor_id&&history.push(`../investor/${situationsState.investor_id}`)}    
                                            style={{ display:'flex', alignItems:'center'}}>
                                            {
                                              (situationsState.investor_id || situationsState.investor_id==0) &&defaultSwitch&&<FaExternalLinkAlt />
                                                
                                        }
                                            </Col>}
                                            <Col sm={1} 
                                              style={{ display:'flex', alignItems:'center'}}>
                                            {
                                              !defaultSwitch&&<CreateContact  isSituation={true} title={"Create Investor"} name={"Investor"}/>                                                
                                        }
                                            </Col>
                                                </Row>
                                         
                        </Form.Group>

                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Situation Type</Form.Label>
                                            <Col sm={defaultSwitch?5:7} style={{marginLeft:'-10px'}}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                type="situation_type"
                                                name="situation_type"
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                readOnly={defaultSwitch}

                                                value={situationsState.situation_type ? situationsState["situation_type"] : ''}
                                                onChange={handleEdit}
                                                as="select">
                                                    <option></option>
                                                {situationsStateOption&&
                                                situationsStateOption?.map(data => (
                                                        <option value={data.value} key={data.value}>{data.display_name}</option>
                                                    ))
                                                }
                                            </Form.Control>

                                            </Col>
                                            
                        </Form.Group>

                        <Form.Group as={Row}>
                            <Row>

                                            <Form.Label className={"mb-n5"} column sm={4}>Related Entity</Form.Label>
                                            <Col sm={defaultSwitch?5:7} style={{paddingRight:0}}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                {   defaultSwitch?(<Form.Control
                                                type="related_entity_id"
                                                name="related_entity_id"
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                readOnly={defaultSwitch}
                                                value={situationsState.related_entity_id ? situationsState["related_entity_id"] : ''}
                                                onChange={handleEdit}
                                                as="select">
                                                    <option></option>
                                                {Object.values(props.contactList)&&
                                                    Object.values(props.contactList)?.map(data => (
                                                        <option value={data.id} key={data.id}>{data.full_name}</option>
                                                    ))
                                                }
                                            </Form.Control>):(<Typeahead
                                                    id="related_entity_id"
                                                    name="related_entity_id"
                                                    labelKey="full_name"
                                                    onChange={(trust)=>{
                                                        console.log({trust})
                                                        trust.length!=0&&handleEdit({target:{name:'related_entity_id',value:trust[0].id}})
                                                        setAutoCompletedEntities(trust)
                                                    }
                                                }
                                                    options={Object.values(props.contactList)}
                                                    placeholder="Choose an entity..."
                                                    selected={autoCompletedEntities}
                                            />)
                                            }

                                            </Col>
                                            {  defaultSwitch&&<Col sm={defaultSwitch?2:1} 
                                            onClick={()=>situationsState.related_entity_id&&history.push(`../trust/${situationsState.related_entity_id}`)}    
                                            style={{ display:'flex', alignItems:'center'}}>
                                            {
                                              (situationsState.related_entity_id || situationsState.related_entity_id===0)&&defaultSwitch&&<FaExternalLinkAlt />
                                                
                                        }          </Col>
                                        }
  <Col sm={1} 
                                              style={{ display:'flex', alignItems:'center'}}>
{
                                              !defaultSwitch&&<CreateContact  isSituation={true} title={"Create Related Entity"}/>                                                
                                        }

                                              </Col>


                                            </Row>
                        </Form.Group>
                        <Form.Group as={Row}>
            <Form.Label className={"mb-3"} column sm={4} >Tags</Form.Label>
            <Col sm={8} style={{marginLeft:'-10px'}}>
{         defaultSwitch?<div>{tags.map((tag,index)=><span className="react-tags__selected-tag display-react-tags__selected-tag" key={index}>{tag.name}</span>)}</div> :<ReactTags
                ref={reactTags}
                tags={tags}
                suggestions={suggestions}
                onDelete={onDelete}
                onAddition={onAddition} 
                allowNew
                minQueryLength ={0}
                newTagText='Create new tag:'
                disabled
                />}

            </Col>
</Form.Group>
                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4} >Notes</Form.Label>
                                            <Col sm={8} style={{marginLeft:'-10px'}}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                readOnly={defaultSwitch}
                                                name="notes"
                                                value={situationsState.notes ? situationsState["notes"] : ''}
                                                onChange={handleEdit}
                                                rows={8}

                                                as='textarea'
                                                />

                                            </Col>
                        </Form.Group>
                        </Col>
                        <Col md={6}>
                   <Todo 
                        name='situation_id' 
                        defaultSwitch={defaultSwitch}
                        value={props.match.params.id} 
                        employees={employeesState}  
                        ownerId={user.user?.id} />
            </Col>
            </Row>
            </Card.Body>
            </Card>
            </Col>
            <Col>
            {/*  this is where the chatter is and the parameters are sent  */}
            <Chatter 
            isSituation={true}
            id={props.match.params.id} owner={situationsState.related_entity_id ?situationsState.related_entity_id : ''} vendor={situationsState.trust_id} changes={situationsState.changes?situationsState.changes:[]} />
            </Col>
            </Row>

                    {/* Tabs Section */}
      </>

   );
};

const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList,
    addressList:state.addressReducer.addressList,
    investorList:state.investorReducer.investorList,
    contactList:state.contactReducer.contactList
})

export default connect(mapStateToProps, {getTrusts,getContacts})(TrustSituationDetails)
