import React,{Component} from 'react'
import { Table,Button,Modal ,message,Spin } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import FontAwesome from 'react-fontawesome'
import propTypes from 'prop-types'

import RunPrivateModal from './privatecomponent/runprivatemodal/runprivatemodal'
import PrivateModal from './privatecomponent/detailprivatemodal/privatemodal'
import './drag-table.css'
import {GET_EARCH_QROUP, UPDATA_GROUP, DELETE_GROUP, RUN_GROUP, DELETE_QUERY} from '../../constants/constants'
import { HttpGet } from '../../server/get'
import { HttpPost } from '../../server/post'
const confirm = Modal.confirm;

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

class BodyRow extends Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };
        
        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }
        
        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }
        
        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);
        
        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);



class DragSortingTable extends Component {
    constructor(props){
        super(props)
        this.columns = [
            {
                title: "GROUP NAME",
                dataIndex: "groupName",
                key:'groupName',
                width:200
            },
            {
                title: "GROUP DESCRIPTION",
                dataIndex: "description",
                key:'description',
                width:350
            },
            {
                title: "PERIODICITY",
                dataIndex: "periodicity",
                key:'periodicity'
            },
            {
                title: "GENERATE RUN",
                dataIndex: "generateRun",
                key:'generateRun'
            },
            {   title: 'ACTION',
                dataIndex: '',
                width:350,
                render: (text,record) =>
                    <span>
                        <Button type="primary" size="small" className="detailBtn" onClick={()=>this.onshowModal(record.groupId)}>
                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                            DETAIL</Button>
                        {
                            this.props.isShowDownloadBtn===true ?
                                <span>
                                    <Button type="primary" size="small" className="runBtn"  disabled>
                                        <FontAwesome name='play-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                        RUN</Button>
                                    <Button type="primary" size="small" className="deleteBtn" disabled>
                                        <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DELETE</Button>
                                </span> :
                                <span>
                                    {
                                        record.allowRunOnline ==='NO' ?
                                            <Button type="primary" size="small" className="runBtn"  disabled>
                                                <FontAwesome name='play-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                                RUN</Button> :
                                            <Button type="primary" size="small" className="runBtn" onClick={()=>this.showRunModal(record.groupId,record.groupName)}>
                                                <FontAwesome name='play-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                                RUN</Button>
                                    }
                                    <Button type="primary" size="small" className="deleteBtn" onClick={()=>this.showDelete(record.groupId,record.groupName)}>
                                        <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DELETE</Button>
                                </span>
                        }
                    </span>
            },
        ];
        this.state = {
            visible:false,
            currentKey:'',
            dialogData: {
                groupcode: {
                    spanlabel:'GROUP CODE',
                    select:'GROUP_1',
                    options:[{
                        value: 'GROUP_1',
                        label: 'GROUP_1'
                    },
                        {
                            value: 'GROUP_2',
                            label: 'GROUP_2'
                        }]
                },
        
                groupdescription: {
                    spanlabel:'GROUP DESCRIPTION',
                    select:'',
                    options:[{
                        value: '',
                        label: ''
                    }]
                },
                periodicity: {
                    spanlabel:'PERIODICITY',
                    select:'DAILY',
                    options:[{
                        value: 'DAILY',
                        label: 'DAILY'
                    }, {
                        value: 'NORMAL',
                        label: 'NORMAL'
                    }]
                },
                startendbatch: {
                    spanlabel:'START/END BATCH',
                    select:'START',
                    options:[{
                        value: 'START',
                        label: 'START'
                    }]
                },
                allowrunonline: {
                    spanlabel:'ALLOW RUN ONLINE',
                    select:'YES',
                    options:[{
                        value: 'YES',
                        label: 'YES'
                    }]
                },
                pnonty: {
                    spanlabel:'PRIORITY',
                    select:'12',
                    options:[{
                        value: '12',
                        label: '12'
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
                authornzedusergroup: {
                    spanlabel:'AUTHORIZED USER GROUP',
                    select:'USER GROUP',
                    options:[{
                        value: 'USER GROUP',
                        label: 'USER GROUP'
                    }]
                },
                authornzeduserids: {
                    spanlabel:'AUTHORIZED USER IDS(SPLIT BY COMMA)',
                    select:'12',
                    options:[{
                        value: '12',
                        label: '12'
                    }]
                }
            },
            editBtnIsshow:true,
            runModalVisible:false,
            isShowEdit:true,
            currentShowGroupId:'',
            currentModalData:{},
            currentQueryIds:[],
            deleteBtn:false,
            rundata:[],
            loadingTable:false,
            page:1,
            size:10,
            total:0,
            items:0,
            runLoading:false
        }
    }
    static propTypes={
        data:propTypes.array.isRequired,
        allQueries:propTypes.array.isRequired,
        getTableData:propTypes.func.isRequired
    }
    onshowModal = (id) => {
        let token="Bearer "+sessionStorage.getItem('token')
        let showGroupId=id
        HttpGet(GET_EARCH_QROUP+showGroupId,token)
            .then((res) => {
                console.log("groupDTAIL")
                console.log(res)
                if(res.status===200){
                    this.setState({
                        currentModalData:res.data.groupDetail,
                        currentQueryIds:res.data.querys
                    })
                }
            })
            .catch((err)=>{
            
            })
        console.log(this.state.currentModalData)
        this.setState({
            currentShowGroupId:id,
            visible:true,
            isShowEdit:true
        })
    }
    handleCancel(){
        this.setState({
            visible:false
        })
    }
    handleOk=(data1,data2)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let data={
            groupDetail:data1,
            queryIds:data2
        }
        if(this.state.isShowEdit===true){
            this.setState({
                isShowEdit:false
            })
        }else if(this.state.isShowEdit===false){
            HttpPost(UPDATA_GROUP,data,token)
                .then((res) => {
                    if(res.status===200){
                        this.setState({
                            visible:false
                        })
                        this.props.getTableData(this.props.currentSearchValue,this.props.page-1,this.props.size)
                        message.success('Edit successfully');
                    }
                })
                .catch((err)=>{
                
                })
        }
    }
    timestampToTime=(timestamp)=> {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes() + ':';
        let s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
    showRunModal=(id,groupname)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_EARCH_QROUP+id,token)
            .then((res) => {
                console.log(111312412)
                console.log(res)
                if(res.status===200){
                    sessionStorage.setItem('currentRunId',id)
                    sessionStorage.setItem('currentRunName',groupname)
                    let rundata=[]
                    for(let i=0;i<res.data.querys.length;i++){
                        rundata.push({
                            queryName:res.data.querys[i].queryName,
                            dateLastRun:this.timestampToTime(res.data.querys[i].dateLastRun)
                        })
                    }
                    this.setState({
                        runModalVisible:true,
                        rundata:rundata
                    })
                }
            })
            .catch((err)=>{
            
            })
    }
    runBtnSave=(id,groupname)=>{
        this.setState({runLoading:true})
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(RUN_GROUP+id,token)
            .then((res) => {
                console.log(111)
                console.log(res)
                if(res.status===200){
                    let rundata=[]
                    for(let i=0;i<res.data.length;i++){
                        rundata.push({
                            queryName:res.data[i].queryName,
                            dateLastRun:this.timestampToTime(res.data[i].dateLastRun)
                        })
                    }
                    this.setState({
                        runModalVisible:false,
                        rundata:rundata
                    })
                    this.setState({runLoading:false})
                    message.success(`${groupname} has been run successfully`);
                }
            })
            .catch((err)=>{
                console.log(err.response)
                this.setState({runLoading:false})
                if (err && err.response) {
                    switch (err.response.data) {
                        case 'Run error':
                            message.error('Run unsuccessfully')
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
    }
    runBtnCancel=()=>{
        this.setState({
            runModalVisible:false
        })
    }
    showDelete=(id,name)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let deleteGroupId=id
        console.log(id)
        confirm({
            title: 'Confirm To Delete?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk:()=> {
                HttpPost(DELETE_GROUP,deleteGroupId,token)
                    .then((res) => {
                        console.log(res)
                        if(res.status===200){
                            this.props.getTableData(this.props.currentSearchValue,this.props.page-1,this.props.size)
                            message.success(`Successfully removed ${name}`);
                        }
                    })
                    .catch((err)=>{
                    
                    })
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }
    components = {
        body: {
            row: DragableBodyRow,
        },
    }
    
    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.props;
        const dragRow = data[dragIndex];
        
        this.setState(
            update(this.props, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
        );
    }
    
    onClick(current, pageSize) {
        console.log(current,pageSize)
        this.setState({page:current,size:pageSize});
        // this.loadData(current,pageSize);
    }
    render() {
        const columns=this.columns
        return (
            <div className="tableCont">
                <Table
                    rowKey="groupId"
                    columns={columns}
                    dataSource={this.props.data}
                    components={this.components}
                    pagination={this.props.pagination}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                    })}
                />
                <PrivateModal visible={this.state.visible}
                              disable={this.props.disable}
                              currentLoginUserName={this.props.currentLoginUserName}
                              isShowDownloadBtn={this.props.isShowDownloadBtn}
                              groupIsDemand={this.state.groupIsDemand}
                              currentUserId={this.props.currentUserId}
                              selectUsers={this.props.selectUsers}
                              selectUserGroup={this.props.selectUserGroup}
                              isShowEdit={this.state.isShowEdit}
                              currentModalData={this.state.currentModalData}
                              allQueries={this.props.allQueries}
                              // getMock={this.props.getMock}
                              currentQueryIds={this.state.currentQueryIds}
                              handleCancel={this.handleCancel.bind(this)}
                              handleOk={this.handleOk}
                    >
                </PrivateModal>
                <RunPrivateModal visibleRun={this.state.runModalVisible}
                                 runloading={this.state.runLoading}
                                 runData={this.state.rundata}
                                 runBtnCancel={this.runBtnCancel.bind(this)}
                                 runBtnSave={this.runBtnSave.bind(this)}
                >
                </RunPrivateModal>
            </div>
            
        );
    }
}

const DragTable = DragDropContext(HTML5Backend)(DragSortingTable);

export default DragTable
