import React, { Component } from 'react'
import { css, StyleSheet } from 'aphrodite/no-important';
import NoImages from '../../assets/images/trust-photo-placeholder.jpg';

const classes = StyleSheet.create({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    borderRadius: ".2rem",
    padding: "1rem",
    background: "white",
    boxShadow: "1px 0px 4px -1px #d2d5d6",
    margin: "0.25rem",
    cursor: "pointer",
    maxWidth: 250
  },

  image: {
    width: 75,
    height: 50,
    marginRight: "0.5rem",
    borderRadius: ".1rem",
  },

  adjust: {
    marginTop: "-6px"
  },

  textWrapper: {
    maxWidth: 150,
    whiteSpace: "break-spaces",
    fontSize: "10px"
  },

  subtitle: {
    marginTop: "0.25rem"
  },
})

export class CustomCard extends Component {
  
  render() {
    let noImage = NoImages
    // the image needs to be refactored or it breaks the page
    // let getPhoto = (data) => {
    //   if (data !== null) {
    //     let obj = Object(data[0])
    //     console.log('obj', obj.photo)
    //     return obj.photo
    //   }
    // }
    // let photo = this.props.photos[0]
    // console.log("photo", photo)
    // console.log(this.props.photos)
    // let image = getPhoto(this.props.photos) || noImage;
    let image =   this.props.image || NoImages;
    let name = this.props.name || this.props.title;
    let full_address = this.props.full_address || this.props.description;
    let investor_id = this.props.owner || this.props.description;
    let family_id = this.props.family || this.props.description;

    return (
      <div
        onClick={this.props.onClick}
        data-id={this.props.id}
        className={`${this.props.className} ${css(classes.wrapper)}`}
      >

        <img src={image} alt="profile"
          className={css(classes.image)} />

        <div className={css(classes.adjust)}>
          <div><b>{name}</b></div>
          <section className={css(classes.textWrapper)}>
            <div>{full_address}</div>
            <div className={css(classes.subtitle)}>{investor_id}</div>
            <div className={css(classes.subtitle)}>{family_id}</div>
          </section>
        </div>
      </div>
    )
  }
}