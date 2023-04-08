import React, { useState, useEffect } from 'react';

import {Documents} from '../../../services';

const DocumentModal = props => {
    const [isLarge, setIsLarge] = useState(false);
    const [documentState, setDocumentState] = useState({});
    const [documentOptionsState, setDocumentOptionsState] = useState({});

    const getOptions = async() => {
        const data=await Documents.getOptions()
        setDocumentOptionsState(data.actions.POST)
    }

    const handleEdit = (event) => {
        // console.log("Event", event)
        const { name, value } = event.target
        setDocumentState({
            ...documentState,
            [name]: value
        })
    }

    const CreateDocument = async(body) =>  {
        const data=await Documents.uploadDocument(body)
        setIsLarge(false)
        props.setToggle(!props.toggle)
     }

    useEffect(() => {
        setDocumentState({
            ...documentState,
            "trust_id": props.id
        })
        getOptions()
    }, [])

    const onSubmit = () => {
        CreateDocument(documentState)
        setIsLarge(false)
    }

    return (
        <React.Fragment>
           
        </React.Fragment>
    );
};

export default DocumentModal;