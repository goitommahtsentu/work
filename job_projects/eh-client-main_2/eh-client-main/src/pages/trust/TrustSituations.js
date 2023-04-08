import React, { useState, useEffect, useRef,useCallback } from 'react';
import {Button, Card} from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import {useHistory} from 'react-router-dom'
// Import AG Grid
import 'ag-grid-enterprise';
import dateFormatter from "../../components/AgGrid/dateFormatter";
import currencyFormatter from "../../components/AgGrid/currencyFormatter";
import gridOptions from "../../components/AgGrid/gridOptions";
import { rtpColor } from "../../components/AgGrid/color";

import checkBoxRenderer from "../../components/AgGrid/checkBoxRenderer";

import {Trusts,Investors,Situations} from '../../services';

import { getParsedListForTrust ,getInvestorsName} from '../../utils/parsedList';
import {useSelector, connect,useDispatch } from 'react-redux';
import { updateSituationList, updateTrustList } from '../../store/action_calls';
import { fetchNextData } from '../../utils/recursiveCall';
import { useLocalStorage } from '../../utils/useLocalStorage';
import {cloneDeep} from 'lodash'

const TrustRTP = props => {
    const history= useHistory()
    const user = useSelector(state => state.account.user.user);
    const [rowData, setRowData] = useState([]);
    const [investorsName, setInvestorsName] = useState([]);
    const [isInvestorsNameReady, setIsInvestorsNameReady] = useState(false);
    const gridRef = useRef(null);
    const [dropdownState,setDropdownState]=useState({})
    //this is regarding data uploading I will use this in the future, but this is where we set the grid to be able to show updates
    //API params!
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    const [setupStage,setSetupStage]=useState([])
   
    const [situationOptions,setSituationOptions]=useState([])

    useEffect(()=>{
    const getOptions=async()=>{
        const data=await Situations.getOptions()
        data&&setSituationOptions(data)
    }
    getOptions()
    },[])
    const dispatch=useDispatch()
const storeInvestorsResponse=(investors)=>{
    setInvestorsName([investorsName,...getInvestorsName(investors)])
}
useEffect(()=>{
  const getInvestors=async()=>{
      const {data}=await Investors.getInvestors()
      storeInvestorsResponse(data)
      await fetchNextData(data,storeInvestorsResponse)
      setIsInvestorsNameReady(prev=>!prev)

  }
   getInvestors().then(r => console.log('check'))
},[])
    //this is a magical filtered get, it is filtering the whole json file by one of the calculated fields.
    
    // useEffect(() => {
    //     // if(Object.keys(props.trustList).length!=0){
    //     //     const data=Object.values(props.trustList)
    //     //     const filtered = data.filter((datum) => {
    //     //         return datum.owner === null;
    //     //     })
    //     //     //
    //     //     setRowData(getParsedListForTrust(filtered))
    //     // }


    //     const getSituations=async()=>{
    //         const data=await Situations.getAllSituations()
    //         setRowData(data)
    //     }
    //     getSituations()
    //  },[]);

     const endTrustIndex=useRef(0)
     useEffect(() => {
        if(!gridRef) return
          const allSituationsList=cloneDeep(Object.values(props.situationsList))
          if(allSituationsList.length===0) return
           if(rowData?.length===0) {
               setRowData(allSituationsList)
               endTrustIndex.current=allSituationsList.length
        }
           else if(endTrustIndex.current!==allSituationsList.length) {
               gridRef.current?.api?.addItems(allSituationsList.slice(endTrustIndex.current,allSituationsList.length))
               endTrustIndex.current=allSituationsList.length
           }
        },[props.situationsList,gridRef]);

     const updateRowData = useCallback((id,data) => {
        var rowNode = gridRef.current.api.getRowNode(id);
        rowNode.setData(data);
      }, []);


    // Enpoint Calls for making edited dat push to the backend and update the data
    const handleUpdate = async(body) => {
        // console.log("Update", body.data.id, "Field:", body.colDef.field, "New Value:", body.newValue)
        const id = body.data.id
        let obj = {};
        obj[body.colDef.field] = body.newValue
        console.log(Object.keys(dropdownState).length,'drd')
        if(Object.keys(dropdownState).length!==0)
        {
            console.log(dropdownState,'drd')
            obj=dropdownState
        }
        const data=await Situations.updateSituation(id,obj)
        data&&updateRowData(data.id,data)
        data&&dispatch(updateSituationList(data))
        // data&&setRowData(prev=>prev.map(row=>row.id==data.id?data:row))
        setDropdownState({})
    }

    // these are the AG grid Col Parameters
    const defaultColDef = {
        filter: 'agMultiColumnFilter',
        sortable: true,
        enableRowGroup: true,
        resizable: true,
        flex: 1,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    }

    const cellRendererParams = {
        clicked: function (id) {
            history.push(`/situations/${id}`);
        },
    }

    const badgeDisplayRenderer = {
        currentUser: user.first_name +" "+ user.last_name
    }



    //this allows the ag-Grid api method to work
    const handleGridReady = params => {
        setGridApi(params.api);
        setColumnApi(params.columnApi);
    };
    const [quickfilter,setQuickfilter]=useLocalStorage('trustsituation_list_filter_text','')
    useEffect(()=>{
        if(gridApi){
            gridApi.setQuickFilter(quickfilter.trim());
        }
    },[quickfilter,gridApi])
    function onFilterTextBoxChanged() {
        const textSearch=document.getElementById('filter-text-box').value
        setQuickfilter(textSearch)
    }

    useEffect(()=>{
        const getStages=async()=>{
            const data=await Trusts.getSetups()
            setSetupStage(data)
        }
        getStages()
    },[])



    const handleNewSits = async(id) => {
        // console.log("New Line Created For Trust Id", props.id)
        const obj = {};
        obj["trust_id"] = props.id
        const data=await Situations.createSits(obj)
       if(data) setRowData(prevState=>[data,...prevState])
    }
  

    const valueGetterSituationType = params => {
        const value=params.context.situationOptions.filter(options=>options.value===params.data?.situation_type)
        if(value.length>0){
            return value[0].display_name
        }
        return params.data?.situation_type
    };

    const valueSetterSituationType = params => {
        // setDropdownState({assigned_investor_id:params.newValue})
        console.log("hello")
        params.data.situation_type = params.newValue;
        return true;
    };

    const  handleDeleteSituation=async(id)=>{
        setRowData(prev=>prev.filter(i=>i.id!=id))
        await Situations.handleDeleteSituation(id)
    }
  
      const cellRendererParamsDelete = {
          clicked: function (id) {
           handleDeleteSituation(id)
          },
      }

      const [sortConfig,setSortConfi]=useLocalStorage('trustsituation_list_order',[])
      const [filterConfig,setFilterConfi]=useLocalStorage('trustsituation_list_filter',{"handled":{"filterType":"multi","filterModels":[null,{"values":["false"],"filterType":"set"}]}})

const   onSortChanged=(params)=> {
   let sortModel = params.api.getSortModel();
   setSortConfi(sortModel)
 }
 const  onFirstDataRendered=(params) =>{
   let sortModel = sortConfig;
   if (sortModel) {
     gridApi?.setSortModel(sortModel);
   }
   let filterModel=filterConfig
   if(filterModel){
       gridApi?.setFilterModel(filterModel)
   }
 }


 const onFilterChanged=(params)=>{
    let filterModel = params.api.getFilterModel();
    setFilterConfi(filterModel)

  }

  const getRowId = useCallback(function (params) {
    return params.data.id;
  }, []);

  const [suggestionsAll,setSuggestionsAll]=useState([])

useEffect(()=>{
    (async()=>{
    const data=await Situations.getSituationTags()
    data&&setSuggestionsAll(data)
    })()

},[])
const tagDisplay =(params)=>{
    console.log({tagDisplay:params})
    return {suggestions:params.context.suggestions}
}
    return (
        <Card  style={{ height: 910 }}>
            <Card.Body>
                <div className="ag-theme-alpine" style={{ height: 800 }}>
                    {/*these Buttons do not do anything, it couple be a link to the create trust form */}

                    <Button className="shadow-1 theme-bg border border-0 "
                            onClick={() => {
                                gridApi.applyTransaction({ add:[{}]});
                                handleNewSits()
                            }}

                    >
                        Add </Button>
                    {/*this is the actual input for the search text*/}
                    <div className="form-inline float-right" >
                        <input type="text" className="form-control " id="filter-text-box"
                               placeholder="Filter..." onInput={onFilterTextBoxChanged}
                               value={quickfilter}
                        />
                    </div>
                    {<AgGridReact
                        onGridReady={handleGridReady}
                        defaultColDef={defaultColDef}
                        ref={gridRef}
                        rowData={rowData}
                        context={{
                            trustList:Object.values(props.trustList),
                            investorList:Object.values(props.investorList),
                            suggestions:suggestionsAll,
                            situationOptions:situationOptions
                        }}
                        // Editing
                        onCellValueChanged={handleUpdate}
                        gridOptions={gridOptions}
                        stopEditingWhenCellsLoseFocus={false}

                        // groupping
                        rowGroupPanelShow={'always'}
                        groupSelectsChildren={true}
                        suppressRowClickSelection={true}
                        getRowNodeId={function (data) {
                            return data.id;
                        }}
                        getRowId={getRowId}
                        rowClassRules={rtpColor}
                        onFilterChanged={onFilterChanged}
                        onSortChanged={onSortChanged}
                        onFirstDataRendered={onFirstDataRendered}
                    >
                      <AgGridColumn field="id"  headerName="" suppressMenu={true} cellRenderer={'agGroupCellRenderer'} cellRendererParams={{
                          checkbox:true
                      }} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                        <AgGridColumn field="id"  headerName="" suppressMenu={true} cellRenderer={'openCellRenderer'} cellRendererParams={cellRendererParams} editable={false} sort={false} filter={false} flex={.2} minWidth={80} />
                        <AgGridColumn headerName="Show Notes">
                            <AgGridColumn
                                field="issue"
                                headerName="Issue"
                                editable={true} />
                            <AgGridColumn
                                field="notes"
                                columnGroupShow="open"
                                headerName="Notes"
                                editable={true} />
                        </AgGridColumn>

                        <AgGridColumn headerName="Show Address" headerTooltip="Show Address">
                            <AgGridColumn
                                field="trust_name"
                                headerName="Trust"
                                cellEditor="autoCompleteEditor"
                                cellEditorParams={(params)=>{
                                    return {name:'name',options:params.context.trustList ,setDropdownState , field:'trust_id'}
                                }}
                                editable={true}
                                flex={.5}
                                minWidth={120}

                            />
                            <AgGridColumn
                                field="address"
                                headerName="Address"
                                columnGroupShow="open"
                                editable={false}
                            />
                        </AgGridColumn>
                        <AgGridColumn headerName="Investor & Entity" headerTooltip="Investor & Entity">
                            <AgGridColumn
                                field="situation_type"
                                valueGetter={valueGetterSituationType}
                                valueSetter={valueSetterSituationType}
                                cellEditor="selectEditor"
                                cellEditorParams={(params)=>({name:'display_name',
                                    options:params.context.situationOptions
                                    ,setDropdownState , field:'situation_type'

                                })

                                }
                                editable={true}
                                headerTooltip="Situation Type"
                                headerName="Situation Type"
                                minWidth={120}
                                maxWidth={160}
                            />
                            <AgGridColumn
                                // valueGetter={valueGetterInvestor}
                                // valueSetter={valueSetterInvestor}
                                field="investor_name"
                                headerTooltip="Investor"
                                headerName="Investor"
                                columnGroupShow="open"
                                cellEditor="autoCompleteEditor"
                                cellEditorParams={(params)=>{
                                    return  {name:'full_name',options:params.context.investorList ,setDropdownState , field:'investor_id'}
                                }
                                }
                                editable={true}
                            />
                            <AgGridColumn
                                field="related_entity_name"
                                headerName="Related Entity"
                                headerTooltip="Related Entity"
                                columnGroupShow="open"
                                cellEditor="autoCompleteEditor"
                                cellEditorParams={{name:'full_name',options:Object.values(props.contactList) ,setDropdownState , field:'related_entity_id'}}
                                editable={true}
                            />
                        </AgGridColumn>
                        <AgGridColumn
                            headerTooltip="Handled"
                            headerName="Handled"
                            field="handled"
                            flex={.3}
                            cellRenderer={checkBoxRenderer}
                        />
                        <AgGridColumn
                            headerTooltip="Next Task"
                            field="next_todo_title"
                            headerName="Next Task"
                            columnGroupShow="closed"
                            editable={false}
                        />
                        <AgGridColumn
                            headerTooltip="Next Assigned To"
                            field="next_todo_employee"
                            headerName="Next Assigned To"
                            columnGroupShow="closed"
                            cellRenderer={'badgeDisplayRenderer'}
                            cellRendererParams={badgeDisplayRenderer}
                            editable={false}
                           maxWidth={150}
                            />
                        <AgGridColumn
                            headerTooltip="Last Completed"
                            field="last_completed_todo_date"
                            headerName="Last Completed"
                            filter='agDateColumnFilter'
                            valueFormatter={dateFormatter}
                            columnGroupShow="closed"
                            minwidth={120}
                            flex={.4}
                            editable={false}
                        />
                            <AgGridColumn
                               field="tag_ids"
                               headerName="Tags"
                               headerTooltip="Tags"
                            //    columnGroupShow="open"
                               cellRenderer={'tagDisplay'}
                               cellRendererParams={tagDisplay}
                               cellEditor={"tagEditor"}
                               cellEditorParams={(params)=>{
                                return  {value:params.value,suggestions:params.context.suggestions}
                            }
                            }
                            //    cellEditor="tagDisplay"
                            //    cellEditorParams={{suggestions:suggestionsAll}}
                            editable={true}
                            flex={.5}
                        />

                        <AgGridColumn
                            field="id"
                            headerName=""
                            suppressMenu={true}
                            cellRenderer={'btnCellRenderer'}
                            cellRendererParams={cellRendererParamsDelete}
                            editable={false}
                            sort={false}
                            filter={false}
                            flex={.2}/>
                    </AgGridReact>
                    }
                </div>
            </Card.Body>
        </Card>
    );
};


const mapStateToProps = state => ({
    trustList: state.trustReducer.trustList,
    addressList:state.addressReducer.addressList,
    contactList: state.contactReducer.contactList,
    investorList:state.investorReducer.investorList,
    situationsList:state.situationsReducer.situationsList
})

export default connect(mapStateToProps, null)(TrustRTP)