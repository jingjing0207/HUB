import React,{Component} from 'react'
import { Select, Radio } from 'antd';

import './select.css'

const Option = Select.Option;

class LotSelect extends Component{
    state = {
        size: 'default',
        initialValue: [],
    };
    
    handleSizeChange = (e) => {
        this.setState({ size: e.target.value });
    }
    handleChange=(value) =>{
        console.log(`Selected: ${value}`);
        console.log(typeof ((value)))
        this.props.addGroupData(value)
    }
    render(){
        console.log('==this.props.disable==>',this.props.disable)
        return(
            <div className="inputPar current-search-input">
                <div className="leftPar1 current-left-par1"> </div>
                <div className="rightPar1">
                    <span className="spanLabel">{this.props.groupcode.spanlabel}</span>
                    {
                        this.props.isValue===false ?
                            this.props.disable===false ?  <Select
                                    mode="multiple"
                                    size={this.state.size}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                    placeholder={this.props.groupcode.select}
                                    disabled
                                >
                                    {
                                        this.props.children.map((item,idx)=>(
                                            <Option key={idx} value={item.value}>{item.label}</Option>
                                        ))
                                    }
                                </Select> :
                                <Select
                                mode="multiple"
                                size={this.state.size}
                                onChange={this.handleChange}
                                style={{ width: '100%' }}
                                placeholder={this.props.groupcode.select}
                            >
                                {
                                    this.props.children.map((item,idx)=>(
                                        <Option key={idx} value={item.value}>{item.label}</Option>
                                    ))
                                }
                            </Select> : this.props.disable===false ?
                                <Select
                                    mode="multiple"
                                    size={this.state.size}
                                    value={this.props.currentValue}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                    placeholder={this.props.groupcode.select}
                                    disabled
                                >
                                    {
                                        this.props.children.map((item,idx)=>(
                                            <Option key={idx} value={item.value}>{item.label}</Option>
                                        ))
                                    }
                                </Select> :
                                <Select
                                    mode="multiple"
                                    size={this.state.size}
                                    value={this.props.currentValue}
                                    onChange={this.handleChange}
                                    style={{ width: '100%' }}
                                    placeholder={this.props.groupcode.select}
                                >
                                    {
                                        this.props.children.map((item,idx)=>(
                                            <Option key={idx} value={item.value}>{item.label}</Option>
                                        ))
                                    }
                                </Select>
                            
                    }
                </div>
            </div>
        )
    }
}
export default LotSelect
