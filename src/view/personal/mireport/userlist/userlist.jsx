import React,{Component} from 'react'
import { withRouter } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import {Modal} from 'antd'
import { Button } from 'element-react'
import './user-list.css'
import PublicSlider from '../../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../../component/navlink/navheader'
import UserOrReportLink from './../privatecomponents/userorreportlink/userorreportlink'
import MyTable from './../../../../component/mytable/mytable'
import UserListPrivateModal from './userlistprivatemodal/userlistprivatemodal'
import SearchInput from '../../../../component/search-input/search-input-chang'
import {GET_ONCE_USER_LIST, GET_USER_LIST, GET_EARCH_MI_REPORT_USER_LIST, GET_INFORMATION} from "../../../../constants/constants";
import {HttpGet} from "../../../../server/get";


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

class UserList extends Component{
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
                title: "USER GROUP",
                dataIndex: "groupName",
                key:'groupName'
            },
            {
                title: "REPORT AUTHORITY",
                dataIndex: "userAuthority",
                key:'userAuthority',
                width:300
            },
            {
                title: "ACTION",
                dataIndex: "action",
                // width:150,
                render:(text,record)=>{
                    return (
                        <div className="showDetail">
                            <span>
                               <Button type="primary" size="small" className="detailBtn" onClick={()=>this.showUserDetailDalog(record.id)}>
                                    <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DETAIL</Button>
                            </span>
                        </div>
                    )
                }
            }
        ],
        data: [],
        modalvisible:false,
        currentReportList:[],
        userListAllData:[],
        currentLoginUser:''
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getuserList()
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
    getuserList=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_USER_LIST,token)
            .then((res)=>{
                console.log(res)
                let data=[]
                let userListAllData=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        id:res.data[i].userId,
                        userId:res.data[i].userName,
                        userName:res.data[i].firstName,
                        groupName:res.data[i].groupName,
                        userAuthority:res.data[i].userAuthority===[] ? '' :res.data[i].userAuthority.distinct().join('、'),
                    })
                    userListAllData.push({
                        value:res.data[i].userId,
                        label:res.data[i].firstName
                    })
                }
                this.setState({data,userListAllData})
            })
            .catch((err)=>{
            
            })
    }
    showUserDetailDalog=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_ONCE_USER_LIST+id,token)
            .then((res)=>{
                console.log(res)
                let currentReportList=[]
                for(let i=0;i<res.data.length;i++){
                    currentReportList.push({
                        key:i+1,
                        reportDescription:res.data[i].reportDescription===null ? '' :res.data[i].reportDescription,
                        reportId:res.data[i].reportId===null ? '' :res.data[i].reportId,
                        reportName:res.data[i].reportName===null ? '' :res.data[i].reportName,
                        retentionPeriod:res.data[i].retentionPeriod===null ? '' :res.data[i].retentionPeriod,
                    })
                }
                this.setState({
                    currentReportList,
                    modalvisible:true
                })
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
        HttpGet(GET_EARCH_MI_REPORT_USER_LIST+id,token)
            .then((res) => {
                console.log(res)
                let data=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        id:res.data[i].userId,
                        userId:res.data[i].userName,
                        userName:res.data[i].firstName,
                        groupName:res.data[i].groupName===null ? '' :res.data[i].groupName,
                        userAuthority:res.data[i].userAuthority===[] ? '' : res.data[i].userAuthority.distinct().join('、'),
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
        const {columns,data,modalvisible,userListAllData}=this.state
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
                                        getTableData={this.getuserList}
                                        states={userListAllData}
                                        searchContent={this.searchEarchUserConfig}
                                    >
                                    </SearchInput>
                                </div>
                            </div>
                            <div className="reportTable">
                                <MyTable columns={columns} data={data}></MyTable>
                                <UserListPrivateModal
                                    currentReportList={this.state.currentReportList}
                                    visible={modalvisible}
                                    saveUserlistDetail={this.saveUserlistDetail}
                                    cancelEdit={this.cancelEdit}
                                >
                                </UserListPrivateModal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(UserList)
