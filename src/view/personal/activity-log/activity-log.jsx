import React,{Component} from 'react'
import PanTable from './../../../component/mytable/pan-table'
import PublicSlider from '../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../component/navlink/navheader'
import SearchInput from '../../../component/search-input/pan-search-input'
import './activity-log.css'
import {
    GET_INFORMATION,
    SEARCH_EARCH_ACTIVITY_LOG,
    SEARCH_ACTIVTY_LOG_PAN,
    GET_ACTIVTY_LOG_PAN,
    GET_ALL_REPORT_PAN
} from "../../../constants/constants";
import {HttpGet} from "../../../server/get";
import {message} from "antd/lib/index";


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


class ActivityLog extends Component{
   state ={
       columns: [
           {
               title: "USER NAME",
               dataIndex: "userName",
               key: "userName",
           },
           {
               title: "USER ID",
               dataIndex: "userId",
               key: "userId",
           },
           {
               title: "TIME",
               dataIndex: "logTime",
               key: "logTime",
           },
           {
               title: "TYPE",
               dataIndex: "logType",
               key: "logType",
           },
           {
               title: "DETAIL",
               dataIndex: "detail",
               key: "detail",
           }
       ],
       data: [],
       currentLoginUser:'',
       userListAllData:[],
       loadingPage:false,
       page:1,
       size:10,
       total:0,
       items:0,
       currentSearchValue:''
   }
    
    componentDidMount(){
        this.getIsAdminLogin()
        this.getAllUserFirstName()
        this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
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
            
            })
    }
    getAllUserFirstName=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(SEARCH_ACTIVTY_LOG_PAN,token)
            .then((res) => {
                console.log(11111,res)
                let data=[],userListAllData=[]
                for(let i=0;i<res.data.length;i++){
                    userListAllData.push({
                        value:res.data[i].firstName,
                        label:res.data[i].firstName
                    })
                }
                this.setState({
                    userListAllData,
                })
            })
            .catch((err)=>{
                if (err && err.response) {
                    switch (err.response.status) {
                        case 403:
                            message.error('You do not have permission to access this data')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    getTableData=(currentSelectValue,page,size)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        this.setState({
            currentSearchValue:currentSelectValue===undefined? '' : currentSelectValue
        })
        HttpGet(GET_ACTIVTY_LOG_PAN+`search=${currentSelectValue===undefined? '' : currentSelectValue}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                let data=[]
                for(let i=0;i<res.data.groupDetails.length;i++){
                    data.push({
                        key:i+i,
                        detail:res.data.groupDetails[i].detail,
                        logId:res.data.groupDetails[i].logId,
                        logTime:timeFormat(res.data.groupDetails[i].logTime),
                        logType:res.data.groupDetails[i].logType,
                        id:res.data.groupDetails[i].userId,
                        userId:res.data.groupDetails[i].userName,
                        userName:res.data.groupDetails[i].firstName
                    })
                }
                this.setState({
                    data,
                    total:res.data.totalElements
                })
            })
            .catch((err)=>{
                if (err && err.response) {
                    switch (err.response.status) {
                        case 403:
                            message.error('You do not have permission to access this data')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    searchEarchUserConfig=(id,page,size)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        this.setState({
            currentSearchValue:id
        })
        HttpGet(GET_ACTIVTY_LOG_PAN+`search=${id===undefined? '' : id}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                console.log(res)
                let data=[]
                for(let i=0;i<res.data.groupDetails.length;i++){
                    data.push({
                        key:i+i,
                        detail:res.data.groupDetails[i].detail,
                        logId:res.data.groupDetails[i].logId,
                        logTime:timeFormat(res.data.groupDetails[i].logTime),
                        logType:res.data.groupDetails[i].logType,
                        id:res.data.groupDetails[i].userId,
                        userId:res.data.groupDetails[i].userName,
                        userName:res.data.groupDetails[i].firstName
                    })
                }
                console.log(11321)
                console.log(data)
                this.setState({data,total:res.data.totalElements})
            })
            .catch((err)=>{
            
            })
    }
    onClick(current, pageSize) {
        console.log(current,pageSize)
        this.setState({page:current,size:pageSize,loadingTable:true});
        if(this.state.currentSearchValue==='' || this.state.currentSearchValue===undefined){
            this.getTableData(this.state.currentSearchValue,current-1,pageSize);
        }else if(this.state.currentSearchValue!==''){
            this.searchEarchUserConfig(this.state.currentSearchValue,current-1,pageSize);
        }
    }
    render(){
        const { columns,data,userListAllData }=this.state
        let {page, size, total, items} = this.state;
        const pagination={
            total: total,
            defaultCurrent: page,
            pageSize: size,
            onShowSizeChange: (current, pageSize) => {
                this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        }
        return(
            <div className="activityClass info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}></NavHeader>
                <div className="pernalWrap">
                    <PublicSlider></PublicSlider>
                    <div className="informationSlider">
                        <div className="HUBquerygroupPar">
                            <div className="query-con">
                                <div className="mireport">
                                    <SearchInput
                                        getTableData={this.getTableData}
                                        states={userListAllData}
                                        searchContent={this.searchEarchUserConfig}
                                        page={this.state.page}
                                        size={this.state.size}
                                    >
                                    </SearchInput>
                                </div>
                            </div>
                        </div>
                        <div className="gropTable user-config">
                            <PanTable columns={columns} data={data} pagination={pagination} loadingPage={this.state.loadingPage}></PanTable>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ActivityLog
