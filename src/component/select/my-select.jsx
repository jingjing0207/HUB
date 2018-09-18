import React,{Component} from 'react'
import { Select } from 'antd'
import propTypes from 'prop-types'


import './select.css'
const Option = Select.Option;

export default class MySelect  extends Component{
    
    static propTypes={
        groupcode:propTypes.object.isRequired,
        changeSelectValue:propTypes.func.isRequired,
        // defaultValue:propTypes.string.isRequired,
        // defaultValue:propTypes.number.isRequired,
        
    }
    handleChange=(value)=> {
        this.props.changeSelectValue(value)
    }
    render(){
        const { groupcode } =this.props
        return(
            <div className="selectPar">
                <div className="leftPar"></div>
                <div className="rightPar">
                    <span className="spanLabel">{groupcode.spanlabel}</span>
                    <Select className="selectCon" value={this.props.defaultValue} style={{ width: 195 }} onChange={this.handleChange}>
                        {
                            groupcode.options.map((item,idx)=>{
                                return (
                                    <Option key={item.label} value={item.value} >{item.label}</Option>
                                )
                            })
                        }
                    </Select>
                </div>
            </div>
        )
    }
}
