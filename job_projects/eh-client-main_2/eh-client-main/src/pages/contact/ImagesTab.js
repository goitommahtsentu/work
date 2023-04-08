import React, { useState, useEffect } from 'react';
import {
   Row,
   Col,
   Card,
   Tab,
   Tabs,
   OverlayTrigger,
   Tooltip,
} from 'react-bootstrap';
import { DropzoneComponent } from 'react-dropzone-component';
import EditedCropper from '../../views/extensions/EditedCropper';
import Gallery from '../../components/Gallery/SimpleGallery';

import _ from 'lodash'

import NoImages from '../../assets/images/person-photo-placeholder.jpg';

// Import API Server
import { API_SERVER } from '../../config/constant';

// Import Endpoints
import { contactImagesUrl } from '../../config/Endpoints';
import {Images} from '../../services';

import { ListManager } from "react-beautiful-dnd-grid";
import { fetchNextData } from '../../utils/recursiveCall';


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
   const [contactImageState, setContactImageState] = useState([]);
   const [currentCropeImage,setCurrentCropeImage]=useState(null)
   const [maxItems, setMaxItems] = useState(3);
   useEffect(()=>{
      setMaxItems(getMaxItems())
      window.addEventListener('resize',()=>setMaxItems(getMaxItems()))
   },[])


   const storeImageResults=(images)=>{
      const allImages=sortList(images)
         setImageState([...imageSate,...allImages]);
   }

   const getImages = async(id) => {
      const data=await Images.getImagesForContact(id)
      if(!data) return
      storeImageResults(data.results)
      fetchNextData(data.next,storeImageResults)
   };

   useEffect(() => {
         getImages(props.id);
      },[]);


      
      useEffect(() => {
         
         let contactSate = [];
         if (imageSate.length > 0) {
            imageSate.map(data => {
               if (data.contact_photo) {
                  contactSate.push(data);
               }
            });
            const contactData=sortList(contactSate)
            setContactImageState(contactData)
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
      if("contact_photo" in body) props.setOnContactPhotoChanges(prev=>!prev)
      if(Object.keys(body).length>1 &&('sequence' in body)) return
      if(data) setImageState(prev=>[...prev.map(image=>image.id==id?data:image)])
   };


   const simpleCallBack = async (file, body, id) =>{
      console.log("New image Created For Trust Id", file.name, file.height, file)
      // console.log(props.id)
      const bodyFormData = new FormData();
      bodyFormData.append('contact_id', props.id);
      bodyFormData.append('photo', file);
      bodyFormData.append('name', file.name);
      let data=await Images.uploadImageForContact(bodyFormData)
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
         contact_id: `${props.contact && props.contact.id}`,
         // photo: file
      },
   };

   const componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: `${API_SERVER}${contactImagesUrl}`,
   };



     const  onDragEndForContact=(fromIndex, toIndex)=> {
        const data = [...contactImageState];
        data[fromIndex].sequence=toIndex
        data[toIndex].sequence=fromIndex
        handleUpdate(
           {
              sequence: fromIndex,
              contact_photo: true
           },
           data[toIndex].id
        )
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        handleUpdate(
         {
            sequence: toIndex,
            contact_photo: true
         },
         item.id
      )
      setContactImageState(data)
      }



       const  onDragEndForAll=(fromIndex, toIndex)=> {
         const data = [...imageSate];
         data[fromIndex].sequence=toIndex
         data[toIndex].sequence=fromIndex
         handleUpdate(
            {
               sequence: fromIndex,
               marketing_photo: data[fromIndex].marketing_photo,
               contact_photo: data[fromIndex].contact_photo,
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
             damage_photo:data[toIndex].damage_photo,
             contact_photo:data[toIndex].contact_photo
          },
          item.id
       )
       setImageState(data)
       }

const handleDelete=async(id)=>{
   const data=await Images.deleteImageForContact(id)
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

                       <button
                  className="btn btn-icon mx-n1"
                  onClick={() =>
                     handleUpdate(
                        {
                           contact_photo: !item.contact_photo,
                        },
                        item.id
                     )
                  }
               >
                  <OverlayTrigger
                     overlay={
                        <Tooltip>
                           Mark as contact photo
                        </Tooltip>
                     }
                  >
                     <i
                        style={{
                           textShadow:" 0 0 5px grey"
                        }}
                        className={
                           item.contact_photo
                              ? 'fa fa-fw text-c-blue fa-user fa-lg'
                              : 'fa fa-fw text-white fa-user fa-lg'
                        }
                     />
                  </OverlayTrigger>
               </button>               
               {/*This launches the crop function in a modal so the user can crop the photo, when marking crop as done the image will be replaced with the cropped version.*/}
               <button className="btn btn-icon ml-n1" onClick={() => setCurrentCropeImage(item)}>
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
         <Tab eventKey="contact" title="Contact">
                  
                  <Row >                           
                     {
                     contactImageState.length > 0 ? (
                     <ListManager
                        items={contactImageState}
                        direction="horizontal"
                        maxItems={maxItems}
                        render={item => <ListElement  
                           allImages={contactImageState}                           
                           item={item}
                           handleUpdate={handleUpdate}
                           handleCropChange={handleCropChange}
                           handleDelete={handleDelete}
                           />}
                        onDragEnd={onDragEndForContact}

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
