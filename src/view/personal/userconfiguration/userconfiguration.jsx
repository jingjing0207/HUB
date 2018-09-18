import React,{Component} from 'react'
import moment from 'moment';
import { Modal,Switch,Icon,Checkbox,Select,DatePicker,Upload, message } from 'antd'
import reqwest from 'reqwest';
import { Button } from 'element-react'
import MyTable from './../../../component/mytable/mytable'
import FontAwesome from 'react-fontawesome'
import {withRouter} from 'react-router-dom';

import PublicSlider from '../privatecomponents/publicslider/publicslider'
import MySecondInput from '../../../component/input/second-input'
import NavHeader from '../../../component/navlink/navheader'
// import PrivateDialog from './privatedialog/privatedialog'
import DataLoading from '../../../utils/image/data-loading.png'
import SearchInput from '../../../component/search-input/search-input'
import SearchInputDfaultValue from './../../../component/search-input/search-input-default-value'
import './userconfiguration.css'
import {
    SELECT_USER_GROUP,
    ADD_USER_GROUP,
    GET_ALL_USER_CONFIG,
    DELETE_USER_CONFIG,
    GET_INFORMATION,
    IMPORT_USERDATA, DOWNLOAD_USER_GROUP_TEMPLATE
} from '../../../constants/constants'
import { HttpGet } from "../../../server/get";
import { HttpPost } from "../../../server/post";


const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group
const Option = Select.Option;

// const FileUpload = require('react-fileupload');


class UserConfiguration extends Component{
    state={
        columns: [
            {
                title: "SEQUANCE",
                dataIndex: "key",
                key:'key'
            },
            {
                title: "USER NAME",
                dataIndex: "username",
                key:'username'
            },
            {
                title: "USER ID",
                dataIndex: "userid",
                key:'userid'
            },
            {
                title: "AUTHORITY DESCRIPTION",
                dataIndex: "authorities",
                key:'authorities',
                width:300
            },
            {
                title: "ACTION",
                dataIndex: "action",
                width:300,
                render:(text,record)=>{
                    return (
                        <div className="showDetail">
                            <span>
                                <Button type="warning" size="small" className="successBtm warningBtm userEditBtn" onClick={()=>this.showEditDalog(record.id)}>
                                    <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    EDIT
                                </Button>
                                <Button type="danger" size="small" className="successBtm" onClick={()=>this.showDelete(record.id,record.username)}>
                                    <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DELETE</Button>
                            </span>
                        </div>
                    )
                }
            }
        ],
        data: [],
        userConfigVisible:false,
        value: 1,
        editInputValue:'',
        userEditConfigVisible:false,
        plainOptions:[],
        authoritydescription:[],
        editOptionvalue:2,
        userName:'',
        emailAddress:'',
        backUser:'ADD',
        queryCheckBtn:[],
        groupCheckBtn:[],
        reportCheckBtn:[],
        assistanceCheckBtn:[],
        userGroupOption:[],
        switchChecked:true,
        selectValue:'',
        backUpUserId:'',
        searchInputData:[],
        toData:'',
        showBackup:false,
        backupQueryAuthority:[],
        backupGroupAuthority:[],
        backupReportAuthority:[],
        backupUserName:'',
        tableBackUpUser:{},
        tableUserData:{},
        earchUserName:'',
        earchEmailAddress:'',
        backEarchUser:'',
        toEarchData:'',
        fromEarchData:'',
        switchEarchChecked:false,
        backUpEarchUserId:'',
        showEarchBackup:false,
        qArr:[],
        gArr:[],
        rArr:[],
        AArr:[],
        backupQarr:[],
        backupGarr:[],
        backupRarr:[],
        editUserId:'',
        searchUserConfig:[],
        earchUserId:'',
        userId:'',
        selectOnceValue:0,
        currentLoginUser:'',
        usernamespan: {
            spanlabel: '',
        },
        uploadModalVisible:false,
        fileList: [],
        uploading: false,
        blurfrom:false,
        blurto:false,
        startValue: null,
        endValue: null,
        endOpen: false,
        groupIsAdminGroup:false,
        adminSelectOption:[],
        adminGroupNameValue:'',
        searchUserConfigFirst:[],
        searchUserConfigID:[],
        currentSelectSearchType:'Username'
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getUserConfig()
    }
    getIsAdminLogin=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
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
    getUserConfig=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        Array.prototype.distinct= function (){
            var arr = this,
                i,
                j,
                len = arr.length
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
        HttpGet(GET_ALL_USER_CONFIG,token)
            .then((res) => {
                console.log('userAll',res.data)
                let data=[]
                let searchUserConfigFirst=[],searchUserConfigID=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        id:res.data[i].userId,
                        username:res.data[i].firstName,
                        userid:res.data[i].userName,
                        authorities:res.data[i].authorities===[] ? [] : res.data[i].authorities.distinct().join('、')
                    })
                    searchUserConfigFirst.push({
                        value:res.data[i].userId,
                        label:res.data[i].firstName
                    })
                    searchUserConfigID.push({
                        value:res.data[i].userId,
                        label:res.data[i].userName
                    })
                }
                console.log(searchUserConfigFirst)
                this.setState({
                    data,
                    searchUserConfigFirst,
                    searchUserConfigID
                })
                if(this.state.currentSelectSearchType==='Username'){
                    this.setState({
                        searchUserConfig:this.state.searchUserConfigFirst
                    })
                }
            })
            .catch((err)=>{
            
            })
    }
    showAddUserDialog=()=>{
        this.getUserGroup()
        this.setState({
            userConfigVisible:true
        })
    }
    closeHanle=()=>{
        this.setState({
            userConfigVisible:false
        })
    }
    changeOptionValue=(value)=>{
        console.log(`id${value}`)
        this.setState({selectValue:value})
    }
    onChange = (value) => {
        this.setState({
            value
        });
    }
    showDelete=(id,name)=>{
        var token="Bearer "+sessionStorage.getItem('token')
        confirm({
            title: 'Confirm To Delete?',
            content: '',
            okText: 'Yes',
            cancelText: 'No',
            okType: 'danger',
            onOk:()=>{
                HttpGet(DELETE_USER_CONFIG+id,token)
                    .then((res)=>{
                        console.log(res)
                        this.getUserConfig()
                        message.success(`Successfully removed ${name}`);
                    })
                    .catch(()=>{
                    
                    })
            },
            onCancel:()=> {
                console.log('Cancel');
            },
        });
        
    }
    loadSuccess = () => {
        const hide = message.loading('Loading..', 0);
        // Dismiss manually and asynchronously
        setTimeout(hide, 2500);
    };
    showEditDalog=(id)=>{
        var token="Bearer "+sessionStorage.getItem('token')
        function titleCase(str) {
            var array = str.toLowerCase().split(" ");
            for (var i = 0; i < array.length; i++){
                array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
            }
            var string = array.join(" ");
            return string;
        }
        this.loadSuccess()
        HttpGet(SELECT_USER_GROUP+'?userId='+id,token)
            .then((res) => {
                console.log('edit')
                console.log(res)
                console.log(res.data.updataUser.enabled)
                let userGroupOption=[]
                for(let i=0;i<res.data.groups.length;i++){
                    userGroupOption.push({id:res.data.groups[i].groupId,groupName:res.data.groups[i].groupName})
                }
                let selectBackupUserName=[]
                for(let i=0;i<res.data.backuUsers.length;i++){
                    selectBackupUserName.push({value:res.data.backuUsers[i].username,label:res.data.backuUsers[i].firstName})
                }
                console.log('=selectBackupUserName=',res.data.backuUsers)
                // this.setState({})
                this.setState({
                    toEarchData:'',
                    editUserId:id
                })
                this.setState({
                    userGroupOption,
                    searchInputData:selectBackupUserName,
                    earchUserName:res.data.updataUser.firstName===null ? '' :res.data.updataUser.firstName,
                    earchUserId:res.data.updataUser.username===null ? '' : res.data.updataUser.username,
                    earchEmailAddress:res.data.updataUser.email===null ? '' :res.data.updataUser.email,
                    switchEarchChecked:res.data.updataUser.enabled===null ? '' :res.data.updataUser.enabled,
                    selectOnceValue:res.data.userGroup===null ? 0 :res.data.userGroup,
                    endValue:res.data.backupUser===null || res.data.backupUser.toDate===null ? new Date():res.data.backupUser.toDate,
                    startValue:res.data.backupUser===null || res.data.backupUser.fromDate===null  ?  new Date() :res.data.backupUser.fromDate,
                    backUpEarchUserId:res.data.backupUser===null ? '' :res.data.backupUser.backupUserName,
                    groupIsAdminGroup:res.data.userGroupName==='ADMGP' ? true : false
                })
                if(res.data.userGroupName==='ADMGP'){
                    let adminSelectOption=[{
                        id:res.data.userGroup,
                        groupName:res.data.userGroupName
                    }]
                    this.setState({
                        adminSelectOption:adminSelectOption,
                        adminGroupNameValue:res.data.userGroup
                    })
                }
                if(res.data.updataUser.authorities!==[]){
                    let authority=[]
                    for(let i=0;i<res.data.updataUser.authorities.length;i++){
                        authority.push(res.data.updataUser.authorities[i].authority)
                    }
                    let qArr=[],gArr=[],rArr=[],AArr=[]
                    console.log("====authority====>",authority)
                    for(let i=0;i<authority.length;i++){
                        console.log(authority[i].indexOf('_ASSIGNMENT')!==-1)
                        if((authority[i].indexOf('QUERY_V')!==-1)===true ||　authority[i].indexOf('QUERY_E')!==-1){
                            qArr.push(titleCase(authority[i].substring(11)))
                        }else if(authority[i].indexOf('GROUP_VIEW')!==-1　||　authority[i].indexOf('GROUP_EDIT')!==-1){
                            gArr.push(titleCase(authority[i].substring(11)))
                        }else if(authority[i].indexOf('REPORT_D')!==-1 || authority[i].indexOf('REPORT_V')!==-1){
                            rArr.push(titleCase(authority[i].substring(12)))
                        }else if(authority[i].indexOf('QUERY_GROUP_ASSIGNMENT')!==-1 || authority[i].indexOf('_IMPORT')!==-1 ||  authority[i].indexOf('REPORT_A')!==-1){
                            AArr.push((titleCase(authority[i].substring(5))))
                        }
                    }
                    console.log('===Aarr==>',AArr)
                    if(AArr.includes('Query_group_assignment')===true){
                        AArr.splice(0,1,'Query/Group_assignment')
                    }
                    this.setState({qArr, gArr, rArr, AArr})
                }else {
                    this.setState({
                        qArr:[],
                        gArr:[],
                        rArr:[],
                        AArr:[]
                    })
                }
                this.setState({
                    userEditConfigVisible:true,
                    loading: true
                })
            })
            .catch((err)=>{
            
            })
    }
    editCloseHanle=()=>{
        this.setState({
            userEditConfigVisible:false
        })
    }
    editOnChange =(e)=>{
        this.setState({
            editOptionvalue: e.target.value,
        });
    }
    onStatusChange=(checked)=>{
        console.log(`switch to ${checked}`);
        this.setState({switchChecked:checked})
    }
    changeUserName=(e)=>{
        this.setState({
            userName:e.target.value
        })
    }
    changeOnceUserId=(e)=>{
        this.setState({
            earchUserId:e.target.value
        })
    }
    changeEmail=(e)=>{
        this.setState({
            emailAddress:e.target.value
        })
    }
    onQueryChange=(checkedValues)=> {
        this.setState({queryCheckBtn:checkedValues})
    }
    onGroupChange=(checkedValues)=>{
        this.setState({groupCheckBtn:checkedValues})
    }
    onReportChange=(checkedValues)=>{
        this.setState({reportCheckBtn:checkedValues})
    }
    onAssistance=(checkedValues)=>{
        this.setState({assistanceCheckBtn:checkedValues})
    }
    getUserGroup=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        HttpGet(SELECT_USER_GROUP,token)
            .then((res) => {
                console.log('userDD',res.data)
                let userGroupOption=[]
                for(let i=0;i<res.data.groups.length;i++){
                    userGroupOption.push({id:res.data.groups[i].groupId,groupName:res.data.groups[i].groupName})
                }
                let selectBackupUserName=[]
                for(let i=0;i<res.data.backuUsers.length;i++){
                    selectBackupUserName.push({value:res.data.backuUsers[i].username,label:res.data.backuUsers[i].firstName})
                }
                console.log('=selectBackupUserName=',res.data.backuUsers)
                this.setState({userGroupOption,searchInputData:selectBackupUserName})
            })
            .catch((err)=>{
            
            })
    }
    saveNewUser=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        let queryArr=[]
        let groupArr=[]
        let reportArr=[]
        let assistanceArr=[],
            assistanceArr2=[]
        for(let i=0;i<this.state.queryCheckBtn.length;i++){
            queryArr.push({name:`ROLE_QUERY_${this.state.queryCheckBtn[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.groupCheckBtn.length;i++){
            groupArr.push({name:`ROLE_GROUP_${this.state.groupCheckBtn[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.reportCheckBtn.length;i++){
            reportArr.push({name:`ROLE_REPORT_${this.state.reportCheckBtn[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.assistanceCheckBtn.length;i++){
            assistanceArr.push(`ROLE_${this.state.assistanceCheckBtn[i].toUpperCase()}`)
        }
        if(assistanceArr.includes('ROLE_QUERY/GROUP_ASSIGNMENT')===true){
            assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT')
        }
        for(let i=0;i<assistanceArr.length;i++){
            assistanceArr2.push({name:assistanceArr[i]})
        }
        let lastSendAuthority= queryArr.concat(groupArr, reportArr,assistanceArr2)
        console.log(11111)
        console.log(lastSendAuthority)
        let password='123'
        let data={
            username:this.state.userId!=='' ? this.state.userId : message.error('User id can not be empty') ,
            firstName:this.state.userName,
            password:password,
            email:this.state.emailAddress,
            groupId:this.state.selectValue==='' ? null:this.state.selectValue,
            enabled:this.state.switchChecked,
            authorityDTOList:lastSendAuthority
        }
        HttpPost(ADD_USER_GROUP,data,token)
            .then((res) => {
                console.log(res.data)
                this.getUserConfig()
                this.setState({
                    userConfigVisible:false,
                    userId:'',
                    userName:'',
                    emailAddress:'',
                    selectValue:'',
                    switchChecked:true,
                    queryCheckBtn:[],
                    groupCheckBtn:[],
                    reportCheckBtn:[],
                    assistanceCheckBtn:[]
                })
                message.success('Add successfully');
            })
            .catch((err)=>{
                console.log(err.response)
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            message.error(err.response.data.userName)
                            break
                        case 401:
                            message.error('You do not have permission to access this data')
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
    onTODataChange=(date, dateString) =>{
        console.log(dateString);
        this.setState({
            toData:Date.parse(dateString)
        })
    }
    setUserId=(val)=>{
        this.setState({
            backUpUserId:val
        })
    }
    showBackUp=()=>{
        if(this.state.showBackup===false){
            this.setState({
                showBackup:true
            })
        }else if(this.state.showBackup===true){
            this.setState({
                showBackup:false
            })
        }
    }
    onBackupQueryChange=(checkedValues)=>{
        this.setState({backupQueryAuthority:checkedValues})
    }
    onBackupGroupChange=(checkedValues)=>{
        this.setState({backupGroupAuthority:checkedValues})
    }
    onBackupReportChange=(checkedValues)=>{
        this.setState({backupReportAuthority:checkedValues})
    }
    editUserData=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        function formatTen(num) {
            return num > 9 ? (num + "") : ("0" + num);
        }
    
        function formatDate(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + formatTen(month) + "-" + formatTen(day)+' '+ formatTen(hour)+':'+formatTen(minute)+':'+formatTen(second);
        }
        let queryArr=[]
        let groupArr=[]
        let reportArr=[]
        let assistanceArr=[],
            assistanceArr2=[]
        for(let i=0;i<this.state.qArr.length;i++){
            queryArr.push({name:`ROLE_QUERY_${this.state.qArr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.gArr.length;i++){
            groupArr.push({name:`ROLE_GROUP_${this.state.gArr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.rArr.length;i++){
            reportArr.push({name:`ROLE_REPORT_${this.state.rArr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.AArr.length;i++){
            assistanceArr.push(`ROLE_${this.state.AArr[i].toUpperCase()}`)
        }
        if(assistanceArr.includes('ROLE_QUERY/GROUP_ASSIGNMENT')===true){
            assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT')
        }
        for(let i=0;i<assistanceArr.length;i++){
            assistanceArr2.push({name:assistanceArr[i]})
        }
        let lastSendAuthority= queryArr.concat(groupArr, reportArr,assistanceArr2)
        console.log(lastSendAuthority)
        let password='123'
        console.log('ade'+this.state.toEarchData)
        console.log('ade'+this.state.fromEarchData)
        let backupData={
            backupUserName:this.state.backUpEarchUserId,
            authorityDTOList:lastSendAuthority,
            fromDate:this.state.startValue===undefined ? null : moment(this.state.startValue).format('YYYY-MM-DD hh:mm:ss'),
            toDate:this.state.endValue===undefined ? null :  moment(this.state.endValue).format('YYYY-MM-DD hh:mm:ss')
        }
        let data={
            userId:this.state.editUserId,
            username:this.state.earchUserId,
            firstName:this.state.earchUserName,
            password:password,
            email:this.state.earchEmailAddress,
            groupId:this.state.selectOnceValue===undefined ? 0 : this.state.selectOnceValue,
            enabled:this.state.switchEarchChecked,
            authorityDTOList:lastSendAuthority,
            backupUser:this.state.backUpEarchUserId==='' ? null :backupData
        }
        console.log('===data===>',data)
        HttpPost(ADD_USER_GROUP,data,token)
            .then((res)=>{
                console.log(res)
                this.getUserConfig()
                this.setState({
                    userEditConfigVisible:false,
                    backUpEarchUserId:'',
                    fromEarchData:'',
                    toEarchData:'',
                    showEarchBackup:false,
                    backupUserId:'',
                    fromDate:'',
                    toDate:'',
                    startValue: null,
                    endValue: null,
                })
                message.success('Edit successful');
            })
            .catch((err)=>{
                console.log('err=>',err.response)
                if (err && err.response) {
                    switch (err.response.data) {
                        case 'BackupData Exception':
                            message.error('The period of backup user is no more than two weeks')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    canCelEdit=()=>{
        this.setState({
            userEditConfigVisible:false,
            showEarchBackup:false,
            startValue: null,
            endValue: null,
        })
    }
    changeOnceUserName=(e)=>{
        this.setState({
            earchUserName:e.target.value
        })
    }
    changeOnceEmail=(e)=>{
        this.setState({
            earchEmailAddress:e.target.value
        })
    }
    changeOnceOptionValue=(value)=>{
        console.log(`id${value}`)
        this.setState({selectOnceValue:value})
    }
    showOnceBackUp=()=>{
        if(this.state.showEarchBackup===false){
            this.setState({
                showEarchBackup:true
            })
        }else if(this.state.showEarchBackup===true){
            this.setState({
                showEarchBackup:false
            })
        }
    }
    onEarchTODataChange=(value, dateString) =>{
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString)
        this.setState({
            toEarchData:dateString
        })
    }
    onEarchStatusChange=(checked)=>{
        console.log(`switch to ${checked}`);
        this.setState({switchEarchChecked:checked})
    }
    onEarchBackupQueryChange=(checkedValues)=>{
        this.setState({backupQarr:checkedValues})
    }
    onEarchBackupGroupChange=(checkedValues)=>{
        this.setState({backupGarr:checkedValues})
    }
    onEarchBackupReportChange=(checkedValues)=>{
        this.setState({backupRarr:checkedValues})
    }
    onEarchQueryChange=(checkedValues)=>{
        this.setState({qArr:checkedValues})
    }
    onEarchGroupChange=(checkedValues)=>{
        this.setState({gArr:checkedValues})
    }
    onEarchReportChange=(checkedValues)=>{
        this.setState({rArr:checkedValues})
    }
    onEarchAssistanceChange=(checkedValues)=>{
        this.setState({AArr:checkedValues})
    }
    setEarchUserId=(val)=>{
        this.setState({
            backUpEarchUserId:val
        })
    }
    changeBackUpUserId=(e)=>{
        this.setState({
            backUpEarchUserId:e.target.value
        })
    }
    onEarchFromDataChange=(value, dateString) =>{
        this.setState({
            fromEarchData:dateString
        })
    }
    searchEarchUserConfig=(id)=>{
        var token="Bearer "+sessionStorage.getItem('token')
        HttpGet(SELECT_USER_GROUP+'?userId='+id,token)
            .then((res) => {
                console.log(123578)
                console.log(res.data.updataUser)
                let authority=[]
                let currentauthority= res.data.updataUser.authorities===[] ? [] :res.data.updataUser.authorities
                for(let i=0;i<currentauthority.length;i++){
                    authority.push(currentauthority[i].authority)
                }
                let lastAuthority=[]
                for(let i=0;i<authority.length;i++){
                    if(authority[i].indexOf('ROLE_')!==-1){
                        lastAuthority.push(authority[i].substring(5))
                    }
                }
                let data=[]
                for(let i=0;i<1;i++){
                    data.push({
                        key:i+1,
                        id:res.data.updataUser.id,
                        userid:res.data.updataUser.username,
                        username:res.data.updataUser.firstName,
                        authorities:lastAuthority===[] ? '' : lastAuthority.distinct().join('、'),
                    })
                }
                console.log(data)
                this.setState({
                    data
                })
            })
            .catch((err)=>{
            
            })
    }
    changeUserId=(obj)=>{
        this.setState({
            userId:obj
        })
    }
    initUserId=()=>{
        this.setState({
            backUpEarchUserId:''
        })
    }
    uploadUserData=()=>{
        this.setState({uploadModalVisible:true})
    }
    squenceNumberRole=(rule, value, callback)=>{
        if (!value) {
            callback([new Error('User name should not be empty')])
        } else {
            setTimeout(() => {
                let reg =/^[0-9a-zA-Z ]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Numbers and letters can be entered')])
                }else {
                    callback()
                }
            }, 800);
        }
    }
    clearData=()=>{
        this.setState({
            userId:'',
            userName:'',
            emailAddress:'',
            selectValue:'',
            switchChecked:true
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
            url: IMPORT_USERDATA,
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
                this.getUserConfig()
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
    colseUploadModal=()=>{
        this.setState({
            uploadModalVisible:false
        })
    }
    focusFrom=()=>{
        this.setState({
            blurfrom:true,
        })
    }
    focusTo=()=>{
        this.setState({
            blurto:true
        })
    }
    downloadTemplate=()=>{
        let token = "Bearer " + sessionStorage.getItem('token')
        fetch(DOWNLOAD_USER_GROUP_TEMPLATE, {
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                'Authorization': token
            }
        }).then(res => res.blob().then(blob => {
            console.log(res)
            if(res.status===400){
                message.error('The file does not exist')
            }else if(res.status===200){
                var filename=`userTemplate.xlsx`
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
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }
    
    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }
    
    onStartChange = (value) => {
        this.onChange('startValue', value);
    }
    
    onEndChange = (value) => {
        this.onChange('endValue', value);
    }
    
    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }
    
    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    selectSearchType=(value)=>{
        this.setState({
            currentSelectSearchType:value
        })
        if(value==='UserId'){
            this.setState({
                searchUserConfig:this.state.searchUserConfigID
            })
        }else if(value==='Username'){
            this.setState({
                searchUserConfig:this.state.searchUserConfigFirst
            })
        }
    }
    render(){
        const {startValue, endValue, endOpen,columns,data,userConfigVisible,userEditConfigVisible,searchInputData,searchUserConfig}=this.state
        const plainOptions01 = ['View', 'Edit'];
        const plainOptions02 = ['View_batch', 'View_demand', 'Edit_batch','Edit_demand'];
        const plainOptions03 = ['View', 'Download'];
        const plainOptions04 = ['Query/Group_assignment', 'Report_assignment','Import'];
        const { uploading } = this.state;
        const props = {
            action: IMPORT_USERDATA,
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
        return(
            <div className="info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider></PublicSlider>
                    <div className="informationSlider">
                        <div className="HUBquerygroupPar">
                            <div className="query-con userSearch">
                                <Select className="selectType" value={this.state.currentSelectSearchType} style={{ width: 120 }} onChange={this.selectSearchType}>
                                    <Option value="Username">USER NAME</Option>
                                    <Option value="UserId">USER ID</Option>
                                </Select>
                                <SearchInput
                                    getTableData={this.getUserConfig}
                                    states={searchUserConfig}
                                    searchContent={this.searchEarchUserConfig}
                                >
                                </SearchInput>
                            </div>
                            <span className="btn EditBtn">
                                <Button type="info" className="add-btn"  onClick={this.showAddUserDialog}>ADD NEW USER</Button>
                                <img onClick={this.uploadUserData} className="data-loading" src={DataLoading} alt=""/>
                            </span>
                        </div>
                        <div className="gropTable user-config">
                            <MyTable columns={columns} data={data} ></MyTable>
                            <Modal className="mydialogCon addInfoDialog user-con-modal"
                                   title="USER"
                                   visible={userEditConfigVisible}
                                   onOk={this.editUserData}
                                   onCancel={this.canCelEdit}
                                   afterClose={this.clearData}
                                   okText="Save"
                                   style={{top:20}}
                            >
                                <div className="userconfigModalContent">
                                    <div className="user-modal-top">
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>USER NAME：<label className="mustWriteUser">*</label></label>
                                            <input type="text" disabled className='disable-input'
                                                   placeholder="User Name"
                                                   value={this.state.earchUserName}
                                                   onChange={this.changeOnceUserName}/>
                                        </div>
                                        <div className="inputInfo"> <span className="iuputSpan"></span>
                                            <label>USER ID：</label>
                                            <input type="text" disabled className='disable-input'
                                                   placeholder="User Id"
                                                   value={this.state.earchUserId}
                                                   onChange={this.changeOnceUserId}/>
                                        </div>
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>EMAIL ADDRESS：</label>
                                            <input type="text"
                                                   placeholder="Email Address"
                                                   value={this.state.earchEmailAddress} onChange={this.changeOnceEmail}/>
                                        </div>
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>USER GROUP：</label>
                                            {
                                                this.state.groupIsAdminGroup==false ?
                                                    <Select allowClear={true} onChange={this.changeOnceOptionValue} value={this.state.selectOnceValue} className="selectInfo">
                                                        {
                                                            this.state.userGroupOption.map((item,idx)=>(
                                                                <Option onChange={this.changeOnceOptionValue} value={item.id} key={idx}>{item.groupName}</Option>
                                                            ))
                                                        }
                                                    </Select> :
                                                    <Select disabled value={this.state.adminGroupNameValue} className="selectInfo">
                                                        {
                                                            this.state.adminSelectOption.map((item,idx)=>(
                                                                <Option value={item.id} key={idx}>{item.groupName}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                            }
                                        </div>
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>BACKUP USER：</label>
                                            <div className="backup-Div"  onClick={this.showOnceBackUp}>
                                                <p className="backup_P">ADD </p>
                                                {
                                                    this.state.showEarchBackup===false ?
                                                        <Icon className="icon-add" type="down" /> :
                                                        <Icon className="icon-add" type="up" />
                                                }
            
                                            </div>
                                        </div>
                                        {
                                            this.state.showEarchBackup===false ?
                                                <div> </div> :
                                                <div className="backupUser">
                                                    <div className="inputInfo">
                                                        <span className="iuputSpan"></span>
                                                        <label>BACKUP USER NAME：</label>
                                                        <SearchInputDfaultValue
                                                            getTableData={this.initUserId}
                                                            currentBackupValue={this.state.backUpEarchUserId}
                                                            states={searchInputData}
                                                            searchContent={this.setEarchUserId}>
                                                        </SearchInputDfaultValue>
                                                    </div>
                                                    <div className="inputInfo">
                                                        <span className="iuputSpan"></span>
                                                        <label>BACKUP USER ID：</label>
                                                        <input type="text" disabled value={this.state.backUpEarchUserId} onChange={this.changeBackUpUserId}/>
                                                    </div>
                                                    <div className="inputInfo">
                                                        <span className="iuputSpan"></span>
                                                        <label>FROM：</label>
                                                        <DatePicker
                                                            defaultValue={moment(startValue,'YYYY-MM-DD HH:mm:ss')}
                                                            showTime
                                                            format="YYYY-MM-DD HH:mm:ss"
                                                            placeholder="Select end start"
                                                            onChange={this.onStartChange}
                                                            onOpenChange={this.handleStartOpenChange}
                                                            focus={this.focusFrom}
                                                        />
                                                    </div>
                                                    <div className="inputInfo">
                                                        <label className="ToSpan">TO：</label>
                                                        <DatePicker
                                                            defaultValue={moment(endValue,'YYYY-MM-DD HH:mm:ss')}
                                                            showTime
                                                            format="YYYY-MM-DD HH:mm:ss"
                                                            placeholder="Select end time"
                                                            onChange={this.onEndChange}
                                                            open={endOpen}
                                                            onOpenChange={this.handleEndOpenChange}
                                                            focus={this.focusTo}
                                                        />
                                                    </div>
                                                </div>
                                        }
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>USER STATUS：</label>
                                            <div className="switchDiv">
                                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" checked={this.state.switchEarchChecked} defaultChecked onChange={this.onEarchStatusChange} />
                                            </div>
                                        </div>
                                        <div className="inputInfo">
                                            <span className="iuputSpan"></span>
                                            <label>AUTHORITY：</label>
                                            <label className="spaceLabel"></label>
                                        </div>
                                    </div>
                                    <div className="radioBtn">
                                        <div>
                                            <h4>QUERY</h4>
                                            <CheckboxGroup options={plainOptions01} defaultChecked={true} value={this.state.qArr} onChange={this.onEarchQueryChange} />
                                        </div>
                                        <div>
                                            <h4>GROUP</h4>
                                            <CheckboxGroup options={plainOptions02} defaultChecked={true} value={this.state.gArr} onChange={this.onEarchGroupChange} />
                                        </div>
                                        <div>
                                            <h4>REPORT</h4>
                                            <CheckboxGroup options={plainOptions03} defaultChecked={true} value={this.state.rArr} onChange={this.onEarchReportChange} />
                                        </div>
                                        <div>
                                            <h4>ASSISTANCE</h4>
                                            <CheckboxGroup options={plainOptions04} defaultChecked={true} value={this.state.AArr} onChange={this.onEarchAssistanceChange} />
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                            
                        </div>
                    </div>
                </div>
                <Modal className="mydialogCon addInfoDialog user-con-modal"
                    title="ADD NEW USER"
                    visible={ userConfigVisible }
                    onOk={this.saveNewUser}
                    onCancel={this.closeHanle}
                    style={{top:30}}
                    okText="Save"
                >
                    <div className="userconfigModalContent">
                        <div className="user-modal-top">
                            {/*<div className="inputInfo">*/}
                                {/*<span className="iuputSpan"></span>*/}
                                {/*<label>USER NAME：</label>*/}
                                {/*<input type="text" className="common-user"*/}
                                       {/*placeholder="User Name"*/}
                                       {/*value={this.state.userName}*/}
                                       {/*onChange={this.changeUserName}/>*/}
                            {/*</div>*/}
                            <div className="inputInfo userIdRole">
                                <span className="iuputSpan"></span>
                                <label>USER ID：<label className="mustWriteUser">*</label></label>
                                <MySecondInput
                                    value={this.state.userId}
                                    groupcode={this.state.usernamespan}
                                    Rule={this.squenceNumberRole}
                                    addGroupData={this.changeUserId}
                                >
                                </MySecondInput>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>EMAIL ADDRESS：</label>
                                <input type="text" className="common-user"
                                       placeholder="Email Address"
                                       value={this.state.emailAddress} onChange={this.changeEmail}/>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>USER GROUP：</label>
                                <Select allowClear={true} onChange={this.changeOptionValue} value={this.state.selectValue} className="selectInfo common-user">
                                    {
                                        this.state.userGroupOption.map((item,idx)=>(
                                            <Option onChange={this.changeOptionValue} value={item.id} key={idx}>{item.groupName}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>USER STATUS：</label>
                                <div className="switchDiv">
                                    <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked onChange={this.onStatusChange} />
                                </div>
                            </div>
                            <div className="inputInfo">
                                <span className="iuputSpan"></span>
                                <label>AUTHORITY：</label>
                                <label className="spaceLabel"></label>
                            </div>
                        </div>
                        <div className="radioBtn">
                            <div>
                                <h4>QUERY</h4>
                                <CheckboxGroup options={plainOptions01} defaultChecked={true} defaultValue={this.state.queryCheckBtn} onChange={this.onQueryChange} />
                            </div>
                            <div>
                                <h4>GROUP</h4>
                                <CheckboxGroup options={plainOptions02} defaultChecked={true}  defaultValue={this.state.groupCheckBtn} onChange={this.onGroupChange} />
                            </div>
                            <div>
                                <h4>REPORT</h4>
                                <CheckboxGroup options={plainOptions03} defaultChecked={true}  defaultValue={this.state.reportCheckBtn} onChange={this.onReportChange} />
                            </div>
                            <div>
                                <h4>ASSISTANCE</h4>
                                <CheckboxGroup options={plainOptions04} defaultChecked={true}  defaultValue={this.state.assistanceCheckBtn} onChange={this.onAssistance} />
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal className="mydialogCon addInfoDialog upload-modal"
                       title="UPLOAD DATA"
                       visible={ this.state.uploadModalVisible }
                       // onOk={this.uploadOk}
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
export default withRouter(UserConfiguration)
