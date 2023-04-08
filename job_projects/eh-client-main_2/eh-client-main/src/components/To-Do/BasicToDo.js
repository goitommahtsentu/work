import React, { createRef, useState, useEffect } from 'react';
import { Row, Col, Button, Form,Control } from 'react-bootstrap';
import { ValidationForm, TextInputGroup } from 'react-bootstrap4-form-validation';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import {FiMoreHorizontal} from 'react-icons/fi';
import {FaSpinner,FaCheck} from 'react-icons/fa'
import { Todos } from '../../services';
import { Typeahead } from 'react-bootstrap-typeahead';
import ReactDragListView from 'react-drag-listview'
import {BsArrowsMove } from 'react-icons/bs'


const sortTodo=(todos)=>{
return todos.sort((a,b)=>a.order_number-b.order_number)
}

const SingleTodList=(props)=>{
    const [autoCompleted,setAutoCompleted]=useState([])
    const {item,handleAssignedEmployeeEdit,handleTodoEdit,deleteHandler,handleUpdate}=props

    useEffect(()=>{
        if(!props.employees) return
       setAutoCompleted(props.employees?.map
       (i=>({...i,full_name:i.first_name + '  ' + i.last_name}))
           .filter(i=>i.id===item.assigned_employee))
    },[props.employees])

    return <>
                    <div className="to-do-list mb-3" style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                   <div style={{padding:20}} className='draggable'>
                   </div>
                    {/* <div className="d-flex justify-content-center align-items-center"> */}
                     
                          {props.defaultSwitch?(<p className="" >{item.title}</p>):(<Form.Control
                            name="title"
                            value={item.title?item.title:''}
                            onChange={(e)=>handleTodoEdit(item.id,e.target.value)}
                            disabled={props.defaultSwitch}
                            plaintext={props.defaultSwitch}
                            as="textarea"
                            />)
                          }
                       
                    {/* </div> */}
                    <div className="float-right d-flex" style={{display:'flex',justifyContent:'center',alignItems:'flex-end',gap:10,flexDirection:'column',marginLeft:'auto',marginRight:'0'}} >
                    <div to="#"
                            style={{borderRadius:"unset",marginRight:"unset",paddingBlock:'0px',width:150,paddingRight:0}}
                            className="text-dark btn-sm todo-list"
                        >
                       { props.defaultSwitch?(<Form.Control
                            name="assigned_employee"
                            value={item.assigned_employee?item.assigned_employee:''}
                            onChange={(e)=>handleAssignedEmployeeEdit(item.id,e.target.value)}
                            as="select"
                            disabled={props.defaultSwitch}
                            plaintext={props.defaultSwitch}
                            >
                            <option value="">---------</option>
                            {
                                props.employees?.map(employee=><option key={employee.id} value={employee.id} >{employee.first_name + '  ' + employee.last_name}</option>)
                            }
                      </Form.Control>  ):(<Typeahead
                                                    id="assigned_employee"
                                                    name="Employees"
                                                    labelKey="full_name"
                                                    onChange={(vendor)=>{
                                                        vendor.length!==0&&handleAssignedEmployeeEdit(item.id,vendor[0].id)
                                                        setAutoCompleted(vendor)
                                                    }
                                                }
                                                    options={props.employees?.map(i=>({...i,full_name:i.first_name + '  ' + i.last_name}))}
                                                    placeholder="Choose an Employee..."
                                                    selected={autoCompleted}
                                            />)
    }
                    </div>
                    <div style={{display:'flex'}}>
                    <Link to="#" className="delete_todolist todo-list" onClick={() => deleteHandler(item.id)} >
                            <i className="fa fa-trash-alt"  style={{color:'red',marginRight:10,marginBlock:15}}/>
                        </Link>
                        <div to="#" className="btn btn-icon btn-info text-dark btn-sm todo-list" 
                        style={{borderRadius:"unset",marginRight:"unset",opacity:item.status==="1"?1:0.5}}
                        onClick={() => handleUpdate(item.id,'pending')}  >
                        <FiMoreHorizontal size={20} />
                        </div>
                        <div to="#" 
                        style={{borderRadius:"unset",marginRight:"unset",backgroundColor:"#EBE875",opacity:item.status=="2"?1:0.5}}
                        className="btn btn-icon btn-secondary text-dark btn-sm todo-list" onClick={() => handleUpdate(item.id,"progress")} >
                        <FaSpinner size={20} />
                        </div>
                        <div  
                         style={{borderRadius:"unset",marginRight:"unset",opacity:item.status=="3"?1:0.5}}
                        className="btn btn-icon theme-bg btn-sm text-dark " onClick={() => handleUpdate(item.id,"completed")}>
                        <FaCheck  size={20} color='gray'/>
                        </div>
                    </div>
                    </div>
                </div>
    </>
}
const BasicToDo = (props) => {
    const formRef = createRef();
    const [newNote, setNewNote] = useState('');
    const [basicTodo, setBasicTodo] = useState([]);
    const [completed,setCompleted]=useState({
        totalTodo:0,
        completedTodo:0,
        status:0
    })

    useEffect(()=>{
        if(!basicTodo) return
        const completedTask=basicTodo.filter(todo=>todo.status==="3")
        let completedStatus=completedTask.length/basicTodo.length
        console.log(completedStatus)
        setCompleted({totalTodo:basicTodo.length,completedTodo:completedTask.length,status:completedStatus*100})
    },[basicTodo])


    useEffect(() => {
        if(!props.value) return
        const getTodoList=async()=>{
           const data=await Todos.getTodos(props.name,props.value)
           setBasicTodo(data)
        }
        getTodoList()
    }, [props.value,props.defaultSwitch]);

    const handleUpdate = async (id,status) => {
        let obj={};
        if(status==="pending") obj['status']="1"
        if(status==="progress") obj['status']="2"
        if(status==="completed") obj['status']="3"
        const data=await Todos.updateTodo(id,obj)
        data&&setBasicTodo([...basicTodo.map(todo=>todo.id!==data.id?todo:data)])
    };

    const handleOrder = async (id,order) => {
        let obj=[];
        obj['order_number']=order
        const data=await Todos.updateTodo(id,obj)
    };

    const handleChange = (e) => {
        setNewNote(e.target.value);
    };

    const handleSubmit = async (e, formData, inputs) => {
        e.preventDefault();
        resetForm();
        let obj={}
        obj[props.name]=props.value
        obj.assigned_employee=props.ownerId
        obj['title']=newNote
        const data=await Todos.createTodo(obj)
        data&&setBasicTodo([...basicTodo,data]);
        setNewNote('');
    };

    const resetForm = () => {
        formRef.current.resetValidationState(true);
    };

    const handleErrorSubmit = (e, formData, errorInputs) => {
        //console.log(errorInputs);
    };


    const deleteHandler = async (id) => {
       const data=await Todos.deleteTodos(id)
       setBasicTodo([...basicTodo.filter(todo=>todo.id!==id)])
    };
    const TodoListHTML = (props)=>{
    
        const [todoLists,setTodoLists]=useState([])
        // useEffect(()=>{
        //     if(todoLists.length==0) return
        //     if(!props.defaultSwitch) return
        //   props.setBasicTodo(todoLists)
        // },[props.defaultSwitch])
    
        useEffect(()=>{
            if(!props.basicTodo) return
            setTodoLists(props.basicTodo)
          },[props.basicTodo])
        const handleTodoEdit=async(id,value)=>{
            setTodoLists(prev=>prev.map(todo=>todo.id===id?({...todo,title:value}):todo))
            await Todos.updateTodo(id, {title: value})
          }
          const handleAssignedEmployeeEdit=(id,value)=>{
            console.log({id,value})
            setTodoLists(prev=>prev.map(employee=>employee.id===id?({...employee,assigned_employee:value}):employee))
            Todos.updateTodo(id,{assigned_employee:parseInt(value)})
          }

    return(<>

            {todoLists.map((item, index) => {
        return (
            <div key={index} style={{position:'relative'}}>
            <div>
              <SingleTodList handleUpdate={handleUpdate} deleteHandler={deleteHandler} item={item} defaultSwitch={props.defaultSwitch}  employees={props.employees} handleTodoEdit={handleTodoEdit} handleAssignedEmployeeEdit={handleAssignedEmployeeEdit}/>
            </div>
            <a href="#"
              style={{
                  position:'absolute',
                  top:"40%",
                  left:0
              }}
            > <BsArrowsMove size={20} color='gray'/></a>
            </div>
        );
    })
    }

    </>
    )
}


const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...basicTodo];
      const item = data.splice(fromIndex, 1);
      data.splice(toIndex, 0, item);
     setBasicTodo(prev=>prev.map((i,index)=>
         index==toIndex?({...prev[fromIndex],order_number:i.order_number}):index===fromIndex?
             ({...prev[toIndex],order_number:i.order_number}):i))
     handleOrder(basicTodo[fromIndex].id,basicTodo[toIndex].order_number)
     handleOrder(basicTodo[toIndex].id,basicTodo[fromIndex].order_number)
    },
    nodeSelector: 'div',
    handleSelector: 'a'
  };


    return (
        <React.Fragment>
            <Row>
                <Col>
                <h6 className="text-muted mt-4 mb-3">
                    <span id="yes-do-translate" className="yes-do-translate" >Today's Tasks Competed</span>
                    : {completed.completedTodo}/{completed.totalTodo}</h6>
                <div className="progress mb-2" id="task-progress">
                    <div className="progress-bar progress-c-theme shadow-sm" role="progressbar" style={{width:`${completed.status}%`,height:"6px"}} ariaValuenow="20" ariaValuemin="5" ariaValuemax="100"></div>
                </div>
                    <ValidationForm ref={formRef} onSubmit={handleSubmit} onErrorSubmit={handleErrorSubmit}>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <TextInputGroup
                                    name="newNote"
                                    id="newNote"
                                    placeholder="Create your task list"
                                    required
                                    append={
                                        <Button type="submit" variant="secondary" className="btn-icon">
                                            <i className="fa fa-plus" />
                                        </Button>
                                    }
                                    value={newNote}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />
                            </Form.Group>
                        </Form.Row>
                    </ValidationForm>

                    <div className="new-task">
                    <ReactDragListView {...dragProps}>
                        <TodoListHTML setBasicTodo={basicTodo}  basicTodo={sortTodo(basicTodo)} employees={props.employees} currentUser={props.ownerId} defaultSwitch={props.defaultSwitch}/>
                    </ReactDragListView >
                        </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default React.memo(BasicToDo);