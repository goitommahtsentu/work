import React from 'react'
import {Form} from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react';
import useComponentVisible from './useComponentVisible'


export default function SelectComponent({options,width="263px"}) {
    const { ref, isComponentVisible,setIsComponentVisible } = useComponentVisible(false);
    const [selected,setSelected]=useState(options[0])
    
    return (
        <div  ref={ref}>
        <div className="form-group">
        <div onClick={()=>setIsComponentVisible(prev=>!prev)} className={isComponentVisible?"chosen-container chosen-container-single chosen-with-drop chosen-container-active":"chosen-container chosen-container-single"} title="" style={{width,marginInline:'2px'}}>
                <a className="chosen-single">
        <span>{selected}</span>
        <div><b></b>
        </div>
        </a>
        <div className="chosen-drop">
        <ul class="chosen-results">
            {
                options.map(option=><li key={option} className={`active-result  ${option==selected?'result-selected':''}`} data-option-array-index="0" 
                onClick={()=>setSelected(option)}
                >  <Form.Group className="ml-4 mb-3" controlId="formBasicCheckbox">
            {option}
            </Form.Group></li>)
            }
        </ul>
        </div></div>
        </div>
        </div>
    )
}
