import React,{Component} from 'react'
import { withRouter } from 'react-router-dom'
import { Modal,Upload,Icon,Input,Spin } from 'antd'
import {Button} from 'element-react'
import MyDialog from './privatecomponent/dragtable/detailmodal/dialog/dialog'
import NavHeader from './../../component/navlink/navheader'
import QueryInventoryDragTable from './privatecomponent/dragtable/dragtable'
import DataLoading from '../../utils/image/data-loading.png'

import './queryinventory.css'
import {
    IMPORT_QUERY,
    SEARCH_ALL_QUERY,
    GET_EARCH_QUERY,
    GET_INFORMATION,
    GET_ALL_USER_GROUP_GUERY, DOWNLOAD_QUERY_GROUP_TEMPLATE, GET_ALL_QUERY_PAN, RUN_QUERY
} from "../../constants/constants";
import SearchInputChange from '../../component/search-input/search-input-chang'
import {HttpGet} from "../../server/get";
import {message} from "antd/lib/index";
import reqwest from "reqwest";

const confirm = Modal.confirm;

class QueryGroup  extends Component{
    state={
        dialogVisible: false,
        data:[],
        searchInputData:[],
        currentUserId:'',
        selectUserGroup:[],
        selectUsers:[],
        isShowDownloadBtn:false,
        assistanceIsShow:false,
        importIsShow:false,
        reportIsShow:false,
        uploadModalVisible:false,
        fileList: [],
        uploading: false,
        currentLoginUserName:'',
        userNeverDemand:true,
        loadingTable:false,
        page:1,
        size:15,
        total:0,
        items:0,
        runLoading:false,
        currentSearchValue:''
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getAllGroupAndUser()
        this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
        this.getSearchData()
    }
    getIsAdminLogin=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log(res)
                let auth=[]
                for(let i=0;i<res.data.loginUser.authorities.length;i++){
                    auth.push(res.data.loginUser.authorities[i].authority)
                }
                console.log(auth)
                for(let i=0;i<auth.length;i++){
                    if(auth[i].indexOf('ROLE_QUERY_VIEW')!==-1){
                        this.setState({isShowDownloadBtn:true})
                    }else if(auth[i].indexOf('ROLE_QUERY_EDIT')!==-1){
                        this.setState({isShowDownloadBtn:false})
                    }else if(auth[i].indexOf('ROLE_QUERY_EDIT')!==-1 && auth[i].indexOf('ROLE_QUERY_VIEW')!==-1){
                        this.setState({isShowDownloadBtn:false})
                    }else if(auth[i].indexOf('ROLE_QUERY_GROUP_ASSIGNMENT')!==-1){
                        this.setState({assistanceIsShow:true})
                    }else if(auth[i].indexOf('ROLE_IMPORT')!==-1){
                        this.setState({importIsShow:true})
                    }else if(auth[i].indexOf('ROLE_REPORT_ASSIGNMENT')!==-1){
                        this.setState({reportIsShow:true})
                    }
                    
                    if( auth.includes('ROLE_QUERY_EDIT') ===false &&
                        auth.includes('ROLE_QUERY_VIEW') ===false ){
                        this.setState({
                            userNeverDemand:false
                        })
                        // message.error('You do not have permission to access this data');
                    }
                    
                    if(auth.includes('ROLE_ADMIN') ===false){
                        this.setState({
                            currentLoginUserName:res.data.loginUser.username
                        })
                    }else if(auth.includes('ROLE_ADMIN') ===true){
                        this.setState({
                            currentLoginUserName:''
                        })
                    }
                    console.log('assistanceIsShow==>',this.state.assistanceIsShow)
                    console.log('reportIsShow==>',this.state.reportIsShow)
                }
                this.setState({
                    currentUserId:res.data.loginUser.id,
                    currentusername:res.data.loginUser.firstName
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
            title: 'Information changed, please login again',
            content: '',
            onOk() {
                that.props.history.push('/')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    getAllGroupAndUser=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_ALL_USER_GROUP_GUERY,token)
            .then((res) => {
                console.log(111)
                console.log(res)
                let selectUserGroup=[],
                    selectUsers=[]
                for(let i=0;i<res.data.userGroups.length;i++){
                    selectUserGroup.push({
                        value:res.data.userGroups[i].groupName,
                        label:res.data.userGroups[i].groupName
                    })
                }
                for(let i=0;i<res.data.users.length;i++){
                    selectUsers.push({
                        value:res.data.users[i].username,
                        label:res.data.users[i].username
                    })
                }
                console.log(selectUserGroup)
                console.log(selectUsers)
                this.setState({selectUserGroup,selectUsers})
            })
            .catch((err)=>{
            
            })
    }
    getSearchData=()=> {
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(SEARCH_ALL_QUERY,token)
            .then((res) => {
                let searchInput=[]
                for(let i=0;i<res.data.length;i++){
                    searchInput.push({
                        value:res.data[i].queryId,
                        label:res.data[i].queryName
                    })
                }
                this.setState({
                    searchInputData:searchInput
                })

            })
            .catch((err)=>{
            
            })
    }
    
    
    getTableData=(currentSelectValue,page,size)=> {
        let token="Bearer "+sessionStorage.getItem('token')
        let currentSearchValue=''
        this.setState({
            currentSearchValue:currentSelectValue===undefined? '' : currentSelectValue
        })
        HttpGet(GET_ALL_QUERY_PAN+`search=${currentSelectValue===undefined? '' : currentSelectValue}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                console.log(res.data.queryDetails)
                this.setState({
                    total:res.data.totalElements
                })
                let tableData=[]
                for(let i=0;i<res.data.queryDetails.length;i++){
                    console.log('pan——query=>',res)
                    tableData.push({
                        key:i,
                        allowRunOnline:res.data.queryDetails[i].allowRunOnline===null ? '' : res.data.queryDetails[i].allowRunOnline,
                        emailNotification:res.data.queryDetails[i].emailNotification===null ? '' : res.data.queryDetails[i].emailNotification,
                        exist:res.data.queryDetails[i].exist===null ? '' : res.data.queryDetails[i].exist,
                        groupCode:res.data.queryDetails[i].groupCode===null ? '' : res.data.queryDetails[i].groupCode,
                        periodicity:res.data.queryDetails[i].periodicity===null ? '' : res.data.queryDetails[i].periodicity,
                        priority:res.data.queryDetails[i].priority===null ? '' : res.data.queryDetails[i].priority,
                        queryDescription:res.data.queryDetails[i].queryDescription===null ? '' : res.data.queryDetails[i].queryDescription,
                        queryId:res.data.queryDetails[i].queryId===null ? '' : res.data.queryDetails[i].queryId,
                        queryName:res.data.queryDetails[i].queryName===null ? '' : res.data.queryDetails[i].queryName,
                        reportName:res.data.queryDetails[i].reportName===null ? '' : res.data.queryDetails[i].reportName,
                        reportRetentionPeriod:res.data.queryDetails[i].reportRetentionPeriod===null ? '' : res.data.queryDetails[i].reportRetentionPeriod,
                        sequenceNumber:res.data.queryDetails[i].sequenceNumber===null ? '' : res.data.queryDetails[i].sequenceNumber,
                        sla:res.data.queryDetails[i].sla===null ? '' : res.data.queryDetails[i].sla,
                        sqlStatement:res.data.queryDetails[i].sqlStatement===null ? '' : res.data.queryDetails[i].sqlStatement,
                        status:res.data.queryDetails[i].status===null ? '' : res.data.queryDetails[i].status,
                        userGroup:res.data.queryDetails[i].userGroup===null ? '' : res.data.queryDetails[i].userGroup,
                        userIds:res.data.queryDetails[i].userIds===null ? '' : res.data.queryDetails[i].userIds
                    })
                }
                console.log('tableData',tableData)
                this.setState({
                    data:tableData,
                    loadingTable:false
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
    showDialog= () => {
        this.setState({ dialogVisible: true })
    }
    parentClose=(flag)=>{
        this.setState({ dialogVisible: flag })
    }
    searchQuery=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_EARCH_QUERY+id,token)
            .then((res) => {
                // console.log(res)
                let tableData=[]
                tableData.push({
                    key:1,
                    allowRunOnline:res.data.allowRunOnline,
                    emailNotification:res.data.emailNotification,
                    exist:res.data.exist,
                    groupCode:res.data.groupCode===null ? '' :res.data.groupCode,
                    periodicity:res.data.periodicity,
                    priority:res.data.priority,
                    queryDescription:res.data.queryDescription,
                    queryId:res.data.queryId,
                    queryName:res.data.queryName,
                    reportRetentionPeriod:res.data.reportRetentionPeriod,
                    reportName:res.data.reportName===null ? '' : res.data.reportName,
                    sequenceNumber:res.data.sequenceNumber,
                    sla:res.data.sla,
                    sqlStatement:res.data.sqlStatement,
                    status:res.data.status,
                    userGroup:res.data.userGroup,
                    userIds:res.data.userIds
                })
                this.setState({
                    data:tableData,
                    total:1,
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
    blurSearchQuery=(value,page,size)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let currentPage=page+1
        console.log('currentPage==>',currentPage)
        this.setState({
            currentSearchValue:value
        })
        HttpGet(GET_ALL_QUERY_PAN+`search=${value}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                this.setState({ page:currentPage })
                let tableData=[]
                let searchInput=[]
                for(let i=0;i<res.data.queryDetails.length;i++){
                    console.log('pan——query=>',res)
                    tableData.push({
                        key:i,
                        allowRunOnline:res.data.queryDetails[i].allowRunOnline===null ? '' : res.data.queryDetails[i].allowRunOnline,
                        emailNotification:res.data.queryDetails[i].emailNotification===null ? '' : res.data.queryDetails[i].emailNotification,
                        exist:res.data.queryDetails[i].exist===null ? '' : res.data.queryDetails[i].exist,
                        groupCode:res.data.queryDetails[i].groupCode===null ? '' : res.data.queryDetails[i].groupCode,
                        periodicity:res.data.queryDetails[i].periodicity===null ? '' : res.data.queryDetails[i].periodicity,
                        priority:res.data.queryDetails[i].priority===null ? '' : res.data.queryDetails[i].priority,
                        queryDescription:res.data.queryDetails[i].queryDescription===null ? '' : res.data.queryDetails[i].queryDescription,
                        queryId:res.data.queryDetails[i].queryId===null ? '' : res.data.queryDetails[i].queryId,
                        queryName:res.data.queryDetails[i].queryName===null ? '' : res.data.queryDetails[i].queryName,
                        reportName:res.data.queryDetails[i].reportName===null ? '' : res.data.queryDetails[i].reportName,
                        reportRetentionPeriod:res.data.queryDetails[i].reportRetentionPeriod===null ? '' : res.data.queryDetails[i].reportRetentionPeriod,
                        sequenceNumber:res.data.queryDetails[i].sequenceNumber===null ? '' : res.data.queryDetails[i].sequenceNumber,
                        sla:res.data.queryDetails[i].sla===null ? '' : res.data.queryDetails[i].sla,
                        sqlStatement:res.data.queryDetails[i].sqlStatement===null ? '' : res.data.queryDetails[i].sqlStatement,
                        status:res.data.queryDetails[i].status===null ? '' : res.data.queryDetails[i].status,
                        userGroup:res.data.queryDetails[i].userGroup===null ? '' : res.data.queryDetails[i].userGroup,
                        userIds:res.data.queryDetails[i].userIds===null ? '' : res.data.queryDetails[i].userIds
                    })
                    searchInput.push({
                        value:res.data.queryDetails[i].queryId,
                        label:res.data.queryDetails[i].queryName
                    })
                }
                this.setState({
                    data:tableData,
                    total:res.data.totalElements,
                    searchInputData:searchInput,
                    loadingTable:false
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
    uploadQueryData=()=>{
        this.setState({
            uploadModalVisible:true
        })
    }
    handleUpload = () => {
        var token="Bearer "+sessionStorage.getItem('token')
        const { fileList } = this.state;
        var formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file);
        });
        
        this.setState({
            uploading: true,
        });
        
        reqwest({
            url: IMPORT_QUERY,
            headers:{
                'Authorization': token
            },
            method: 'post',
            processData: false,
            data:formData,
            success: () => {
                console.log(formData)
                this.setState({
                    fileList: [],
                    uploading: false,
                    uploadModalVisible:false
                });
                message.success('Upload successfully');
                this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
            },
            error: (err) => {
                console.log(err.response)
                this.setState({
                    uploading: false,
                });
                message.error('Upload failed');
            },
        });
    }
    downloadTemplate=()=>{
        let token = "Bearer " + sessionStorage.getItem('token')
        fetch(DOWNLOAD_QUERY_GROUP_TEMPLATE, {
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                'Authorization': token
            }
        }).then(res => res.blob().then(blob => {
            if(res.status===400){
                message.error('The file does not exist!')
            }else if(res.status===200){
                console.log(res)
                var filename=`QueryTemplate.xlsx`
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
                } else {
                    var a = document.createElement('a');
                    document.body.appendChild(a)
                    var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
                    a.href = url;
                    a.download = filename;
                    a.target='_blank'
                    a.click();
                    a.remove()
                    window.URL.revokeObjectURL(url);
                }
            }
        }))
    }
    colseUploadModal=()=>{
        this.setState({uploadModalVisible:false})
    }
    onClick(current, pageSize) {
        console.log(current,pageSize)
        this.setState({page:current,size:pageSize,loadingTable:true});
        if(this.state.currentSearchValue==='' || this.state.currentSearchValue===undefined){
            this.getTableData(this.state.currentSearchValue,current-1,pageSize);
        }else if(this.state.currentSearchValue!==''){
            this.blurSearchQuery(this.state.currentSearchValue,current-1,pageSize);
        }
    }
    runQuery=(queryName)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        confirm({
            title: 'Confirm To Run?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk:()=> {
                this.setState({runLoading:true})
                HttpGet(RUN_QUERY+queryName, token)
                    .then((res) => {
                        console.log(res)
                        if (res.status === 200) {
                            message.success(`${queryName} has been run successfully`);
                            this.getTableData(this.state.currentSearchValue,this.state.page-1, this.state.size)
                            this.setState({runLoading:false})
                        }
                    })
                    .catch((err) => {
                        this.setState({runLoading:false})
                        console.log(err.response)
                        if (err && err.response) {
                            switch (err.response.data) {
                                case 'Run error':
                                    message.error('Please check if SQL grammar is correct')
                                    break
                                case 'Run Failed':
                                    message.error('Report generation failed')
                                    break
                                case 'Sql exception':
                                    message.error('Please check if SQL grammar is correct')
                                    break
                                default:
                            }
                        }
                        return Promise.reject(err)
                    })
            },
            onCancel() {
            
            },
        });
    }
    render(){
        const {dialogVisible,searchInputData}=this.state
        const { uploading } = this.state;
        let {page, size, total, items} = this.state;
        const props = {
            action: IMPORT_QUERY,
            onRemove: (file) => {
                this.setState(({ fileList }) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ fileList }) => ({
                    fileList: [...fileList, file],
                }));
                return false;
            },
            fileList: this.state.fileList,
        };
        const pagination={
            total: total,
            defaultCurrent: page,
            current:page,
            pageSize: size,
            // showSizeChanger: true,
            // showTotal:(total) =>{
            //     return `Total ${total} items`;
            // },
            onShowSizeChange: (current, pageSize) => {
                this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        }
        return(
            <div>
                <Spin spinning={this.state.runLoading}>
                    <NavHeader currentLoginUser={this.state.currentusername}/>
                    <div>
                        <MyDialog
                            currentLoginUserName={this.state.currentLoginUserName}
                            reportIsShow={this.state.reportIsShow}
                            assistanceIsShow={this.state.assistanceIsShow}
                            selectUsers={this.state.selectUsers}
                            selectUserGroup={this.state.selectUserGroup}
                            currentusername={this.state.currentusername}
                            currentUserId={this.state.currentUserId}
                            page={this.state.page}
                            size={this.state.size}
                            currentSearchValue={this.state.currentSearchValue}
                            getTableData={this.getTableData}
                            dialogVisible={dialogVisible}
                            parentClose={this.parentClose}>
                        </MyDialog>
                        <div className="queryGroupWrap">
                            <div className="HUBquerygroupPar">
                                <div className="query-con">
                                    <h3>QUERY INVENTORY</h3>
                                    {/*<Input  onChange={this.onChangeUserName} value={this.state.currentSearchValue} className="userList" icon="search" placeholder="SEARCH" />*/}
                                    <SearchInputChange
                                        states={searchInputData}
                                        getTableData={this.getTableData}
                                        page={this.state.page}
                                        size={this.state.size}
                                        currentSearchValue={this.state.currentSearchValue}
                                        blurSearchQuery={this.blurSearchQuery}
                                        searchContent={this.searchQuery}>
                                    </SearchInputChange>
                                </div>
                                <span className="btn">
                                    {
                                        this.state.isShowDownloadBtn===true || this.state.userNeverDemand===false ?
                                            <Button disabled type="info" className="add-btn">ADD NEW QUERY</Button> :
                                            <Button type="info" className="add-btn"  onClick={this.showDialog}>ADD NEW QUERY</Button>
                                    }
                                    {
                                        this.state.importIsShow===true ?
                                            <img onClick={this.uploadQueryData} className="data-loading" src={DataLoading} alt=""/> :''
                                    }
                                </span>
                            </div>
                            <div className="gropTable">
                                <QueryInventoryDragTable
                                    runQuery={this.runQuery}
                                    currentLoginUserName={this.state.currentLoginUserName}
                                    reportIsShow={this.state.reportIsShow}
                                    assistanceIsShow={this.state.assistanceIsShow}
                                    isShowDownloadBtn={this.state.isShowDownloadBtn}
                                    selectUsers={this.state.selectUsers}
                                    selectUserGroup={this.state.selectUserGroup}
                                    currentusername={this.state.currentusername}
                                    currentUserId={this.state.currentUserId}
                                    page={this.state.page}
                                    size={this.state.size}
                                    getTableData={this.getTableData}
                                    currentSearchValue={this.state.currentSearchValue}
                                    loadingPage={this.state.loadingTable}
                                    pagination={pagination}
                                    data={this.state.data}>
                                </QueryInventoryDragTable>
                            </div>
                        </div>
                    </div>
                    <Modal className="mydialogCon addInfoDialog upload-modal"
                           title="UPLOAD DATA"
                           visible={ this.state.uploadModalVisible }
                           onCancel={this.colseUploadModal}
                           style={{top:30}}
                           okText="Submit"
                           footer={null}
                    >
                        <div className="userconfigModalContent upload-con">
                            <div className="uploadModal">
                                <p>Please upload data according to the following template: <a onClick={this.downloadTemplate} className="downloadTemplate" href="javascript:;">Click download template</a></p>
                            </div>
                            <div className="select-file-con">
                                <Upload {...props}>
                                    <Button type="warning" size="small" className="userEditBtn upload-btn"><Icon type="upload" /> Import File</Button>
                                </Upload>
                            </div>
                        </div>
                        <div className="footer-btn">
                            <Button
                                className="upload-demo-start"
                                type="primary"
                                onClick={this.handleUpload}
                                disabled={this.state.fileList.length === 0}
                                loading={uploading}
                            >
                                {uploading ? 'Uploading' : 'Start Upload' }
                            </Button>
                        </div>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
export default withRouter(QueryGroup)
