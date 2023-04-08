import React from 'react'
import './properties.css'

export default function PopularProperties() {
    return (
        <div>
               <section className="mostPostsBlock bgWhite">
        <div className="container">
            <h1 className="fontNeuron blockH text-uppercase "><span className="bdrBottom">MOST POPULAR</span> <span className="textSecondary">PLACES</span></h1>
            <div className="row">
                <div className="col-xs-12 col-sm-6">
                    <a href="properties-detial.html" className="visualPostColumn hasOver elemenBlock text-center type01 textWhite">
                        <span className="bgCover elemenBlock" style={{backgroundImage: "url(https://via.placeholder.com/555x450)"}}></span>
                        <div className="captionWrap">
                            <h2 className="fontNeuron">New York</h2>
                            <h3 className="fontNeuron fwNormal">24 Properties</h3>
                        </div>
                    </a>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <a href="properties-detial.html" className="visualPostColumn hasOver elemenBlock text-center type02 textWhite">
                        <span className="bgCover elemenBlock" style={{backgroundImage: "url(https://via.placeholder.com/555x210)"}}></span>
                        <div className="captionWrap">
                            <h2 className="fontNeuron">Chicago</h2>
                            <h3 className="fontNeuron fwNormal">24 Properties</h3>
                        </div>
                    </a>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <a href="#" className="visualPostColumn hasOver elemenBlock text-center type03 textWhite">
                                <span className="bgCover elemenBlock" style={{backgroundImage: "url(https://via.placeholder.com/265x210)"}}></span>
                                <div className="captionWrap">
                                    <h2 className="fontNeuron">Los Angeles</h2>
                                    <h3 className="fontNeuron fwNormal">24 Properties</h3>
                                </div>
                            </a>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <a href="properties-detial.html" className="visualPostColumn hasOver elemenBlock text-center type03 textWhite">
                                <span className="bgCover elemenBlock" style={{backgroundImage: "url(https://via.placeholder.com/265x210)"}}></span>
                                <div className="captionWrap">
                                    <h2 className="fontNeuron">San Francisco</h2>
                                    <h3 className="fontNeuron fwNormal">24 Properties</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
        </div>
    )
}
