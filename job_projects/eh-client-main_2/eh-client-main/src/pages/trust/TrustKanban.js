import React, { useState, useEffect,useRef } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import Board from 'react-trello';

import {CustomCard} from "../../components/Trello/Card";

import {Trusts,Contacts,Lanes,Images,Users} from '../../services/'
import { useLocalStorage } from '../../utils/useLocalStorage';
import _ from 'lodash'
import httpService from '../../services/httpService';
import { connect,useDispatch,useSelector } from 'react-redux';
import {updateTrustList} from '../../store/action_calls'
import { useHistory } from 'react-router-dom';

const compareFun=(a,b,arr)=>{
    return arr.indexOf(parseInt(a.id)) - arr.indexOf(parseInt(b.id))
}
const TrustTaskBoard = (props) => {
    const [board, setBoard] = useState({lanes: []})
    const [trustsData,setTrustsData]=useState([])
    const [groupBy,setGroupBy]=useLocalStorage('groupBy','owner')
    const [setUps,setSetups]=useState([])
    const [repairStage,setRepairStage]=useState([])
    const [imageState,setImageState]=useState([])

    const [kanbanSettings,setKanbanSettings]=useState(null)
    const [owners,setOwners]=useState([])

    useEffect(()=>{
       (async()=>{
       const data=await Users.getkanbanSettings()
       data&&setKanbanSettings(data.kanban_settings)
       })()
    },[])
    
    const user=useSelector(state=>state.account.user.user)
    const history=useHistory()
    useEffect(()=>{
        const getImages=async()=>{
            const data=await Images.getImages()
            data&&setImageState(data.results)
        }
        getImages()
        
    },[])
    useEffect(()=>{
        const source=httpService.getSource()
        const getStage=async()=>{
            const data=await Trusts.getSetups(source)
            data&&setSetups(data)
        }
        getStage()
        return () => source.cancel();
    },[])

    useEffect(()=>{
        const source=httpService.getSource()
        const getReqairStage=async()=>{
            const data=await  Trusts.getRepairStages(source)
            data&&setRepairStage(data)
        }
        getReqairStage()
        return () => source.cancel();
    },[])


    const getImage=(id)=>{
        const imagesForTrust=imageState.filter(image=>image.trust_id===id)
        const getMarketingImage=imagesForTrust.filter(image=>image.marketing_photo)
        if(getMarketingImage.length===0){
            return imagesForTrust.length>0&&imagesForTrust[0].photo
        }
        return getMarketingImage[0].photo
    }

    const getOptions=async(newData,source)=>{
        const tmpData=kanbanSettings?kanbanSettings[groupBy]:null
        if(groupBy==='set_up_stage_id'){
            let tmpSetUps=[]
            if(tmpData){
                tmpSetUps=setUps.sort((a,b)=>compareFun(a,b,tmpData))
            }else{
                tmpSetUps=setUps
            }
           const result=tmpSetUps.map(setup=>{
                const lane= newData.filter(item=>item.title===setup.id)
                console.log(lane)
                if(lane.length===0){
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
        else  if(groupBy=='further_repair_stage_id'){
            let tmpRepairStage=[]
            if(tmpData){
                tmpRepairStage=repairStage.sort((a,b)=>compareFun(a,b,tmpData))
            }else{
                tmpRepairStage=repairStage
            }
          const result=tmpRepairStage.map(setup=>{
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
       else  if(groupBy=='owner_id'){
        const owners=Object.values(props.contactList)
        const result=owners.reduce((results,owner)=>{
             const lane= newData.filter(item=>item.title==owner.id) 
             console.log(lane)
             if(lane.length!=0){
                 results.push({
                   id:`${owner.id}`,
                   title:owner.full_name,
                   cards:lane[0].cards,
                   disallowAddingCard: true
     
                })
             }
           return results
          },[])
          if(tmpData){
              result.sort((a,b)=>compareFun(a,b,tmpData))
              console.log({result,tmpData})
          }
      return result
       }
        return newData
     }
     const groupByData=async(data,source)=>{
      const groupedData=_.chain(data)
         .groupBy(groupBy)
         .map((cards, setup_stage) => ({cards:cards.map(card=>({id:card.id,description:card.full_address,title:card.name,owner:card.owner?card.owner:'no owner',family:card.family,image:getImage(card.id)})), title:setup_stage}))
         .value()
     const lanes= await getOptions(groupedData,source)
     return lanes  
     //   .map((cards,index)=>({id:`${index}`,...cards}));
     }
    useEffect(() => {
        const source=httpService.getSource()
       const getTrust=async()=>{
        console.time('getting lanes')
        if(Object.keys(props.trustList).length!=0){
        const data=Object.values(props.trustList)
        data&&setTrustsData(data)
        const newGrouped=await groupByData(data,source)
        newGrouped&&setBoard({lanes: newGrouped})
        console.log('lanes data',newGrouped)
        }
       }
      getTrust()
      return () => source.cancel();
    },
    [props.trustList,imageState])

    useEffect(()=>{
        if(!props.trustList) return
        setOwners([... new Set(Object.values(props.trustList).map(i=>i.owner_id).filter(i=>i!==null))].map(i=>({id:i})))

    },[props.contactList,props.trustList])

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
   [groupBy,setUps,repairStage,imageState,kanbanSettings])

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
        history.push(`${cardId}`);
    };

    const dispatch=useDispatch()

    const handleDragEnd = async( cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        console.log("setup", cardDetails.laneId, "trust", cardDetails.id)
        const id = cardDetails.id
        const obj = {};
        obj[groupBy] =targetLaneId
        const data=await Trusts.updateTrust(id,obj)
        data&&dispatch(updateTrustList(data))


    }

    const handleLaneDragEnd=async(removedIndex, addedIndex, payload)=>{
        console.log({removedIndex, addedIndex, payload})
        setBoard(prev=>{
            const lanes=prev.lanes
            const newLanes=lanes.map((board,index)=>index===removedIndex?lanes[addedIndex]:index===addedIndex?lanes[removedIndex]:board)
            return {lanes:newLanes}
        })
        let orderList= [];
        if(groupBy==='set_up_stage_id'){
            orderList=setUps
        }else if(groupBy==='further_repair_stage_id'){
            orderList=repairStage
        }else{
            orderList=owners
        }
       orderList= orderList.map((board,index)=>index===removedIndex?orderList[addedIndex]:index===addedIndex?orderList[removedIndex]:board)
     const kanbanData=  await Users.updatekanbanSettings({
        email:user.email,
        kanban_settings:{
            ...kanbanSettings?kanbanSettings:[],
            [groupBy]:orderList.map(i=>i.id)
        }
       })

       setKanbanSettings(kanbanData.kanban_settings)
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
                     <option value={'set_up_stage_id'} key={'setup_stage'}>setup stage</option>
                     <option value={'owner_id'} key={'owner'}>Owner</option>
                     <option value={'further_repair_stage_id'} key={'further_repair_stage_id'}>Further Repair Stage</option>
               </Form.Control>
               </Col>
                <Col sm={12}>
                    <Board
                        disallowAddingCard={true}
                        laneDraggable={true}
                        data={board}
                        draggable
                        editable={true}
                        canAddLanes={groupBy!='owner_id'}
                        editCardTitle={false}
                        cardDraggable={groupBy!='owner_id'}
                        // editLaneTitle
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
                        handleLaneDragEnd={handleLaneDragEnd}
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
    contactList: state.contactReducer.contactList,
    trustList:state.trustReducer.trustList
})

export default connect(mapStateToProps, null)(TrustTaskBoard)