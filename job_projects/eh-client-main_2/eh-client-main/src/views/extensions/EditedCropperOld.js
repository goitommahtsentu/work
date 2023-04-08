import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios'

// Import API Server
import { API_SERVER } from '../../config/constant';

// Import Endpoints
import { imagesUrl } from '../../config/Endpoints';


const EditedCropper = (data) => {

    const [image, setImage] = useState();
    const [cropData, setCropData] = useState('#');
    const [cropper, setCropper] = useState('#');
    const [isLarge, setIsLarge] = useState(false);

    const updateConfig = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    const refreshImage = () => {
        axios({
            method: 'get',
            url: `${API_SERVER}${imagesUrl}${data.photo.id}`,
        })
            .then(function (response) {
                //handle success
                setImage(response.data.photo);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }

    const getCropData = () => {

        if (typeof cropper !== 'undefined') {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            console.log(cropper)
            updateImage(cropData)
            console.log(cropData)
        } else {
            alert("File Not Saved")
        }
        setIsLarge(false)
    };

    const updateImage = (photo) => {

        const formData = base64ToFile(photo)
        console.log("formData",formData)

        axios.put(axios.put(`${API_SERVER}${imagesUrl}${data.photo.id}/`, formData, updateConfig))
            .then((res) => {
                //handle success
                console.log(res);
                setImage(res.data.photo);
            })
            .catch((res) => {
                //handle error
                console.log(res);
            });
    }

    const base64ToFile = (base64) => {
        fetch(base64)
        .then(res => res.blob())
        .then(blob => {
            const fd = new FormData()
            const file = new File([blob], data.photo.name)
            console.log("photo", file)
            fd.append('photo', file)
            console.log(fd)
            console.log("dataURL", cropData)
            fd.append('dataURL', cropData)
            console.log("fd",fd)
            return fd

        })
    }

    refreshImage()

    return (
        <React.Fragment>
            <button className="btn btn-icon" onClick={() => setIsLarge(true)}>
                <OverlayTrigger overlay={<Tooltip>Crop image</Tooltip>}>
                    <i className="fa fa-fw text-white fa-crop-alt fa-2x " />
                </OverlayTrigger>
            </button>
            <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Crop Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={12} className="mt-3">
                            <Cropper
                                crossOrigin="anonymous"
                                style={{ height: 400, width: '100%' }}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                checkCrossOrigin={false}
                                viewMode={1}
                                guides={true}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Row>
                        <Col className="float-right">
                            <div className="float-right" style={{ display: "flex" }}>
                                <OverlayTrigger overlay={<Tooltip>Discard Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" onClick={() => setIsLarge(false)}>
                                        Cancel
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Save Changes</Tooltip>} style={{ float: "right" }}>
                                    <Button className="shadow-1 theme-bg border border-0" onClick={getCropData}>
                                        Save
                                    </Button>
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
