import React,{Component} from 'react'
import MyNavLink from './navlink/nav-link'
import FontAwesome from 'react-fontawesome'
import {withRouter} from 'react-router-dom';
import {Icon} from 'antd'

import './navheader.css'
import logoImg from './../../utils/image/logo.png'
import headerPic from '../../utils/image/headerPic.png'
import logoutPic from '../../utils/image/logout.png'
import news from './../../utils/image/news.png'
import {LOGIN_OUT} from './../../constants/constants'
import {HttpGet} from "../../server/get";

class NavHeader extends Component{
    state={
        logoImg:logoImg,
        navPart:[
            {img:'download',info:'DOWNLOAD REPORT',path:'/downloadreport'},
            {img:'life-ring',info:'QUERY INVENTORY',path:'/queryinventory'},
            {img:'pie-chart',info:'QUERY GROUP',path:'/querygroup'},
            {img:'bar-chart',info:'MONITORING',path:'/monitoring'} ,
        ],
        news:news,
        isShowInfo:false,
        singOut:false,
        // currentLoginUser:
        addClass:false,
        personalAddClass:false
    }
    // componentDidMount(){
    //     this.getIsAdminLogin()
    // }
    showSelect=()=>{
        this.setState({
            singOut:true
        })
    }
    notSelect=()=>{
        this.setState({
            singOut:false
        })
    }
    addLogout=()=>{
        this.setState({
            addClass:true
        })
    }
    leaverLogout=()=>{
        this.setState({
            addClass:false
        })
    }
    addPerson=()=>{
        this.setState({
            personalAddClass:true
        })
    }
    leaverPerson=()=>{
        this.setState({
            personalAddClass:false
        })
    }
    changeInformation=()=>{
        this.props.history.push('/information')
        this.setState({
            isshowInfo:true
        })
    }
    showSignOut=()=>{
        if(this.state.singOut===false){
            this.setState({
                singOut:true
            })
        }else if(this.state.singOut===true){
            this.setState({
                singOut:false
            })
        }
    }
    signOut=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(LOGIN_OUT,token)
            .then((res)=>{
                sessionStorage.clear();
               if(res.status===200){
                   setTimeout(()=>{
                       this.props.history.push('/')
                   },100)
               }
            })
    }
    render(){
        const { logoImg,navPart,news }=this.state
        return(
            <div className="navWrap">
                <div className="navLeft">
                    <img src={logoImg} alt=""/>
                </div>
                <ul  className="navCenter">
                    {
                        navPart.map((item,idx)=>{
                            return (
                                <MyNavLink to={item.path}  key={idx}>
                                    <li className="navCenterImg">
                                        <FontAwesome
                                            name={item.img}
                                            style={{ fontSize: "17px" }}
                                        />
                                        <p>{item.info}</p>
                                    </li>
                                </MyNavLink>
                            )
                        })
                    }
                </ul>
                <div className="navRight">
                    {/*<img src={news} alt=""/>*/}
                    <div className="personalInfo" >
                        <div className="headerPic"  onMouseOver={this.showSelect}>
                            <div className="personal-con"  onClick={this.showSignOut}>
                                <div className="personal-div" onClick={this.changeInformation}>
                                    <img className="header" src={headerPic} alt="" />
                                    <h5>{this.props.currentLoginUser}</h5>
                                </div>
                                <div className="logout-div">
                                    <img onClick={this.signOut}  className="logout" src={logoutPic} alt=""/>
                                </div>
                            </div>
                        </div>
                        {/*{*/}
                            {/*this.state.singOut===true ?*/}
                                {/*<div className="singOut">*/}
                                    {/*/!*<Icon type="caret-up" />*!/*/}
                                    {/*<ul onMouseLeave={this.notSelect}>*/}
                                        {/*/!*<li onClick={this.changeInformation} className={this.state.personalAddClass ===true ? 'bgColor' :''}  onMouseOver={this.addPerson} onMouseLeave={this.leaverPerson}>Personal</li>*!/*/}
                                        {/*/!*<li onClick={this.signOut} className={this.state.addClass ===true ? 'bgColor' :''} onMouseOver={this.addLogout} onMouseLeave={this.leaverLogout}>Logout</li>*!/*/}
                                    {/*</ul>*/}
                                {/*</div> : ' '*/}
                        {/*}*/}
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(NavHeader)
