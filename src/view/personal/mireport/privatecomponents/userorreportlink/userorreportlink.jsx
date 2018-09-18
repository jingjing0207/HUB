import React,{Component} from 'react'
import MyPrivateLink from './userprivatelink/userprivatelink'
import { Radio } from 'antd';



import './user-or-report-link.css'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class UserOrReportLink extends Component{
    render(){
        const redioData=[
            {key:'1',label:'User List',path:'/userlist'},
            {key:'2',label:'Report List',path:'/reportlist'},
            {key:'2',label:'Report Action',path:'/reportaction'},
        ]
        return(
            <div>
                <RadioGroup>
                    {
                        redioData.map((item,idx)=>{
                            return (
                                <MyPrivateLink to={item.path} key={idx}>
                                    <RadioButton value={item.key}>{item.label}</RadioButton>
                                </MyPrivateLink>
                            )
                        })
                    }
                </RadioGroup>
            </div>
        )
    }
}
export default UserOrReportLink
