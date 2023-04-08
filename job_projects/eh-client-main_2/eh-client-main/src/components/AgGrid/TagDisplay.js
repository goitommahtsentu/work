import React, {Component} from 'react'

class TagDisplay extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
            {this.props.suggestions.filter(i=>this.props.value?.includes(i.id)) .map((tag,index)=><span className="text-white f-15 theme-bg2 badge mr-1" key={index}>{tag.name}</span>)}
        </div> 
      )
    }
  }
  
  export default TagDisplay;