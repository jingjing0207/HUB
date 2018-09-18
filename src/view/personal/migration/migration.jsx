import React,{Component} from 'react'
// import moment from 'moment';
import { Modal,Table} from 'antd'
import { Input } from 'element-react'
// import reqwest from 'reqwest';
import { Button } from 'element-react'
// import PrivateTable from './../../../view/downloadreport/privatetable/privatetable'
import FontAwesome from 'react-fontawesome'
import {withRouter} from 'react-router-dom';

import PublicSlider from '../privatecomponents/publicslider/publicslider'
// import MySecondInput from '../../../component/input/second-input'
import NavHeader from '../../../component/navlink/navheader'
// import PrivateDialog from './privatedialog/privatedialog'
import DataLoading from '../../../utils/image/data-loading.png'
// import SearchInput from './../../../component/search-input/search-input'
// import SearchInputDfaultValue from './../../../component/search-input/search-input-default-value'

// import {
//     SELECT_USER_GROUP,
//     ADD_USER_GROUP,
//     GET_ALL_USER_CONFIG,
//     DELETE_USER_CONFIG,
//     GET_INFORMATION,
//     IMPORT_USERDATA, DOWNLOAD
// } from '../../../constants/constants'
// import { HttpGet } from "../../../server/get";
// import { HttpPost } from "../../../server/post";

import './mi-gration.css'
// const confirm = Modal.confirm;
// const CheckboxGroup = Checkbox.Group
// const Option = Select.Option;



class Migration extends Component{
    state={
        columns: [
            {
                title: "From Lib",
                dataIndex: "fromLib",
                key:'fromLib',
                width:250
                // fixed: 'left'
            },
            {
                title: "From File",
                dataIndex: "fromFile",
                key:'fromFile',
                width:250
            },
            {
                title: "To Lib",
                dataIndex: "toLib",
                key:'toLib',
                width:250
            },
            {
                title: "To File",
                dataIndex: "toFile",
                key:'toFile',
                width:250
            },
            {
                title: "Target File",
                dataIndex: "targetFile",
                key:'targetFile',
                width:250
            },
            {
                title: "Naming Method",
                dataIndex: "namingMethod",
                key:'namingMethod',
                width:250
            },
            {
                title: "Keep Month",
                dataIndex: "keepMonth",
                key:'keepMonth',
                width:250
            },
            {
                title: "Keep Year",
                dataIndex: "keepYear",
                key:'keepYear',
                width:250
            },
            {
                title: "Masking",
                dataIndex: "masking",
                key:'masking',
                width:250
            },
            {
                title: "Last Update Date Field Name",
                dataIndex: "lastUpdateFieldName",
                key:'lastUpdateFieldName',
                width:350
            },
            {
                title: "Purpose",
                dataIndex: "purpose",
                key:'purpose',
                width:250
            },
            
            {
                title: "Channel",
                dataIndex: "channel",
                key:'channel',
                width:250
            },
            {
                title: "Status(Completed/Pending)",
                dataIndex: "status",
                key:'status',
                width:350
            },
    
            {
                title: "Last Update Date",
                dataIndex: "lastUpdateDate",
                key:'lastUpdateDate',
                width:250
            },
    
            {
                title: "Last Update Time",
                dataIndex: "lastUpdateTime",
                key:'lastUpdateTime',
                width:250
            },
            {
                title: "ACTION",
                dataIndex: "action",
                width:400,
                // fixed: 'right',
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
        data: [{
            fromLib:12345678,
            fromFile:12345678,
            toLib:12345678,
            toFile:12345678,
            targetFile:12345678,
            namingMethod:12345678,
            keepMonth:12345678,
            keepYear:12345678,
            masking:12345678,
            lastUpdateTime:4567890,
            purpose:12345678,
            channel:12345678,
            lastUpdateDate:12345678,
            status:4567890,
        }],
        userEditConfigVisible:false,
        userConfigVisible:false
    }
    showAddUserDialog=()=>{
    
    }
    uploadUserData=()=>{
    
    }
    saveNewUser=()=>{
    
    }
    closeHanle=()=>{
    
    }
    editUserData=()=>{
    
    }
    canCelEdit=()=>{
    
    }
    render(){
        const {userEditConfigVisible,userConfigVisible,columns,data}=this.state
        return(
            <div className="info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}> </NavHeader>
                <div className="pernalWrap">
                    <PublicSlider></PublicSlider>
                    <div className="informationSlider migration-right">
                        <div className="HUBquerygroupPar">
                            <div className="query-con">
                                <Input className="querysearch userConfig" icon="search" placeholder="SEARCH" />
                                {/*<SearchInput*/}
                                    {/*getTableData={this.getUserConfig}*/}
                                    {/*states={searchUserConfig}*/}
                                    {/*searchContent={this.searchEarchUserConfig}*/}
                                {/*>*/}
                                {/*</SearchInput>*/}
                            </div>
                            <span className="btn">
                                <Button type="info" className="add-btn"  onClick={this.showAddUserDialog}>ADD NEW USER</Button>
                                <img onClick={this.uploadUserData} className="data-loading" src={DataLoading} alt=""/>
                            </span>
                        </div>
                        <div className="gropTable user-config">
                            <div>
                                <Table columns={columns} dataSource={data} scroll={{ x: 2400 }} />
                            </div>
                            <Modal className="mydialogCon addInfoDialog user-con-modal"
                                   title="USER"
                                   visible={userEditConfigVisible}
                                   onOk={this.editUserData}
                                   onCancel={this.canCelEdit}
                                   afterClose={this.clearData}
                                   okText="Save"
                                   style={{top:20}}
                            >
                            
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
                
                </Modal>
            </div>
        )
    }
}
export default withRouter(Migration)
