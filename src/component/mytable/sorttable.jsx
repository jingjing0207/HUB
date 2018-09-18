import React,{Component} from 'react'
import { Table } from 'antd';
import propTypes from 'prop-types'

import './my-table.css'

class SortTable extends Component{
    static propTypes={
        columns:propTypes.array.isRequired,
        data:propTypes.array.isRequired,
    }
    onChange=(pagination, filters, sorter)=>{
        this.props.sorterTableChange(pagination, filters, sorter)
    }
    changePage=(page)=>{
        console.log(page)
    }
    
    render(){
        const { columns,data,loadingPage,pagination }=this.props
        console.log(loadingPage,pagination)
        return(
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                    onChange={this.onChange}
                    loading={loadingPage}
                    pagination={pagination}/>
            </div>
        )
    }
}
export default SortTable
