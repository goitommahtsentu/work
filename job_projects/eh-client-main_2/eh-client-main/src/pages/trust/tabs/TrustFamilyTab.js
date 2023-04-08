import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Button, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';

// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../../components/AgGrid/currencyFormatter";

import LoanModal from '../modals/LoanModal';
import {Trusts} from '../../../services';
import { getParsedListForTrust } from '../../../utils/parsedList';

const FamilyTabView = props => {
    const [rowData, setRowData] = useState([]);

    // This is for the Edit switch
    const [FamSwitch, setFamSwitch] = useState(false);

    const toggleHandler = () => {
        setFamSwitch((prevState) => !prevState);
    };

    

    const getList = async() => {
         const data= await Trusts.getFamilyHistory(props.id)
         setRowData(getParsedListForTrust(data))
    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: true,
        sortable: false,
        editable: true,
    }


    useEffect(() => {
        getList()
    }, [props.id]);


    return (
        <React.Fragment>
            <Card.Header>
                <Card.Title as="h5">Family History</Card.Title>
                <OverlayTrigger overlay={<Tooltip>Create a loan by pressing this button</Tooltip>} style={{ float: "right" }}>
                    <LoanModal />
                </OverlayTrigger>
                <div className="switch d-inline m-r-10 float-right">
                    <Form.Control
                        type="checkbox"
                        id="famswitch"
                        famswitch={FamSwitch}
                        onChange={() => toggleHandler}
                    />
                    <Form.Label htmlFor="famswitch" className="cr" />
                    <Form.Label>Show Inv History</Form.Label>
                </div>
            </Card.Header>
            <div className="ag-theme-alpine" style={{ height: 400 }}>
                <AgGridReact
                    defaultColDef={defaultColDef}
                    // sizeColsToFix={true}
                    // autoSizeColumns={'allColIds'}
                    // quickFilter={'1'}
                    rowData={rowData}>
                    <AgGridColumn field="family_id" headerName="Family" width={210} />
                    <AgGridColumn field="fam_price" headerName="Price" width={110} valueFormatter={currencyFormatter} />
                    <AgGridColumn field="move_in_date" headerName="Move In" width={130} valueFormatter={dateFormatter}/>
                    <AgGridColumn field="move_out_date" headerName="Move Out" width={130} valueFormatter={dateFormatter}/>
                    <AgGridColumn field="investor_id" headerName="Investor" width={210} />
                    <AgGridColumn field="inv_purchase_price" headerName="Price" width={110} valueFormatter={currencyFormatter} />
                    <AgGridColumn field="purchase_date" headerName="Purchase Date" flex={1} valueFormatter={dateFormatter}/>
                </AgGridReact>
            </div>
        </React.Fragment>
    );
};

export default FamilyTabView;