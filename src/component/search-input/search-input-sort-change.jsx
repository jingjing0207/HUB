import React,{Component} from 'react'
import { Select,Icon } from 'antd';
import propTypes from 'prop-types'

import './search-input.css'
const Option = Select.Option;

class SearchInputSortChange extends Component {
    state = {
        size: 'default',
        currentPage:1,
        currentSize:15
    };
    static propTypes = {
        states: propTypes.array.isRequired,
        searchContent:propTypes.func.isRequired,
    }
    handleChange = (value) => {
        console.log('current=>',value)
        this.props.searchContent(value)
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
            sessionStorage.setItem(value,'currentInputValueSatus')
            this.props.getTableData(value,this.props.page-1,this.props.size,this.props.selectSortType)
        }
    }
    searchChange=(value)=>{
        console.log(value)
        // sessionStorage.setItem(value,'currentSearchValue')
        this.props.blurSearchQuery(value,this.state.currentPage-1,this.state.currentSize,this.props.selectSortType)
        // this.props.blurSearchQuery(value,this.props.page-1,this.props.size,this.props.selectSortType)
    }
    render() {
        console.log('this.props.states',this.props.states)
        return (
            <div className="commonInput">
                <Select
                    showSearch
                    size={this.state.size}
                    allowClear={true}
                    style={{width: 250}}
                    // open={false}
                    placeholder="Search"
                    optionFilterProp="children"
                    onChange={this.changeInputValue}
                    onSelect={this.handleChange}
                    onSearch={this.searchChange}
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
export default SearchInputSortChange
