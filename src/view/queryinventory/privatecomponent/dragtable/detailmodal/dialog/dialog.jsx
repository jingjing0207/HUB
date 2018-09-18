import React,{Component} from 'react'
import { Modal,message,Input } from 'antd'

import propTypes from 'prop-types'
// import MyInput from '../../../../../../component/input/my-input'

import './dialog.css'
import MySelect from "../../../../../../component/select/my-select";
import { HttpPost } from '../../../../../../server/post'
import {ADD_GUERY, CHECK_QUERY_NAME_IS_EXST} from "../../../../../../constants/constants";
import LotSelect from '../../../../../../component/select/lot-select'
import MySecondInput from '../../../../../../component/input/second-input'
import {HttpGet} from "../../../../../../server/get";
const { TextArea } = Input;

export default class MyDialog extends Component{
    state={
        dialogData: {
            groupcode: {
                spanlabel:'SEQUENCE NUMBER',
                select:'001',
                options:[{
                    value: '001',
                    label: '001'
                }]
            },
            periodicity: {
                spanlabel:'QUERY NAME',
                //Should Be Combination Of Numbers & Alphabets
                //SHOULD BE COMBINATION OF NUMBERS & ALPHABETS
                select:'Query name',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            startendbatch: {
                spanlabel:'QUERY DESCRIPTION',
                select:'Query description',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            allowrunonline: {
                spanlabel:'REPORT AUTHORIZED USER GROUP',
                select:'Report authorized user group',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            pnonty: {
                spanlabel:'REPORT AUTHORIZED USER ID (SPLIT BY COMMA)',
                select:'Report authorized user id (split by comma)',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            authorizedusergroup:{
                spanlabel:'QUERY AUTHORIZED USER GROUP',
                select:'Query authorized user group',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            authorizeduserids:{
                spanlabel:'QUERY AUTHORIZED USER ID',
                select:'Query authorized user id',
                options:[{
                    value: '1234567',
                    label: '1234567'
                }]
            },
            sqlstatement: {
                spanlabel:'SQL STATEMENT',
                select:'Sql statement',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            mailNotification: {
                spanlabel:'MAIL NOTIFICATION',
                select:'NO',
                options:[{
                    value: 'YES',
                    label: 'YES'
                },
                {
                    value: 'NO',
                    label: 'NO'
                }]
            },
            retentionPeriod: {
                spanlabel:'REPORT RETENTION PERIOD',
                select:'1 day',
                options:[{
                    value: '1',
                    label: '1 day'
                },{
                    value: '2',
                    label: '2 days'
                },{
                    value: '3',
                    label: '3 days'
                }]
            }
        },
        sequenceNumber:'',
        queryName:'',
        queryDescription:'DESCRIPTION',
        userGroup:[],
        userIds:[],
        sqlstatement:'select * from T_GROUP_DETAIL where rownum<=5',
        mailNotification:'YES',
        retentionPeriod:'3',
        currentNameIsExists:false,
        authorizedusergroup:[],
        authorizeduserids:[],
        currentPage:1,
        currentSize:10

    }
    static propTypes={
        dialogVisible:propTypes.bool.isRequired,
        parentClose:propTypes.func.isRequired,
        getTableData:propTypes.func.isRequired
    }
    handleOk=()=>{
        if(this.props.currentLoginUserName!==''){
            this.state.authorizeduserids.unshift(this.props.currentLoginUserName)
        }
        let addGueryData={
            createUserName:this.props.currentusername,
            sequenceNumber:this.state.sequenceNumber,
            queryName:this.state.queryName,
            queryDescription:this.state.queryDescription,
            userIds:this.state.userIds===[] ? null :this.state.userIds.join(','),
            userGroup:this.state.userGroup===[] ? null :this.state.userGroup.join(','),
            authorizedUserGroup:this.state.authorizedusergroup===[] ? null :this.state.authorizedusergroup.join(','),
            authorizedUserIds:this.state.authorizeduserids===[] ? '' :this.state.authorizeduserids.join(','),
            sqlStatement:this.state.sqlstatement,
            reportRetentionPeriod:this.state.retentionPeriod,
            emailNotification:this.state.mailNotification,
        }
        console.log(12345678)
        console.log(this.state.userIds)
        console.log(this.state.userGroup)
        console.log(addGueryData)
        let token="Bearer "+sessionStorage.getItem('token')
        HttpPost(ADD_GUERY,addGueryData,token)
            .then((res) => {
                console.log(res)
                if(res.status===200){
                    this.props.parentClose(false)
                    this.props.getTableData(this.props.currentSearchValue,this.props.page-1, this.props.size)
                    message.success('Add successful');
                    this.setState({
                        sequenceNumber:'',
                        queryName:'',
                        queryDescription:'',
                        userGroup:[],
                        userIds:[],
                        sqlstatement:'select * from T_GROUP_DETAIL where rownum<=5',
                        mailNotification:'NO',
                        retentionPeriod:'1',
                        currentNameIsExists:false,
                        authorizedusergroup:[],
                        authorizeduserids:[],
                    })
                }
            })
            .catch((err)=>{
                console.log(err.response)
                if (err && err.response) {
                    switch (err.response.status) {
                        case 500:
                            message.error('The query name already exists')
                            break
                        case 401:
                            message.error('You do not have permission to access this data')
                            break
                        case 403:
                            message.error('You do not have permission to access this data')
                            break
                        default:
                    }
                    switch (err.response.data) {
                        case 'queryName Not Null':
                            message.error('Query name and sequence number can not be empty')
                            break
                        case 'Sql exception':
                            message.error('Please check if SQL grammar is correct')
                            break
                        case 'SqlStatement Not Null':
                            message.error('Please check if SQL grammar is correct')
                            break;
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    handleCancel =()=>{
        this.props.parentClose(false)
    }
    inputValue=(obj,value)=>{
        this.setState({
            sequenceNumber:obj
        },value)
    }
    squenceNumberRole=(rule, value, callback)=>{
        if (!value) {
            callback([new Error('Sequence number should not be empty')])
        } else {
            setTimeout(() => {
                let reg = /^[0-9]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Number only')])
                } else {
                    callback()
                }
            }, 800);
        }
    }
    periodicity=(obj)=>{
        this.setState({
            queryName:obj
        })
    }
    checkQueryNameIsExsit=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(CHECK_QUERY_NAME_IS_EXST+this.state.queryName,token)
            .then((res) => {
                if(res.status===200){
                    this.setState({currentNameIsExists:false})
                }
            })
            .catch((err)=>{
                if (err && err.response) {
                    switch (err.response.status) {
                        case 400:
                            // message.error('The group name already exists')
                            this.setState({currentNameIsExists:true})
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    
    queryNameRole=(rule, value, callback)=>{
        if (!value) {
            callback([new Error('Query name should not be empty')])
        } else {
            setTimeout(() => {
                let reg = /^[0-9a-zA-Z_@#$%&*]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Numbers, underscores and letters can be entered')])
                }else {
                    callback()
                }
            }, 800);
        }
    }
    startendbatch=(e)=>{
        this.setState({
            queryDescription:e.target.value
        })
        // console.log(this.state.queryDescription)
    }
    allowrunonline=(obj)=>{
        this.setState({
            userGroup:obj
        })
    }
    pnonty=(obj)=>{
        this.setState({
            userIds:obj
        })
    }
    sqlstatement=(e)=>{
        this.setState({
            sqlstatement:e.target.value
        })
    }
    retentionPeriod=(obj)=>{
        this.setState({
            retentionPeriod:obj
        })
    }
    mailNotification=(val)=>{
        this.setState({
            mailNotification:val
        })
    }
    authorizedusergroup=(obj)=>{
        this.setState({
            authorizedusergroup:obj
        })
    }
    authorizeduserids=(obj)=>{
        this.setState({
            authorizeduserids:obj
        })
    }
    render(){
        const { dialogVisible }=this.props
        const { dialogData } =this.state
        console.log('-====>',this.props.reportIsShow)
        let isValue=false
        let queryNameLabel='Query name'
        let sequenceNumber=3
        let queryName=10
        return(
            <div>
                <Modal
                    title="ADD NEW QUERY"
                    visible={dialogVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    style={{top:20}}
                    okText="Save"
                >
                    <div>
                        <div className="inputList">
                            <MySecondInput
                                mustNumber={sequenceNumber}
                                value={this.state.sequenceNumber}
                                Rule={this.squenceNumberRole}
                                groupcode={dialogData.groupcode}
                                addGroupData={this.inputValue}
                            >
                            </MySecondInput>
                            <MySecondInput
                                mustNumber={queryName}
                                value={this.state.queryName}
                                Rule={this.queryNameRole}
                                groupcode={dialogData.periodicity}
                                addGroupData={this.periodicity}
                                currentNameIsExists={this.state.currentNameIsExists}
                            >
                            </MySecondInput>
                        </div>
                        <div className="inputList changeInputWidth sqlStatement">
                            <div className="leftPar1 sqlClass"> </div>
                            <div className="rightPar1">
                                <span className="spanLabel sqlSpan">{this.state.dialogData.startendbatch.spanlabel}</span>
                                <TextArea onChange={this.startendbatch}  rows={3} placeholder="Query Description"/>
                            </div>
                        </div>
                        {
                            this.props.assistanceIsShow===true ?
                                <span>
                                    <div className="inputList changeInputWidth">
                                        <LotSelect
                                            disable={this.props.assistanceIsShow}
                                            isValue={isValue}
                                            children={this.props.selectUserGroup}
                                            groupcode={dialogData.authorizedusergroup}
                                            addGroupData={this.authorizedusergroup}
                                        >
                                        </LotSelect>
                                    </div>
                                    <div className="inputList changeInputWidth">
                                        <LotSelect
                                            disable={this.props.assistanceIsShow}
                                            isValue={isValue}
                                            children={this.props.selectUsers}
                                            groupcode={dialogData.authorizeduserids}
                                            addGroupData={this.authorizeduserids}
                                        >
                                        </LotSelect>
                                    </div>
                                </span> : <span>
                                    <LotSelect
                                        disable={this.props.assistanceIsShow}
                                        isValue={isValue}
                                        children={this.props.selectUserGroup}
                                        groupcode={dialogData.authorizedusergroup}
                                        addGroupData={this.authorizedusergroup}
                                    >
                                    </LotSelect>
                                    <LotSelect
                                        disable={this.props.assistanceIsShow}
                                        isValue={isValue}
                                        children={this.props.selectUserGroup}
                                        groupcode={dialogData.authorizedusergroup}
                                        addGroupData={this.authorizedusergroup}
                                    >
                                    </LotSelect>
                                </span>
                        }
                        {
                            this.props.reportIsShow===true ?
                                <span>
                                    <div className="inputList changeInputWidth">
                                        <LotSelect
                                            disable={this.props.reportIsShow}
                                            isValue={isValue}
                                            children={this.props.selectUserGroup}
                                            groupcode={dialogData.allowrunonline}
                                            addGroupData={this.allowrunonline}
                                        >
                                        </LotSelect>
                                    </div>
                                    <div className="inputList changeInputWidth">
                                        <LotSelect
                                            disable={this.props.reportIsShow}
                                            isValue={isValue}
                                            children={this.props.selectUsers}
                                            groupcode={dialogData.pnonty}
                                            addGroupData={this.pnonty}
                                        >
                                        </LotSelect>
                                    </div>
                                </span> : <span>
                                    <LotSelect
                                        disable={this.props.reportIsShow}
                                        isValue={isValue}
                                        children={this.props.selectUserGroup}
                                        groupcode={dialogData.allowrunonline}
                                        addGroupData={this.allowrunonline}
                                    >
                                    </LotSelect>
                                    <LotSelect
                                        disable={this.props.reportIsShow}
                                        isValue={isValue}
                                        children={this.props.selectUserGroup}
                                        groupcode={dialogData.allowrunonline}
                                        addGroupData={this.allowrunonline}
                                    >
                                    </LotSelect>
                                </span>
                        }
                        <div className="inputList">
                            <MySelect
                                defaultValue={this.state.retentionPeriod}
                                groupcode={dialogData.retentionPeriod}
                                changeSelectValue={this.retentionPeriod}
                            >
                            </MySelect>
                            <MySelect
                                defaultValue={this.state.mailNotification}
                                groupcode={dialogData.mailNotification}
                                changeSelectValue={this.mailNotification}
                            >
                            </MySelect>
                        </div>
                        <div className="inputList changeInputWidth sqlStatement">
                            <div className="leftPar1 sqlClass"> </div>
                            <div className="rightPar1">
                                <span className="spanLabel sqlSpan">{this.state.dialogData.sqlstatement.spanlabel} <label className="mustWrite">*</label></span>
                                <TextArea onChange={this.sqlstatement} value={this.state.sqlstatement} rows={4} />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
