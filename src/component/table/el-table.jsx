import React,{Component} from 'react'
import {Table} from 'element-react'
import  propTypes  from 'prop-types'

import './el-table.css'
export default class MyTable  extends Component{
    static propTypes={
        columns:propTypes.array.isRequired,
        data:propTypes.array.isRequired
    }
    render(){
        const {columns,data}=this.props
        return(
            <div>
                <Table calssName="tableWrap"
                       style={{width: '100%'}}
                       columns={columns}
                       data={data}
                       border={true}
                       highlightCurrentRow={true}
                       onCurrentChange={item=>{console.log(item)}}
                />
            </div>
        )
    }
}
