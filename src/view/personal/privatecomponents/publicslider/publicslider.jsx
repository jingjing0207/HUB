import React,{Component} from 'react'
import { Link } from 'react-router-dom'
import MyPrivateLink from './privatelink/private-link'
import { GET_INFORMATION } from '../../../../constants/constants'


import './publicslider.css'
import {HttpGet} from "../../../../server/get";
class PublicSlider extends Component{
    state={
        isAdminLogin:false,
    }
    
    componentDidMount(){
        this.getIsAdminLogin()
    }
    getIsAdminLogin=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log(res)
                this.setState({
                    isAdminLogin:res.data.identity ==='USER' ? false : true
                })
                sessionStorage.setItem("isAdminLogin",this.state.isAdminLogin)
            })
            .catch((err)=>{
            
            })
    }
    render(){
        const sliderData= this.state.isAdminLogin === true  ?
            [
                {label:'INFORMATION',path:'/information'},
                {label:'USER CONFIGURATION',path:'/userconfiguration'},
                {label:'USER GROUP CONFIGURATION',path:'/usergroupconfiguration'},
                // {label:'MIGRATION FILE LIST',path:'/migration'},
            ] :
            [
                {label:'INFORMATION',path:'/information'},
                {label:'FILE LIST',path:'/allreportlist'},
            ]
        return(
            <ul className="sliderWrap">
                {
                    sliderData.map((item,idx)=>{
                        return (
                            <MyPrivateLink to={item.path} key={idx}>
                                <li>{item.label}</li>
                            </MyPrivateLink>
                        )
                    })
                }
                {
                    this.state.isAdminLogin === true ?
                        <span>
                            <Link to="/userlist" className="report-con">
                                <li >MI REPORT</li>
                            </Link>
                            <Link to="/activity" className="activity-con">
                                <li>ACTIVITY LOG</li>
                            </Link>
                        </span> :' '
                }
            </ul>
        )
    }
}
export default PublicSlider
