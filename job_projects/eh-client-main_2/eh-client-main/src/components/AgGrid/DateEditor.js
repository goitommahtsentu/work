import React, { useState, forwardRef, useImperativeHandle } from "react";
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';


export default forwardRef((props, ref) => {
    const [selectedDate, setSelectedDate] = useState([]);

    function handleDateChange(d) {
        if (d) {
            d.setHours(0, 0, 0, 0);
        }
        setSelectedDate(d);
    }

    useImperativeHandle(ref, () => {
        return {
            getValue: () => {
                let dateString = null;
                if (selectedDate) {
                    dateString = format(selectedDate, 'yyyy-MM-dd');
                }
                return dateString;
            },
            isCancelAfterEnd: () => {
                return !selectedDate;
            },
            afterGuiAttached: () => {
                if (!props.value) {
                    return;
                }
                const sdate = props.value;
                let selectedDate = new Date(sdate);
                selectedDate.setUTCDate(selectedDate.getUTCDate() + 1);
                setSelectedDate(selectedDate);
            }
        };
    });

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                style={{ width: '100%', margin: 0, padding: '6px 10px', }}
                margin="normal"
                id="date-picker-dialog"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                variant="inline"
                disableToolbar
                placeholder={'Enter ' + props.column.colId}
            />
        </MuiPickersUtilsProvider>
    )
});