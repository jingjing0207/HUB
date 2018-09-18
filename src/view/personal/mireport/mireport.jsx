import React,{Component} from 'react'

import PublicSlider from '../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../component/navlink/navheader'
import {GET_INFORMATION} from "../../../constants/constants";
import {HttpGet} from "../../../server/get";
class MiReport extends Component{
    state={
        currentLoginUser:''
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
                    currentLoginUser:res.data.loginUser.username
                })
            })
            .catch((err)=>{
            
            })
    }
    render(){
        return(
            <div>
                <NavHeader> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider> </PublicSlider>
                    <div className="informationSlider">
                    
                    </div>
                </div>
            </div>
        )
    }
}
export default MiReport
