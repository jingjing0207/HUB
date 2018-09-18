import React,{Component} from 'react'
import { Input } from 'antd'
import propTypes from 'prop-types'


import './input.css'
export default class MyInput  extends Component{
    state={
        maxlength:380
    }
    static propTypes={
        value:propTypes.string.isRequired,
        addGroupData:propTypes.func.isRequired
    }
    changeInputValueComponent=(e)=>{
        let value=e.target.value
        this.props.addGroupData(value)
    }
    render(){
        const { maxlength } =this.state
        const currentInputValue=this.props.value===undefined ? '' : this.props.value
        return(
            <div className="inputPar">
                <div className="leftPar1"> </div>
                <div className="rightPar1">
                    <span className="spanLabel">{this.props.groupcode.spanlabel}</span>
                    {
                        this.props.disableInput===true ?
                            <Input className="selectCon"
                                   onChange={this.changeInputValueComponent}
                                   value={currentInputValue}
                                   maxLength={maxlength}
                                   disabled
                                   placeholder={this.props.groupcode.select}
                            >
                            </Input> :
                            <Input className="selectCon"
                                   onChange={this.changeInputValueComponent}
                                   value={currentInputValue}
                                   maxLength={maxlength}
                                   placeholder={this.props.groupcode.select}
                            >
                            </Input>
                            
                    }
                </div>
            </div>
        )
    }
}
