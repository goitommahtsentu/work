import React, { useState, forwardRef, useImperativeHandle } from "react";

//this doesn't work yet


const getRunningTotal = (params) => {
    const { id, credit, debit, estimate } = params?.data;
    let result;
    if (estimate) {
      result = "Estimate";
    }


    const filteredRow = rowData.filter((row) => row.estimate !== true);

    filteredRow.map((row, index) => {
      if (row.id === id) {
        if (index === 0) {
          result = credit - debit;
        } else {
          // first Running total
          // Cal second running total
          // cal 3rd running total
          const allRunningTotalNode = document.querySelectorAll(
            '[col-id="running_total"]'
          );

          const allRunningTotalArr = Array.from(allRunningTotalNode);
          allRunningTotalArr.shift();

          const filteredRunningTotal = allRunningTotalArr.filter(
            (runningTotal) => runningTotal.innerHTML !== "Estimate"
          );
          const prevRunningTotal =
            index === 0 ? credit - debit : filteredRunningTotal[index - 1];

          const prevTot = prevRunningTotal.innerHTML.replace(/[^0-9.-]+/g,"")



          const total =
              Number(prevTot) +
              Number(params.data.credit) -
              Number(params.data.debit);
          console.log("Prevtot",prevTot.replace(/[^0-9.-]+/g,""))
          result = total;
        }
      }
    });

    return result;
  };

export default getRunningTotal