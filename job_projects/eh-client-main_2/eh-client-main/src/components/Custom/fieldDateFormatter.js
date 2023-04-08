// import React from "react";

import moment from 'moment';



function fieldDateFormatter(field) {

    if (field == null)
    { return ""}
    else {
      return moment(field).format("LL");
}}

export default fieldDateFormatter;