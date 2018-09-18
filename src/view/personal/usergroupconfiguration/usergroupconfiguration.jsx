import React,{Component} from 'react'
import { Modal,Checkbox,Transfer  } from 'antd'
import { Button } from 'element-react'
import MyTable from './../../../component/mytable/mytable'
// import MySecondInput from '../../../component/input/second-input'
import CheckFormSecond from '../../../component/input/check-form-second'
// import Transfrom from './../privatecomponents/transfromcomponent/transfrom'
import FontAwesome from 'react-fontawesome'
import {withRouter} from 'react-router-dom';
// import DataLoading from '../../../utils/image/data-loading.png'


import PublicSlider from '../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../component/navlink/navheader'
import SearchInput from '../../../component/search-input/search-input'
import {
    GET_ALL_GROUP_USER,
    ADD_NEW_USER_GROUP,
    GET_ALL_USER_GROUP,
    DELETE_USER_GROUP,
    GET_INFORMATION
} from '../../../constants/constants'
import './usergroupconfiguration.css'
import { HttpGet } from "../../../server/get";
import { HttpPost } from "../../../server/post";
import {message} from "antd/lib/index";

const confirm = Modal.confirm;
const CheckboxGroup = Checkbox.Group

// const token="Bearer "+sessionStorage.getItem('token')

class UserGroupConfiguration extends Component{
    state={
        columns: [
            {
                title: "SEQUANCE",
                dataIndex: "key",
                key: "key",
            },
            {
                title: "GROUP NAME",
                dataIndex: "groupName",
                key: "groupName",
            },
            {
                title: "AUTHORITY DESCRIPTION",
                dataIndex: "authorities",
                key: "authorities",
                width:300
            },
            {
                title: "ACTION",
                dataIndex: "action",
                width:300,
                render:(text,record)=>{
                    return (
                        <div className="showDetail">
                            {
                                record.groupName==='ADMGP'?
                                    <span>
                                        <Button type="primary" size="small" className="detailBtn" onClick={()=>this.edtDialog(record.groupId)}>
                                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            DETAIL</Button>
                                    </span> :
                                    <span>
                                        <Button type="warning" size="small" className="successBtm warningBtm userEditBtn" onClick={()=>this.edtDialog(record.groupId)}>
                                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            EDIT</Button>
                                        <Button type="danger" size="small" className="successBtm" onClick={()=>this.showDelete(record.groupId,record.groupName)}>
                                            <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            DELETE</Button>
                                    </span>
                            }
                           
                        </div>
                    )
                }
            }
        ],
        data: [],
        userConfigVisible:false,
        headerTitle:['USER LIST','GROUP LIST'],
        userEditConfigVisible:false,
        inputname:'',
        editHeaderTitle:[],
        groupName:'',
        groupnamespan: {
            spanlabel: '',
        },
        newGroupQueryAuth:[],
        newGroupGroupAuth:[],
        newGroupReportAuth:[],
        newAssistanceAuth:[],
        userList:[],
        mockData: [],
        targetKeys: [],
        backupQarr:[],
        backupGarr:[],
        backupRarr:[],
        backupAarr:[],
        editTargetKeys:[],
        editMockData:[],
        currentEditId:'',
        currentLoginUser:'',
        searchGroupConfig:[],
        isAdminGroup:false
        
    }
    componentDidMount() {
        this.getIsAdminLogin()
        this.getGroupList()
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
    getGroupList=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
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
        HttpGet(GET_ALL_USER_GROUP,token)
            .then((res)=>{
                console.log("group")
                console.log(res.data)
                let data=[]
                let searchGroupConfig=[]
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key: i + 1,
                        groupId: res.data[i].groupId,
                        groupName: res.data[i].groupName,
                        authorities:res.data[i].authorities===null ? '' : res.data[i].authorities.distinct().join('、')
                    })
                    searchGroupConfig.push({
                        value:res.data[i].groupId,
                        label:res.data[i].groupName
                    })
                }
                this.setState({
                    data,
                    searchGroupConfig
                })
            })
            .catch((err)=>{
            
            })
    }
    
    editFilterOption = (inputValue, option) => {
        return  option.title.toLowerCase().indexOf(inputValue) > -1;
    }
    addFilterOption = (inputValue, option) => {
        return  option.title.toLowerCase().indexOf(inputValue) > -1;
    }
    handleChange = (targetKeys) => {
        console.log(targetKeys)
        this.setState({ targetKeys });
    }
    
    showAddUserDialog=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_ALL_GROUP_USER+'0',token)
            .then((res)=>{
                console.log(res)
                let userList=[]
                for(let i=0;i<res.data.userList.length;i++){
                    userList.push({
                        key:res.data.userList[i].id,
                        title:res.data.userList[i].username
                    })
                }
                this.setState({
                    mockData:userList,
                })
            })
            .catch((err)=>{
            
            })
    
        this.setState({
            userConfigVisible:true
        })
    }
    closeHanle=()=>{
        this.setState({
            userConfigVisible:false,
            groupName:'',
        })
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
                HttpGet(DELETE_USER_GROUP+id,token)
                    .then((res)=>{
                        this.getGroupList()
                        message.success(`Successfully removed ${name}`);
                    })
                    .catch((err)=>{
            
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
    edtDialog=(id)=>{
        console.log('id',id)
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
        this.setState({currentEditId:id})
        HttpGet(GET_ALL_GROUP_USER+id,token)
            .then((res)=>{
                console.log(res)
                let userList=[]
                for(let i=0;i<res.data.userList.length;i++){
                    userList.push({
                        key:res.data.userList[i].id,
                        title:res.data.userList[i].username
                    })
                }
                let currentGroupUsers=[]
                for(let i=0;i<res.data.groupUsers.length;i++){
                    currentGroupUsers.push(res.data.groupUsers[i].id)
                }
                console.log('user=>',userList)
                this.setState({
                    inputname:res.data.userGroup.groupName,
                    editMockData:userList,
                    editTargetKeys:currentGroupUsers
                })
                if(res.data.userGroup.authorities!==[]){
                    let backupauthority=[]
                    let backupQarr=[]
                    let backupGarr=[]
                    let backupRarr=[]
                    let backupAarr=[]
                    for(let i=0;i<res.data.userGroup.authorities.length;i++){
                        backupauthority.push(res.data.userGroup.authorities[i].authority)
                    }
                    for(let i=0;i<backupauthority.length;i++){
                        if(backupauthority[i].indexOf('QUERY_V')!==-1 || backupauthority[i].indexOf('QUERY_E')!==-1 ){
                            backupQarr.push(titleCase(backupauthority[i].substring(11)))
                        }else if(backupauthority[i].indexOf('GROUP_VIEW')!==-1　||　backupauthority[i].indexOf('GROUP_EDIT')!==-1){
                            backupGarr.push(titleCase(backupauthority[i].substring(11)))
                        }else if(backupauthority[i].indexOf('REPORT_D')!==-1 || backupauthority[i].indexOf('REPORT_V')!==-1){
                            backupRarr.push(titleCase(backupauthority[i].substring(12)))
                        }else if(backupauthority[i].indexOf('QUERY_GROUP_ASSIGNMENT')!==-1 || backupauthority[i].indexOf('_IMPORT')!==-1 ||  backupauthority[i].indexOf('REPORT_A')!==-1){
                            backupAarr.push((titleCase(backupauthority[i].substring(5))))
                        }
                    }
                    console.log('===backupGarr==>',backupGarr)
                    if(backupAarr.includes('Query_group_assignment')===true){
                        backupAarr.splice(0,1,'Query/Group_assignment')
                    }
                    this.setState({backupQarr, backupGarr, backupRarr, backupAarr})
                }
                this.setState({
                    userEditConfigVisible:true
                })
            })
            .catch((err)=>{
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            message.error('Request failed')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    closeDialog=()=>{
        this.setState({
            userEditConfigVisible:false
        })
    }
    changeGroupName=(obj)=>{
        
        this.setState({
            groupName:obj
        })
    }
    selectQueryAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({newGroupQueryAuth:checkedValues})
    }
    selectGroupAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({newGroupGroupAuth:checkedValues})
    }
    selectReportAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({newGroupReportAuth:checkedValues})
    }
    selectAssistanceAuth=(checkedValues)=>{
        this.setState({newAssistanceAuth:checkedValues})
    }
    saveNewGroup=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        function findall(a,x){
            var results=[],
                len=a.length,
                pos=0;
            while(pos<len){
                pos=a.indexOf(x,pos);
                if(pos===-1){//未找到就退出循环完成搜索
                    break;
                }
                results.push(pos);//找到就存储索引
                pos+=1;//并从下个位置开始搜索
            }
            return results;
        }
    
        // var arr=[1,2,3,1,4,1,4,1];
        // findall(arr,1)
        
        let queryArr=[],
            groupArr=[],
            reportArr=[],
            assistanceArr=[],
            assistanceArr2=[]
        for(let i=0;i< this.state.newGroupQueryAuth.length;i++){
            queryArr.push({name:`ROLE_QUERY_${this.state.newGroupQueryAuth[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.newGroupGroupAuth.length;i++){
            groupArr.push({name:`ROLE_GROUP_${this.state.newGroupGroupAuth[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.newGroupReportAuth.length;i++){
            reportArr.push({name:`ROLE_REPORT_${this.state.newGroupReportAuth[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.newAssistanceAuth.length;i++){
            assistanceArr.push(`ROLE_${this.state.newAssistanceAuth[i].toUpperCase()}`)
        }
        console.log('==assistanceArr==>',assistanceArr)
        
        console.log(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'))
        
        console.log('splice===>',assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT'))
    
        console.log('=findall=>',findall(assistanceArr,'ROLE_QUERY/GROUP_ASSIGNMENT'))
        
        assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT')
        
        console.log('=assistanceArr=>',assistanceArr)
        if(assistanceArr.includes('ROLE_QUERY/GROUP_ASSIGNMENT')===true){
            assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT')
        }
        for(let i=0;i<assistanceArr.length;i++){
            assistanceArr2.push({name:assistanceArr[i]})
        }
        console.log('assistanceArr2',assistanceArr2)
        let currentChecked=queryArr.concat(groupArr, reportArr,assistanceArr2)
        console.log(currentChecked)
        let data={
            groupName:this.state.groupName,
            authorityDTOList:currentChecked,
            userIds:this.state.targetKeys
        }
        HttpPost(ADD_NEW_USER_GROUP,data,token)
            .then((res)=>{
                console.log(res)
                this.setState({
                    userConfigVisible:false,
                    groupName:'',
                    targetKeys:[]
                })
                this.getGroupList()
                message.success('Add successfully');
            })
            .catch((err)=>{
                console.log(err.response)
                if (err && err.response) {
                    switch (err.response.data) {
                        case "groupName Not Null":
                            message.error('User group name can not be empty')
                            break;
                        case "The groupName already exists":
                            message.error('User group name already exists')
                            break;
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    editUserGroup=(e)=>{
        this.setState({
            inputname:e.target.value
        })
    }
    selectEditQueryAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({backupQarr:checkedValues})
    }
    selectEditGroupAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({backupGarr:checkedValues})
    }
    selectEditReportAuth=(checkedValues)=> {
        console.log(checkedValues)
        this.setState({backupRarr:checkedValues})
    }
    selectEditAssistanceChange=(checkedValues)=>{
        this.setState({backupAarr:checkedValues})
    }
    editHandleChange= (targetKeys) => {
        console.log(targetKeys)
        this.setState({ editTargetKeys: targetKeys});
    }
    editSuccessBtn=()=>{
        var token="Bearer "+sessionStorage.getItem('token')
        let queryArr=[],
            groupArr=[],
            reportArr=[],
            assistanceArr=[],
            assistanceArr2=[]
        console.log(this.state.backupQarr)
        for(let i=0;i< this.state.backupQarr.length;i++){
            queryArr.push({name:`ROLE_QUERY_${this.state.backupQarr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.backupGarr.length;i++){
            groupArr.push({name:`ROLE_GROUP_${this.state.backupGarr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.backupRarr.length;i++){
            reportArr.push({name:`ROLE_REPORT_${this.state.backupRarr[i].toUpperCase()}`})
        }
        for(let i=0;i<this.state.backupAarr.length;i++){
            assistanceArr.push(`ROLE_${this.state.backupAarr[i].toUpperCase()}`)
        }
        
        if(assistanceArr.includes('ROLE_QUERY/GROUP_ASSIGNMENT')===true){
            assistanceArr.splice(assistanceArr.indexOf('ROLE_QUERY/GROUP_ASSIGNMENT'),1,'ROLE_QUERY_GROUP_ASSIGNMENT')
        }
        for(let i=0;i<assistanceArr.length;i++){
            assistanceArr2.push({name:assistanceArr[i]})
        }
        let editChecked=queryArr.concat(groupArr, reportArr,assistanceArr2)
        let data={
            groupId:this.state.currentEditId,
            groupName:this.state.inputname,
            authorityDTOList:editChecked,
            userIds:this.state.editTargetKeys
        }
        this.state.inputname==='ADMGP' ?
            this.setState({
                userEditConfigVisible:false,
            }) :
            HttpPost(ADD_NEW_USER_GROUP,data,token)
                .then((res)=>{
                    console.log(res)
                    this.setState({
                        userEditConfigVisible:false,
                    })
                    this.getGroupList()
                    message.success('Edit successfully');
                })
                .catch((err)=>{
                    console.log(err.response)
                   // GroupName immutable
                    if (err && err.response) {
                        switch (err.response.data) {
                            case 'GroupName immutable':
                                message.error('User group can not be edited')
                                break;
                            case 'ADMGP Prohibit to edit':
                                message.error('ADMGP group can not be edited')
                                break;
                            default:
                        }
                    }
                    return Promise.reject(err)
                })
        
    }
    searchEarchGroupConfig=(id)=>{
        var token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_ALL_GROUP_USER+id,token)
            .then((res) => {
                let authority=[]
                let currentauthority= res.data.userGroup.authorities===[] ? [] :res.data.userGroup.authorities
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
                // for(let i=0;i<1;i++){
                console.log('res.data.userGroup==>',res.data.userGroup)
                data.push({
                    key:1,
                    groupId:res.data.userGroup.groupId,
                    groupName:res.data.userGroup.groupName,
                    authorities:lastAuthority===[] ? '' : lastAuthority.distinct().join('、'),
                })
                // }
                console.log(data)
                this.setState({
                    data
                })
            })
            .catch((err)=>{
            
            })
    }
    squenceNumberRole=(rule, value, callback)=>{
        if (!value) {
            callback([new Error('User group name should not be empty')])
        } else {
            setTimeout(() => {
                let reg = /^[0-9a-zA-Z]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Numbers and letters can be entered')])
                }else {
                    callback()
                }
            }, 800);
        }
    }
    render(){
        const {columns,data,userConfigVisible,userEditConfigVisible,searchGroupConfig }=this.state
        const plainOptions01 = ['View', 'Edit'];
        const plainOptions02 = ['View_batch', 'View_demand', 'Edit_batch','Edit_demand'];
        const plainOptions03 = ['View', 'Download'];
        const plainOptions04 = ['Query/Group_assignment', 'Report_assignment','Import'];
        console.log('',this.state.groupName)
        const groupNameLabel='Group name'
        return(
            <div className="info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider></PublicSlider>
                    <div className="informationSlider">
                        <div className="HUBquerygroupPar">
                            <div className="query-con">
                                {/*<Input className="querysearch userConfig" icon="search" placeholder="SEARCH" />*/}
                                <SearchInput
                                    getTableData={this.getGroupList}
                                    states={searchGroupConfig}
                                    searchContent={this.searchEarchGroupConfig}
                                >
                                </SearchInput>
                            </div>
                            <span className="btn EditBtn">
                                <Button type="info" className="add-btn"  onClick={this.showAddUserDialog}>ADD NEW GROUP</Button>
                            </span>
                        </div>
                        <div className="gropTable user-config">
                            <MyTable columns={columns} data={data} ></MyTable>
                            <Modal className="mydialogCon userConfiguration"
                                   title="GROUP"
                                   style={{ top: 30 }}
                                   visible={userEditConfigVisible}
                                   onOk={this.editSuccessBtn}
                                   okText={this.state.inputname==='ADMGP' ? 'OK' : 'Save'}
                                   onCancel={this.closeDialog}
                            >
                                <div>
                                    <div className="user-config-user-name edit-user-config-user-name">
                                        <div className="inputInfo userconfigPrivate user-config-con">
                                            <span  className="iuputSpan"></span>
                                            <label>GROUP NAME：<label className="mustWriteUser">*</label></label>
    
                                            {
                                                this.state.inputname==='ADMGP' ?
                                                    <input disabled='disabled' type="text"
                                                           value={this.state.inputname}
                                                           placeholder="groupName"
                                                           onChange={this.editUserGroup}/> :
                                                    <input type="text"
                                                           value={this.state.inputname}
                                                           placeholder="groupName"
                                                           onChange={this.editUserGroup}/>
                                            }
                                        </div>
                                    </div>
                                    <div className="inputInfo userconfigPrivate">
                                        <span className="iuputSpan"></span>
                                        <label>AUTHORITY：</label>
                                        {
                                            this.state.inputname==='ADMGP' ?
                                                <div className="radioBtn">
                                                    <div>
                                                        <h4>QUERY</h4>
                                                        <CheckboxGroup disabled options={plainOptions01} value={this.state.backupQarr} onChange={this.selectEditQueryAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>GROUP</h4>
                                                        <CheckboxGroup disabled  options={plainOptions02} value={this.state.backupGarr} onChange={this.selectEditGroupAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>REPORT</h4>
                                                        <CheckboxGroup disabled options={plainOptions03} value={this.state.backupRarr} onChange={this.selectEditReportAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>ASSISTANCE</h4>
                                                        <CheckboxGroup disabled options={plainOptions04} value={this.state.backupAarr} onChange={this.selectEditAssistanceChange} />
                                                    </div>
                                                </div> :
                                                <div className="radioBtn">
                                                    <div>
                                                        <h4>QUERY</h4>
                                                        <CheckboxGroup options={plainOptions01} value={this.state.backupQarr} onChange={this.selectEditQueryAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>GROUP</h4>
                                                        <CheckboxGroup options={plainOptions02} value={this.state.backupGarr} onChange={this.selectEditGroupAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>REPORT</h4>
                                                        <CheckboxGroup options={plainOptions03} value={this.state.backupRarr} onChange={this.selectEditReportAuth} />
                                                    </div>
                                                    <div>
                                                        <h4>ASSISTANCE</h4>
                                                        <CheckboxGroup options={plainOptions04} value={this.state.backupAarr} onChange={this.selectEditAssistanceChange} />
                                                    </div>
                                                </div>
                                        }
                                       
                                    </div>
                                    <div className="inputInfo">
                                        {
                                            this.state.inputname==='ADMGP' ?
                                                <span className="adminWrap">
                                                    <div className="wrap-con"></div>
                                                    <Transfer
                                                     className="groupTranfer"
                                                     dataSource={this.state.editMockData}
                                                     // showSearch
                                                     operations={['>', '<']}
                                                     titles={["USER LIST","GROUP MEMBER LIST"]}
                                                     targetKeys={this.state.editTargetKeys}
                                                     render={item => item.title}
                                                    />
                                                </span> :
                                                <Transfer
                                                    className="groupTranfer"
                                                    dataSource={this.state.editMockData}
                                                    showSearch
                                                    operations={['>', '<']}
                                                    titles={["USER LIST","GROUP MEMBER LIST"]}
                                                    targetKeys={this.state.editTargetKeys}
                                                    filterOption={this.editFilterOption}
                                                    onChange={this.editHandleChange}
                                                    render={item => item.title}
                                                />
                                        }
                                    </div>
                                </div>
                            </Modal>
                        </div>
                    </div>
                </div>
                <Modal  className="mydialogCon  userConfiguration"
                    title="ADD NEW GROUP"
                    visible={userConfigVisible}
                    onOk={this.saveNewGroup}
                    onCancel={this.closeHanle}
                        okText="Save"
                        style={{ top: 30 }}
                >
                    <div>
                        <div className="user-config-user-name">
                            <div className="inputInfo userconfigPrivate userIdRole">
                                <span  className="iuputSpan"></span>
                                <label>GROUP NAME：<label className="mustWriteUser">*</label></label>
                                <CheckFormSecond
                                    propsLabel={groupNameLabel}
                                    value={this.state.groupName}
                                    groupcode={this.state.groupnamespan}
                                    Rule={this.squenceNumberRole}
                                    addGroupData={this.changeGroupName}
                                >
                                </CheckFormSecond>
                            </div>
                        </div>
                        <div className="inputInfo userconfigPrivate">
                            <span className="iuputSpan"></span>
                            <label>AUTHORITY：</label>
                            <div className="radioBtn">
                                <div>
                                    <h4>QUERY</h4>
                                    <CheckboxGroup options={plainOptions01} onChange={this.selectQueryAuth} />
                                </div>
                                <div>
                                    <h4>GROUP</h4>
                                    <CheckboxGroup options={plainOptions02} onChange={this.selectGroupAuth} />
                                </div>
                                <div>
                                    <h4>REPORT</h4>
                                    <CheckboxGroup options={plainOptions03} onChange={this.selectReportAuth} />
                                </div>
                                <div>
                                    <h4>ASSISTANCE</h4>
                                    <CheckboxGroup options={plainOptions04} onChange={this.selectAssistanceAuth} />
                                </div>
                            </div>
                        </div>
                        <div className="inputInfo">
                            <Transfer
                                className="groupTranfer"
                                dataSource={this.state.mockData}
                                showSearch
                                titles={["USER LIST","GROUP MEMBER LIST"]}
                                operations={['>', '<']}
                                targetKeys={this.state.targetKeys}
                                filterOption={this.addFilterOption}
                                onChange={this.handleChange}
                                render={item => item.title}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default withRouter(UserGroupConfiguration)
