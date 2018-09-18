import React,{Component} from 'react'
import { Select,Icon } from 'antd';
import propTypes from 'prop-types'

import './search-input.css'
const Option = Select.Option;

class SearchInputDfaultValue extends Component {
    state = {
        size: 'default'
    };
    static propTypes = {
        states: propTypes.array.isRequired,
        searchContent:propTypes.func.isRequired,
        getTableData:propTypes.func.isRequired
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
        if(value!==undefined){
            this.props.searchContent(value)
        }else if(value===undefined){
            this.props.getTableData()
        }
    }
    
    handleBlur = () => {
        console.log('blur');
    }
    
    handleFocus = () => {
        console.log('focus');
    }
    render() {
        return (
            <div className="commonInput">
                <Select
                    showSearch
                    size={this.state.size}
                    defaultValue={this.props.currentBackupValue}
                    allowClear={true}
                    style={{width: 200}}
                    placeholder="Search"
                    optionFilterProp="children"
                    onChange={this.handleChange}
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
export default SearchInputDfaultValue
