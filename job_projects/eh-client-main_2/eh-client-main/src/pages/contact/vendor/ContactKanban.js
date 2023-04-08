import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import Board from 'react-trello';



import {CustomCard} from "../../../components/Trello/Card";
import { useHistory } from 'react-router-dom';


import {Contacts,Lanes} from '../../../services'
import httpService from '../../../services/httpService';
import { updateContactList } from '../../../store/action_calls';
import {useDispatch } from 'react-redux'

const ContactTaskBoard = () => {
    const history=useHistory()
    const [board, setBoard] = useState({lanes: []})

   

    useEffect(() => {
        const source=httpService.getSource()
        const getKanban=async()=>{
          const data= await  Contacts.getContactsKanban(source)
          console.log('kanban',data)
          setBoard({lanes: data})
        }
            getKanban()
            return () => source.cancel();
    },
    []);

    console.log(board)

    const onCardAdd = () => {
        history.push('/contact');
    };

    const onLaneAdd = async(params) => {
        console.log(params.title,);
        const id = params.title
        const obj = {};
        obj["stage"] = params.title
        console.log(obj);
        await Lanes.addLane(obj)
    };

    const onLaneUpdate = (laneId, data) => {
        console.log(data,laneId);
        const landId = laneId;
        const obj = {};
        obj["stage"] = data.title
        console.log(obj);
        Lanes.updateLane(landId,obj)
    };

    const onCardClick = (cardId) => {
         history.push(`${cardId}`,{from:'/contact/kanban'});
    };
    
    const dispatch = useDispatch()
    const handleDragEnd = async( cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        // console.log( targetLaneId, cardDetails);
        // console.log("setup", cardDetails.laneId, "contact", cardDetails.id)
        const id = cardDetails.id
        const obj = {};
        obj["set_up_stage_id"] = cardDetails.laneId
        const data=await Contacts.updateContact(id,obj)
        data&&dispatch(updateContactList(data))

    }

    return (
        <React.Fragment>
            <Row>
                <Col sm={12}>
                    <Board
                        disallowAddingCard={true}
                        laneDraggable={false}
                        data={board}
                        draggable
                        editable={true}
                        canAddLanes={true}
                        editCardTitle={false}

                        editLaneTitle
                        hideCardDeleteIcon
                        className="adv-task-board"
                        addCardLink={
                            <div className="mt-1">
                                {' '}
                                <Button className="shadow-1 theme-bg border border-0" size="sm">Afg</Button>
                            </div>
                        }
                        onLaneAdd={onLaneAdd}
                        addLaneTitle="+ Add New Task"
                        onCardClick={onCardClick}
                        handleDragEnd={handleDragEnd}
                        onCardAdd={onCardAdd}
                        onLaneUpdate={onLaneUpdate}
                        components={{Card: CustomCard}}
                        laneStyle={{backgroundColor: "#dfe6ed" }}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ContactTaskBoard;