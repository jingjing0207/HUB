import React,{Component} from 'react'
import propTypes from 'prop-types'
import { Modal } from 'antd'
import FontAwesome from 'react-fontawesome'

import { Button } from 'element-react'
import './user-list-private-moda.css'
import MyTable from './../../../../../component/mytable/mytable'

const confirm = Modal.confirm;


class UserListPrivateModal extends Component{
    state={
        columns: [
            {
                title: "REPORT NAME",
                dataIndex: "reportName",
                key:'reportName'
            },
            {
                title: "REPORT DESCRIPTION",
                dataIndex: "reportDescription",
                key:'reportDescription'
            },
            {
                title: "RETENTION PERIOD",
                dataIndex: "retentionPeriod",
                key:'retentionPeriod'
            }
        ],
        // data: [],
    }
    static propTypes={
        visible:propTypes.bool.isRequired,
        saveUserlistDetail:propTypes.func.isRequired,
        cancelEdit:propTypes.func.isRequired
    }
    handleOk=()=>{
        this.props.saveUserlistDetail()
    }
    handleCancel=()=>{
        this.props.cancelEdit()
    }
    showDelete=()=>{
        confirm({
            title: 'Confirm To Delete?',
            content: '',
            okText: 'Yes',
            cancelText: 'No',
            okType: 'danger',
            onOk:()=>{
            
            },
            onCancel:()=> {
                console.log('Cancel');
            },
        });
    }
    render(){
        const { columns,data }=this.state
        const { visible }=this.props
        return(
            <div>
                <Modal className="userlistmodal"
                    title="User List Detail"
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="OK"
                >
                    <div className="modal-con">
                        <MyTable data={this.props.currentReportList} columns={columns}></MyTable>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default UserListPrivateModal
