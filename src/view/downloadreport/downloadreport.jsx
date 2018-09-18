
import 'fetch-detector';
import 'fetch-ie8';

import React,{Component} from 'react'
import {withRouter} from 'react-router-dom';
import {Modal,List, message, Spin,Select } from 'antd'
import {Button} from 'element-react'
import FontAwesome from 'react-fontawesome'
import NavHeader from './../../component/navlink/navheader'

import InfiniteScroll from 'react-infinite-scroller';


import SortTable from '../../component/mytable/sorttable'
import {
    DOWNLOAD,
    VIEW_REPORT,
    GET_INFORMATION,
    SEARCH_REPORT,
    GET_ALL_REPORT_PAN,
    GET_REPORT
} from '../../constants/constants'
import { HttpGet } from "../../server/get";
import SearchInputSortChange from '../../component/search-input/search-input-sort-change'
import './downloadreport.css'

import 'babel-polyfill';
require('es6-promise').polyfill();

const confirm = Modal.confirm;
const Option = Select.Option;

class QueryGroup  extends Component{
    state={
        columns : [
            {
            title: 'REPORT ID',
            dataIndex: 'reportName',
            key: 'reportName',
        }, {
            title: 'QUERY DESCRIPTION',
            dataIndex: 'reportDescription',
            key: 'reportDescription',
            width:285
        }, {
            title: 'CREATOR',
            dataIndex: 'creator',
            key: 'creator',
        }, {
            title: 'DATE',
            dataIndex: 'generateDate',
            key: 'generateDate',
        },{
            title: 'ACTION',
            width:300,
            key: 'action',
            render: (text, record) => (
                <span>
                    {
                        this.state.isAdminLogin===true  ?
                            <span>
                                <Button disabled type="info" size="small" className="successBtn">
                                    <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                     VIEW</Button>
                                <Button disabled type="info" size="small" className="successBtn" >
                                    <FontAwesome name='arrow-circle-down' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                    DOWNLOAD</Button>
                            </span> :
                            <span>
                                {
                                    this.state.isViewBtn===true ?
                                        <Button type="info" size="small" className="successBtn" onClick={()=>{this.viewReport(record.id)}}>
                                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            VIEW</Button> :
                                        <Button disabled type="info" size="small" className="successBtn">
                                            <FontAwesome name='info-circle' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            VIEW</Button>
                                }
                                {
                                    this.state.isShowDownloadBtn===true ?
                                        record.buttonColor===false ?
                                        <Button  type="info" size="small" className="successBtn" onClick={()=>{this.downloadData(record.id,record.reportName)}}>
                                            <FontAwesome name='arrow-circle-down' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            DOWNLOAD</Button>:<Button  type="info" size="small" className="successBtn havenDownload" onClick={()=>{this.downloadData(record.id,record.reportName)}}>
                                                <FontAwesome name='arrow-circle-down' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                                DOWNLOAD</Button>:
                                        <Button disabled  type="info" size="small" className="successBtn">
                                            <FontAwesome name='arrow-circle-down' style={{ fontSize: "14px",marginRight:'5px' }}/>
                                            DOWNLOAD</Button>
                                }
                            </span>
                    }
                </span>
            ),
        }
        ],
        data : [],
        tableKey:'',
        visible: false,
        columnsReport:[],
        dataReport:[],
        searchInputData:[],
        isAdminLogin:false,
        currentLoginUser:'',
        authorities:[],
        isShowDownloadBtn:false,
        isViewBtn:false,
        userNeverDemand:true,
        isHavenDownload:false,
        scrollData: [],
        loading: false,
        hasMore: true,
        headerData:[],
        totle:0,
        currentViewId:'',
        reportListData:[],
        headerTotle:0,
        loadingTable:false,
        page:1,
        size:15,
        total:0,
        items:0,
        currentSearchValue:'',
        selectSortType:'des',
        viewLoading:false
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size,this.state.selectSortType)
        this.getSearchAllData()
    }
    getIsAdminLogin=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log('ressadfhj=>',res)
                let auth=[]
                for(let i=0;i<res.data.loginUser.authorities.length;i++){
                    auth.push(res.data.loginUser.authorities[i].authority)
                }
                console.log(auth)
                if(auth.includes('ROLE_REPORT_DOWNLOAD')===true){
                    this.setState({
                        isViewBtn:true,
                        isShowDownloadBtn:true
                    })
                }else if(auth.includes('ROLE_REPORT_VIEW')===true){
                    this.setState({
                        isViewBtn:true,
                        isShowDownloadBtn:false
                    })
                }
                if(res.data.identity !=='ADMIN'){
                    if(auth.includes('ROLE_REPORT_VIEW') ===false && auth.includes('ROLE_REPORT_DOWNLOAD') ===false){
        
                        this.setState({
                            userNeverDemand:false
                        })
                    }
                }
                
                this.setState({
                    isAdminLogin: res.data.identity ==='USER' ? false : true,
                    currentLoginUser:res.data.loginUser.firstName,
                    authorities:res.data.loginUser.authorities
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
        var that = this;
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
    timestampToTime=(timestamp)=> {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate()< 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())+ ':';
        let m = date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes();
        let s = date.getSeconds();
        return Y+M+D+h+m;
    }
    
    getSearchAllData=()=> {
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_REPORT,token)
            .then((res) => {
                console.log('allreport=>',res)
                let searchInput=[]
                for(let i=0;i<res.data.length;i++){
                    searchInput.push({
                        value:res.data[i].id,
                        label:res.data[i].reportName,
                    })
                }
                this.setState({
                    searchInputData:searchInput,
                })
            })
            .catch((err)=>{
            
            })
    }
    getTableData=(currentSelectValue,page,size,sort)=> {
        let token="Bearer "+sessionStorage.getItem('token')
        let currentSearchValue=''
        this.setState({
            currentSearchValue:currentSelectValue===undefined? '' : currentSelectValue
        })
        HttpGet(GET_ALL_REPORT_PAN+`search=${currentSelectValue===undefined? '' : currentSelectValue}&sortType=${sort}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                console.log(1231)
                console.log(res)
                let tableData=[]
                for(let i=0;i<res.data.reports.length;i++){
                    tableData.push({
                        key:i,
                        creator:res.data.reports[i].creator,
                        csvURL:res.data.reports[i].csvURL,
                        excelURL:res.data.reports[i].excelURL,
                        excelURL2007:res.data.reports[i].excelURL2007,
                        buttonColor:res.data.reports[i].button,
                        generateDate:this.timestampToTime(res.data.reports[i].generateDate),
                        reportDescription:res.data.reports[i].reportDescription,
                        id:res.data.reports[i].id,
                        queryName:res.data.reports[i].queryName,
                        reportName:res.data.reports[i].reportName,
                    })
                }
                this.setState({
                    reportListData:tableData,
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
    viewReport=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        this.setState({
            currentViewId:id,
            viewLoading:true,
        })
        HttpGet(VIEW_REPORT+id,token)
            .then((res) => {
                console.log('res===>',res)
                if(res.status===200){
                    if(res.data.header===null && res.data.body===null){
                        message.error('The file does not exist')
                    }
                   
                    this.setState({
                        visible: true,
                        data:res.data.body,
                        totle:res.data.body.length,
                        headerData:res.data.header,
                        headerTotle:res.data.header.length,
                        viewLoading:false,
                    });
                    console.log('this.state.totle=>',this.state.totle)
                }
            })
            .catch((err)=>{
                this.setState({viewLoading:false})
                if (err && err.response) {
                    switch (err.response.data) {
                        case 'File not found':
                            message.error('The file does not exist')
                            break
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    downloadData=(id,reportName)=>{
        let token = "Bearer " + sessionStorage.getItem('token')
        fetch(DOWNLOAD + id, {
            headers: {
                'Content-type': 'application/json;charset=UTF-8',
                'Authorization': token
            }
        }).then(res => res.blob().then(blob => {
            console.log(res)
            if(res.status===400){
                message.error('The file does not exist')
            }else if(res.status===200){
                var filename=`${reportName}.xlsx`
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
                this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size)
            }
        }).catch((err)=>{
            console.log(err)
        }))
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    searchDownload=(id)=>{
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(SEARCH_REPORT + id, token)
            .then((res) => {
                if (res.status === 200) {
                    let tableData = []
                    tableData.push({
                        key:1,
                        creator:res.data.creator,
                        csvURL:res.data.csvURL,
                        excelURL:res.data.excelURL,
                        excelURL2007:res.data.excelURL2007,
                        buttonColor:res.data.button,
                        generateDate:this.timestampToTime(res.data.generateDate),
                        reportDescription:res.data.reportDescription,
                        id:res.data.id,
                        queryName:res.data.queryName,
                        reportName:res.data.reportName,
                    })
                
                    this.setState({
                        reportListData: tableData,
                        total:1
                    })
                }
            })
            .catch((err) => {
            
            })
    }
    blurSearchQuery=(value,page,size,sort)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let currentPage=page+1
        console.log('currentPage==>',currentPage)
        this.setState({
            currentSearchValue:value,
        })
        console.log(value)
        HttpGet(GET_ALL_REPORT_PAN+`search=${value}&sortType=${sort}&pageNumber=${page}&pageSize=${size}`,token)
            .then((res) => {
                this.setState({ page:currentPage })
                let tableData=[]
                let searchInput=[]
                for(let i=0;i<res.data.reports.length;i++){
                    tableData.push({
                        key:i,
                        creator:res.data.reports[i].creator,
                        csvURL:res.data.reports[i].csvURL,
                        excelURL:res.data.reports[i].excelURL,
                        excelURL2007:res.data.reports[i].excelURL2007,
                        buttonColor:res.data.reports[i].button,
                        generateDate:this.timestampToTime(res.data.reports[i].generateDate),
                        reportDescription:res.data.reports[i].reportDescription,
                        id:res.data.reports[i].id,
                        queryName:res.data.reports[i].queryName,
                        reportName:res.data.reports[i].reportName,
                    })
                    searchInput.push({
                        value:res.data.reports[i].id,
                        label:res.data.reports[i].reportName,
                    })
                }
                this.setState({
                    reportListData:tableData,
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
    sorterTableChange=(pagination, filters, sorter)=>{
        console.log('params', pagination, filters, sorter);
    }
    handleInfiniteOnLoad = () => {
        let token="Bearer "+sessionStorage.getItem('token')
        let data = this.state.data;
       
        this.setState({
            loading: true,
        });
        if (data.length > this.state.totle-1) {
            message.warning('No more data');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        
        
        HttpGet(VIEW_REPORT+this.state.currentViewId,token)
            .then((res) => {
                console.log('res===>',res)
                if(res.status===200){
                    data = data.concat( res.data.body);
                    this.setState({
                        visible: true,
                        data,
                        scrollData:res.data.body,
                        loading: false,
                    });
                }
            })
            .catch((err)=>{
            
            })
    }
    onClick(current, pageSize) {
        console.log(current,pageSize)
        this.setState({page:current,size:pageSize,loadingTable:true});
        if(this.state.currentSearchValue==='' || this.state.currentSearchValue===undefined){
            this.getTableData(this.state.currentSearchValue,current-1,pageSize,this.state.selectSortType);
        }else if(this.state.currentSearchValue!==''){
            this.blurSearchQuery(this.state.currentSearchValue,current-1,pageSize,this.state.selectSortType);
        }
    }
    sortTypeHandleChange=(value)=>{
        this.setState({
            selectSortType:value
        })
    }
    selectedCurrentValue=(value)=>{
        this.setState({
            selectSortType:value,
            // page:0,
            // size:10
        })
        this.getTableData(this.state.currentSearchValue,this.state.page-1,this.state.size,value)
    }
    render(){
        const {columns,reportListData,columnsReport,dataReport,searchInputData}=this.state
        console.log('this.state.headerData',this.state.headerData)
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
        console.log('searchInputData',searchInputData)
        return(
            <div>
                <Spin spinning={this.state.viewLoading}>
                    <NavHeader currentLoginUser={this.state.currentLoginUser}/>
                    <div>
                        <div className="queryGroupWrap">
                            <div className="HUBquerygroupPar report-header-con">
                                <div className="query-con down-search">
                                    <h3>DOWNLOAD REPORT</h3>
                                    <SearchInputSortChange
                                        states={searchInputData}
                                        getTableData={this.getTableData}
                                        page={this.state.page}
                                        size={this.state.size}
                                        selectSortType={this.state.selectSortType}
                                        currentSearchValue={this.state.currentSearchValue}
                                        blurSearchQuery={this.blurSearchQuery}
                                        searchContent={this.searchDownload}
                                    >
                                    </SearchInputSortChange>
                                </div>
                                <div className='select-con'>
                                    <h5 className='sortLabel'>SEQUENCE</h5>
                                    <Select defaultValue={this.state.selectSortType}
                                            onChange={this.sortTypeHandleChange}
                                            onSelect={this.selectedCurrentValue}>
                                        <Option value="des">DES</Option>
                                        <Option value="asc">ASC</Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="gropTable">
                                <SortTable
                                    columns={columns}
                                    data={reportListData}
                                    sorterTableChange={this.sorterTableChange}
                                    pagination={pagination}
                                >
                                </SortTable>
                            </div>
                        </div>
                    </div>
                    <Modal
                        className="reportModal"
                        title="REPORT"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        style={{top:20}}
                    >
                        <div>
                            <div className="demo-infinite-container">
                                <InfiniteScroll
                                    initialLoad={false}
                                    pageStart={0}
                                    loadMore={this.handleInfiniteOnLoad}
                                    hasMore={!this.state.loading && this.state.hasMore}
                                    useWindow={false}
                                >
                                    <List
                                        // xxl={1600}
                                        size="small"
                                        // pagination={true}
                                        dataSource={this.state.data}
                                        header={this.state.headerData.map((item,index)=>(
                                            <List.Item.Meta
                                                key={index}
                                                description={item}
                                            />
                                        ))}
                                        renderItem={(item,idx) => (
                                            <List.Item key={idx}>
                                                {
                                                    item.map((item,idx)=>(
                                                        <List.Item.Meta
                                                            key={idx}
                                                            description={item}
                                                        />
                                                    ))
                                                }
                                            </List.Item>
                                        )}
                                    >
                                        {this.state.loading && this.state.hasMore && (
                                            <div className="demo-loading-container">
                                                <Spin />
                                            </div>
                                        )}
                                    </List>
                                </InfiniteScroll>
                            </div>
                        </div>
                    </Modal>
                </Spin>
            </div>

        )
    }
}
export default withRouter(QueryGroup)
