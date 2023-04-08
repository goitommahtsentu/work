import React,{useEffect,useState} from 'react';
import { Importer, ImporterField } from 'react-csv-importer';
import 'react-csv-importer/dist/index.css';
import {Button} from 'react-bootstrap';
import {Trusts } from '../../services'
import { useDispatch} from 'react-redux';
import {updateTrustList} from '../../store/action_calls'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ImportDragAndDrop({handleClickListner,trustList}) {
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
    const data=await Trusts.createTrustImport(row)
    if(!data) {
      toast.error("Duplicate Trust "+row.name, {
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
  const trust=await Trusts.getTrust(data.trust_id)
  trust&&dispatch(updateTrustList(trust))
  }
}

const handleComplete=({ file, preview, fields, columnFields }) => {
  // optional, invoked right after import is done (but user did not dismiss/reset the widget yet)
  // showMyAppToastNotification();
  // console.log('rows',{fields,columnFields,preview,file})
  // console.log('close')
  if(rowData.length!==0){
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

  return <div >
<Importer
  assumeNoHeaders={false} // optional, keeps "data has headers" checkbox off by default
  restartable={true} // optional, lets user choose to upload another file when import is complete
  onStart={handleStart}
  processChunk={handleProcessChunck}
  onComplete={handleComplete}
  onClose={handleClose}
>
  <ImporterField name="name" label="Name"/>
  <ImporterField name="street_1" label="Street 1" optional />
  <ImporterField name="street_2" label="Street 2" optional />
  <ImporterField name="city" label="City" optional />
  <ImporterField name="county" label="County" optional />
  <ImporterField name="zipcode" label="Zipcode" optional />
  <ImporterField name="state" label="State" optional />
  <ImporterField name="country" label="Country" optional />
  <ImporterField name="latitude" label="Latitude" optional />
  <ImporterField name="longitude" label="Longitude" optional />
  <ImporterField name="lockbox" label="Lockbox" optional />
  <ImporterField name="purchase_date" label="Purchase Date" optional />
  <ImporterField name="insurance_company" label="Insurance Company" optional />
  <ImporterField name="insured_amount" label="Insured Amount" optional />
  <ImporterField name="daily_insurance_rate" label="Daily Insurance Rate" optional />
  <ImporterField name="policy_number" label="Policy Number" optional />
  <ImporterField name="prop_pres_notes" label="Prop Pres Notes" optional />
  <ImporterField name="easy_homes_notes" label="Easy Homes Notes" optional />
  <ImporterField name="property_description" label="Property Description" optional />
  <ImporterField name="qual_home" label="qual Home" optional />
  <ImporterField name="sold_to_investor" label="Sold To Investor" optional />
  <ImporterField name="on_market" label="On Market" optional />
  <ImporterField name="trustee_type" label="Trustee Type" optional />
  <ImporterField name="sale_manager_id" label="Sale Manager Id" optional />
  <ImporterField name="loan_amount" label="Loan Amount" optional />
  <ImporterField name="land_contract_name_id" label="Land Contract Name id" optional />
  <ImporterField name="eh_list_price" label="EH Price" optional/>
  <ImporterField name="investor_price" label="Investor Price" optional />
  <ImporterField name="arv" label="Average" optional />
  <ImporterField name="trust_create_date" label="Trust create date" optional />
  <ImporterField name="eh_purchase_price" label="EH purchase price" optional />
  <ImporterField name="investor_purchase_date" label="Investor purchase date" optional />
  <ImporterField name="pi_approved_price" label="PI approved price" optional />
  <ImporterField name="deed_record_date" label="Deed record date" optional />
  <ImporterField name="warranty" label="Warranty" optional />

</Importer>

<ToastContainer />
  </div>;
}
