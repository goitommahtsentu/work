import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tab, Badge, Tabs, Tooltip } from 'react-bootstrap';


import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { GET_CHATTER } from '../../store/actions';

import { useDispatch } from 'react-redux';
import moment from 'moment';


import {Chatters} from '../../services';

const Chatter = props => {

    dayjs.extend(relativeTime);

    const [chatterState, setChatterState] = useState([])
    const [postState, setPostState] = useState({})

    const dispatch = useDispatch();



  


    const getList = async(id) => {
        const data=await Chatters.getChatterQualForTrust(id)
        setChatterState(data)
        dispatch({
            type: GET_CHATTER,
            payload: data
        });
    }

    useEffect(() => {
        getList(props.id)
    }, [props.id])

    const postChatter = async(body) => {
        const bodyFormData = new FormData();
        bodyFormData.append('trust_id', body.trust_id);
        bodyFormData.append('contact_id', body.contact_id);
        bodyFormData.append('message_text', body.message_text);
        bodyFormData.append('chatter_type', body.chatter_type);
        const data =await Chatters.createChatter(bodyFormData)
        setPostState({...postState,'message_text':''})
        setChatterState([
            data,
            ...chatterState
        ])
    }

    const handleEdit = (event) => {
        const { name, value } = event.target
        setPostState({
            ...postState,
            [name]: value,
            "contact_id": `${props.owner}`,
            "trust_id": props.id,
            "date": getCurrentDateTime,
            "chatter_type": "1"
        })
    }

    const onSubmit = () => {
        postChatter(postState)
    }

    const getCurrentDateTime = () => {
        return {
            now: moment().format('YYYY-DD-MM HH:mm:ss'),
        };
    }


    console.log("Chatter", postState)

    return (
            <Card style={{boxShadow:'unset'}}>
                <Card.Body>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" rows="3" placeholder="Write your message"
                            onChange={handleEdit}
                            name="message_text"
                            value={postState.message_text}
                            onKeyPress={event => {
                                if (event.key === 'Enter') {
                                    onSubmit()
                                }
                              }}
                        />
                    </Form.Group>
                    <div className="float-right mb-2">
                        <OverlayTrigger overlay={<Tooltip>Attach a File</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paperclip f-20 mr-2"
                            />
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip>Send</Tooltip>} style={{ float: "right" }}>
                            <i className="fa fa-paper-plane text-c-blue f-20 mr-2"
                                onClick={onSubmit}
                            />
                        </OverlayTrigger>
                    </div>
                    <br />
                    {chatterState &&
                        <ul className="task-list">
                            {chatterState.map(data => (
                                <li key={data.id}>
                                    <i className="task-icon bg-c-green" />
                                    <h6>
                                        <p className="text-muted">{moment(data.date).format('l LT')}<Badge className="float-right text-white f-11 theme-bg2">Username</Badge></p>
                                    </h6>
                                    <p>{data.message_text}</p>
                                </li>
                            ))}
                        </ul>
                    }
                </Card.Body>
            </Card>
    )
}

export default Chatter;