import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import MyCarousel from './MyCarousel';
import { FaHeart } from 'react-icons/fa';
import {FiHeart } from 'react-icons/fi'

import './card.css'
class MyCard extends Component {
  render() {
    return (
      <Card style={{ width: '20rem',height:'30rem', position:'relative' }} className="property-card">
        <MyCarousel/>
        <div 
          style={{
            position:'absolute',
            top:170,
            right:10,
            zIndex:4001, 
          }}
          className="hear-icon-style linkToFavourite"
          >
            <FiHeart size={25}
            style={{color:'white'}}
            />
            </div>
        <Card.Body>
          <Card.Title>Meridian Villas</Card.Title>
          <Card.Text>
                <address>
                    <span className="icn"><i className="fi flaticon-pin-1"></i></span>
                    <p>
                      The Village, Jersey City, NJ 07302, USA
                      </p>
                </address>
                <span className="status-info">For Rent</span>
                <h5 className=""><span className="textSecondary">$ 920,000</span> <span className="textUnit fwNormal">/ monthly</span></h5>
                <footer className="property-footer">
                    <ul className="propery-list-style">
                        <li>
                            <strong className="fwNormal elemenBlock text-primary">Area </strong>
                            <strong className="fwNormal elemenBlock">2100 m2</strong>
                        </li>
                        <li>
                            <strong className="fwNormal elemenBlock text-primary">Beds </strong>
                            <strong className="fwNormal elemenBlock">3</strong>
                        </li>
                        <li>
                            <strong className="fwNormal elemenBlock text-primary">Baths </strong>
                            <strong className="fwNormal elemenBlock">2</strong>
                        </li>
                        <li>
                            <strong className="fwNormal elemenBlock text-primary">Garages </strong>
                            <strong className="fwNormal elemenBlock">1</strong>
                        </li>
                    </ul>
                </footer>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

export default MyCard;