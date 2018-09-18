import React,{Component} from 'react'
import { Modal } from 'antd'
import propTypes from 'prop-types'

import MySelect from './../../../../../component/select/my-select'
import MyInput from './../../../../../component/input/my-input'
import LotSelect from '../../../../../component/select/lot-select'
import MySecondInput from '../../../../../component/input/second-input'
import './detail-modal.css'
import {Input} from "antd/lib/index";

const { TextArea } = Input;
class QueryinventoryModal extends Component{
    constructor(props){
        super(props)
        this.state={
            dialogDataquery: {
    
                groupcode: {
                    spanlabel:'GROUP NAME',
                    select:'',
                    options:[]
                },
                periodicity: {
                    spanlabel:'PERIODICITY',
                    select:'DAILY',
                    options:[{
                        value: 'DAILY',
                        label: 'DAILY'
                    },{
                        value: 'WEEKLY END',
                        label: 'WEEKLY END'
                    },{
                        value: 'SEMI-MONTHLY',
                        label: 'SEMI-MONTHLY'
                    },{
                        value: 'QUARTER-MONTHLY',
                        label: 'QUARTER-MONTHLY'
                    }]
                },
                startendbatch: {
                    spanlabel:'BEFORE/AFTER BATCH',
                    select:'BEFORE',
                    options:[{
                        value: 'BEFORE',
                        label: 'BEFORE'
                    },{
                        value: 'AFTER',
                        label: 'AFTER'
                    }]
                },
                allowrunonline: {
                    spanlabel:'ALLOW RUN ONLINE',
                    select:'YES',
                    options:[{
                        value: 'YES',
                        label: 'YES'
                    },{
                        value: 'NO',
                        label: 'NO'
                    }]
                },
                pnonty: {
                    spanlabel:'PRIORITY',
                    select:1,
                    options:[{
                        value: 1,
                        label: 1
                    },{
                        value: 2,
                        label: 2
                    },{
                        value: 3,
                        label: 3
                    },{
                        value: 4,
                        label: 4
                    },{
                        value: 5,
                        label: 5
                    },{
                        value: 6,
                        label: 6
                    },{
                        value: 7,
                        label: 7
                    },{
                        value: 8,
                        label: 8
                    },{
                        value: 9,
                        label: 9
                    },{
                        value: 10,
                        label: 10
                    },{
                        value: 11,
                        label: 11
                    },{
                        value: 12,
                        label: 12
                    }]
                },
                sla: {
                    spanlabel:'SLA',
                    select:'',
                    options:[{
                        value: '07:00',
                        label: '07:00'
                    }]
                },
                sequencenumber:{
                    spanlabel:'SEQUENCE NUMBER',
                    select:'001',
                    options:[{
                        value: '001',
                        label: '001'
                    }]
                },
                queryname:{
                    spanlabel:'QUERY NAME',
                    select:'QRYNAME1_1',
                    options:[{
                        value: '',
                        label: ''
                    }]
                },
                querydescription:{
                    spanlabel:'QUERY DESCRIPTION',
                    select:'QRYNAME1_1',
                    options:[{
                        value: '',
                        label: ''
                    }]
                },
                reportauthonzedusergroup:{
                    spanlabel:'REPORT AUTHORIZED USER GROUP',
                    select:'Report authorized user group',
                    options:[{
                        value: '',
                        label: ''
                    }]
                },
                reportauthonzeduserids:{
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
                        value: '',
                        label: ''
                    }]
                },
                sqlstaterment:{
                    spanlabel:'SQL STATEMENT',
                    select:'select from TABLE_A',
                    options:[{
                        value: '',
                        label: ''
                    }]
                },
                mailNotification: {
                    spanlabel:'MAIL NOTIFICATION',
                    select:'YES',
                    options:[{
                        value: 'YES',
                        label: 'YES'
                    },{
                            value: 'NO',
                            label: 'NO'
                    }]
                },
                retentionPeriod: {
                    spanlabel:'REPORT RETENTION PERIOD',
                    select:'1',
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
            groupcode:'',
            periodicity:'',
            startendbatch:'',
            allowrunonline:'',
            pnonty:'',
            sla:'07:00:00',
            sequencenumber:'',
            queryname:' ',
            querydescription:'',
            reportauthonzedusergroup:[],
            reportauthonzeduserids:[],
            sqlstaterment:'select * from T_GROUP_DETAIL where rownum<=5',
            mailNotification:'',
            retentionPeriod:'',
            authorizedusergroup:[],
            authorizeduserids:[]
        }
    }
    static propTypes ={
        visiblequeryInventoryDetail:propTypes.bool.isRequired,
        ischangeBtn:propTypes.bool.isRequired,
        detailData:propTypes.object.isRequired,
        selectGroupcode:propTypes.object.isRequired,
        cancelQueryInventroy:propTypes.func.isRequired,
        currentQueryId:propTypes.string.isRequired,
        postEditQueryDetail:propTypes.func.isRequired,
    }
    componentWillReceiveProps (nextProps){
        nextProps.detailData !== this.props.detailData && this.setState({
            detailData:nextProps.detailData
        },() => {
            console.log(nextProps.detailData)
            this.setState({
                groupcode:this.props.detailData.groupCode===null? '' :this.props.detailData.groupCode,
                queryname:this.props.detailData.queryName===null? '' :this.props.detailData.queryName,
                sequencenumber:this.props.detailData.sequenceNumber===null? '' :this.props.detailData.sequenceNumber,
                querydescription:this.props.detailData.queryDescription===null? '' :this.props.detailData.queryDescription,
                reportauthonzedusergroup:this.props.detailData.userGroup===null ? [] :this.props.detailData.userGroup.split(','),
                reportauthonzeduserids:this.props.detailData.userIds===null ? [] : this.props.detailData.userIds.split(","),
                authorizedusergroup:this.props.detailData.authorizedUserGroup===null ? [] : this.props.detailData.authorizedUserGroup.split(","),
                authorizeduserids:this.props.detailData.authorizedUserIds===null ? [] : this.props.detailData.authorizedUserIds.split(","),
                sqlstaterment:this.props.detailData.sqlStatement===null? '' :this.props.detailData.sqlStatement,
                retentionPeriod:this.props.detailData.reportRetentionPeriod===null? '' :this.props.detailData.reportRetentionPeriod,
                mailNotification:this.props.detailData.emailNotification===null? '' :this.props.detailData.emailNotification,
                pnonty:this.props.detailData.priority===null? '' :this.props.detailData.priority,
                periodicity:this.props.detailData.periodicity===null? '' :this.props.detailData.periodicity,
                allowrunonline:this.props.detailData.allowRunOnline===null? '' :this.props.detailData.allowRunOnline,
                startendbatch:this.props.detailData.status===null? '' :this.props.detailData.status,
            })
            console.log(typeof (this.state.reportauthonzeduserids))
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    handleOk=() =>{
        if(this.props.currentLoginUserName!==''){
            if( this.state.authorizeduserids.includes(this.props.currentLoginUserName)===false){
                this.state.authorizeduserids.unshift(this.props.currentLoginUserName)
            }
        }
        let editQueryDetailData={
            queryId:this.props.currentQueryId,
            sequenceNumber:this.state.sequencenumber,
            queryName:this.state.queryname,
            queryDescription:this.state.querydescription,
            userGroup:this.state.reportauthonzedusergroup===[] ? null : this.state.reportauthonzedusergroup.join(','),
            userIds:this.state.reportauthonzeduserids===[] ? null : this.state.reportauthonzeduserids.join(','),
            authorizedUserGroup:this.state.authorizedusergroup===[] ? null :this.state.authorizedusergroup.join(','),
            authorizedUserIds:this.state.authorizeduserids===[] ? null :this.state.authorizeduserids.join(','),
            sqlStatement:this.state.sqlstaterment,
            reportRetentionPeriod:this.state.retentionPeriod,
            groupCode:this.state.groupcode,
            periodicity:this.state.periodicity,
            status:this.state.startendbatch,
            allowRunOnline:this.state.allowrunonline,
            priority:this.state.pnonty,
            emailNotification:this.state.mailNotification,
            sla:this.state.sla,
        }
        this.props.postEditQueryDetail(editQueryDetailData)
    }
    handleCancel= ()=>{
        this.props.cancelQueryInventroy()
    }
    sequenceNumber=(obj)=>{
        this.setState({sequencenumber:obj})
    }
    queryName=(obj)=>{
        this.setState({queryname:obj})
    }
    queryDescription=(e)=>{
        this.setState({querydescription:e.target.value})
    }
    sla=(obj)=>{
        this.setState({sla:obj})
    }
    reportauthonzedusergroup=(obj)=>{
        this.setState({reportauthonzedusergroup:obj})
        // console.log(this.stat.)
    }
    reportauthonzeduserids=(obj)=>{
        this.setState({reportauthonzeduserids:obj})
    }
    sqlStaterment=(e)=>{
        this.setState({sqlstaterment:e.target.value})
    }
    retentionPeriod=(obj)=>{
        this.setState({retentionPeriod:obj})
    }
    groupCode=(obj)=>{
        this.setState({groupcode:obj})
    }
    periodicity=(val)=>{
        this.setState({periodicity:val})
    }
    startendbatch=(val)=>{
        this.setState({startendbatch:val})
    }
    allowrunonline=(val)=>{
        this.setState({allowrunonline:val})
    }
    pnonty=(val)=>{
        this.setState({pnonty:val})
    }
    mailNotification=(val)=>{
        this.setState({mailNotification:val})
    }
    authorizedusergroup=(obj)=>{
        this.setState({authorizedusergroup:obj})
    }
    authorizeduserids=(obj)=>{
        this.setState({authorizeduserids:obj})
    }
    QueryNameRole=(rule, value, callback)=>{
        if (!value) {
            callback([new Error('Query name should not be empty')])
        } else {
            setTimeout(() => {
                let reg = /^[0-9a-zA-Z_@#$%&*]*$/g
                if (!reg.test(value)) {
                    callback([new Error('Numbers, underscores and letters can be entered')])
                } else {
                    callback()
                }
            }, 800);
        }
    }
    render(){
        const { visiblequeryInventoryDetail,ischangeBtn,selectGroupcode } =this.props
        let isValue=true
        let queryName=10
        // console.log('this.props.currentLoginUserName=>',this.props.currentLoginUserName)
        return(
            <div>
                {
                    this.props.isShowDownloadBtn===true?
                        <Modal className="queryinventoryModal"
                               title="QUERY DETAIL"
                               visible={visiblequeryInventoryDetail}
                               // onOk={this.handleOk}
                               onCancel={this.handleCancel}
                               maskClosable={false}
                               style={{top:30}}
                               okText={ischangeBtn===true ? "Save" :"Edit" }
                               footer={null}
                        >
        
                            <div className="run-con">
                                {
                                    ischangeBtn===false ?
                                        <div className="editDiv"> </div> : ''
                                }
                                <div>
                                    <div className="inputList">
                                        <MyInput
                                            value={this.state.queryname}
                                            groupcode={this.state.dialogDataquery.queryname}
                                            addGroupData={this.queryName}
                                        >
                                        </MyInput>
                                        <MyInput
                                            value={this.state.sequencenumber}
                                            groupcode={this.state.dialogDataquery.sequencenumber}
                                            addGroupData={this.sequenceNumber}
                                        >
                                        </MyInput>
                                    </div>
                                    <div className="inputList">
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogDataquery.querydescription.spanlabel}</span>
                                                <TextArea onChange={this.queryDescription} value={this.state.querydescription}  rows={2} placeholder="Query Description"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inputList">
                                        {
                                            this.props.assistanceIsShow===true ?
                                                <span>
                                                    <LotSelect
                                                        currentValue={this.state.authorizedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.authorizedusergroup}
                                                        addGroupData={this.authorizedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        currentValue={this.state.authorizeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.authorizeduserids}
                                                        addGroupData={this.authorizeduserids}
                                                    >
                                                    </LotSelect>
                                                </span> : <span>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.authorizedusergroup}
                                                        addGroupData={this.authorizedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.authorizeduserids}
                                                        addGroupData={this.authorizeduserids}
                                                    >
                                                    </LotSelect>
                                                </span>
                                        }
                                    </div>
                                    <div className="inputList">
                                        {
                                            this.props.reportIsShow===true ?
                                                <span>
                                                    <LotSelect
                                                        currentValue={this.state.reportauthonzedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.reportauthonzedusergroup}
                                                        addGroupData={this.reportauthonzedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        currentValue={this.state.reportauthonzeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.reportauthonzeduserids}
                                                        addGroupData={this.reportauthonzeduserids}
                                                    >
                                                    </LotSelect>
                                                </span> : <span>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.reportauthonzedusergroup}
                                                        addGroupData={this.reportauthonzedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.reportauthonzeduserids}
                                                        addGroupData={this.reportauthonzeduserids}
                                                    >
                                                    </LotSelect>
                                                </span>
                                        }
                                    </div>
                                    
                                    <div className="inputList">
                                        <MyInput
                                            value={this.state.retentionPeriod}
                                            groupcode={this.state.dialogDataquery.retentionPeriod}
                                            addGroupData={this.retentionPeriod}
                                        >
                                        </MyInput>
                                        <MySelect
                                            defaultValue={this.state.mailNotification}
                                            groupcode={this.state.dialogDataquery.mailNotification}
                                            changeSelectValue={this.mailNotification}
                                        >
                                        </MySelect>
                                    </div>
                                    <div className="inputList">
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogDataquery.sqlstaterment.spanlabel} <label className="mustWrite">*</label></span>
                                                <TextArea onChange={this.sqlStaterment} value={this.state.sqlstaterment}  rows={3} placeholder="select * from T_GROUP_DETAIL where rownum<=5"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>:
                        <Modal className="queryinventoryModal"
                               title="QUERY DETAIL"
                               visible={visiblequeryInventoryDetail}
                               onOk={this.handleOk}
                               onCancel={this.handleCancel}
                               maskClosable={false}
                               style={{top:30}}
                               okText={ischangeBtn===true ? "Save" :"Edit" }
                        >
        
                            <div className="run-con">
                                {
                                    ischangeBtn===false ?
                                        <div className="editDiv"> </div> : ''
                                }
                                <div>
                                    <div className="inputList">
                                        <MySecondInput
                                            mustNumber={queryName}
                                            value={this.state.queryname}
                                            Rule={this.QueryNameRole}
                                            groupcode={this.state.dialogDataquery.queryname}
                                            addGroupData={this.queryName}
                                        >
                                        </MySecondInput>
                                        <MyInput
                                            value={this.state.sequencenumber}
                                            groupcode={this.state.dialogDataquery.sequencenumber}
                                            addGroupData={this.sequenceNumber}
                                        >
                                        </MyInput>
                                    </div>
                                    <div className="inputList">
    
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogDataquery.querydescription.spanlabel}</span>
                                                <TextArea onChange={this.queryDescription} value={this.state.querydescription}  rows={2} placeholder="Query Description"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inputList">
                                        {
                                            this.props.assistanceIsShow===true ?
                                                <span>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.authorizedusergroup}
                                                        addGroupData={this.authorizedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.authorizeduserids}
                                                        addGroupData={this.authorizeduserids}
                                                    >
                                                    </LotSelect>
                                                </span> : <span>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.authorizedusergroup}
                                                        addGroupData={this.authorizedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.assistanceIsShow}
                                                        currentValue={this.state.authorizeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.authorizeduserids}
                                                        addGroupData={this.authorizeduserids}
                                                    >
                                                    </LotSelect>
                                                </span>
                                        }
                                    </div>
                                    <div className="inputList">
                                        {
                                            this.props.reportIsShow===true ?
                                                <span>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.reportauthonzedusergroup}
                                                        addGroupData={this.reportauthonzedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.reportauthonzeduserids}
                                                        addGroupData={this.reportauthonzeduserids}
                                                    >
                                                    </LotSelect>
                                                </span> :  <span>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzedusergroup}
                                                        isValue={isValue}
                                                        children={this.props.selectUserGroup}
                                                        groupcode={this.state.dialogDataquery.reportauthonzedusergroup}
                                                        addGroupData={this.reportauthonzedusergroup}
                                                    >
                                                    </LotSelect>
                                                    <LotSelect
                                                        disable={this.props.reportIsShow}
                                                        currentValue={this.state.reportauthonzeduserids}
                                                        isValue={isValue}
                                                        children={this.props.selectUsers}
                                                        groupcode={this.state.dialogDataquery.reportauthonzeduserids}
                                                        addGroupData={this.reportauthonzeduserids}
                                                    >
                                                    </LotSelect>
                                                </span>
                                        }
                                    </div>
                                   
                                    <div className="inputList">
                                        <MySelect
                                            defaultValue={this.state.retentionPeriod}
                                            groupcode={this.state.dialogDataquery.retentionPeriod}
                                            changeSelectValue={this.retentionPeriod}
                                        >
                                        </MySelect>
                                        <MySelect
                                            defaultValue={this.state.mailNotification}
                                            groupcode={this.state.dialogDataquery.mailNotification}
                                            changeSelectValue={this.mailNotification}
                                        >
                                        </MySelect>
                                    </div>
                                    <div className="inputList">
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogDataquery.sqlstaterment.spanlabel} <label className="mustWrite">*</label></span>
                                                <TextArea onChange={this.sqlStaterment} value={this.state.sqlstaterment}  rows={3} placeholder="select * from T_GROUP_DETAIL where rownum<=5"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                }
            </div>
        )
    }
}
export default QueryinventoryModal
