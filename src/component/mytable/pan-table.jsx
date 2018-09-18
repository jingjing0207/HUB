import React,{Component} from 'react'
import { Table } from 'antd';
import propTypes from 'prop-types'


class PanTable extends Component{
    static propTypes={
        columns:propTypes.array.isRequired,
        data:propTypes.array.isRequired,
    }
    render(){
        const { columns,data,loadingPage,pagination  }=this.props
        return(
            <div>
                <Table columns={columns}
                       dataSource={data}
                       loading={loadingPage}
                       pagination={pagination}/>
            </div>
        )
    }
}
export default PanTable
