import React,{Component} from 'react'
import propTypes from 'prop-types'
import { Modal } from 'antd'
import FontAwesome from 'react-fontawesome'

import { Button } from 'element-react'
import './report-list-private-modal.css'
import MyTable from './../../../../../component/mytable/mytable'

const confirm = Modal.confirm;


class ReportListPrivateModal extends Component{
    state={
        columns: [
            {
                title: "USER NAME",
                dataIndex: "userName",
                key:'userName'
            },
            {
                title: "USER GROUP",
                dataIndex: "groupName",
                key:'groupName'
            },
            {
                title: "AUTHORITY DESCRIPTION",
                dataIndex: "userAuthority",
                key:'userAuthority',
                width:320
            }
        ]
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
        const { columns }=this.state
        const { visible }=this.props
        console.log(this.props.currentUserList)
        return(
            <div>
                <Modal className="userlistmodal"
                       title="Report List Detail"
                       visible={visible}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       okText="OK"
                >
                    <div className="modal-con">
                        <MyTable data={this.props.currentUserList} columns={columns}></MyTable>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default ReportListPrivateModal
