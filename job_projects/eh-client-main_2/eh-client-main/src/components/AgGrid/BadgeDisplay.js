import React, { Component} from 'react';

class BadgeDisplayRenderer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{
          position:'relative'
      }}>
         {this.props.value} {this.props.value==this.props.currentUser&&<span 
         style={{
            position:'absolute',
            top:0,
            right:"-15px"
        }}
         class="badge badge-danger">1</span>}
      </div>
    )
  }
}

export default BadgeDisplayRenderer;