import React, { useState, forwardRef, useImperativeHandle } from "react";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default forwardRef((props, ref) => {
    const [value, setValue] = useState(props.name);
    const [inputValue, setInputValue] = useState('');

    function onChangeHandler(e) {
        props.setDropdownState({[props.field]:e.target.value})
        setValue(e.target.value);
    }



    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value;
            },
            afterGuiAttached: () => {
                setValue(props.value)
            }
        };
    });
    return (
        <Select
        style={{ width:'100%'}}
          value={value}
          onChange={onChangeHandler}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
            {
                props.options.map((option,index)=>(
                    <MenuItem 
                    value={option.value} key={index}>{option.display_name}</MenuItem>
                ))
            }
        </Select>
    )
})