import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

const BadgeDisplayRenderer =(props)=> {
    const [total,setTotal]=useState(0)
     const history=useHistory()
    useEffect(()=>{
        const totalNumlocal=parseInt(localStorage.getItem('total-situation-assigned'))
       !isNaN(totalNumlocal)&&setTotal(totalNumlocal)
    },[localStorage.getItem('total-situation-assigned')])

    return (
      <div style={{
          position:'relative',
          cursor:'pointer'
      }}
      onClick={
          ()=>history.push('/situations')
      }
      className="trust-situation-menuitems"
      >
          Trust Situations
          {total!=0&&<span 
         style={{
            position:'absolute',
            top:0,
            right:"-15px"
        }}
         class="badge badge-danger">{total}</span>}
      </div>
    )
}

export default BadgeDisplayRenderer;