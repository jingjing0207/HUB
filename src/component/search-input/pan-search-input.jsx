import React,{Component} from 'react'
import { Select,Icon } from 'antd';
import propTypes from 'prop-types'

import './search-input.css'
const Option = Select.Option;

class SearchInput extends Component {
    state = {
        size: 'default'
    };
    static propTypes = {
        states: propTypes.array.isRequired,
        searchContent:propTypes.func.isRequired,
    }
    handleChange = (value) => {
        console.log('current=>',value)
        this.props.searchContent(value,this.props.page-1,this.props.size)
    }
    
    handleBlur = () => {
        console.log('blur');
    }
    
    handleFocus = () => {
        console.log('focus');
    }
    changeInputValue=(value)=>{
        console.log(`selected ${value}`);
        if(value===undefined) {
            this.props.getTableData(value,this.props.page-1,this.props.size)
        }
    }
    // searchChange=(value)=>{
    //     console.log(value)
    //     this.props.searchContent(value)
    // }
    render() {
        return (
            <div className="commonInput">
                <Select
                    showSearch
                    size={this.state.size}
                    allowClear={true}
                    style={{width: 250}}
                    placeholder="Search"
                    optionFilterProp="children"
                    onChange={this.changeInputValue}
                    onSelect={this.handleChange}
                    // onSearch={this.searchChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                >
                    {
                        this.props.states.map((item, idx) => {
                            return (
                                <Option key={idx} value={item.value}>{item.label}</Option>
                            )
                        })
                    }
                </Select>
                <Icon type="search" className="searchIcon" />
            </div>
        )
    }
}
export default SearchInput
