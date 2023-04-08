import React, { useEffect, useState,useRef } from "react";
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

// Import API Server
import { API_SERVER } from "../../../config/constant";

// Import Endpoints
import { documentsUrl } from "../../../config/Endpoints";
import ModalContainer from '../../../components/ImageModal/ModalContainer'

import {Documents} from "../../../services";
import ReactTags from 'react-tag-autocomplete'

import {connect} from 'react-redux'
import {groupBy} from 'lodash'

const ContactDocumentTab = (props) => {
  const [uploadState, setUploadState] = useState([]);
  const [documentState, setDocumentState] = useState([]);
  const [documentOptionsState, setDocumentOptionsState] = useState([]);
  const [isLarge, setIsLarge] = useState(false);

  //this is for displaying the Files
  const getDocuments = async(id) => {
    const data=await Documents.getDocumentsForContacts(id,props.name)
    setDocumentState(data);
  };


    const getOptions = async() => {
    const datas=await Documents.getOptions()

        const filtered = datas.filter((data) => {
            return data.contact_doc === true;
        })
        setDocumentOptionsState((filtered))
     }



  useEffect(() => {
    getOptions();
    getDocuments(props.id);
  }, []);

  const handleEdit = (event) => {
    // console.log("Event", event)
    const { name, value } = event.target;
    setUploadState({
      ...uploadState,
      [name]: value,
    });
  };

  const handleUpdate = async() => {
    // console.log("Update", uploadState)
    let data = uploadState;
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    if(tags){
     for(let owner of tags){
      formData.append('trust_ids', owner.id);
     }
    }
    await Documents.updateDocument(uploadState.id,formData)
    getDocuments(props.id);

  };


  const simpleCallBack = async (file) =>{
    // console.log("New image Created For Contact Id", props.contact,props.contact.related_trust_ids.owner_list)
    const bodyFormData = new FormData();
    bodyFormData.append(`${props.name}`, props.id);
    bodyFormData.append("file", file);
    // bodyFormData.append("name", "name");
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
    acceptedFiles: "pdf,xls,xlsx,csv,doc,docx,txt",
    autoProcessQueue: false,
    // uploadprogress: 100,
    params: {
      contact_id: `${props.contact && props.contact.id}`,
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
    documentOptionsState.map((option,index) => {
      // console.log('options', option)

      let match = false;

      const optionsRow = (
        <tr key={index}>
          {/* This will be the Name of the Document Type */}
          <th scope="row" width="30%" style={{borderBottom:index==documentOptionsState.length-1?"1px solid #eaeaea":""}}>
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

  const FilesArray = Object.entries(groupBy(documentState,'doc_type')).map(([key,values]) => {
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
            <td>{Object.values(props.trustList).filter(i=>file.trust_ids.includes(i.id)).map(d=><span className="react-tags__selected-tag display-react-tags__selected-tag">{d.name}</span>)}</td>
            <td>Uploaded On:{moment(file.uploaded_at).format("LL")}</td>
            </tr>
          ))
        }
        {/* This needs to be the name of the document that opens a modal? to view/print the document */}
      </tr>
    );
  });


  const  reactTags = useRef()
  const [tags,setTags]=useState([])
  const [suggestions,setSuggestions]=useState([])
  const [suggestionsAll,setSuggestionsAll]=useState([])



    const onDelete =(i)=> {

      setTags(prevTags=>{
      const item=prevTags.filter((tag,index)=>index==i)
      setSuggestions(prev=>[...prev,...item])
      return prevTags.filter((tag,index)=>index!=i)
  })
  }
  useEffect(()=>{
    const ownerList=props.contact?.related_trust_ids?.owner_list
    if(!ownerList) return
    if(!props.trustList) return
    const allTrusts=Object.values(props.trustList)
    const myTrusts=allTrusts.filter(sug=>ownerList.includes(sug.id))
    setSuggestionsAll(allTrusts)
    setTags(myTrusts)
  },[props.contact?.related_trust_ids?.owner_list,props.trustList])

    useEffect(()=>{
        const ownerList=props.contact?.related_trust_ids?.owner_list
        if(!suggestionsAll) return
        if(!ownerList) return setSuggestions(suggestionsAll)
        setSuggestions(suggestionsAll.filter(sug=>!ownerList.includes(sug.id)))
        },[props.contact?.related_trust_ids?.owner_list,suggestionsAll])


  const onAddition= async(tag) =>{
  //   const data=
  console.log({tag})
  const isTagNew=suggestions.filter(sug=>sug.name==tag.name.trim())[0]
  if(isTagNew){
      setTags(prev=>[...prev,tag])
      setSuggestions(prev=>prev.filter(i=>i.id!=tag.id))
  return
      }
}



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

            <Form.Group as={Row}>
              <Form.Label className={"mb-n5"} column xs={4} md={3}>
                Trusts
              </Form.Label>
              <Col>
                  <ReactTags
                    ref={reactTags}
                    tags={tags}
                    suggestions={suggestions}
                    onDelete={onDelete}
                    onAddition={onAddition} 
                    minQueryLength ={0}
                    />
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



const mapStateToProps = state => ({
  trustList: state.trustReducer.trustList,
})

export default React.memo(connect(mapStateToProps, null)(ContactDocumentTab))
