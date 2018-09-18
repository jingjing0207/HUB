import React,{Component} from 'react'
import { Input } from 'element-react'


import './input.css'
export default class MyInput  extends Component{
    state={
        maxlength:380
    }
    render(){
        const {maxlength} =this.state
        console.log(this.props.groupcode)
        return(
            <div className="inputPar">
                <div className="leftPar1"></div>
                <div className="rightPar1">
                    <span className="spanLabel">{this.props.groupcode.spanlabel}</span>
                    <Input className="selectCon" maxLength={maxlength} value={this.props.groupcode.select}></Input>
                </div>
            </div>
        )
    }
}
