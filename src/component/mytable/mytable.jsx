import React,{Component} from 'react'
import { Table } from 'antd';
import propTypes from 'prop-types'


class MyTable extends Component{
    static propTypes={
        columns:propTypes.array.isRequired,
        data:propTypes.array.isRequired,
    }
    render(){
        const { columns,data}=this.props
        return(
            <div>
                <Table columns={columns}
                       dataSource={data}/>
            </div>
        )
    }
}
export default MyTable
