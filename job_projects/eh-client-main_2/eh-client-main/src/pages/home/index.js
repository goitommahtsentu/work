import React from 'react'
import {Route } from 'react-router-dom'
import './NewHome/assets/css/responsive.css'
import './NewHome/assets/css/style.css'
import './NewHome/assets/css/font-icons.css'
import HomeIndex from './NewHome/index'
import ProductDetails from './NewHome/product-details'
import SearchResults from './NewHome/SearchResults'

export default function Home(props) {
    console.log(props.match.path)
    return (
      <>
        <Route exact path={`${props.match.path}`} component={HomeIndex} exact />
        <Route path={`${props.match.path}product-details/:id`} component={ProductDetails} />
        <Route path={`${props.match.path}search-result/`} component={SearchResults} />
        <Route path={`${props.match.path}users`}  component={()=><div>users</div>} />
      </>
    )
}
