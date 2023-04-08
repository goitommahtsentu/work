import React, { useState,useEffect, forwardRef, useImperativeHandle } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default forwardRef((props, ref) => {
    const [value, setValue] = useState({});
    const [inputValue, setInputValue] = useState('');


    function onChangeHandler(e, value) {
        props.setDropdownState({[props.field]:value.id})
        setValue(value);
    }

    function onInputChangeHandler(e, inputValue) {
        setInputValue(inputValue);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                return value[props.name
                ];
            },
            afterGuiAttached: () => {
                setValue(props.options.filter(i=>i[props.name]==props.value)[0])
            }
        };
    });

    return (
        <Autocomplete
            style={{ padding: '0 10px' }}
            options={[...props.options,{id:null,[props.name]:'unassign'}]}   
            value={value}
            onChange={onChangeHandler}
            inputValue={inputValue}
            renderOption={option => <div>{option[props.name]}</div>}
            getOptionLabel={option => option[props.name]  || ""}
            onInputChange={onInputChangeHandler}
            disableClearable
            renderInput={(params) => (
                <TextField
                    {...params}
                    style={{ padding: '5px 0' }}
                    lable={params[props.name]}
                    placeholder={'Select ' + props.column.colId} />
            )}
        />
    );
})
