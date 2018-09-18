import React,{Component} from 'react'
import { Modal } from 'antd'
import propTypes from 'prop-types'

import MySelect from '../../../select/my-select'
import MyInput from '../../../input/my-input'
import Transfrom from '../../../../view/querygroup/privatetransfromcomponent/transfrom/transfrom'
import MySecondInput from '../../../../component/input/second-input'
import LotSelect from '../../../../component/select/lot-select'

import './private-modal.css'
import {Input} from "antd/lib/index";

const { TextArea } = Input;

class PrivateModal extends Component{
    state={
        editBtnIsshow:true,
        headertitle: ['CANDIDATE QUERIES', 'QUERIES UNDER CURRENT GROUP'],
        dialogData: {
            groupcode: {
                spanlabel:'GROUP NAME',
                select:'group name',
                options:[{
                    value: 'GROUP_1',
                    label: 'GROUP_1'
                }, {
                    value: 'GROUP_2',
                    label: 'GROUP_2'
                }]
            },
    
            groupdescription: {
                spanlabel:'GROUP DESCRIPTION',
                select:'group description',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            periodicity: {
                spanlabel:'PERIODICITY',
                select:'',
                options:[{
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
                spanlabel:'BEFORE/AFTER BATCH',
                select:'',
                options:[{
                    value: 'BEFORE',
                    label: 'BEFORE'
                },{
                    value: 'AFTER',
                    label: 'AFTER'
                }]
            },
            sla: {
                spanlabel:'SLA',
                select:'',
                options:[{
                    value: '',
                    label: ''
                }]
            },
            allowrunonline: {
                spanlabel:'ALLOW RUN ONLINE',
                select:'',
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
                select:'',
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
            authornzedusergroup: {
                spanlabel:'QUERY GROUP AUTHORIZED USER GROUP',
                select:'Query group authorized user group',
                options:[{
                    value: 'USER GROUP',
                    label: 'USER GROUP'
                },{
                    value: 'USER GROUP02',
                    label: 'USER GROUP02'
                }]
            },
            authornzeduserids: {
                spanlabel:'QUERY GROUP AUTHORIZED USER ID',
                select:'Query group authorized user id',
                options:[{
                    value: '12',
                    label: '12'
                },{
                    value: '12314125362475',
                    label: '12314125362475'
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
            generateRun: {
                spanlabel:'GENERATE RUN',
                select:' ',
                options:[{
                    value: 'DURING BATCH',
                    label: 'DURING BATCH'
                },
                    {
                        value: 'ON-DEMAND',
                        label: 'ON-DEMAND'
                    }]
            }
        },
        groupId:'',
        groupCode:'',
        groupDescription:'',
        periodicity:'',
        startEndBatch:'AFTER',
        allowRunOnline:'NO',
        pnonty:2,
        sla:'07:00:00',
        authornzedUserGroup:[],
        authornzedUserIds:[],
        generateRun:'',
        genryateRunSelected:true,
        reportauthorizedusergroup:[],
        reportauthorizeduserids:[],
    }
    static propTypes={
        visible:propTypes.bool.isRequired,
        isShowEdit:propTypes.bool.isRequired,
        currentModalData:propTypes.object.isRequired,
        allQueries:propTypes.array.isRequired,
        currentQueryIds:propTypes.array.isRequired,
        handleOk:propTypes.func.isRequired,
        handleCancel:propTypes.func.isRequired
    }
    componentWillReceiveProps (nextProps){
        nextProps.currentModalData !== this.props.currentModalData && this.setState({
            currentModalData:nextProps.currentModalData
        },() => {
            // data.replace("]","")
            console.log(11111)
            // console.log('this.props.currentModalData.userIds==>',this.props.currentModalData.userIds)
            if(this.props.currentModalData!==null){
                this.setState({
                    groupId:this.props.currentModalData.groupId===null ? '': this.props.currentModalData.groupId,
                    groupCode:this.props.currentModalData.groupName===null ? '': this.props.currentModalData.groupName,
                    groupDescription:this.props.currentModalData.description===null ? '': this.props.currentModalData.description,
                    periodicity:this.props.currentModalData.periodicity===null ? '': this.props.currentModalData.periodicity,
                    startEndBatch:this.props.currentModalData.status===null ? '': this.props.currentModalData.status,
                    allowRunOnline:this.props.currentModalData.allowRunOnline===null ? '': this.props.currentModalData.allowRunOnline,
                    pnonty:this.props.currentModalData.priority===null ? '': this.props.currentModalData.priority,
                    // sla:this.props.currentModalData.sla===null ? '': this.props.currentModalData.sla,
                    authornzedUserGroup:this.props.currentModalData.userGroup===null ? []:this.props.currentModalData.userGroup.split(','),
                    authornzedUserIds:this.props.currentModalData.userIds===null ? []: this.props.currentModalData.userIds.split(','),
                    generateRun:this.props.currentModalData.generateRun===null ? '': this.props.currentModalData.generateRun
                })
                if(this.props.groupIsDemand===true || nextProps.currentModalData.generateRun==='ON-DEMAND'){
                    this.setState({genryateRunSelected:false})
                }else if(this.props.groupIsDemand===false || nextProps.currentModalData.generateRun==='DURING BATCH'){
                    this.setState({genryateRunSelected:true})
                }
                console.log('authornzedUserIds==>',this.state.authornzedUserIds)
            }
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    saveBtn = () => {
        if(this.props.currentLoginUserName!==''){
            if( this.state.authornzedUserIds.includes(this.props.currentLoginUserName)===false){
                this.state.authornzedUserIds.unshift(this.props.currentLoginUserName)
            }
        }
        console.log('selectedUser ids:',this.state.authornzedUserGroup)
        let queryDetails
        this.state.genryateRunSelected===true ?
            queryDetails={
                groupId:this.state.groupId,
                groupCode:this.state.groupCode,
                groupName:this.state.groupCode,
                description:this.state.groupDescription,
                periodicity:this.state.periodicity,
                status:this.state.startEndBatch,
                allowRunOnline:this.state.allowRunOnline,
                priority:this.state.pnonty,
                userGroup:this.state.authornzedUserGroup===[] ? '' :this.state.authornzedUserGroup.join(','),
                userIds:this.state.authornzedUserIds===[] ? '' :this.state.authornzedUserIds.join(','),
                generateRun:this.state.generateRun,
                sla:this.state.sla
            } :
            queryDetails={
                groupId:this.state.groupId,
                groupCode:this.state.groupCode,
                groupName:this.state.groupCode,
                description:this.state.groupDescription,
                periodicity:this.state.periodicity,
                userGroup:this.state.authornzedUserGroup===[] ? '' :this.state.authornzedUserGroup.join(','),
                userIds:this.state.authornzedUserIds===[] ? '' :this.state.authornzedUserIds.join(','),
                generateRun:this.state.generateRun,
            }
            
        let queryIds
        if(this.props.isShowEdit===false){
            queryIds=sessionStorage.getItem('tartgetData').split(',')
        }
        this.props.handleOk(queryDetails,queryIds)
        // this.props.getMock()
        this.setState({
            // authornzedUserGroup:[],
            // authornzedUserIds:[],
        })
    }
    cancelBtn=()=>{
        this.props.handleCancel()
        this.setState({
            genryateRunSelected:false,
            authornzedUserIds:[],
            authornzedUserGroup:[],
        })
    }
    editDetailBtn=()=>{
        this.setState({
            editBtnIsshow:false
        })
    }
    changeGroupCode=(obj)=>{
        this.setState({
            groupCode:obj
        })
    }
    changeGroupDescrition=(e)=>{
        this.setState({
            groupDescription:e.target.value
        })
    }
    changePeriodicity=(val)=>{
        this.setState({
            periodicity:val
        })
    }
    changeStartEndBatch=(val)=>{
        this.setState({
            startEndBatch:val
        })
    }
    changeAllowRunOnline=(val)=>{
        this.setState({
            allowRunOnline:val
        })
    }
    changePnonty=(val)=>{
        this.setState({
            pnonty:val
        })
    }
    changeSla=(obj)=>{
        this.setState({
            sla:obj
        })
    }
    changeAuthoriedUserGroup=(obj)=>{
        this.setState({
            authornzedUserGroup:obj
        })
    }
    changeAuthoriedUserId=(obj)=>{
        this.setState({
            authornzedUserIds:obj
        })
    }
    changeGenenrationRun=(obj)=>{
        this.setState({
            generateRun:obj
        })
        if(obj==='DURING BATCH'){
            this.setState({genryateRunSelected:true})
        }else if(obj==='ON-DEMAND') {
            this.setState({genryateRunSelected:false})
        }
    }
    GroupNameRole=(rule, value, callback)=>{
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
    reportauthorizedusergroup=(obj)=>{
        this.setState({
            reportauthorizedusergroup:obj
        })
    }
    reportauthorizeduserids=(obj)=>{
        this.setState({
            reportauthorizeduserids:obj
        })
    }
    render() {
        const { visible,isShowEdit } =this.props
        const isValue=true
        const disableInput=true
        let groupName=10
        return (
            <div >
                {
                    this.props.isShowDownloadBtn===true ?
                        <Modal className="detailModal"
                               title="GROUP DETAIL"
                               visible={visible}
                               onOk={this.saveBtn}
                               onCancel={this.cancelBtn}
                               okText={ isShowEdit===true ? "Edit" : "Save" }
                               style={{ top: 5 }}
                               footer={null}
                        >
                            <div className="dialog-con">
                                {
                                    isShowEdit===true ?
                                        <div className="editDiv"> </div> : ''
                                }
                                <div className="dialog-content-left">
                                    <div className="addList">
                                        <MySecondInput
                                            mustNumber={groupName}
                                            value={this.state.groupCode}
                                            Rule={this.GroupNameRole}
                                            groupcode={this.state.dialogData.groupcode}
                                            addGroupData={this.changeGroupCode}
                                        >
                                        </MySecondInput>
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogData.groupdescription.spanlabel}</span>
                                                <TextArea onChange={this.changeGroupDescrition} value={this.state.groupDescription} rows={3} />
                                            </div>
                                        </div>
                                        <MySelect
                                            defaultValue={this.state.generateRun}
                                            groupcode={this.state.dialogData.generateRun}
                                            changeSelectValue={this.changeGenenrationRun}
                                        >
                                        </MySelect>
                                        {
                                            this.state.genryateRunSelected===true ?
                                                <span>
                                            <MySelect
                                                defaultValue={this.state.allowRunOnline}
                                                groupcode={this.state.dialogData.allowrunonline}
                                                changeSelectValue={this.changeAllowRunOnline}
                                            >
                                            </MySelect>
                                             {/*<MySelect*/}
                                                 {/*defaultValue={this.state.startEndBatch}*/}
                                                 {/*groupcode={this.state.dialogData.startendbatch}*/}
                                                 {/*changeSelectValue={this.changeStartEndBatch}*/}
                                             {/*>*/}
                                            {/*</MySelect>*/}
                                            <MyInput
                                                disableInput={disableInput}
                                                value={this.state.sla}
                                                groupcode={this.state.dialogData.sla}
                                                addGroupData={this.changeSla}
                                            >
                                            </MyInput>
                                            <MySelect
                                                defaultValue={this.state.pnonty}
                                                groupcode={this.state.dialogData.pnonty}
                                                changeSelectValue={this.changePnonty}
                                            >
                                            </MySelect>
                                        </span>
                                                : ''
                        
                                        }
                                        <MySelect
                                            defaultValue={this.state.periodicity}
                                            groupcode={this.state.dialogData.periodicity}
                                            changeSelectValue={this.changePeriodicity}
                                        >
                                        </MySelect>
                                        {
                                            this.props.disable === true ?
                                                <span>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserGroup }
                                                isValue={isValue}
                                                children={this.props.selectUserGroup}
                                                groupcode={this.state.dialogData.authornzedusergroup}
                                                addGroupData={this.changeAuthoriedUserGroup}
                                            >
                                            </LotSelect>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserIds}
                                                isValue={isValue}
                                                children={this.props.selectUsers}
                                                groupcode={this.state.dialogData.authornzeduserids}
                                                addGroupData={this.changeAuthoriedUserId}
                                            >
                                            </LotSelect>
                                        </span> : <span>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserGroup }
                                                isValue={isValue}
                                                children={this.props.selectUserGroup}
                                                groupcode={this.state.dialogData.authornzedusergroup}
                                                addGroupData={this.changeAuthoriedUserGroup}
                                            >
                                            </LotSelect>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserIds}
                                                isValue={isValue}
                                                children={this.props.selectUsers}
                                                groupcode={this.state.dialogData.authornzeduserids}
                                                addGroupData={this.changeAuthoriedUserId}
                                            >
                                            </LotSelect>
                                        </span>
                                        }
                                    </div>
                                </div>
                                <div className="dialog-content-right">
                                    <div className="detailTransfer">
                                        <Transfrom
                                            isShowEdit={this.props.isShowEdit}
                                            allQueries={this.props.allQueries}
                                            currentQueryIds={this.props.currentQueryIds}
                                            headertitle={this.state.headertitle}
                                        >
                                        </Transfrom>
                                    </div>
                                </div>
                            </div>
                        </Modal> :
                        <Modal className="detailModal"
                                         title="GROUP DETAIL"
                                         visible={visible}
                                         onOk={this.saveBtn}
                                         onCancel={this.cancelBtn}
                                         okText={ isShowEdit===true ? "Edit" : "Save" }
                                         style={{ top: 5 }}
                        >
                            <div className="dialog-con">
                                {
                                    isShowEdit===true ?
                                        <div className="editDiv"> </div> : ''
                                }
                                <div className="dialog-content-left">
                                    <div className="addList">
                                        <MySecondInput
                                            mustNumber={groupName}
                                            value={this.state.groupCode}
                                            Rule={this.GroupNameRole}
                                            groupcode={this.state.dialogData.groupcode}
                                            addGroupData={this.changeGroupCode}
                                        >
                                        </MySecondInput>
                                        <div className="inputList changeInputWidth sqlStatement">
                                            <div className="leftPar1 sqlClass"> </div>
                                            <div className="rightPar1">
                                                <span className="spanLabel sqlSpan">{this.state.dialogData.groupdescription.spanlabel}</span>
                                                <TextArea onChange={this.changeGroupDescrition} value={this.state.groupDescription} rows={3} />
                                            </div>
                                        </div>
                                        <MySelect
                                            defaultValue={this.state.generateRun}
                                            groupcode={this.state.dialogData.generateRun}
                                            changeSelectValue={this.changeGenenrationRun}
                                        >
                                        </MySelect>
                                        {
                                            this.state.genryateRunSelected===true ?
                                                <span>
                                            <MySelect
                                                defaultValue={this.state.allowRunOnline}
                                                groupcode={this.state.dialogData.allowrunonline}
                                                changeSelectValue={this.changeAllowRunOnline}
                                            >
                                            </MySelect>
                                             {/*<MySelect*/}
                                                 {/*defaultValue={this.state.startEndBatch}*/}
                                                 {/*groupcode={this.state.dialogData.startendbatch}*/}
                                                 {/*changeSelectValue={this.changeStartEndBatch}*/}
                                             {/*>*/}
                                            {/*</MySelect>*/}
                                            <MyInput
                                                disableInput={disableInput}
                                                value={this.state.sla}
                                                groupcode={this.state.dialogData.sla}
                                                addGroupData={this.changeSla}
                                            >
                                            </MyInput>
                                            <MySelect
                                                defaultValue={this.state.pnonty}
                                                groupcode={this.state.dialogData.pnonty}
                                                changeSelectValue={this.changePnonty}
                                            >
                                            </MySelect>
                                        </span>
                                                : ''
                        
                                        }
                                        <MySelect
                                            defaultValue={this.state.periodicity}
                                            groupcode={this.state.dialogData.periodicity}
                                            changeSelectValue={this.changePeriodicity}
                                        >
                                        </MySelect>
                                        {
                                            this.props.disable === true ?
                                                <span>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserGroup }
                                                isValue={isValue}
                                                children={this.props.selectUserGroup}
                                                groupcode={this.state.dialogData.authornzedusergroup}
                                                addGroupData={this.changeAuthoriedUserGroup}
                                            >
                                            </LotSelect>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserIds}
                                                isValue={isValue}
                                                children={this.props.selectUsers}
                                                groupcode={this.state.dialogData.authornzeduserids}
                                                addGroupData={this.changeAuthoriedUserId}
                                            >
                                            </LotSelect>
                                        </span> : <span>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserGroup }
                                                isValue={isValue}
                                                children={this.props.selectUserGroup}
                                                groupcode={this.state.dialogData.authornzedusergroup}
                                                addGroupData={this.changeAuthoriedUserGroup}
                                            >
                                            </LotSelect>
                                            <LotSelect
                                                disable={this.props.disable}
                                                currentValue={this.state.authornzedUserIds}
                                                isValue={isValue}
                                                children={this.props.selectUsers}
                                                groupcode={this.state.dialogData.authornzeduserids}
                                                addGroupData={this.changeAuthoriedUserId}
                                            >
                                            </LotSelect>
                                        </span>
                                        }
                                    </div>
                                </div>
                                <div className="dialog-content-right">
                                    <div className="detailTransfer">
                    
                                        <Transfrom
                                            isShowEdit={this.props.isShowEdit}
                                            allQueries={this.props.allQueries}
                                            currentQueryIds={this.props.currentQueryIds}
                                            headertitle={this.state.headertitle}
                                        >
                                        </Transfrom>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                }
               
                
            </div>
        );
    }
}
export default PrivateModal
