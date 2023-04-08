// import React from "react";


export function currencyFormatterForPublic(value) {
    // const agValue = params.value
    // console.log("stupid",agValue)
    if (isNaN(value))
    { return value}
    else if (value < 0) {return '-$' + formatNumber(parseFloat(value));}
    else {


    return '$' + formatNumber(value);
}}

function currencyFormatter(params) {
    // const agValue = params.value
    // console.log("stupid",agValue)
    if (isNaN(params.value))
    { return params.value}
    else if (params.value < 0) {return '-$' + formatNumber(parseFloat(params.value));}
    else {


    return '$' + formatNumber(params.value);
}}


function formatNumber(number) {
    // console.log("hey look at me",number)
    return Math.abs(number)
        .toFixed(2)
        .toLocaleString('en-US')
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export default currencyFormatter;