import React, {Component} from 'react';
import {Modal,DatePicker,Button,Icon } from 'antd'
import FontAwesome from 'react-fontawesome'
import {withRouter} from 'react-router-dom';

import PublicSlider from '../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../component/navlink/navheader'
import './information.css'
import personnalHeaderImg from '../../../utils/image/pic02.jpg'
// import MyTable from '../../../component/mytable/mytable'
// import MyInput from '../../../component/input/my-input'
import { GET_INFORMATION,GET_ALL_USER,ADD_NEW_USER,DELETE_USER_DEMAND } from '../../../constants/constants'
import { HttpGet } from "../../../server/get";
import { HttpPost } from "../../../server/post";
// import SearchInput from '../../../component/search-input/search-input'

const confirm = Modal.confirm;
// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

class Information extends Component {
    state = {
        personalInformation: {
            personnalHeaderImg: personnalHeaderImg,
            name: 'INFORMATION',
        },
        addInfoVisible: false,
        changeBtnValue: false,
        currentInfo: {
            maintain: 'ADMIN',
            username: 'QUEEN',
            usergroup: 'IT',
            currentEmail: 'user@hsbc.com.cn'
        },
        information:{
            maintain:{
                spanlabel:'',
                select:'miantain',
                options:[{
                    value: '',
                    label: ''
                }]
            },
        },
        maintain:[],
        username:'',
        usergroup:'',
        email:'',
        status:'',
        addIsShow:false,
        backUpUserId:'',
        searchInputData:[],
        toData:'',
        revokeId:'',
        identity:'',
        fromData:'',
        currentLoginUser:'',
        backupUser:{},
        backupFirstName:''
    }
    componentDidMount(){
        this.getInformationData()
    }
    getUserData=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let id=sessionStorage.getItem('userId')
        HttpGet(GET_ALL_USER+id,token)
            .then((res) => {
                // console.log(res.data)
                let searchInputData=[]
                for(let i=0;i<res.data.length;i++){
                    searchInputData.push({
                        value:res.data[i].id,
                        label:res.data[i].username
                    })
                }
                this.setState({searchInputData})
            })
            .catch((err)=>{
            
            })
    }
    getInformationData=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        Array.prototype.distinct= function (){
            var arr = this,
                i,
                j,
                len = arr.length;
            for(i = 0; i < len; i++){
                for(j = i + 1; j < len; j++){
                    if(arr[i] === arr[j]){
                        arr.splice(j,1);
                        len--;
                        j--;
                    }
                }
            }
            return arr;
        };
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log(111212)
               console.log(res)
                if (res.status===200){
                   sessionStorage.setItem('userId',res.data.loginUser.id)
                   this.setState({
                       username:res.data.loginUser.username,
                       email:res.data.loginUser.email===null ? '': res.data.loginUser.email,
                       changeBtnValue:res.data.backupUser===null ? false : true,
                       revokeId:res.data.backupId===null ? '' :res.data.backupId,
                       identity:res.data.identity,
                       status:res.data.loginUser.enabled===true ?  'Active' : 'Inactive',
                       currentLoginUser:res.data.loginUser.firstName,
                       usergroup:res.data.userGroup===null ? '' : res.data.userGroup.groupName,
                      
                   })
                    if(res.data.backupUser!==null){
                       this.setState({
                           backUpUserId:res.data.backupUserUserName,
                           backupFirstName:res.data.backupUserFirstName,
                           fromData:res.data.backupUser.fromDate,
                           toData:res.data.backupUser.toDate,
                           // backupUsername:res.data.backupUserFirstName
                       })
                    }
                    let maintain=[]
                    for(let i=0;i<res.data.loginUser.authorities.length;i++){
                        maintain.push(res.data.loginUser.authorities[i].authority)
                    }
                    console.log('maintain==>',maintain)
    
                    let qArr=[]
                    for(let i=0;i<maintain.length;i++){
                        if((maintain[i].indexOf('ROLE_')!==-1)===true){
                            qArr.push(maintain[i].substring(5))
                        }
                        
                    }
                    let lastAuthority= qArr
                    console.log('qrr=>',qArr)
                    this.setState({maintain:lastAuthority.distinct()})
                    if(this.state.identity.includes("ADMIN")===true){
                        this.setState({
                            addIsShow:false
                        })
                    }else {
                        this.setState({
                            addIsShow:true
                        })
                    }
                }
            })
            .catch((err)=>{
                if (err && err.response) {
                    switch (err.response.status) {
                        case 401:
                            this.showConfirm()
                            break
                        default:
                    }
                    return Promise.reject(err)
                }
            })
    }
    showConfirm=()=> {
        var that=this
        confirm({
            title: 'Information changed, please login again.',
            content: '',
            onOk() {
                that.props.history.push('/')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    addInfoBtn = () => {
        this.setState({
            addInfoVisible: true
        })
    }
    revoleInfoBtn = () => {
        let token="Bearer "+sessionStorage.getItem('token')
        console.log(this.state.revokeId)
        let userId=this.state.revokeId
        confirm({
            title: 'Confirm To Revoke?',
            content: '',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
                HttpGet(DELETE_USER_DEMAND+userId,token)
                    .then((res) => {
                        console.log(res.data)
                        this.getInformationData()
                        this.setState({
                            changeBtnValue: false
                        })
                    })
                    .catch((err)=>{
            
                    })
                    
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }
    closeHanle = () => {
        this.setState({
            addInfoVisible: false
        })
    }
 
    okBtn=()=>{
        this.setState({
            addInfoVisible:false
        })
    }
    changeEmailContent=(e)=>{
        let value=e.target.value
        this.setState({
            email:value
        })
    }
    onChange=(checked)=>{
        console.log(`switch to ${checked}`);
    }
    setUserId=(val)=>{
        this.setState({
            backUpUserId:val
        })
    }
    onTODataChange=(date, dateString) =>{
        console.log(dateString);
        this.setState({
            toData:dateString
        })
    }
    onFromDataChange=(date, dateString) =>{
        console.log(dateString);
        this.setState({
            fromData:dateString
        })
    }
    render() {
        const {personalInformation, addInfoVisible,searchInputData} = this.state
        return (
            <div className="info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider> </PublicSlider>
                    <div className="informationSlider">
                        <div className="personalHeaderPic">
                            <div className="headerCon">
                                <div className="headerImg">
                                    <div className="header-content">
                                        <img src={personalInformation.personnalHeaderImg} alt=""/>
                                        <FontAwesome name='pencil' style={{fontSize: "14px", marginRight: '5px'}}/>
                                    </div>
                                    <p>{this.state.currentLoginUser}</p>
                                </div>
                            </div>
                        </div>
                        <div className="pernalInformation">
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>IDENTITY：</label>
                                <p>{this.state.identity}</p>
                            </div><br/>
                            <span>
                                <div className="inputInfo">
                                    <span className="iuputSpan authoritySpan"></span>
                                    <label className="authoritySpan">AUTHORITY：</label>
                                    <div className="maintain">
                                        {
                                            this.state.maintain.map((item, idx) => {
                                                return (
                                                    <li key={idx}><Icon type="right" className="info-icon" theme="outlined" />&nbsp;&nbsp;{item}</li>
                                                )
                                            })
                                        }
                                    </div>
                                </div><br/>
                            </span>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>USER ID：</label>
                                <p>{this.state.username}</p>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>USER GROUP：</label>
                                <p>{this.state.usergroup}</p>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>EMAIL ADDRESS：</label>
                                <input
                                       onChange={this.changeEmailContent}
                                       value={this.state.email}
                                       placeholder="user@hsbc.com.cn"/>
                            </div>
                            {
                                this.state.addIsShow===false  ? '' :
                                    <div className="inputInfo">
                                        <span className="iuputSpan"></span>
                                        <label>USER STATUS：</label>
                                        <p>{this.state.status}</p>
                                    </div>
                            }
                            {
                                this.state.changeBtnValue === false  ? '':
                                    <div className="inputInfo">
                                        <span className="iuputSpan"></span>
                                        <label>BACKUP USER：</label>
                                        <button className="addInfoBtn" onClick={this.addInfoBtn}>{this.state.backupFirstName}</button>
                                    </div>
                             }
                        </div>
                    </div>
                </div>
                <Modal className="mydialogCon addInfoDialog"
                       title="BACKUP USER"
                       visible={addInfoVisible}
                       onOk={this.okBtn}
                       onCancel={this.closeHanle}
                       okText="Ok"
                       footer={null}
                >
                    <div className="modalContent-pad">
                        <div className="inputInfo">
                            <span className="iuputSpan"></span>
                            <label>BACKUP USER NAME：</label>
                            <p className="info-personal">{this.state.backupFirstName}</p>
                        </div>
                        <div className="inputInfo">
                            <span className="iuputSpan"></span>
                            <label>BACKUP USER ID：</label>
                            <p className="info-personal">{this.state.backUpUserId}</p>
                        </div>
                        <div className="inputInfo">
                            <span className="iuputSpan"></span>
                            <label>FROM：</label>
                            <p className="info-personal">{this.state.fromData}</p>
                        </div>
                        <div className="inputInfo">
                            <label className="ToSpan">TO：</label>
                            <p className="info-personal">{this.state.toData}</p>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Information)
