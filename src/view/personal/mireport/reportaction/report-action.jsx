import React,{Component} from 'react'

import {Modal} from 'antd'
import { withRouter } from 'react-router-dom'
import './report-action.css'
import PublicSlider from '../../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../../component/navlink/navheader'
import UserOrReportLink from './../privatecomponents/userorreportlink/userorreportlink'
import MyTable from './../../../../component/mytable/mytable'
import SearchInput from '../../../../component/search-input/search-input-chang'

import {GET_EARCH_MI_REPORT_REPORT_ACTION_LIST, GET_INFORMATION, REPORT_ACTION} from '../../../../constants/constants'
import {HttpGet} from "../../../../server/get";

function add0(m){return m<10?'0'+m:m }
function timeFormat(timestamp){
    //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
    var time = new Date(timestamp);
    var year = time.getFullYear();
    var month = time.getMonth()+1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    return year+'-'+add0(month)+'-'+add0(date)+' '+add0(hours)+':'+add0(minutes)+':'+add0(seconds);
}
const confirm = Modal.confirm;

class ReportAction extends Component{
    state={
        columns: [
            {
                title: "USER NAME",
                dataIndex: "userName",
                key:'userName'
            },
            {
                title: "USER ID",
                dataIndex: "userId",
                key:'userId'
            },
            {
                title: "REPORT NAME",
                dataIndex: "reportName",
                key:'reportName'
            },
            {
                title: "ACTION",
                dataIndex: "actionStr",
                key:'actionStr'
            },
            {
                title: "LATEST TIME",
                dataIndex: "latestTime",
                key:'latestTime'
            }
        ],
        data: [],
        modalvisible:false,
        userListAllData:[],
        currentLoginUser:''
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getReportList()
    }
    getIsAdminLogin=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log(res)
                this.setState({
                    currentLoginUser:res.data.loginUser.firstName
                })
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
    getReportList=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        Array.prototype.distinct = function(){
            var arr = this,
                result = [],
                i,
                j,
                len = arr.length;
            for(i = 0; i < len; i++){
                for(j = i + 1; j < len; j++){
                    if(arr[i] === arr[j]){
                        j = ++i;
                    }
                }
                result.push(arr[i]);
            }
            return result;
        }
        HttpGet(REPORT_ACTION,token)
            .then((res)=>{
                console.log(res)
                let data=[],userListAllData=[],reportAllList=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        id:res.data[i].userId,
                        userId:res.data[i].userName,
                        userName:res.data[i].firstName,
                        reportName:res.data[i].reportName,
                        actionStr:res.data[i].actionStr,
                        latestTime:timeFormat(res.data[i].latestTime),
                    })
                    reportAllList.push(res.data[i].firstName)
                }
                let newReportActionArr=reportAllList.distinct()
                for(let i=0;i<newReportActionArr.length;i++){
                    userListAllData.push({
                        value:newReportActionArr[i],
                        label:newReportActionArr[i]
                    })
                }
                this.setState({data,userListAllData})
            })
            .catch((err)=>{
            
            })
    }
    showDetailDalog=()=>{
        this.setState({
            modalvisible:true
        })
    }
    saveUserlistDetail=()=>{
        this.setState({
            modalvisible:false
        })
    }
    cancelEdit=()=>{
        this.setState({
            modalvisible:false
        })
    }
    searchEarchUserConfig=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_EARCH_MI_REPORT_REPORT_ACTION_LIST+id,token)
            .then((res) => {
                console.log(res)
                let data=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        id:res.data[i].userId,
                        userId:res.data[i].userName,
                        userName:res.data[i].firstName,
                        reportName:res.data[i].reportName,
                        actionStr:res.data[i].actionStr,
                        latestTime:timeFormat(res.data[i].latestTime),
                    })
                }
                console.log(11321)
                console.log(data)
                this.setState({
                    data
                })
            })
            .catch((err)=>{
            
            })
    }
    render(){
        const {columns,data,userListAllData}=this.state
        return(
            <div className="listClass info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider> </PublicSlider>
                    <div className="informationSlider">
                        <div className="common-header">
                            <UserOrReportLink> </UserOrReportLink>
                        </div>
                        <div className="userlistpar">
                            <div className="report-content">
                                {/*<Input className="userList" icon="search" placeholder="SEARCH" />*/}
                                <div className="mireport">
                                    <SearchInput
                                        getTableData={this.getReportList}
                                        states={userListAllData}
                                        searchContent={this.searchEarchUserConfig}
                                    >
                                    </SearchInput>
                                </div>
                            </div>
                            <div className="reportTable">
                                <MyTable columns={columns} data={data}></MyTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(ReportAction)
