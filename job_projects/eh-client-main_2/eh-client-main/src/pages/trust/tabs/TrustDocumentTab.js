import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  OverlayTrigger,
  Tooltip,
  Form,
  Table,
} from "react-bootstrap";
import { DropzoneComponent } from "react-dropzone-component";
import moment from "moment";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { store } from "../../../store/index";
import { getTrust } from "../../../store/action_calls";

// Import API Server
import { API_SERVER } from "../../../config/constant";

// Import Endpoints
import { documentsUrl, trustUrl } from "../../../config/Endpoints";
import ModalContainer from '../../../components/ImageModal/ModalContainer'

import {Documents, Images} from "../../../services";
import {groupBy} from 'lodash'

const TrustDocumentTab = (props) => {
  const [uploadState, setUploadState] = useState([]);
  const [documentState, setDocumentState] = useState([]);
  const [documentOptionsState, setDocumentOptionsState] = useState([]);
  const [isLarge, setIsLarge] = useState(false);


  //this is for displaying the Files
  const getDocuments = async(id) => {
    const data=await Documents.getDocumentsForTrust(id)
    setDocumentState(data);
  };


    const getOptions = async() => {
    const datas=await Documents.getOptions()

        const filtered = datas.filter((data) => {
            return data.trust_doc === true;
        })
        setDocumentOptionsState((filtered))
     }



  useEffect(() => {
    getOptions();
    getDocuments(props.id);
  }, []);

  const handleEdit = (event) => {
    console.log("Event", event)
    const { name, value } = event.target;
    setUploadState({
      ...uploadState,
      [name]: value,
            "contact_id": `${props.owner}`,
        })
  };

  const tokenConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const updateConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const handleUpdate = async() => {
    // console.log("Update", uploadState)
    let data = uploadState;
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    await Documents.updateDocument(uploadState.id,formData)
    getDocuments(props.id);

  };


  console.log("New image Created For", props.owner)

  const simpleCallBack = async (file) =>{

    const bodyFormData = new FormData();
    bodyFormData.append("trust_id", props.id);
    // bodyFormData.append('contact_id', props.owner); this is the line that should work but props. owner is undefined and throws an error
    const ownerId=parseInt(props.owner)??null;
    (ownerId || (ownerId===0))&&bodyFormData.append('contact_id', props.owner);
    bodyFormData.append("file", file);
    const data=await Documents.uploadDocument(bodyFormData)

    if(!data) return
    setIsLarge(true);
    setUploadState({ id:data.id });
    myDropzone.removeAllFiles()
  };

  var myDropzone;
   const initCallback =(dropzone)=> {
      myDropzone = dropzone;
  }

  const eventHandlers = {
    addedfile: simpleCallBack,
    init: initCallback
  };

  // Needed for file upload component
  const djsConfig = {
    addRemoveLinks: true,
    acceptedFiles: "pdf,xls,xlsx,doc,docx,txt",
    autoProcessQueue: false,
    // uploadprogress: 100,
    params: {
      trust_id: `${props.trust && props.trust.id}`,
      // photo: file
    },
  };

  const componentConfig = {
    iconFiletypes: [".pdf", ".xls", ".xlsx", ".doc", ".docx", ".txt"],
    showFiletypeIcon: true,
    postUrl: `${API_SERVER}${documentsUrl}`,
  };

  const handleDelete=async(id)=>{
    const data=await Documents.deleteDocument(id)
    setDocumentState(prev=>[...prev.filter(file=>file.id!=id)])
  };

  const onSubmit = () => {
    handleUpdate();
    setIsLarge(false);
  };

  const OptionsArray =
    documentOptionsState &&
    documentOptionsState.map((option) => {
      // console.log('options', option)

      let match = false;

      const optionsRow = (
        <tr>
          {/* This will be the Name of the Document Type */}
          <th scope="row" width="30%">
            {option.name}
            <span style={{ float: "right" }}>
            </span>
          </th>
          <td>No File Uploaded</td>
          {/* This needs to be the name of the document that opens a modal? to view/print the document */}
        </tr>
      );

      if (documentState === []) {
        return optionsRow;
      } else {
        documentState.forEach((element) => {
          if (element.doc_type === option.name) {
            match = true;
          }
        });
        if (match === false) {
          return optionsRow;
        }
      }
    });

  // const FilesArray = documentState.map((file) => {
  //   return (
  //     <tr>
  //       {/* This will be the Name of the Document Type */}
  //       <th scope="row" width="30%">
  //         {file.doc_type}
  //         <span style={{ float: "right" }}>
  //           <button className="btn btn-icon mx-n1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) handleDelete(file.id)}}>
  //              <OverlayTrigger overlay={<Tooltip>Delete Image</Tooltip>}>
  //              <i className="fa fa-fw text-c-red fa-trash fa-md" />
  //              </OverlayTrigger>
  //           </button>
  //           <ModalContainer src={file.file} />
  //         </span>
  //       </th>
  //       <td>{file.name}</td>
  //       <td>Uploaded On:{moment(file.uploaded_at).format("LL")}</td>
  //       {/* This needs to be the name of the document that opens a modal? to view/print the document */}
  //     </tr>
  //   );
  // });
const FilesArray=Object.entries(groupBy(documentState,'doc_type')).map(([key,values]) => {
  return (
    <tr>
      {/* This will be the Name of the Document Type */}
      <th scope="row" width="30%" style={{borderRight:"1px solid #eaeaea",borderBottom:"1px solid #eaeaea"}}>{key}</th>
      {
        values.map(file=>(
          <tr>
          <th scope="row" width="100%">
            <span >
              <button className="btn btn-icon mx-n1" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) handleDelete(file.id)}}>
                 <OverlayTrigger overlay={<Tooltip>Delete Image</Tooltip>}>
                 <i className="fa fa-fw text-c-red fa-trash fa-md" />
                 </OverlayTrigger>
              </button>
              <ModalContainer src={file.file} />
            </span>
          </th>
          <td>{file.name}</td>
          <td>{Object.values(props.contactList).filter(i=>file.contact_id==i.id || file.family_id==i.id || file.investor_id==i.id  || file.investor_lead_id==i.id || file.family_lead_id==i.id).map(d=><span className="react-tags__selected-tag display-react-tags__selected-tag">{d.full_name}</span>)}</td>
          <td>Uploaded On:{moment(file.uploaded_at).format("LL")}</td>
          </tr>
        ))
      }
      {/* This needs to be the name of the document that opens a modal? to view/print the document */}
    </tr>
  );
});

  return (
    <React.Fragment>
      <Card style={{ height: "50%" }}>
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          <Table hover className="table-columned sorted">
            <tbody>
              {/* Document Rows */}
              {OptionsArray}
              {FilesArray}
            </tbody>
          </Table>
        </Row>
      </Card>

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
      <Modal size="lg" show={isLarge} onHide={() => setIsLarge(false)}>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row}>
              <Form.Label className={"mb-n5"} column xs={4} md={3}>
                Document Name
              </Form.Label>
              <Col>
                <Form.Control name="name"  validate onChange={handleEdit} />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label className={"mb-n5"} column xs={4} md={3}>
                Document Type
              </Form.Label>
              <Col>
                <Form.Control
                  name="type_id"
                  onChange={handleEdit}
                  as="select"
                >
                  <option value="" />

                  {documentOptionsState &&
                    documentOptionsState.map((data) => (
                      <option value={data.id} key={data.id}>
                        {data.name}
                      </option>
                    ))}
                </Form.Control>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Row>
            <Col className="float-right">
              <div className="float-right" style={{ display: "flex" }}>
                <OverlayTrigger
                  overlay={<Tooltip>Discard Changes</Tooltip>}
                  style={{ float: "right" }}
                >
                  <Button
                    className="shadow-1 theme-bg border border-0"
                    onClick={() => setIsLarge(false)}
                  >
                    Cancel
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={<Tooltip>Upload File</Tooltip>}
                  style={{ float: "right" }}
                >
                  <Button
                    className="shadow-1 theme-bg border border-0"
                    type="submit"
                    onClick={onSubmit}
                  >
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

TrustDocumentTab.propTypes = {
  trust: PropTypes.object.isRequired,
  contactList:PropTypes.object
};

const mapStateToProps = (state) => ({
  trust: state.trustReducer.trust,
  contactList:state.contactReducer.contactList
});

export default connect(mapStateToProps, { getTrust })(TrustDocumentTab);
