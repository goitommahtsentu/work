// import React from "react";



  const checkBoxRenderer = (params) => {
    var input = document.createElement('input');
    input.type="checkbox";
    input.checked=params.value;
    input.addEventListener('click', function (event) {
      params.value=!params.value;
      params.node.data.paid_bill = params.value;
    const id = params.data.id;
    const field = params.colDef.field;
    const data = params.value
    const rowNode = params.api.getRowNode(id);
    console.log("this should have updated the check box with this stuff", field, data,  id, rowNode)
      rowNode.setDataValue(field, data);
    });
    return input;
  }

export default checkBoxRenderer