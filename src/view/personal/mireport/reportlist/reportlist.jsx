import React,{Component} from 'react'
import { withRouter } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'

import { Button } from 'element-react'
import PublicSlider from '../../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../../component/navlink/navheader'
import UserOrReportLink from './../privatecomponents/userorreportlink/userorreportlink'
import MyTable from './../../../../component/mytable/mytable'
import SearchInput from '../../../../component/search-input/search-input-chang'
import ReportListPrivateModal from './reportlistprivatemodal/reportlistprivatemodal'
import {GET_REPORT_LIST, GET_ONCE_REPORT_LIST, GET_EARCH_MI_REPORT_REPORT_LIST, GET_INFORMATION} from '../../../../constants/constants'
import { HttpGet } from "../../../../server/get";


import './report-list.css'
import { Modal } from "antd/lib/index";


const confirm = Modal.confirm;

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
class ReportList extends Component{
    state={
        columns: [
            {
                title: "REPORT NAME",
                dataIndex: "reportName",
                key:'reportName'
            },
            {
                title: "RETENTION PERIOD",
                dataIndex: "retentionPeriod",
                key:'retentionPeriod'
            },
            {
                title: "END TIME",
                dataIndex: "endDate",
                key:'endDate'
            },
            {
                title: "VIEW TIMES",
                dataIndex: "viewTimes",
                key:'viewTimes'
            },
            {
                title: "ACTION",
                dataIndex: "action",
                // width:300,
                render:(text,record)=>{
                    return (
                        <div className="showDetail">
                            <span>
                                <Button type="primary" size="small" className="detailBtn" onClick={()=>this.showDetailDalog(record.reportId)}>
                                    <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DETAIL</Button>
                            </span>
                        </div>
                    )
                }
            }
        ],
        data: [],
        reportvisible:false,
        currentUserList:[],
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
        HttpGet(GET_REPORT_LIST,token)
            .then((res)=>{
                console.log(res)
                let data=[],userListAllData=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        reportId:res.data[i].id,
                        endDate:res.data[i].endDate===null ? '' :res.data[i].endDate,
                        reportName:res.data[i].reportName===null  ? '' : res.data[i].reportName,
                        reportDescription:res.data[i].reportDescription===null  ? '' : res.data[i].reportDescription,
                        queryName:res.data[i].queryName===null  ? '' : res.data[i].queryName,
                        retentionPeriod:res.data[i].retentionPeriod===null  ? '' : res.data[i].retentionPeriod,
                        viewTimes:res.data[i].viewTimes===null  ? '' : res.data[i].viewTimes,
                        creator:res.data[i].creator===null  ? '' : res.data[i].creator,
                    })
                    userListAllData.push({
                        value:res.data[i].id,
                        label:res.data[i].reportName
                    })
                }
                this.setState({data,userListAllData})
            })
            .catch((err)=>{
            
            })
    }
    showDetailDalog=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_ONCE_REPORT_LIST+id,token)
            .then((res)=>{
                console.log(res)
                let currentUserList=[]
                for(let i=0;i<res.data.length;i++){
                    currentUserList.push({
                        key:i+1,
                        userName:res.data[i].firstName,
                        groupName:res.data[i].groupName,
                        userAuthority:res.data[i].userAuthority===null  ? '' : res.data[i].userAuthority.length>=2 ? res.data[i].userAuthority.distinct().join('、'): res.data[i].userAuthority.distinct()
                    })
                }
                this.setState({
                    currentUserList,
                    reportvisible:true
                })
            })
            .catch((err)=>{
            
            })
    }
    saveUserlistDetail=()=>{
        this.setState({
            reportvisible:false
        })
    }
    cancelEdit=()=>{
        this.setState({
            reportvisible:false
        })
    }
    searchEarchUserConfig=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_EARCH_MI_REPORT_REPORT_LIST+id,token)
            .then((res) => {
                console.log(res)
                let data=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        reportId:res.data[i].id,
                        endDate:res.data[i].endDate===null ? '' :res.data[i].endDate,
                        reportName:res.data[i].reportName===null  ? '' : res.data[i].reportName,
                        reportDescription:res.data[i].reportDescription===null  ? '' : res.data[i].reportDescription,
                        queryName:res.data[i].queryName===null  ? '' : res.data[i].queryName,
                        retentionPeriod:res.data[i].retentionPeriod===null  ? '' : res.data[i].retentionPeriod,
                        viewTimes:res.data[i].viewTimes===null  ? '' : res.data[i].viewTimes,
                        creator:res.data[i].creator===null  ? '' : res.data[i].creator,
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
        const {columns,data,reportvisible,userListAllData}=this.state
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
                                <MyTable columns={columns} data={data}> </MyTable>
                                <ReportListPrivateModal
                                    currentUserList={this.state.currentUserList}
                                    visible={reportvisible}
                                    saveUserlistDetail={this.saveUserlistDetail}
                                    cancelEdit={this.cancelEdit}
                                >
                                </ReportListPrivateModal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default  withRouter(ReportList)
