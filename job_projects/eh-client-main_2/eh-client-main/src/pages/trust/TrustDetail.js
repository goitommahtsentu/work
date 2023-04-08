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
import Datetime from 'react-datetime';
import moment from 'moment';
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';

import Gallery from '../../components/Gallery/SimpleGallery';
import NumberFormat from 'react-number-format';

// Import Tab Views
import InsuranceTabView from './tabs/TrustInsuranceTab';
import TaxTabView from './tabs/TrustTaxTab';
import OwnershipTabView from './tabs/TrustOwnershipTab';
import FamilyTabView from './tabs/TrustFamilyTab';
import BillsTabView from './tabs/TrustBillsTab';
import TrustDocumentTab from "./tabs/TrustDocumentTab";
import TrustImagesTab from './tabs/TrustImagesTab';
import MarketingTab from './tabs/TrustMarketingTab';
import SitsTab from './tabs/TrustSitsTab'
import QualTab from './tabs/TrustQualTab'
import NotesTab from './tabs/TrustNotesTab';

// no Image Found
import NoImages from '../../assets/images/trust-photo-placeholder.jpg';

// Import Chatter
import Chatter from './Chatter';

// Import Modals
import OwnershipModal from './modals/OwnershipModal';
import LoanModal from './modals/LoanModal';


import { GET_TRUST, EDIT_TRUST } from '../../store/actions';



import { Link, useHistory } from 'react-router-dom';

import {Trusts,Lanes,Contacts,Images,Addresses} from '../../services'


import fieldDateFormatter from '../../components/Custom/fieldDateFormatter';
import { Typeahead } from 'react-bootstrap-typeahead';
import {AddressField} from "../../components/Custom/editableField";

import FormControl from 'react-bootstrap/FormControl'
import { FaExternalLinkAlt } from 'react-icons/fa';
import httpService from '../../services/httpService';

import { useDispatch,connect } from 'react-redux';
import { updateTrustList } from '../../store/action_calls';
import {getNextItem,getPrevItem} from '../../utils/parsedList'
import { fetchNextData } from '../../utils/recursiveCall';

const style = {
   select: {
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      color: 'black',
      textIndent: '0px',
      textOverflow: '',
   },
};

const TrustFormView = props => {
    const history=useHistory()
   const [startDate, setStartDate] = useState(new Date());

   // This is for the Edit swtich
   const [defaultSwitch, setDefaultSwitch] = useState(true);
   const [trustState, setTrustState] = useState({});
   const [trustTabState, setTrustTabState] = useState({});
   const [trustOptionsState, setTrustOptionsState] = useState({});
   const [addressState, setAddressState] = useState([]);
   const [stageState, setStageState] = useState([]);
   const [marketingState, setMarketingState] = useState([]);
   const [imagesState, setImagesState] = useState([]);
   const [onMarketingPhotoChanges,setOnMarketingPhotoChanges]=useState(false)
   const [selected, setSelected] = useState([]);
   const [autoCompleted,setAutoCompleted]=useState([])
   const [vendorState, setVendorState] = useState([]);
   const [vendorName, setVendorName] = useState('');
 
   const dispatch=useDispatch()
const storeVendors=(vendors)=>{
    const vendorsFiltered= vendors.map(vendor=>({...vendor,full_name:vendor.contact.full_name}))
    setVendorState(prev=>[...prev,...vendorsFiltered])
}
      useEffect(()=>{
       const source=httpService.getSource()
       const getVendors=async()=>{
       const vendors=await Contacts.getVendors(source)
       if(!vendors) return
       storeVendors(vendors.results)
       fetchNextData(vendors.next,storeVendors)
       }
       getVendors()
       return () => source.cancel();
   },[])

   useEffect(()=>{
    const getVendor=async()=>{
     const id=trustState.assigned_vendor
     if(!id) return
     const vendor=await Contacts.getVendor(id)
     console.log(vendor)
     if(vendor.length===0) return
     defaultSwitch&&setAutoCompleted([{...vendor,full_name:vendor.contact.full_name}])
     setVendorName(vendor.contact.full_name)
 }
    getVendor()
},[trustState,defaultSwitch])


   const [onOwnerChange,setOwnerChange]=useState(false)
   function sortList(list) {
    return list.slice().sort((first, second) => first.sequence - second.sequence);
  }

   const [otherState, setOtherState] = useState([
      { id: 0, photo: NoImages, empty: true },
   ]);
   const [toggle, setToggle] = useState(0);

   const toggleHandler = () => {
    if(!defaultSwitch) setSelected(addressState.filter(address=>address.id===trustState.address_id))
      setDefaultSwitch(prevState => !prevState);

   };
   // for ContentEditable



 

   const newAddress = id => {
      setTrustState({
         ...trustState,
         address_id: id,
      });
   };

   const EditTrust = async(id, body,donTswitch) => {
        const data=await Trusts.updateTrust(id,body)
        if(donTswitch) return
        if(data){
            setTrustState(data)
            // dispatch(updateTrustList(data))
        }
        setDefaultSwitch(prevState => !prevState);
   };

   const getMarketingHistory = async(id) => {
        const data=await Trusts.getMarketingHistory(id)
        setMarketingState(data);
   };

   const postMarketingHistory = async(body) => {
        await Trusts.postMarketingHistory(body)
        getMarketingHistory(props.match.params.id);
        setToggle(!toggle);

   };

   const editMarketingHistory = async(id, body) => {
        await Trusts.editMarketingHistory(id,body)
        await getMarketingHistory(props.match.params.id);
        setToggle(!toggle);
   };

   const getStage = async() => {
       const data=await Lanes.getStage()
        setStageState(data);
   };

   const onEdit = id => {
      EditTrust(id, trustState);
   };

   const onMarketingChange = () => {
      if (marketingState.length > 0) {
         var last = marketingState[0];

         if (last.on_market_date === null && last.off_market_date) {
            editMarketingHistory(last.id, {
               on_market_date: moment().format('YYYY-MM-DD'),
            });
         } else if (last.off_market_date === null && last.on_market_date) {
            editMarketingHistory(last.id, {
               off_market_date: moment().format('YYYY-MM-DD'),
            });
         } else {
            postMarketingHistory({
               on_market_date: moment().format('YYYY-MM-DD'),
               trust_id: props.match.params.id,
            });
         }
      } else {
         postMarketingHistory({
            on_market_date: moment().format('YYYY-MM-DD'),
            trust_id: props.match.params.id,
         });
      }
   };

   const prevTrust = () => {
      let i = props.match.params.id;
      let id = i - 1;
      let newId=getPrevItem(id,props.trustList)
      history.push(`${newId}`)
   };

   const nextTrust = () => {
      let i = props.match.params.id;
      let id = ++i;
      let newId=getNextItem(id,props.trustList)
      history.push(`${newId}`)
   };

   const handleEdit = event => {
      const { name, value } = event.target;
      setTrustState({
         ...trustState,
         [name]: value,
      });
   };

   const handleValueChange = (event, name) => {
      const value = event.value;
      setTrustState({ ...trustState, [name]: value });
   };

   const handleDates = (event, name) => {
      setTrustState({
         ...trustState,
         [name]: moment(event._d).format('YYYY-MM-DD'),
      });
   };

   useEffect(() => {
      getMarketingHistory(props.match.params.id);
   }, [props.match.params.id]);


//    useEffect(() => {
//       (props.match.params.id&&Object.keys(props.trustList).length!=0)&&setTrustState(props.trustList[parseInt(props.match.params.id)])
//  }, [props.match.params.id,props.trustList]);

useEffect(() => {
    (async()=>{
    const data=await Trusts.getTrust(props.match.params.id)
    setTrustState(data)
    })()
}, [props.match.params.id,defaultSwitch]);

   useEffect(() => {
      getStage();
   }, []);

   useEffect(()=>{
    Object.keys(props.addressList).length!=0&&setAddressState(Object.values(props.addressList))
},[props.addressList]);

   //trustee_type.choices
   useEffect(() => {
    const source=httpService.getSource()
    const getOptions=async()=>{
      const options=await Trusts.getOptions(source)
      options&&setTrustOptionsState(options.actions?.POST?options.actions?.POST:{})
    }
    getOptions()
    return () => source.cancel();
 }, []);
   
 useEffect(()=>{
    const  getImages=async()=>{
      const data=await Images.getImagesForTrust(props.match.params.id)
      data && setImagesState(sortList(data.results));
     }
    getImages()
   },[onMarketingPhotoChanges])

   useEffect(()=>{
    const source=httpService.getSource()
    const  getTrust=async()=>{
      const data=await Trusts.getTrust(props.match.params.id,source)

      data && setTrustState(data);
     }
     if(onOwnerChange){
        getTrust()
         setOwnerChange(prev=>!prev)
     }
     return () => source.cancel();
   },[onOwnerChange,props.trustList])

   useEffect(() => {
      if (imagesState.length > 0 && !otherState.empty) {
         setOtherState([]);
         let temp = [];
         imagesState.map(data => {
            if (data.marketing_photo) {
               temp.push(data);
            }
         });
         temp.length==0?setOtherState([imagesState[0]]):setOtherState(temp);
      }
   }, [imagesState]);
  useEffect(()=>{

      return ()=>{
        if ( history.location.state?.from) {
            let state = { ...history.location.state };
            history.replace({ ...history.location,state: {...history.location.state,from:state.from}});
        }
      }
  },[])

  useEffect(()=>{
   const getTrustTab=async()=>{
       const data=await Trusts.getTrustTabs(props.match.params.id)
       data&&setTrustTabState(data)
   }
   getTrustTab()

},[props.match.params.id])
    return (
        <>
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
                                    margin:10,
                                    maxWidth: 300,
                                    maxHeight: "100%",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Gallery
                                        images={
                                            otherState.map((data, index) => {
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
                                    {/* -------------------- /api/trust/trust/ - name -------------------- */}
                                    <h2>{trustState && trustState.name}</h2>
                                    <OwnershipModal setOwnerChange={setOwnerChange} trust={trustState} id={props.match.params.id} toggle={toggle} setToggle={setToggle} />
                                    <LoanModal />
                                    <br/>

                                    <Button className=" bg-light text-dark border border-0 btn-sm" onClick={prevTrust}>prev</Button>
                                    <Button className=" bg-light text-dark border border-0 btn-sm" onClick={nextTrust}>next</Button>
                                </Col>
                                <Col className="float-right">
                                    <div className="float-right" style={{ display: "flex" }}>
                                        <div className="switch d-inline m-r-10">
                                            <Form.Label className="mr-1">On Market</Form.Label>
                                            <Form.Control
                                                type="checkbox"
                                                id="on-market"
                                                name="on_market"
                                                checked={trustState.on_market}
                                                onChange={(e) => {
                                                setTrustState({
                                                    ...trustState,
                                                    on_market:e.target.checked
                                                })

                                                EditTrust(trustState.id,{
                                                    on_market:e.target.checked
                                                },true)
                                            }
                                        }
                                            />
                                            <Form.Label htmlFor="on-market" className="cr" />
                                        </div>
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
                                            <OverlayTrigger overlay={<Tooltip>Save Edited Trust</Tooltip>} style={{ float: "right" }}>
                                                <Button className="shadow-1 theme-bg border border-0" onClick={() => onEdit(trustState.id)}>
                                                    Save
                                                </Button>
                                            </OverlayTrigger>
                                            :
                                            <OverlayTrigger overlay={<Tooltip>Create New Trust</Tooltip>} style={{ float: "right" }}>

                                                <Link to="/trust">
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
                                        {/*<Form.Group as={Row}>*/}
                                            {/*<Form.Label className={"mb-n4"} column sm={4}>Address</Form.Label>*/}
                                            <AddressField field={trustState.address_id}
                                                      addressState={addressState}
                                                      full_address={trustState.full_address}
                                                      state={trustState}
                                                      setState={setTrustState}
                                                      defaultSwitch={defaultSwitch}
                                                      newAddress={newAddress}
                                        />
                                        {/*</Form.Group>*/}
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Beneficiary/Owner</Form.Label>
                                            <Col sm={5}>
                                                {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                                {/* This is going to point to a contacts app when built */}
                                                {/* For now it is just a CharField in order to get data */}
                                                <Form.Control
                                                    readOnly={true}
                                                    name="owner"
                                                    plaintext={true}
                                                    value={trustState.owner ? trustState["owner"] : ''}
                                                    onChange={handleEdit}
                                                />

                                            </Col>
                                            <Col sm={2} 
                                            onClick={()=>trustState.owner_id&&history.push(`../contact/${trustState.owner_id}`)}    
                                            style={{marginLeft:"-20", display:'flex', alignItems:'center'}}>
                                            {
                                            defaultSwitch&&<FaExternalLinkAlt />
                                                
                                        }
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            {/* -------------------- /api/trust/trust/ - trustee -------------------- */}
                                            <Form.Label className={"mb-n5"} column sm={4}>Trustee</Form.Label>
                                            <Col sm={8}>
                                                {/* /api/trust - trustee */}
                                                <Form.Control
                                                    disabled={defaultSwitch}
                                                    plaintext={defaultSwitch}
                                                    name="trustee_type"
                                                    value={trustState.trustee_type ? trustState["trustee_type"] : ''}
                                                    onChange={handleEdit}
                                                    style={defaultSwitch ? style.select : {}}
                                                    as="select">
                                                    {trustOptionsState.trustee_type &&
                                                        trustOptionsState.trustee_type.choices.map(data => (

                                                            <option value={data.value} key={data.value}>{data.display_name}</option>
                                                        ))
                                                    }
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            {/* -------------------- /api/trust/trust/ - beneficiary_id -------------------- */}
                                            {/* This is going to point to users app */}
                                            {/* It will check for employee status of users in order to generate this group to select from */}
                                            {/* For now it is just a CharField in order to get data */}
                                            <Form.Label className={"mb-n5"} column sm={4}>EasyHomes Sales Manager</Form.Label>
                                            <Col sm={8}>
                                                {/* /api/trust - sale_manager */}
                                                <Form.Control disabled={defaultSwitch} plaintext={defaultSwitch} style={defaultSwitch ? style.select : {}} as="select">
                                                    <option>Charlotte Wallet</option>
                                                    <option>Jessica Hollingsworth</option>
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>County</Form.Label>
                                            <Col sm={8}>
                                                {/* -------------------- /api/trust/trust/ - county -------------------- */}


                                                    <Form.Control
                                                        readOnly={true}
                                                        name="county"
                                                        plaintext={true}
                                                        value={trustState.county ? trustState["county"] : ''}
                                                        onChange={handleEdit}
                                                    />


                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Lockbox code</Form.Label>
                                            <Col sm={8}>
                                                {/* -------------------- /api/trust/trust/ - lockbox -------------------- */}
                                                {defaultSwitch ?
                                                    <Form.Control
                                                        readOnly={defaultSwitch}
                                                        plaintext={defaultSwitch}
                                                        name="lockbox"
                                                        value={trustState.lockbox ? trustState["lockbox"] : ''}
                                                        onChange={handleEdit}
                                                    />
                                                    :
                                                    <Form.Control
                                                        readOnly={defaultSwitch}

                                                        plaintext={defaultSwitch}
                                                        name="lockbox"
                                                        value={trustState.lockbox ? trustState["lockbox"] : ''}
                                                        onChange={handleEdit}
                                                    />
                                                }
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row}>
                                            <Form.Label className={"mb-n5"} column sm={4}>Properties Assigned Contractor</Form.Label>
                                            <Col sm={5}>
                                                {/* -------------------- /api/trust/trust/ - assigned_vendor -------------------- */}
                                                {/* I also don't think this will be a dropdown */}
                                                 {      defaultSwitch?(
                                                     <Form.Control
                                                     readOnly={true}
                                                     plaintext={true}
                                                     name="assigned_vendor"
                                                     value={vendorName}
                                                 />
                                                 ):(<Typeahead
                                                    id="assigned_vendor"
                                                    name="assigned_vendor"
                                                    labelKey="full_name"
                                                    onChange={(vendor)=>{
                                                        vendor.length!=0&&handleEdit({target:{name:'assigned_vendor',value:vendor[0].id}})
                                                        setAutoCompleted(vendor)
                                                    }
                                                }
                                                    options={vendorState}
                                                    placeholder="Choose an entity..."
                                                    selected={autoCompleted}
                                            />)
                                        }

        
                                            </Col>
                                            <Col sm={2} 
                                               onClick={()=>trustState.assigned_vendor&&history.push(`../contact/${trustState.assigned_vendor}`)}
                                                  
                                            style={{marginLeft:"-20", display:'flex', alignItems:'center'}}>
                                            {
                                            defaultSwitch&&<FaExternalLinkAlt />
                                                
                                        }
                                            </Col>
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col md={6}>
                                    <Form.Group as={Row}>
                                        <Form.Label className={"mb-n5"} column sm={4}>Set Up & Repair Step</Form.Label>
                                        <Col sm={8}>
                                            {/* -------------------- /api/trust/trust/ - repair_stage_id -------------------- */}
                                            {/* This will pull from another place, it is a simple CharField for now */}
                                            <Form.Control
                                                disabled={defaultSwitch}
                                                plaintext={defaultSwitch}
                                                type="set_up_stage_id"
                                                name="set_up_stage_id"
                                                value={trustState.set_up_stage_id ? trustState["set_up_stage_id"] : ''}
                                                onChange={handleEdit}
                                                style={defaultSwitch ? style.select : {}}
                                                as="select">
                                                {stageState &&
                                                    stageState.map(data => (
                                                        <option value={data.id} key={data.id}>{data.stage}</option>
                                                    ))
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - trust_create_date -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Trust Creation Date</Form.Label>
                                        <Col sm={8}>
                                            {
                                                defaultSwitch ?
                                                    <Form.Control
                                                        readOnly={true}
                                                        plaintext={defaultSwitch}
                                                        dateFormat="MM-DD-YYYY"
                                                        name="trust_create_date"
                                                        value={fieldDateFormatter(trustState.trust_create_date)}
                                                    />

                                                    :
                                                    <Datetime
                                                        dateFormat="MM-DD-YYYY"
                                                        closeOnSelect={true}
                                                        timeFormat={false}
                                                        name="trust_create_date"
                                                        value={moment(trustState.trust_create_date ? trustState["trust_create_date"] : '').format("LL")}
                                                        onChange={event => handleDates(event, "trust_create_date")} />
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - purchase_date -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Purchased Date</Form.Label>
                                        <Col sm={8}>
                                            {
                                                defaultSwitch ?
                                                    <Form.Control
                                                        readOnly={true}
                                                        plaintext={defaultSwitch}
                                                        dateFormat="MM-DD-YYYY"
                                                        name="purchase_date"
                                                        value={fieldDateFormatter(trustState.purchase_date)} />
                                                    :
                                                    <Datetime
                                                        dateFormat="MM-DD-YYYY"
                                                        closeOnSelect={true}
                                                        timeFormat={false}
                                                        name="purchase_date"
                                                        value={moment(trustState.purchase_date ? trustState["purchase_date"] : '').format("LL")}
                                                        onChange={event => handleDates(event, "purchase_date")} />
                                            }


                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - deed_record_date -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Deed Recorded Date</Form.Label>
                                        <Col sm={8}>

                                            {
                                                defaultSwitch ?
                                                    <Form.Control
                                                        readOnly={true}
                                                        plaintext={defaultSwitch}
                                                        dateFormat="MM-DD-YYYY"
                                                        name="deed_record_date"
                                                        value={fieldDateFormatter(trustState.deed_record_date)} />
                                                    :
                                                    <Datetime
                                                        dateFormat="MM-DD-YYYY"
                                                        closeOnSelect={true}
                                                        timeFormat={false}
                                                        name="deed_record_date"
                                                        value={moment(trustState.deed_record_date ? trustState["deed_record_date"] : '').format("LL")}
                                                        onChange={event => handleDates(event, "deed_record_date")} />
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - investor_purchase_date -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Last Date Sold To Inv</Form.Label>
                                        <Col sm={8}>

                                                    <Form.Control
                                                        readOnly={true}
                                                        plaintext={true}
                                                        dateFormat="MM-DD-YYYY"
                                                        name="investor_purchase_date"
                                                        value={fieldDateFormatter(trustState.investor_purchase_date)} />

                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - insured_amount -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Amount Ins For</Form.Label>
                                        <Col sm={8}>
                                            {
                                                defaultSwitch ?
                                                    <NumberFormat
                                                        value={trustState.insured_amount ? trustState["insured_amount"] : ''}
                                                        readOnly={defaultSwitch}
                                                        className="form-control-plaintext"
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        onChange={handleEdit}
                                                        decimalScale={2}
                                                        name="insured_amount"
                                                    />
                                                    :
                                                    <NumberFormat
                                                        value={trustState.insured_amount ? trustState["insured_amount"] : ''}
                                                        readOnly={false}
                                                        className="form-control"
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        // Name needs to be the field that is being updated
                                                        onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='insured_amount')}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                    />
                                            }
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        {/* -------------------- /api/trust/trust/ - loan_amount -------------------- */}
                                        <Form.Label className={"mb-n5"} column sm={4}>Current Loan Amt</Form.Label>
                                        <Col sm={8}>
                                            {
                                                defaultSwitch ?
                                                    <NumberFormat
                                                        name="loan_amount"
                                                        value={trustState.loan_amount ? trustState["loan_amount"] : ''}
                                                        readOnly={defaultSwitch}
                                                        className="form-control-plaintext"
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        onChange={handleEdit}
                                                        decimalScale={2}
                                                    />
                                                    :
                                                    <NumberFormat
                                                        value={trustState.loan_amount ? trustState["loan_amount"] : ''}
                                                        readOnly={false}
                                                        className="form-control"
                                                        thousandSeparator={true}
                                                        prefix={'$'}
                                                        // Name needs to be the field that is being updated
                                                        onValueChange={(defaultValue, name) => handleValueChange(defaultValue, name='loan_amount')}
                                                        decimalScale={2}
                                                        fixedDecimalScale={true}
                                                        isNumericString={true}
                                                    />
                                            }
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    {/* Tabs Section */}
                    <Card >
                        <Card.Body style={{ boxShadow: "none !important" }}>
                            <Tabs variant="pills" defaultActiveKey="ownership" style={{ boxShadow: "none " }}>

                                {/* Ownership Tab */}
                                <Tab eventKey="ownership" title="OWNERSHIP">
                                    <OwnershipTabView setOwnerChange={setOwnerChange} trust={trustState} id={props.match.params.id} toggle={ toggle } setToggle={ setToggle }/>
                                </Tab>

                                {/* Family History Tab */}
                                <Tab eventKey="family" title="FAMILY" >
                                    <FamilyTabView trust={trustState} id={props.match.params.id} />
                                </Tab>

                        {/* Marketing Tab */}
                        <Tab eventKey="marketing" title="MARKETING">
                           <MarketingTab
                              trust={trustState}
                              id={props.match.params.id}
                              toggle={toggle}
                              setToggle={setToggle}
                           />
                        </Tab>

                        <Tab eventKey="sits" title="SITS">
                           <SitsTab
                              trust={trustState}
                              id={props.match.params.id}
                              toggle={toggle}
                              setToggle={setToggle}
                           />
                        </Tab>

                        <Tab eventKey="qual" title="QUAL">
                           <QualTab
                             id={props.match.params.id} 
                             owner={trustState.owner_id ? trustState["owner_id"] : ''} 
                             vendor={trustState.assigned_vendor}
                           />
                        </Tab>

                        {/* Taxes Tab */}
                        <Tab eventKey="taxes" title="TAXES">
                           <TaxTabView
                              trust={trustState}
                              id={props.match.params.id}
                           />
                        </Tab>

                        {/* Insurance Tab */}
                        <Tab eventKey="insurance" title="INSURANCE">
                           <InsuranceTabView
                              trustOptions={trustOptionsState}
                              trust={trustState}
                              id={props.match.params.id}
                           />
                        </Tab>

                        {/* Other Bills */}
                        <Tab eventKey="bills" title="OTHER BILLS">
                           <BillsTabView
                              trust={trustState}
                              id={props.match.params.id}
                           />
                        </Tab>

                        {/* Documents Tab */}
                        <Tab eventKey="documents" title="DOCUMENTS">
                     { Object.keys(trustState).length !== 0 && <TrustDocumentTab
                              trust={trustState}
                              id={props.match.params.id}
                              owner={`${trustState.owner_id}`}
                              
                              // owner={trustState.owner_id ? trustState["owner_id"] : null }
                           />
                           }
                        </Tab>

                        {/* Images Tab */}
                        <Tab eventKey="images" title="IMAGES">
                           { Object.keys(trustState).length !== 0 && <TrustImagesTab
                              trust={trustState}
                              id={props.match.params.id}
                              owner={`${trustState.owner_id}`}
                              setOnMarketingPhotoChanges={setOnMarketingPhotoChanges}
                              // owner={trustState.owner_id ? trustState["owner_id"] : null }
                           />
                           }
                        </Tab>

                        {/* Notes Tab */}
                        <Tab eventKey="notes" title="NOTES">
                           <NotesTab
                              trust={trustState}
                              id={props.match.params.id}
                           />
                        </Tab>
                     </Tabs>
                  </Card.Body>
               </Card>
            </Col>
            {/*  this is where the chatter is and the parameters are sent  */}
            <Chatter id={props.match.params.id} owner={trustState.owner_id ? trustState["owner_id"] : ''} vendor={trustState.assigned_vendor} changes={trustState.changes} />
         </Row>
      </>

   );
};

const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList,
    addressList:state.addressReducer.addressList
})

export default connect(mapStateToProps, null)(TrustFormView)
