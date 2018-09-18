import React,{Component} from 'react'
import { Modal,Button,Table } from 'antd'
import propTypes from 'prop-types'

import './runprivatemodal.css'
class RunPrivateModal extends Component{
    state={
        columns:[
            {
                title: "QUERY",
                dataIndex: "queryName",
                key:'queryName',
                render: text => <span><span></span> {text}</span>,
            },
            {
                title: "DATE LAST RUN",
                dataIndex: "dateLastRun",
                key:'dateLastRun',
                render: text => <span><span></span> {text}</span>,
            },
        ]
    }
    static propTypes={
        visibleRun:propTypes.bool.isRequired,
        runBtnCancel:propTypes.func.isRequired,
        runBtnSave:propTypes.func.isRequired,
        runData:propTypes.array.isRequired
    }
    handleOk=()=>{
        let id=sessionStorage.getItem('currentRunId')
        let groupname=sessionStorage.getItem('currentRunName')
        this.props.runBtnSave(id,groupname)
    }
    handleCancel=()=>{
        this.props.runBtnCancel()
    }
    render(){
       const { visibleRun,runloading }=this.props
        return(
            <div>
                <Modal
                    className="runModal"
                    title="CONFIRM TO RUN"
                    visible={ visibleRun }
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Run"
                    style={{top:20}}
                    footer={[
                        <Button key="submit" type="primary" loading={runloading} onClick={this.handleOk}>
                            Run
                        </Button>,
                    ]}
                >
                    <div className="run-con">
                        <div className="run-con-bot">
                            <Table dataSource={this.props.runData} columns={this.state.columns}></Table>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}
export default RunPrivateModal
