import React,{Component} from 'react'
import { Table } from 'antd';
import propTypes from 'prop-types'


class PrivateTable extends Component{
    static propTypes={
        columns:propTypes.array.isRequired,
        data:propTypes.array.isRequired,
    }
    render(){
        const { columns,data }=this.props
        return(
            <div>
                <Table columnWidth='300' columns={columns} dataSource={data} scroll={{ x: 1800, y: 300 }} />
            </div>
        )
    }
}
export default PrivateTable
