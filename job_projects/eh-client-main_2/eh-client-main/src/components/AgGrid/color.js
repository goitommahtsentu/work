



  export const billColor = {
              'theme-bg text-white': 'data.paid_bill === true && data.debit > 0',
      'theme-bg2 text-white': 'data.paid_bill === false && data.debit > 0',
  }

  export const rtpColor = {
      'theme-bg text-white': 'data.assigned_investor_id !== null && data.assigned_investor_id !== "Not Assigned" && data.investor_price > 1',
      'border-left border-right border-danger border-bottom-0 border-5 font-weight-light': 'data.qual_home === true',
      'theme-bg2 text-white': 'data.sold_to_investor === true && data.assigned_investor_id !== null && data.assigned_investor_id !== "Not Assigned"',
  }


