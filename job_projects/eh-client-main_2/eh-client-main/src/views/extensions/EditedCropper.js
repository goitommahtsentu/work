import React, { useState, useCallback, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
// prettier-ignore
import {Row, Col, Button, Modal, OverlayTrigger, Tooltip} from 'react-bootstrap';
// import Cropper from 'react-cropper'; // Old cropper library
import Cropper from 'react-easy-crop'; // New cropper library
import 'cropperjs/dist/cropper.css';
import axios from 'axios';

import { API_SERVER } from '../../config/constant';
import { imagesUrl } from '../../config/Endpoints';
import getCroppedImg from './cropImage.js';

const EditedCropper = (data) => {
   const {directly}=data
   const [image, setImage] = useState();
   const [isLarge, setIsLarge] = useState(directly);
   const [disable, setDisable] = useState(false);

   const [crop, setCrop] = useState({ x: 0, y: 0 });
   const [rotation, setRotation] = useState(0)
   const [zoom, setZoom] = useState(1);
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
   const resetSate=()=>{
      data.onImageCropped(null,null)
      setRotation(0)
      setImage(null)
      setIsLarge(false)
      setDisable(false)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
   }
   const updateConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

   // const refreshImage = () => {
   //    console.log('In refreshImage');
   //    axios({ method: 'get', url: `${API_SERVER}${imagesUrl}${data.photo.id}` })
   //       .then(res => setImage(res.data.photo))
   //       .catch(err => console.log(err));
   // };

   const refreshImage = () => {
      console.log('In refreshImage');
      axios({ method: 'get', url: `${API_SERVER}${imagesUrl}${data.photo.id}` })
         .then(res => setImage(res.data.photo))
         .catch(err => console.log(err));
   };

   useEffect(() => {
      refreshImage();
   }, [refreshImage]);

   // const getCropData = () => {
   //    if (typeof cropper !== 'undefined') {
   //       setCropData(cropper.getCroppedCanvas().toDataURL());
   //       console.log(cropper);
   //       updateImage(cropData);
   //       console.log(cropData);
   //    } else {
   //       alert('File Not Saved');
   //    }
   //    setIsLarge(false);
   // };

   const updateImage = async(photo) => {
      const formData = await base64ToFile(photo);
      const {data:newImage} = await  axios.put(`${API_SERVER}${imagesUrl}${data.photo.id}/`,formData,updateConfig)
     return newImage
   };
   const handleCropChange = crop => setCrop(crop);
   const handleZoomChange = zoom => setZoom(zoom);

   const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
   }, []);

   const handleSave = async function () {
      try {
         setDisable(true)
         const croppedImgUrl = await getCroppedImg(image, croppedAreaPixels,rotation);
         const newImage= await updateImage(croppedImgUrl)
         setImage(croppedImgUrl);
         setCrop({ x: 0, y: 0 })
         // setIsLarge(false)
         resetSate()
         data.onImageCropped(data.photo,newImage)
      } catch (err) {
         console.log('ERR: ', err);
      }
   };

   // const base64ToFile = async(blobUrl) => {
   //    let blob = await fetch(blobUrl).then(r => r.blob());
   //    console.log('blob',blob)
   //          const fd = new FormData();
   //          // const file = new File([blob], data.photo.name,{type: "image/png"});
           
   //          // // console.log('photo', file);
   //          // // console.log(data.photo.name)
   //          // // // console.log(fd);
   //          // console.log('dataURL',file);
            
            
   //    const blobToData = (blob) => {
   //             return new Promise((resolve) => {
   //               const reader = new FileReader()
   //               reader.onloadend = () => resolve(reader.result)
   //               reader.readAsDataURL(blob)
   //             })
   //           }

   //          let dataUrl=await blobToData(blob);
   //          console.log(dataUrl)
   //          fd.append('photo', blob,data.photo.name);
   //          fd.append('dataURL', dataUrl);
   //          return fd;
   // };

    const base64ToFile = async(blobUrl) => {
      let blob = await fetch(blobUrl).then(r => r.blob());
      const fd = new FormData();
      const checkFileExtention=(fileName)=>{
         console.log(fileName?.lastIndexOf('.'))
         if(fileName)
         {
            if(fileName.includes("undefined")) 
            {
              fileName.replace('undefined',''+new Date())
              }
            return fileName.lastIndexOf('.')!==-1?fileName:fileName+".jpg"
         }
         return ''+new Date()+'.jpg'
      }
      const file = new File([blob],checkFileExtention(data.photo.name),{type:'image/jpg'});
      fd.append('name',data.photo.photo.name)
      fd.append('photo', file);
      const blobToData = (blob) => {
         return new Promise((resolve) => {
         const reader = new FileReader()
         reader.onloadend = () => resolve(reader.result)
         reader.readAsDataURL(blob)
         })
      }
      let cropData= await blobToData(blob);
      fd.append('dataURL', cropData);
      // fd.append('marketing_photo',data.photo.marketing_photo)
      // fd.append('damage_photo',data.photo.damage_photo)
      return fd;
   };


   


   // const base64ToFile = async(base64) => {
   //    fetch(base64)
   //       .then(res => res.blob())
   //       .then(async(blob) => {
   //          const fd = new FormData();
   //          const file = new File([blob], data.photo.name);
   //          console.log('photo', file);
   //          fd.append('photo', file);
   //          console.log(fd);
   //                const blobToData = (blob) => {
   //             return new Promise((resolve) => {
   //               const reader = new FileReader()
   //               reader.onloadend = () => resolve(reader.result)
   //               reader.readAsDataURL(blob)
   //             })
   //           }
   //         let cropData= await blobToData(blob);
   //          console.log('dataURL', cropData);
   //          fd.append('dataURL', cropData);
   //          console.log('fd', fd);
   //          return fd;
   //       });
   // };



   return (
      <React.Fragment>
         {directly===false&&(<button className="btn btn-icon" onClick={() => setIsLarge(true)}>
            <OverlayTrigger overlay={<Tooltip>Crop image</Tooltip>}>
               <i className="fa fa-fw text-white fa-crop-alt fa-2x " />
            </OverlayTrigger>
         </button>)
          }
         <Modal style={{zIndex:10000}} size="md" show={isLarge} onHide={() => {
            resetSate()
            }}
             backdrop="static">
            <Modal.Header closeButton>
               <Modal.Title as="h5">Crop Image</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '70vh' }}>
               <div
                  style={{
                     position: 'relative',
                     minHeight: '100%',
                     minWidth: '100%',
                  }}
               >
                  <Cropper
                     image={image}
                     crop={crop}
                     zoom={zoom}
                     rotation={rotation}
                     aspect={4 / 3}
                     onCropChange={handleCropChange}
                     onZoomChange={handleZoomChange}
                     onCropComplete={handleCropComplete}
                  />
               </div>
               <div>
               <div className="controls">
                  <span>Crop</span> 
                  <Slider
                     value={zoom}
                     min={1}
                     max={3}
                     step={0.1}
                     aria-labelledby="Zoom"
                     onChange={(e, zoom) => setZoom(zoom)}
                  />
               </div>
               <div className="controls">
                  Rotate
                  <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={(e, rotation) => setRotation(rotation)}
                     />
               </div>
               </div>


            </Modal.Body>
            <Modal.Footer>
               <Row>
                  <Col className="float-right mt-5">
                     <div className="float-right" style={{ display: 'flex', marginTop:20 }}>
                        <OverlayTrigger
                           overlay={<Tooltip>Discard Changes</Tooltip>}
                           style={{ float: 'right' }}
                        >
                           <Button
                               disabled={disable}
                              className="shadow-1 theme-bg border border-0"
                              onClick={() => resetSate()}
                           >
                              Cancel
                           </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                           overlay={<Tooltip>Save Changes</Tooltip>}
                           style={{ float: 'right' }}
                        >
                           <div >
                           <Button
                              disabled={disable}
                              className="shadow-1 theme-bg border border-0"
                              onClick={handleSave}
                              >
                           Save
                              {
                                 disable&& <span className="spinner-border spinner-border-sm ml-1" role="status" aria-hidden="true"></span>
                              }
                           
                           </Button>
                           </div>
                        </OverlayTrigger>
                     </div>
                  </Col>
               </Row>
            </Modal.Footer>
         </Modal>
      </React.Fragment>
   );
};

export default EditedCropper;
