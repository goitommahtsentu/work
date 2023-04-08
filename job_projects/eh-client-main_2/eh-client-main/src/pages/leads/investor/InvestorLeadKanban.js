import React, { useState, useEffect,useRef } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import Board from 'react-trello';

import {CustomCard} from "../../../components/Trello/Card";

import {InvestorLeads,Contacts,Lanes} from '../../../services'
import { useLocalStorage } from '../../../utils/useLocalStorage';
import _ from 'lodash'
import httpService from '../../../services/httpService';
import { connect,useDispatch } from 'react-redux';
import {updateInvestorLeadList} from '../../../store/action_calls'

const TrustTaskBoard = (props) => {
    const [board, setBoard] = useState({lanes: []})
    const [trustsData,setTrustsData]=useState([])
    const [groupBy,setGroupBy]=useLocalStorage('groupByInvestorLead','lead_stage')
    const [setUps,setSetups]=useState([])
    const [repairStage,setRepairStage]=useState([])

    useEffect(()=>{
        const source=httpService.getSource()
        const getStage=async()=>{
            const data=await InvestorLeads.getSetups(source)
            data&&setSetups(data)
        }
        getStage()
        return () => source.cancel();
    },[])

    useEffect(()=>{
        const source=httpService.getSource()
        const getReqairStage=async()=>{
            const data=await  InvestorLeads.getRepairStages(source)
            data&&setRepairStage(data)
        }
        getReqairStage()
        return () => source.cancel();
    },[])

    const getOptions=async(newData)=>{
        if(groupBy=='lead_stage'){
            const result=setUps.map(setup=>{
                 const lane= newData.filter(item=>item.title==setup.id) 
                 console.log(lane)
                 if(lane.length==0){
                    return {
                       id:`${setup.id}`,
                       title:setup.stage,
                       cards:[],
                       disallowAddingCard: true
      
                    }
                 }
                 else{
                    return {
                       id:`${setup.id}`,
                       title:setup.stage,
                       cards:lane[0].cards,
                       disallowAddingCard: true
      
                    }
                 }
            })
        return result

        }
        else{
            return newData
        }
     }
     const groupByData=async(data,source)=>{
      const groupedData=_.chain(data)
         .groupBy(groupBy)
         .map((cards, setup_stage) => ({cards:cards.map(card=>({id:card.id,full_address:card.full_address,name:card.full_name,owner:card.text_phone})), title:setup_stage}))
         .value()
         console.log('groupedData',groupedData)
     const lanes= await getOptions(groupedData,source)
     return lanes  
     //   .map((cards,index)=>({id:`${index}`,...cards}));
     }
    useEffect(() => {
        const source=httpService.getSource()
       const getTrust=async()=>{
        console.time('getting lanes')
        if(Object.keys(props.investorLeadList).length!=0){
        const data=Object.values(props.investorLeadList)
        data&&setTrustsData(data)
        const newGrouped=await groupByData(data,source)
        newGrouped&&setBoard({lanes: newGrouped})
        console.log('lanes data',newGrouped)
        }
       }
      getTrust()
      return () => source.cancel();
    },
    [props.investorLeadList])

   const ref=useRef(true)
    useEffect(() => {
    const source=httpService.getSource()
      const getLanes=async()=>{
         const newGrouped=await groupByData(trustsData,source)
         newGrouped&&setBoard({lanes: newGrouped})
      }
      if(ref.current){
         ref.current=false
         return
      }
      getLanes()
      return () => source.cancel();
   },
   [groupBy,setUps,repairStage])

    const onCardAdd = () => {
        window.location.href='/trust';
    };

    const onLaneAdd = (params) => {
        console.log(params.title,);
        const id = params.title
        const obj = {};
        obj["stage"] = params.title
        console.log(obj);
        Lanes.addLane(obj)
    };

    const onLaneUpdate = (laneId, data) => {
        console.log(data,laneId);
        const landId = laneId;
        const obj = {};
        obj["stage"] = data.title
        console.log(obj);
        Lanes.updateLane(laneId,obj)
    };

    const onCardClick = (cardId) => {
         window.location = (`${cardId}`);
    };

    const dispatch=useDispatch()

    const handleDragEnd = async( cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        console.log("setup", cardDetails.laneId, "trust", cardDetails.id)
        const id = cardDetails.id
        const obj = {};
        obj[groupBy] =targetLaneId
        const data=await InvestorLeads.updateInvestorLead(id,obj)
        data&&dispatch(updateInvestorLeadList(data))


    }

    return (
        <React.Fragment>
            <Row>
               <Col sm={8}>
               </Col>
               <Col sm={4}>
               <Form.Control
                     // disabled={true}
                     plaintext={true}
                     name="groupBy"
                     value={groupBy}
                     onChange={(event)=>{
                        setGroupBy(event.target.value)
                     }}
                     as="select"
               >
                     <option value={'lead_stage'} key={'lead_stage'}>Lead stage</option>
               </Form.Control>
               </Col>
                <Col sm={12}>
                    <Board
                        disallowAddingCard={true}
                        laneDraggable={false}
                        data={board}
                        draggable
                        editable={true}
                        canAddLanes={groupBy!='owner_id'}
                        editCardTitle={false}
                        cardDraggable={groupBy!='owner_id'}
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


const mapStateToProps = state => ({
    investorLeadList: state.investorLeadReducer.investorLeadList
})

export default connect(mapStateToProps, null)(TrustTaskBoard)