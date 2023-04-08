import React, { useState, useEffect, useRef } from 'react';
import {
   Row,
   Col,
   Card,
   Button,
   Form,
   Tab,
   Tabs,
   OverlayTrigger,
   Tooltip,
} from 'react-bootstrap';
import { DropzoneComponent } from 'react-dropzone-component';
import EditedCropper from '../../../views/extensions/EditedCropper';
import Gallery from '../../../components/Gallery/SimpleGallery';

import _ from 'lodash'

import NoImages from '../../../assets/images/trust-photo-placeholder.jpg';

// Import API Server
import { API_SERVER } from '../../../config/constant';

// Import Endpoints
import { imagesUrl, trustUrl } from '../../../config/Endpoints';
import {Images} from '../../../services';

import { ListManager } from "react-beautiful-dnd-grid";
import {fetchNextData} from '../../../utils/recursiveCall'
const getWindowDimensions=()=> {
   const { innerWidth: width } = window;
   return {
     width
   };
 }
// select max items for the drag and drop based on the screensize
 const getMaxItems=()=>{
   const {width}=getWindowDimensions()
   console.log(width,'for pc size')
   if(width<576){
      return 1
   } else if(width>=576 && width<768){
      return 2
   } else if(width>=768 && width<992){
      return 3
   }  
   else if( width>=992 && width<1200){
      return 3
   }
   else if( width>=1200 && width<1400){
      return 3
   }
   else{
      return 5
   }
 }
 

const TrustImagesTab = props => {
   const [imageSate, setImageState] = useState([]);
   const [marketingImageState, setMarketingImageState] = useState([]);
   const [damageImageState, setDamageImageState] = useState([]);
   const [currentCropeImage,setCurrentCropeImage]=useState(null)
   const [maxItems, setMaxItems] = useState(3);
   //this is for displaying the image

   useEffect(()=>{
      setMaxItems(getMaxItems())
      window.addEventListener('resize',()=>setMaxItems(getMaxItems()))
   },[])
const storeImageResults=(images)=>{
   const allImages=sortList(images)
      setImageState([...imageSate,...allImages]);
}
   const getImages = async(id) => {
      const data=await Images.getImagesForTrust(id)
      if(!data) return
      storeImageResults(data.results)
      fetchNextData(data.next,storeImageResults)

   };

   useEffect(() => {
         getImages(props.id);
      },[props.id]);


      
      useEffect(() => {
         
         let marketingSate = [];
         let damageSate=[];
         if (imageSate.length > 0) {
            imageSate.map(data => {
               if (data.marketing_photo) {
                  marketingSate.push(data);
               }else if (data.damage_photo) {
                  damageSate.push(data);
               }
            });
            const marketingData=sortList(marketingSate)
            setMarketingImageState(marketingData)
            const damageData=sortList(damageSate)
            setDamageImageState(damageData)
         }
      },[imageSate]);
      
      
      function sortList(list) {
         return list.slice().sort((first, second) => first.sequence - second.sequence);
       }
 

   const handleUpdate = async(body, id) => {
      let formData = new FormData();
      for (let key in body) {
         formData.append(key, body[key]);
      }
      if(Object.keys(body).length==1 && !('sequence' in body)) formData.append('sequence',0);
      const data=await Images.updateImageForTrust(id,formData)
      if("marketing_photo" in body) props.setOnMarketingPhotoChanges(prev=>!prev)
      if(Object.keys(body).length>1 &&('sequence' in body)) return
      if(data) setImageState(prev=>[...prev.map(image=>image.id==id?data:image)])
   };



   const simpleCallBack = async (file, body, id) =>{
      console.log("New image Created For Trust Id", props.trust, props.owner, file)
       const owner = props.owner
      // console.log(props.id)
      const bodyFormData = new FormData();
      bodyFormData.append('trust_id', props.id);
      if(props.owner<1) return  bodyFormData.append('contact_id', props.owner), console.log("contact_id",props.owner)
      bodyFormData.append('photo', file);
      bodyFormData.append('name', file.name);
      let data=await Images.uploadImageForTrust(bodyFormData)
      if(data) setImageState(prev=>[...prev,data])
      console.log('destroy image')
      myDropzone.removeAllFiles()
   };

   const handleCropChange=(oldData,newData)=>{
      setCurrentCropeImage(null)
      if(oldData==null && newData==null) return
      const tmpData={...newData}
      if(newData){
         if(oldData.marketing_photo){
            tmpData.marketing_photo=true
           handleUpdate(
            {
               sequence: oldData.sequence,
               marketing_photo: true
            },
            oldData.id
         )
         }else if(oldData.damage_photo){
            tmpData.damage_photo=true
           handleUpdate(
            {
               sequence: oldData.sequence,
               damage_photo: true
            },
            oldData.id
         )
         }
         setImageState(prev=>[...prev.map(image=>image.id!=tmpData.id?image:tmpData)])
         setCurrentCropeImage(null)
      } 
      // getImages(props.id)

   }

   var myDropzone;
   const initCallback =(dropzone)=> {
      myDropzone = dropzone;
  }

const eventHandlers = {
          addedfile: simpleCallBack,
          init: initCallback
  }

   // Needed for file upload component
   const djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif',
      autoProcessQueue: false,
      // uploadprogress: 100,
      params: {
         trust_id: `${props.trust && props.trust.id}`,
         // photo: file
      },
   };

   const componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: `${API_SERVER}${imagesUrl}`,
   };



     const  onDragEndForMarketing=(fromIndex, toIndex)=> {
        const data = [...marketingImageState];
        data[fromIndex].sequence=toIndex
        data[toIndex].sequence=fromIndex
        handleUpdate(
           {
              sequence: fromIndex,
              marketing_photo: true
           },
           data[toIndex].id
        )
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        handleUpdate(
         {
            sequence: toIndex,
            marketing_photo: true
         },
         item.id
      )
      setMarketingImageState(data)
      }


      const  onDragEndForDamage=(fromIndex, toIndex)=> {
         const data = [...damageImageState];
         data[fromIndex].sequence=toIndex
         data[toIndex].sequence=fromIndex
         handleUpdate(
            {
               sequence: fromIndex,
               damage_photo: true
            },
            data[toIndex].id
         )
         const item = data.splice(fromIndex, 1)[0];
         data.splice(toIndex, 0, item);
         handleUpdate(
          {
             sequence: toIndex,
             damage_photo: true
          },
          item.id
       )
       setDamageImageState(data)
       }


       const  onDragEndForAll=(fromIndex, toIndex)=> {
         const data = [...imageSate];
         data[fromIndex].sequence=toIndex
         data[toIndex].sequence=fromIndex
         handleUpdate(
            {
               sequence: fromIndex,
               marketing_photo: data[fromIndex].marketing_photo,
               damage_photo:data[fromIndex].damage_photo
            },
            data[toIndex].id
         )
         const item = data.splice(fromIndex, 1)[0];
         data.splice(toIndex, 0, item);
         handleUpdate(
          {
             sequence: toIndex,
             marketing_photo: data[toIndex].marketing_photo,
             damage_photo:data[toIndex].damage_photo
          },
          item.id
       )
       setImageState(data)
       }

const handleDelete=async(id)=>{
   const data=await Images.deleteImage(id)
   setImageState(prev=>[...prev.filter(item=>item.id!=id)])
}
   const ListElement=({item,handleUpdate,allImages,handleDelete})=>{
      const [hovered,setHovered]=useState(false)
      let startIndex=_.findIndex(allImages,item)
      return(
      <>
      <Col
         // xl={3}
         // md={4}
         // className="m-4 dragParent"
         style={{
            width: "800%",
            maxHeight: "100%",
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom:'1em'
         }}
      >
         <Gallery
            images={
                  allImages.map((data) => {
                      if (data.id === item.id) {
                          return ({ src: data.photo, thumbnail: data.photo, useForDemo: true })
                      } else {
                          return ({ src: data.photo })
                      }
                  })
              }
            startIndex={startIndex}
            backdropClosesModal
            singleItem
         />

            <span
               className={'mb-1'}
               style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 10,
               }}
            >
               <button className="btn btn-icon mx-n1" onClick={() => handleDelete(item.id)}>
               <OverlayTrigger
                     overlay={
                        <Tooltip>
                           Delete Image
                        </Tooltip>
                     }
                  >
               <i 
                  style={{
                     textShadow:" 0 0 5px grey"
                  }}
               className="fa fa-fw text-white fa-trash fa-lg " />
               </OverlayTrigger>
                   </button>               
               {/*This launches the crop function in a modal so the user can crop the photo, when marking crop as done the image will be replaced with the cropped version.*/}
               <button className="btn btn-icon mx-n1" onClick={() => setCurrentCropeImage(item)}>
               <OverlayTrigger
                     overlay={
                        <Tooltip>
                           Crop Image
                        </Tooltip>
                     }
                  >
               <i
                  style={{
                     textShadow:" 0 0 5px grey"
                  }}
               className="fa fa-fw text-white fa-crop-alt fa-lg " />

               </OverlayTrigger>
                   </button>
               {/*this marks a boolean stored in relation to the photo that this is a marketing photo*/}
               <button
                  className="btn btn-icon mx-n1"
                  onClick={() =>
                     handleUpdate(
                        {
                           marketing_photo: !item.marketing_photo,
                        },
                        item.id
                     )
                  }
               >
                  <OverlayTrigger
                     overlay={
                        <Tooltip>
                           Mark as marketing photo
                        </Tooltip>
                     }
                  >
                     <i
                        style={{
                           textShadow:" 0 0 5px grey"
                        }}
                        className={
                           item.marketing_photo
                              ? 'fa fa-fw text-c-blue fa-laptop fa-lg'
                              : 'fa fa-fw text-white fa-laptop fa-lg'
                        }
                     />
                  </OverlayTrigger>
               </button>
               {/*This marks a boolean in relation to the photo called "Shows Damage"*/}
               <button
                  className="btn btn-icon ml-n1"
                  onClick={() =>
                     handleUpdate(
                        {
                           damage_photo: !item.damage_photo,
                        },
                        item.id
                     )
                  }
               >
                  <OverlayTrigger
                     overlay={
                        <Tooltip>
                           Mark as showing damage
                        </Tooltip>
                     }
                  >
                     <i
                     style={{
                        textShadow:" 0 0 5px grey"
                     }}
                        className={
                           item.damage_photo
                              ? 'fa fa-fw text-c-blue fa-house-damage fa-lg'
                              : 'fa fa-fw text-white fa-house-damage fa-lg'
                        }
                     />
                  </OverlayTrigger>
               </button>
            </span>
            <i 
            
            style={{
               position: 'absolute',
               top: 13 ,
               right: 25,
               cursor:'move',
               textShadow:" 0 0 5px grey",
               ":hover":{
                  textShadow:"none",
               }
            }}
            onMouseOver={()=>setHovered(true)}
            onMouseOut={()=>setHovered(false)}
            onDragStart={()=>setHovered(true)}
            className={hovered?"fas text-c-blue fa-arrows-alt fa-lg":"fas text-white fa-arrows-alt fa-lg"}
            />
        
      </Col>
            </>

      )
   }

   return (
      <React.Fragment>
         <Row>
            <Col>
               <Card.Header>
                  <Card.Title as="h5">Trust Images</Card.Title>
               </Card.Header>
               <Card.Body>
                     {
                     currentCropeImage&&<EditedCropper directly={true} photo={currentCropeImage}  onImageCropped={handleCropChange} />

                  }
                  <Tabs defaultActiveKey="all" className="mb-4">
                     {/* This shows all photos related to this property */}
                     <Tab eventKey="all" title="ALL">
                  
                        <Row >                           
                           {
                           imageSate.length > 0 ? (
                           <ListManager
                              items={imageSate}
                              direction="horizontal"
                              maxItems={maxItems}
                              render={item => <ListElement  
                                 allImages={imageSate}                           
                                 item={item}
                                 handleUpdate={handleUpdate}
                                 handleCropChange={handleCropChange}
                                 handleDelete={handleDelete}
                                 />}
                              onDragEnd={onDragEndForAll}

                              />
                              ) : (
                           <img
                           src={NoImages}
                           alt="No image found"
                           width="200"
                           height="300"
                           />
                           )}
                              </Row>
                     </Tab>
                     {/* This shows all photos with the marketing boolean active */}
                     <Tab eventKey="marketing" title="MARKETING">
                  
                        <Row >                           
                           {
                           marketingImageState.length > 0 ? (
                           <ListManager
                              items={marketingImageState}
                              direction="horizontal"
                              maxItems={maxItems}
                              render={item => <ListElement  
                                 allImages={marketingImageState}                               
                                 item={item}
                                 handleUpdate={handleUpdate}
                                 handleCropChange={handleCropChange}
                                 handleDelete={handleDelete}
                                 />}
                              onDragEnd={onDragEndForMarketing}

                              />
                              ) : (
                           <img
                           src={NoImages}
                           alt="No image found"
                           width="200"
                           height="300"
                           />
                           )}
                              </Row>
                </Tab>
                     {/* This shows all photos with the damage Boolean Active */}
                     <Tab eventKey="damage" title="DAMAGE">
                        <Row >                           
                           {
                           damageImageState.length > 0 ? (
                           <ListManager
                              items={damageImageState}
                              direction="horizontal"
                              maxItems={maxItems}
                              render={item => <ListElement  
                                 allImages={damageImageState}                               
                                 item={item}
                                 handleUpdate={handleUpdate}
                                 handleCropChange={handleCropChange}
                                 handleDelete={handleDelete}
                                 />}
                              onDragEnd={onDragEndForDamage}

                              />
                              ) : (
                           <img
                           src={NoImages}
                           alt="No image found"
                           width="200"
                           height="300"
                           />
                           )}
                              </Row>
                     </Tab>
                  </Tabs>
               </Card.Body>
            </Col>
         </Row>

         {/* File Upload */}
         <Row>
            <Col>
               <Card.Header>
                  <Card.Title as="h5">File Upload</Card.Title>
               </Card.Header>
               <Card.Body>
                  <DropzoneComponent
                     config={componentConfig}
                     eventHandlers={eventHandlers}
                     djsConfig={djsConfig}
                  />
               </Card.Body>
            </Col>
         </Row>
      </React.Fragment>
   );
};

export default TrustImagesTab;
