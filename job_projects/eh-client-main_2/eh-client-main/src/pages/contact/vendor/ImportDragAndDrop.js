import React,{useEffect,useState} from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
import {Button} from 'react-bootstrap';
import {Contacts } from '../../../services'
import { useDispatch} from 'react-redux';
import {updateContactList} from '../../../store/action_calls'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function formatPhoneNumber(phoneNumberString) {
  if(phoneNumberString.trim()[0]=="+") return "+" + phoneNumberString.replace(/\D/g,'')
  let parsedPhone=phoneNumberString.replace(/\D/g,'')
  return parsedPhone[0]==1?"+"+parsedPhone:"+1"+parsedPhone;
}
function checkPhoneFormat(phone){
  return /^[\+][0-9]{10,11}$/im.test(phone)
}


export default function ImportDragAndDrop({handleClickListner,trustList,isFamily=false,isInvestor=false,isFamilyLead=false,isInvestorLead=false,reloadPage}) {
  const [rowData,setRowdata]=useState([])
  const dispatch=useDispatch()



const handleStart=({ file, fields, columns, skipHeaders }) => {
  // optional, invoked when user has mapped columns and started import
  // prepMyAppForIncomingData();
}

const handleProcessChunck=async(rows, { startIndex }) => {
     setRowdata([...rowData,...rows])
}

const storeData=async()=>{
  
  for (let row of rowData) {
    if(Object.values(row).every(i=>i=="")) continue
    const contactData={...row,family_bool:isFamily,investor_bool:isInvestor,family_lead_bool:isFamilyLead,investor_lead_bool:isInvestorLead}
    if(contactData.text_phone){
      contactData.text_phone=formatPhoneNumber(contactData.text_phone)
    }
    // if(!contactData.text_phone){
    //   delete contactData.text_phone
    // }
    const data=await Contacts.createContact(contactData)
    if(typeof data === 'string' || data instanceof String) {
        toast.error(" "+data+" \n "+checkPhoneFormat(contactData.text_phone)?"Phone Formate Should be +1##########  Format":'', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
        continue
      }
      data&&dispatch(updateContactList(data))
  }
  reloadPage&&reloadPage()
}

const handleComplete=({ file, preview, fields, columnFields }) => {
  // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
  // showMyAppToastNotification();
  // console.log('rows',{fields,columnFields,preview,file})
  // console.log('close')
  if(rowData.length!=0){
    storeData()
  }
  handleClickListner&&handleClickListner()
}

const handleClose=({ file, preview, fields, columnFields }) => {
  // optional, invoked when import is done and user clicked "Finish"
  // (if this is not specified, the widget lets the user upload another file)
  // goToMyAppNextPage();
  console.log('close')
  handleClickListner&&handleClickListner()
}

useEffect(()=>{
 let importButton=document.querySelector('.CSVImporter_ImporterFrame__footerSecondary .CSVImporter_TextButton')
 if(!importButton)  return
 importButton.style.display='block'
 const buttontexts= document.querySelectorAll('.CSVImporter_TextButton')
 for(let butext in buttontexts){
   if(buttontexts[butext].innerText=='Finish'){
    buttontexts[butext].style.display='none'
   }
 }
 importButton.innerText='Done'

},[document.querySelector('.CSVImporter_ImporterFrame__footerSecondary .CSVImporter_TextButton')])

  return <div >
<Importer
  assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
  restartable={true} // optional, lets user choose to upload another file when import is complete
  onStart={handleStart}
  processChunk={handleProcessChunck}
  onComplete={handleComplete}
  onClose={handleClose}
>
  <ImporterField name="first_name" label="First name" />
  <ImporterField name="last_name" label="Last name" />
  <ImporterField name="company" label="Company" optional/>
  <ImporterField name="primary_email" label="Email" optional />
  <ImporterField name="text_phone" label="Phone" optional />

  <ImporterField name="family_bool" label="Family" optional/>
  <ImporterField name="family_lead_bool" label="Family Lead" optional/>
  <ImporterField name="investor_bool" label="Investor" optional/>
  <ImporterField name="investor_lead_bool" label="Investor Lead" optional/>

  <ImporterField name="vendor_bool" label="Vendor" optional/>
  <ImporterField name="contractor_bool" label="Contractor" optional/>
  <ImporterField name="prop_source_bool" label="Prop Source" optional/>
  <ImporterField name="company_bool" label="Company" optional/>
  <ImporterField name="ambassador_bool" label="Ambassador" optional/>

  <ImporterField name="street_1" label="Street 1" optional />
  <ImporterField name="street_2" label="Street 2" optional />
  <ImporterField name="city" label="City" optional />
  <ImporterField name="county" label="County" optional />
  <ImporterField name="zipcode" label="Zipcode" optional />
  <ImporterField name="state" label="State" optional />
  <ImporterField name="country" label="Country" optional />
  <ImporterField name="latitude" label="Latitude" optional />
  <ImporterField name="longitude" label="Longitude" optional />
</Importer>
<ToastContainer />
  </div>;
}
