import React,{Component} from 'react'
import { Select } from 'element-react'


import './select.css'
export default class MySelect  extends Component{
    // state={
    //     value:'12313'
    // }
    render(){
        // const {value}=this.state
        const {groupcode} =this.props
        return(
            <div className="selectPar">
                <div className="leftPar"></div>
                <div className="rightPar">
                    <span className="spanLabel">{groupcode.spanlabel}</span>
                    <Select className="selectCon" value={groupcode.select}>
                        {
                            groupcode.options.map((item)=>{
                                return (
                                    <Select.Option key={item.value} label={item.label} value={item.value} />
                                )
                            })
                        }
                    </Select>
                </div>
            </div>
        )
    }
}
 