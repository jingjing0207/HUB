import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal, Transfer, Select,Upload,Icon,Spin} from 'antd'
import {Button} from 'element-react'

import MyInput from '../../component/input/my-input'
import MySelect from './../../component/select/my-select'
import NavHeader from './../../component/navlink/navheader'
import DragTable from './../../component/dragtable/dragtable'
import SearchInput from '../../component/search-input/search-input'
import SearchInputChange from '../../component/search-input/search-input-chang'
import MySecondInput from '../../component/input/second-input'
import LotSelect from '../../component/select/lot-select'
import DataLoading from '../../utils/image/data-loading.png'
import './querygroup.css'
import {
    GET_ALL_GROUP,
    GET_EARCH_QROUP,
    SEARCH_ALL_QUERY,
    ADD_NEW_GROUP,
    GET_INFORMATION,
    DOWNLOAD_QUERY_GROUP_TEMPLATE,
    SELECT_USER_GROUP,
    GET_ALL_USER_GROUP_GUERY,
    IMPORT_QUERY, GET_ALL_GROUP_PAN, RUN_GROUP,
} from "../../constants/constants";
import {HttpGet} from "../../server/get";
import {HttpPost} from "../../server/post";
import {Input, message} from "antd/lib/index";
import reqwest from "reqwest";

const {TextArea} = Input;
const confirm = Modal.confirm;

class QueryGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: [],
            dialogVisible: false,
            dialogData01: {
                groupcode: {
                    spanlabel: 'GROUP NAME',
                    select: 'group name',
                    options: [{
                        value: 'GROUP_1',
                        label: 'GROUP_1'
                    }, {
                        value: 'GROUP_2',
                        label: 'GROUP_2'
                    }]
                },
                
                groupdescription: {
                    spanlabel: 'GROUP DESCRIPTION',
                    select: 'group description',
                    options: [{
                        value: '',
                        label: ''
                    }]
                },
                periodicity: {
                    spanlabel: 'PERIODICITY',
                    //"periodicity"
                    select: '',
                    options: [{
                        value: 'DAILY',
                        label: 'DAILY'
                    }, {
                        value: 'WEEKLY',
                        label: 'WEEKLY'
                    }, {
                        value: 'MONTHLY',
                        label: 'MONTHLY'
                    }, {
                        value: 'QUARTERLY',
                        label: 'QUARTERLY'
                    }, {
                        value: 'HALF-YEARLY',
                        label: 'HALF-YEARLY'
                    }]
                },
                startendbatch: {
                    spanlabel: 'BEFORE/AFTER BATCH',
                    select: 'AFTER',
                    options: [{
                        value: 'BEFORE',
                        label: 'BEFORE'
                    }, {
                        value: 'AFTER',
                        label: 'AFTER'
                    }]
                },
                allowrunonline: {
                    spanlabel: 'ALLOW RUN ONLINE',
                    select: '',
                    options: [{
                        value: 'YES',
                        label: 'YES'
                    }, {
                        value: 'NO',
                        label: 'NO'
                    }]
                },
                pnonty: {
                    spanlabel: 'PRIORITY',
                    select: 0,
                    options: [{
                        value: 1,
                        label: 1
                    }, {
                        value: 2,
                        label: 2
                    }, {
                        value: 3,
                        label: 3
                    }, {
                        value: 4,
                        label: 4
                    }, {
                        value: 5,
                        label: 5
                    }, {
                        value: 6,
                        label: 6
                    }, {
                        value: 7,
                        label: 7
                    }, {
                        value: 8,
                        label: 8
                    }, {
                        value: 9,
                        label: 9
                    }, {
                        value: 10,
                        label: 10
                    }, {
                        value: 11,
                        label: 11
                    }, {
                        value: 12,
                        label: 12
                    }]
                },
                authornzedusergroup: {
                    spanlabel: 'QUERY GROUP AUTHORIZED USER GROUP',
                    select: 'Query group authorized user group',
                    options: [{
                        value: 'USER GROUP',
                        label: 'USER GROUP'
                    }, {
                        value: 'USER GROUP02',
                        label: 'USER GROUP02'
                    }]
                },
                reportauthorizedusergroup: {
                    spanlabel: 'REPORT AUTHORIZED USER GROUP',
                    select: 'Report authorized user group',
                    options: [{
                        value: '',
                        label: ''
                    }]
                },
                reportauthorizeduserids: {
                    spanlabel: 'REPORT AUTHORIZED USER ID (SPLIT BY COMMA)',
                    select: 'Report authorized user id (split by comma)',
                    options: [{
                        value: '',
                        label: ''
                    }]
                },
                authornzeduserids: {
                    spanlabel: 'QUERY GROUP AUTHORIZED USER ID',
                    select: 'Query group authorized user id',
                    options: [{
                        value: '12',
                        label: '12'
                    }, {
                        value: '12314125362475',
                        label: '12314125362475'
                    }]
                },
                generateRun: {
                    spanlabel: 'GENERATE RUN',
                    select: '',
                    options: [{
                        value: 'DURING BATCH',
                        label: 'DURING BATCH'
                    },
                        {
                            value: 'ON-DEMAND',
                            label: 'ON-DEMAND'
                        }]
                },
                sla: {
                    spanlabel: 'SLA',
                    select: '',
                    options: [{
                        value: '',
                        label: ''
                    }]
                },
            },
            mockData: [],
            targetKeys: [],
            havenChose: '',
            data: [],
            searchInputData: [],
            groupCode: '',
            groupDescription: '',
            periodicity: 'DAILY',
            startEndBatch: 'AFTER',
            allowRunOnline: 'NO',
            pnonty: 2,
            authornzedUserGroup: [],
            authornzedUserIds: [],
            generateRun: 'DURING BATCH',
            allQueries: [],
            genryateRunSelected: true,
            isAdminLogin: false,
            selectUser: [],
            currentusername: '',
            selectUserGroup: [],
            selectUsers: [],
            currentUserId: [],
            isShowDownloadBtn: false,
            groupIsDemand: false,
            sla: '07:00:00',
            Reportauthorizedusergroup: [],
            Reportauthorizeduserids: [],
            isRunShow: false,
            uploadModalVisible:false,
            fileList: [],
            uploading: false,
            importIsShow:false,
            assistanceIsShow:false,
            currentLoginUserName:'',
            userNeverDemand:true,
            loading:false,
            loadingTable:false,
            page:1,
            size:15,
            total:0,
            items:0,
            currentSearchValue:'',
            runLoading:false
        }
    }
    
    componentDidMount() {
        let token = "Bearer " + sessionStorage.getItem('token')
        this.getIsAdminLogin()
        this.getAllGroupAndUser()
        this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
        this.getSearchData()
        HttpGet(SEARCH_ALL_QUERY, token)
            .then((res) => {
                this.setState({
                    allQueries: res.data,
                })
            })
            .catch((err) => {
                message.error('Request failed');
            })
    }
    
    getIsAdminLogin = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION, token)
            .then((res) => {
                console.log(res)
                let auth = []
                for (let i = 0; i < res.data.loginUser.authorities.length; i++) {
                    auth.push(res.data.loginUser.authorities[i].authority)
                }
                console.log('jing=>',auth)
                console.log('jing=>',auth.includes('ROLE_GROUP_VIEW_DEMAND'))
                
                if (auth.includes('ROLE_GROUP_VIEW_DEMAND') ===true) {
                    this.setState({
                        isShowDownloadBtn: true, //只有查看权限
                        groupIsDemand: true,
                    })
                }
              
                if (auth.includes('ROLE_GROUP_VIEW_BATCH') ===true) {
                    this.setState({
                        isShowDownloadBtn: true, //只有查看权限
                        groupIsDemand: false,
                    })
                }
                if (auth.includes( 'ROLE_GROUP_VIEW_DEMAND') ===true || auth.includes('ROLE_GROUP_VIEW_BATCH') ===true ) {
                    this.setState({isShowDownloadBtn: true})
                }
                if (auth.includes('ROLE_GROUP_EDIT_DEMAND') ===true || auth.includes('ROLE_GROUP_EDIT_BATCH') ===true) {
                    this.setState({isShowDownloadBtn: false})
                }
                if (auth.includes( 'ROLE_IMPORT') ===true) {
                    this.setState({importIsShow: true})
                }
                
                if (auth.includes('ROLE_QUERY_GROUP_ASSIGNMENT') ===true) {
                    this.setState({assistanceIsShow: true})
                }
                
                if(auth.includes('ROLE_GROUP_VIEW_DEMAND') ===false &&
                    auth.includes('ROLE_GROUP_VIEW_BATCH') ===false &&
                    auth.includes('ROLE_GROUP_EDIT_DEMAND') ===false &&
                    auth.includes('ROLE_GROUP_EDIT_BATCH') ===false){
                    this.setState({
                        userNeverDemand:false
                    })
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
                this.setState({
                    currentusername: res.data.loginUser.firstName,
                    currentUserId: res.data.loginUser.id,
                })
            })
            .catch((err)=>{
                console.log(err.response)
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
    getAllGroupAndUser = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(GET_ALL_USER_GROUP_GUERY, token)
            .then((res) => {
                console.log(111)
                console.log(res)
                let selectUserGroup = [],
                    selectUsers = []
                for (let i = 0; i < res.data.userGroups.length; i++) {
                    selectUserGroup.push({
                        value: res.data.userGroups[i].groupName,
                        label: res.data.userGroups[i].groupName
                    })
                }
                for (let i = 0; i < res.data.users.length; i++) {
                    selectUsers.push({
                        value: res.data.users[i].username,
                        label: res.data.users[i].username
                    })
                }
                console.log(selectUserGroup)
                console.log(selectUsers)
                this.setState({selectUserGroup, selectUsers})
            })
            .catch((err) => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            message.error('Request failed')
                            break
                        case 403:
                            message.error('You do not have permission to access this data')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    getSearchData = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(GET_ALL_GROUP, token)
            .then((res) => {
                let searchInput = []
                for(let i=0;i<res.data.length;i++){
                    searchInput.push({
                        value: res.data[i].groupId,
                        label: res.data[i].groupName
                    })
                }
                this.setState({
                    searchInputData:searchInput,
                })
            })
            .catch((err) => {
            
            })
    }
    getTableData = (currentSelectValue,page,size) => {
        let token = "Bearer " + sessionStorage.getItem('token')
        // let currentSearchValue=''
        this.setState({
            currentSearchValue:currentSelectValue===undefined? '' : currentSelectValue
        })
        HttpGet(GET_ALL_GROUP_PAN+`search=${currentSelectValue===undefined? '' : currentSelectValue}&pageNumber=${page}&pageSize=${size}`, token)
            .then((res) => {
                console.log(res)
                if (res.status === 200){
                    let tableData=[]
                    for(let i=0;i<res.data.groupDetails.length;i++){
                        tableData.push({
                            key:i,
                            groupCode:res.data.groupDetails[i].groupCode,
                            groupId:res.data.groupDetails[i].groupId,
                            groupName:res.data.groupDetails[i].groupName,
                            periodicity:res.data.groupDetails[i].periodicity,
                            priority:res.data.groupDetails[i].priority,
                            sla:res.data.groupDetails[i].sla,
                            status:res.data.groupDetails[i].status,
                            userGroup:res.data.groupDetails[i].userGroup,
                            userIds:res.data.groupDetails[i].userIds,
                            allowRunOnline:res.data.groupDetails[i].allowRunOnline,
                            description:res.data.groupDetails[i].description,
                            generateRun:res.data.groupDetails[i].generateRun,
                        })
                    }
                    console.log('isRunShow=>',this.state.isRunShow)
                    this.setState({
                        data: tableData,
                        total:res.data.totalElements,
                        loadingTable:false
                    })
                }
            })
            .catch((err) => {
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
    showDialog = () => {
        this.setState({loading:true})
        this.getMock()
    }
    parentClose = (flag) => {
        this.setState({dialogVisible: flag})
    }
    
    getMock = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        const mockData = [];
        HttpGet(SEARCH_ALL_QUERY, token)
            .then((res) => {
                console.log(11)
                console.log(res)
                this.setState({
                    loading:true
                })
                for (let i = 0; i < res.data.length; i++) {
                    const data = {
                        key: res.data[i].queryId,
                        title: res.data[i].queryName,
                        description: res.data[i].queryDescription,
                        disabled: res.data[i].selected
                    }
                    mockData.push(data);
                }
                this.setState({mockData,dialogVisible: true, loading:false});
            })
            .catch((err) => {
                message.error('Request failed');
            })
    }
    searchQuery = (id) => {
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(GET_EARCH_QROUP + id, token)
            .then((res) => {
                if (res.status === 200) {
                    let tableData = []
                    tableData.push({
                        key: '1',
                        description:res.data.groupDetail.description,
                        generateRun:res.data.generateRun,
                        allowRunOnline: res.data.groupDetail.allowRunOnline,
                        periodicity: res.data.groupDetail.periodicity,
                        status: res.data.groupDetail.status,
                        groupName: res.data.groupDetail.groupName,
                        groupId: res.data.groupDetail.groupId
                    })
                    this.setState({data: tableData,total:1})
                }
            })
            .catch((err) => {
            
            })
    }
    handleChange = (targetKeys, direction, moveKeys) => {
        console.log(targetKeys, direction, moveKeys);
        this.setState({targetKeys});
    }
    addNewGroup = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        if(this.state.currentLoginUserName!==''){
            this.state.authornzedUserIds.unshift(this.state.currentLoginUserName)
        }
        let groupDetail
        this.state.genryateRunSelected===true ?
                groupDetail={
                    groupCode: this.state.groupCode,
                    groupName: this.state.groupCode,
                    description: this.state.groupDescription,
                    periodicity: this.state.periodicity,
                    status: this.state.startEndBatch,
                    allowRunOnline: this.state.allowRunOnline,
                    priority: this.state.pnonty,
                    userGroup: this.state.authornzedUserGroup === [] ? '' : this.state.authornzedUserGroup.join(','),
                    userIds: this.state.authornzedUserIds === [] ? '' : this.state.authornzedUserIds.join(','),
                    generateRun: this.state.generateRun,
                    sla:this.state.sla
                } :
                groupDetail={
                    groupCode: this.state.groupCode,
                    groupName: this.state.groupCode,
                    description: this.state.groupDescription,
                    periodicity: this.state.periodicity,
                    userGroup: this.state.authornzedUserGroup === [] ? '' : this.state.authornzedUserGroup.join(','),
                    userIds: this.state.authornzedUserIds === [] ? '' : this.state.authornzedUserIds.join(','),
                    generateRun: this.state.generateRun,
                }
                
        let data = {
            groupDetail: groupDetail,
            queryIds: this.state.targetKeys
            
        }
        HttpPost(ADD_NEW_GROUP, data, token)
            .then((res) => {
                
                if (res.status === 200) {
                    this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
                    this.setState({
                        dialogVisible: false,
                        
                    })
                    message.success('Add successfully');
                }
            })
            .catch((err) => {
                if (err && err.response) {
                    switch (err.response.status) {
                        case 401:
                            message.error('You do not have permission to access this data')
                            break
                        case 403:
                            message.error('You do not have permission to access this data')
                            break
                        default:
                    }
                    if (err && err.response) {
                        switch (err.response.data) {
                            case "GroupName Not Null":
                                message.error('Query group name can not be empty')
                                break;
                            case "The groupName already exists":
                                message.error('Query group name already exists')
                                break;
                            default:
                        }
                    }
                    return Promise.reject(err)
                }
                return Promise.reject(err)
            })
    }
    renderItem = (item) => {
        const customLabel = (
            <span className="custom-item">
        {item.title} - {item.description}
      </span>
        );
        
        return {
            label: customLabel, // for displayed item
            value: item.title, // for title and filter matching
        };
    }
    
    changeGroupCode = (obj) => {
        this.setState({
            groupCode: obj
        })
    }
    GroupNameRole = (rule, value, callback) => {
        if (!value) {
            callback([new Error('Query group name should not be empty')])
        } else {
            setTimeout(() => {
                let reg = /^[0-9a-zA-Z_@#$%&*]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Numbers and letters can be entered')])
                } else {
                    callback()
                }
            }, 800);
        }
    }
    changeGroupDescription = (e) => {
        this.setState({
            groupDescription: e.target.value
        })
    }
    changePeriodicity = (val) => {
        this.setState({
            periodicity: val
        })
    }
    changeStartEndBatch = (val) => {
        this.setState({
            startEndBatch: val
        })
    }
    changeAllowRunOnline = (val) => {
        this.setState({
            allowRunOnline: val
        })
    }
    changeAuthorizedUserGroup = (obj) => {
        this.setState({
            authornzedUserGroup: obj
        })
    }
    changeAuthorizedUserIds = (obj) => {
        this.setState({
            authornzedUserIds: obj
        })
    }
    changeGenerateRun = (val) => {
        console.log(val)
        this.setState({
            generateRun: val
        })
        
        if (val === 'DURING BATCH') {
            this.setState({genryateRunSelected: true})
        } else if (val === 'ON-DEMAND') {
            this.setState({genryateRunSelected: false})
        }
    }
    chengPnonty = (val) => {
        this.setState({
            pnonty: val
        })
    }
    searchUserGroup = (val) => {
        this.setState({
            authornzedUserIds: val
        })
    }
    uploadGroupData = () => {
        this.setState({uploadModalVisible:true})
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
            console.log(res)
            if(res.status===400){
                message.error('The file does not exist!')
            
            }else if(res.status===200){
                var filename=`GroupTemplate.xlsx`
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
    changeSla = (obj) => {
        this.setState({
            sla: obj
        })
    }
    onScrollMockData=(direction, event)=>{
        // console.log('dir=>',direction,event)
    }
    filterOption=(inputValue, option) => {
        return option.title.toLowerCase().indexOf(inputValue) > -1;
    }
    blurSearchQuery=(value,page,size)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let currentPage=page+1
        console.log('currentPage==>',currentPage)
        this.setState({
            currentSearchValue:value
        })
        console.log(value)
        HttpGet(GET_ALL_GROUP_PAN+`search=${value}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                this.setState({ page:currentPage })
                let searchInput = []
                let tableData=[]
                for(let i=0;i<res.data.groupDetails.length;i++){
                    tableData.push({
                        key:i,
                        groupCode:res.data.groupDetails[i].groupCode,
                        groupId:res.data.groupDetails[i].groupId,
                        groupName:res.data.groupDetails[i].groupName,
                        periodicity:res.data.groupDetails[i].periodicity,
                        priority:res.data.groupDetails[i].priority,
                        sla:res.data.groupDetails[i].sla,
                        status:res.data.groupDetails[i].status,
                        userGroup:res.data.groupDetails[i].userGroup,
                        userIds:res.data.groupDetails[i].userIds,
                        allowRunOnline:res.data.groupDetails[i].allowRunOnline,
                        description:res.data.groupDetails[i].description,
                        generateRun:res.data.groupDetails[i].generateRun,
                    })
                    searchInput.push({
                        value: res.data.groupDetails[i].groupId,
                        label: res.data.groupDetails[i].groupName
                    })
                }
                this.setState({
                    data: tableData,
                    searchInputData:searchInput,
                    total:res.data.totalElements,
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
    onClick(current, pageSize) {
        console.log(current,pageSize)
        // let currentInputValueStatus=
        this.setState({
            currentSearchValue:sessionStorage.getItem('currentInputValueStatus'),
            page:current,
            size:pageSize,
            loadingTable:true
        });
        console.log('this.state.page=>',this.state.page)
        console.log('currentSearchValue',this.state.currentSearchValue)
        if(this.state.currentSearchValue==='' || this.state.currentSearchValue===undefined){
            this.getTableData(this.state.currentSearchValue,current-1,pageSize);
        }else if(this.state.currentSearchValue!==''){
            this.blurSearchQuery(this.state.currentSearchValue,current-1,pageSize);
        }
    }
    // runGroupQuery=(id,groupname)=>{
    //     let token="Bearer "+sessionStorage.getItem('token')
    //     HttpGet(RUN_GROUP+id,token)
    //         .then((res) => {
    //             console.log(111)
    //             console.log(res)
    //             if(res.status===200){
    //                 let rundata=[]
    //                 for(let i=0;i<res.data.length;i++){
    //                     rundata.push({
    //                         queryName:res.data[i].queryName,
    //                         dateLastRun:this.timestampToTime(res.data[i].dateLastRun)
    //                     })
    //                 }
    //                 this.setState({
    //                     runModalVisible:false,
    //                     rundata:rundata
    //                 })
    //                 message.success(`${groupname} has been run successfully`);
    //             }
    //         })
    //         .catch((err)=>{
    //             console.log(err.response)
    //             if (err && err.response) {
    //                 switch (err.response.data) {
    //                     case 'Run error':
    //                         message.error('Run unsuccessfully')
    //                         break
    //                     case 'Run Failed':
    //                         message.error('Report generation failed')
    //                         break
    //                     case 'Sql exception':
    //                         message.error('Please check if SQL grammar is correct')
    //                         break
    //                     default:
    //                 }
    //             }
    //             return Promise.reject(err)
    //         })
    // }
    render() {
        const {dialogVisible, dialogData01, mockData, targetKeys, searchInputData} = this.state
        let isValue = false
        let {page, size, total, items} = this.state;
        const pagination={
            total: total,
            defaultCurrent: page,
            current:page,
            pageSize: size,
            onShowSizeChange: (current, pageSize) => {
                this.onClick(current, pageSize)
            },
            onChange:(current, pageSize) => {
                this.onClick(current, pageSize)
            },
        }
        const { uploading } = this.state;
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
    
        const disableInput=true
        let groupName=10
        
        console.log('this.state.page=>',this.state.page)
        return (
            <div>
                    <NavHeader currentLoginUser={this.state.currentusername}/>
                    <div>
                        <Modal className="detailModal"
                               title="ADD NEW GROUP"
                               style={{top: 0}}
                               visible={dialogVisible}
                               onOk={this.addNewGroup}
                               onCancel={() => this.setState({dialogVisible: false})}
                               okText="Save"
                        >
                            <div className="dialog-con">
                                <div className="dialog-content-left">
                                    <div className="addList">
                                        <MySecondInput
                                            mustNumber={groupName}
                                            value={this.state.groupCode}
                                            Rule={this.GroupNameRole}
                                            groupcode={dialogData01.groupcode}
                                            addGroupData={this.changeGroupCode}
                                        >
                                        </MySecondInput>
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"></div>
                                            <div className="rightPar1">
                                                <span
                                                    className="spanLabel sqlSpan">{this.state.dialogData01.groupdescription.spanlabel}</span>
                                                <TextArea onChange={this.changeGroupDescription}
                                                          value={this.state.groupDescription} rows={3}
                                                          placeholder="group description"/>
                                            </div>
                                        </div>
                                        
                                        <MySelect
                                            defaultValue={this.state.generateRun}
                                            groupcode={dialogData01.generateRun}
                                            changeSelectValue={this.changeGenerateRun}
                                        >
                                        </MySelect>
                                        {
                                            this.state.genryateRunSelected === true ?
                                                <span>
                                                    <MySelect
                                                        defaultValue={this.state.allowRunOnline}
                                                        groupcode={dialogData01.allowrunonline}
                                                        changeSelectValue={this.changeAllowRunOnline}
                                                    >
                                                    </MySelect>
                                                    {/*<MySelect*/}
                                                        {/*defaultValue={this.state.startEndBatch}*/}
                                                        {/*groupcode={dialogData01.startendbatch}*/}
                                                        {/*changeSelectValue={this.changeStartEndBatch}*/}
                                                    {/*>*/}
                                                    {/*</MySelect>*/}
                                                    <MyInput
                                                        disableInput={disableInput}
                                                        value={this.state.sla}
                                                        groupcode={dialogData01.sla}
                                                        addGroupData={this.changeSla}
                                                    >
                                                    </MyInput>
                                                    <MySelect
                                                        defaultValue={this.state.pnonty}
                                                        groupcode={dialogData01.pnonty}
                                                        changeSelectValue={this.chengPnonty}
                                                    >
                                                    </MySelect>
                                                </span> : ''
                                        }
                                        <MySelect
                                            defaultValue={this.state.periodicity}
                                            groupcode={dialogData01.periodicity}
                                            changeSelectValue={this.changePeriodicity}
                                        >
                                        </MySelect>
                                        {
                                            this.state.assistanceIsShow===true ?
                                                <span>
                                                    <LotSelect
                                                        disable={this.state.assistanceIsShow}
                                                        isValue={isValue}
                                                        children={this.state.selectUserGroup}
                                                        groupcode={dialogData01.authornzedusergroup}
                                                        addGroupData={this.changeAuthorizedUserGroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.state.assistanceIsShow}
                                                        isValue={isValue}
                                                        children={this.state.selectUsers}
                                                        groupcode={dialogData01.authornzeduserids}
                                                        addGroupData={this.changeAuthorizedUserIds}
                                                    >
                                                    </LotSelect>
                                                </span> : <span>
                                                    <LotSelect
                                                        disable={this.state.assistanceIsShow}
                                                        isValue={isValue}
                                                        children={this.state.selectUserGroup}
                                                        groupcode={dialogData01.authornzedusergroup}
                                                        addGroupData={this.changeAuthorizedUserGroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.state.assistanceIsShow}
                                                        isValue={isValue}
                                                        children={this.state.selectUsers}
                                                        groupcode={dialogData01.authornzeduserids}
                                                        addGroupData={this.changeAuthorizedUserIds}
                                                    >
                                                    </LotSelect>
                                                </span>
                                        }
                                    </div>
                                </div>
                                <div className="dialog-content-right transfrom-wrap queryTransfrom">
                                    <Transfer
                                        dataSource={mockData}
                                        showSearch
                                        listStyle={{
                                            width: 280,
                                            height: 470,
                                        }}
                                        lazy={true}
                                        searchPlaceholder='Search'
                                        titles={['CANDIDATE QUERIES', 'QUERIES UNDER CURRENT GROUP']}
                                        targetKeys={targetKeys}
                                        filterOption={this.filterOption}
                                        onChange={this.handleChange}
                                        render={this.renderItem}
                                        onScroll={this.onScrollMockData}
                                    />
                                </div>
                            </div>
                        </Modal>
                        <div className="queryGroupWrap">
                            <div className="HUBquerygroupPar">
                                <div className="query-con">
                                    <h3>Query Group</h3>
                                    <SearchInputChange
                                        states={searchInputData}
                                        getTableData={this.getTableData}
                                        page={this.state.page}
                                        size={this.state.size}
                                        currentSearchValue={this.state.currentSearchValue}
                                        blurSearchQuery={this.blurSearchQuery}
                                        searchContent={this.searchQuery}
                                    >
                                    </SearchInputChange>
                                </div>
                                <span className="btn">
                                    {
                                        this.state.isShowDownloadBtn===true || this.state.userNeverDemand===false ?
                                            <Button disabled type="info" className="add-btn">ADD NEW GROUP</Button> :
                                            <Button type="info" className="add-btn" loading={this.state.loading}
                                                    onClick={this.showDialog}>ADD NEW GROUP</Button>
                                    }
                                    {
                                        this.state.importIsShow===true ?
                                            <img onClick={this.uploadGroupData}
                                                 className="data-loading" src={DataLoading} alt=""/> :''
                                    }
                                </span>
                            </div>
                            <div className="gropTable">
                                <DragTable
                                    pagination={pagination}
                                    disable={this.state.assistanceIsShow}
                                    isRunShow={this.state.isRunShow}
                                    currentSearchValue={this.state.currentSearchValue}
                                    currentLoginUserName={this.state.currentLoginUserName}
                                    groupIsDemand={this.state.groupIsDemand}
                                    isShowDownloadBtn={this.state.isShowDownloadBtn}
                                    currentUserId={this.state.currentUserId}
                                    selectUserGroup={this.state.selectUserGroup}
                                    selectUsers={this.state.selectUsers}
                                    isAdminLogin={this.state.isAdminLogin}
                                    getTableData={this.getTableData}
                                    page={this.state.page}
                                    size={this.state.size}
                                    loadingTable={this.state.loadingTable}
                                    data={this.state.data}
                                    allQueries={this.state.allQueries}
                                    getMock={this.getMock}
                                />
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
            </div>
        )
    }
}

export default withRouter(QueryGroup)
