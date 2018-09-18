import React,{Component} from 'react'

import { Table,Button,Modal,message } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import FontAwesome from 'react-fontawesome'
import propTypes from 'prop-types'


import QueryinventoryModal from './detailmodal/queryinventorymodal'
import {
    GET_EACH_GUERY,
    GET_ALL_GROUP,
    UPDATA_QUERY,
    DELETE_QUERY,
    RUN_QUERY
} from "../../../../constants/constants";
import { HttpGet } from "../../../../server/get";
import { HttpPost } from "../../../../server/post";
import './dragtable.css'
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
                title: "QUERY NAME",
                dataIndex: "queryName",
                key:'queryname'
            },
            {
                title: "GROUP NAME",
                dataIndex: "groupCode",
                key:'groupCode'
            },
            {
                title: "REPORT ID",
                dataIndex: "reportName",
                key:'reportName'
            },
            {
                title: "QUERY DESCRIPTION",
                dataIndex: "queryDescription",
                key:'queryDescription',
                width:350
            },
            {   title: 'ACTION',
                dataIndex: '',
                width:350,
                render: (text,record) =>
                    <span>
                        <Button
                                size="small"
                                className="detailBtn"
                                onClick={() => this.showQueryInventroyDetail(record.queryId)}>
                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                            DETAIL</Button>
                        {
                            this.props.isShowDownloadBtn===true ?
                                <span>
                                    <Button
                                            size="small"
                                            className="runBtn"
                                            disabled>
                                        <FontAwesome name='play-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                        RUN</Button>
                                    <Button
                                            size="small"
                                            className="deleteBtn"
                                            disabled>
                                        <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                        DELETE</Button>
                                </span>:
                                <span>
                                    <Button
                                            size="small"
                                            className="runBtn"
                                            onClick={()=>this.showRun(record.queryName)}>
                                        <FontAwesome name='play-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                        RUN</Button>
                                    <Button
                                            size="small"
                                            className="deleteBtn"
                                            onClick={()=>this.showDelete(record.queryId,record.groupCode,record.queryName)}>
                                        <FontAwesome name='times-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                        DELETE</Button>
                                </span>
                        }
                    </span>
            },
        ];
        this.state = {
            // data: [],
            visible:false,
            ischangeBtn:false,
            detailData:{},
            allgroupCode:[],
            selectGroupcode:{},
            currentQueryId:'',
            currentPage:1,
            currentSize:10
        }
    }
    static propTypes={
        data:propTypes.array.isRequired,
        getTableData:propTypes.func.isRequired
    }
    componentDidMount(){
        this.getGroupCode()
    }
    showQueryInventroyDetail=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let currentQueryId=id
        this.setState({currentQueryId})
        HttpGet(GET_EACH_GUERY+currentQueryId,token)
            .then((res) => {
                console.log(12134532647)
                console.log(res)
                if(res.status===200){
                    this.setState({
                        detailData:res.data,
                        visible:true,
                        ischangeBtn:false,
                    })
                }
            })
            .catch((err)=>{

            })
    }
    getGroupCode=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let groupcodearr=[]
        HttpGet(GET_ALL_GROUP,token)
            .then((res) => {
                if(res.status===200){
                    // console.log(res)
                    for(let i=0;i<res.data.length;i++){
                        groupcodearr.push({
                            value:res.data[i].groupName,
                            label:res.data[i].groupId
                        })
                    }
                    this.setState({
                        selectGroupcode:{
                            spanlabel:'GROUP CODE',
                            select:'',
                            options:groupcodearr
                        }
                    })
                }
            })
            .catch((err)=>{
            
            })
    }
    showRun=(queryname)=>{
        this.props.runQuery(queryname)
    }
    showDelete=(id,group,name)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let deleteQueryId=id
        console.log('121313')
        console.log(typeof (group))
        if(group === ''){
            confirm({
                title: 'Confirm To Delete?',
                content: '',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk:()=> {
                    HttpPost(DELETE_QUERY,deleteQueryId,token)
                        .then((res) => {
                            console.log(res)
                            if(res.status===200){
                                this.props.getTableData(this.props.currentSearchValue,this.props.page-1, this.props.size)
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
        }else if(group !== ''){
            Modal.info({
                title: 'This query be used under some group，please check and remove from the group first',
                content: '',
                okText: 'Close',
                onOk: () => {
                    this.setState({
                        deleteBtn: true
                    })
            
                },
            });
        }
        
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
    
    cancelQueryInventroy=()=>{
        this.setState({
            visible:false
        })
    }
    postEditQueryDetail=(data)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        if(this.state.ischangeBtn===false){
            this.setState({
                ischangeBtn:true
            })
        }else{
            HttpPost(UPDATA_QUERY,data,token)
                .then((res) => {
                    // console.log(res)
                    if(res.status===200){
                        this.setState({visible:false})
                        this.props.getTableData(this.props.currentSearchValue,this.props.page-1, this.props.size)
                        message.success('Edit successfully');
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
                            default:;
                        }
                        switch (err.response.data) {
                            case 'Sql exception':
                                message.error('Please check if SQL grammar is correct')
                                break;
                            case 'SqlStatement Not Null':
                                message.error('Please check if SQL grammar is correct')
                                break;
                            case 'queryName Not Null':
                                message.error('Query name can not be empty')
                                break;
                            default:;
                        }
                    }
                    return Promise.reject(err)
                })
        }
       
    }
    render() {
        const columns=this.columns
        const { visible,ischangeBtn,detailData,selectGroupcode,currentQueryId } =this.state
       
        return (
            <div className="showDetail">
                <Table
                    columns={columns}
                    dataSource={this.props.data}
                    components={this.components}
                    pagination={this.props.pagination}
                    // loading={this.props.loadingPage}
                    onRow={(record, index) => ({
                        index,
                        moveRow: this.moveRow,
                    })}
                />
                <QueryinventoryModal
                    currentLoginUserName={this.props.currentLoginUserName}
                    reportIsShow={this.props.reportIsShow}
                    assistanceIsShow={this.props.assistanceIsShow}
                    isShowDownloadBtn={this.props.isShowDownloadBtn}
                    selectUsers={this.props.selectUsers}
                    selectUserGroup={this.props.selectUserGroup}
                    currentUserId={this.props.currentUserId}
                    currentusername={this.props.currentusername}
                    visiblequeryInventoryDetail={visible}
                    ischangeBtn={ischangeBtn}
                    detailData={detailData}
                    selectGroupcode={selectGroupcode}
                    currentQueryId={currentQueryId}
                    cancelQueryInventroy={this.cancelQueryInventroy}
                    postEditQueryDetail={this.postEditQueryDetail}
                >
                </QueryinventoryModal>
            </div>
        );
    }
}

const QueryInventoryDragTable = DragDropContext(HTML5Backend)(DragSortingTable);

export default QueryInventoryDragTable
