import React from "react";

class AddRow extends React.Component {
     constructor(props) {
       super(props);
     }
              //ag-Grid hook ready
  onGridReady = params => {
    this.gridApi = params.api;

  };
  //ag-Grid add new row functions
  onAddRow = () => {

    this.gridApi.updateRowData({
      add: [{ make: 'BMW', model: 'S2', price: '63000' }]
         });

}
}
export default AddRow;
