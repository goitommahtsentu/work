import React, { useState, forwardRef, useImperativeHandle } from "react";
import Checkbox from '@material-ui/core/Checkbox';

export default forwardRef((props, ref) => {
    const [value, setValue] = useState(false);
    const [inputValue, setInputValue] = useState('');

    function onChangeHandler(e) {
        props.setDropdownState({[props.field]:e.target.checked})
        setValue(e.target.checked);
    }
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


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
        <Checkbox 
        {...label} 
        style={{padding:'0 auto',color:'#04a9f5'}}
        checked={value}
        onChange={onChangeHandler}
        />
    )
})