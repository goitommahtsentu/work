import React, { Component } from 'react';
import './AgencyCard.css'
export default function AgencyCard() {
    return (
<article className="profileColumn hasOver">
    <div className="aligncenter">
        <a href="agent-detail.html" tabindex="0">
            <img src="https://via.placeholder.com/260x260" alt="Emmy Ramos Buying Agent" /> 
        </a>
    </div>
    <div className="textWrap">
        <h2 className="fontNeuron text-capitalize"><a href="agent-detail.html" tabindex="0">Emmy Ramos</a></h2>
        <h3 className="fwNormal text-capitalize">Buying Agent</h3>
        <div className="collapseWrap">
            <ul className="list-unstyled socialNetworks profileColumnSocial">
                <li><a href="#" tabindex="0"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="#" tabindex="0"><i className="fab fa-twitter"></i></a></li>
                <li><a href="#" tabindex="0"><i className="fab fa-instagram"></i></a></li>
                <li><a href="#" tabindex="0"><i className="fab fa-google"></i></a></li>
            </ul>
        </div>
    </div>
</article>
    )
  }
