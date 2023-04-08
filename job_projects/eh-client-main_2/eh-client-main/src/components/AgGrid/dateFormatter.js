// import React, { useState, forwardRef, useImperativeHandle } from "react";

import moment from 'moment';



function dateFormatter(params) {

    if (params.value == null)
    { return ""}
    else {
      return  moment(params.value).format("L");
}}

export default dateFormatter;