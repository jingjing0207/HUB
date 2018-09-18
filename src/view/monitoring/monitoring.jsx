import React,{Component} from 'react'
import 'babel-polyfill'
import { Modal } from 'antd'
import {Button,Input,Select} from 'element-react'
import MyTable from './../../component/mytable/mytable'
import NavHeader from './../../component/navlink/navheader'
import {withRouter} from 'react-router-dom';
import { QUERY_RUN_STATUS } from './../../constants/constants'
import monitoringImg01 from './../../utils/image/monitoring01.png'
import monitoringImg02 from './../../utils/image/monitoring02.png'
import './monitoring.css'
import { HttpGet } from "../../server/get";
import {GET_INFORMATION, RUN_QUERY} from "../../constants/constants";
import {message} from "antd/lib/index";

const confirm = Modal.confirm;

class Monitoring  extends Component{
   state={
       monitoringImg01:monitoringImg01,
       monitoringImg02:monitoringImg02,
       columns: [
           {
               title: "QUERY NAME",
               dataIndex: "queryname",
               width:130,
               key:'queryname'
           },
           {
               title: "START TIME",
               dataIndex: "starttime",
               key: 'starttime',
           },
           {
               title: "STATUS",
               dataIndex: "status",
               key: 'status',
               render: text =>
                        <span>
                            <span style={{marginLeft: '10px'}} className={text==='SUCCESS'?"green":"red"}>{text}</span>
                        </span>
                    
           },
           {
               title: "ACTION",
               dataIndex: "action",
               key: "action",
               render:(text,record) =>{
                   return (
                       <span>
                           {
                               record.status === 'SUCCESS'? ' ':
                                   <Button size="small" type="success" className="successBtm" onClick={()=>this.reRunBtn(record.queryname)}>RUN</Button>
                           }
                        </span>
                   )
               }
           }
       ],
       data: [],
       columns2: [
           {
               title: "GROUP NAME",
               dataIndex: "queryname",
               key:'queryname'
           },
           {
               title: "START TIME",
               dataIndex: "time",
               key:'time'
           },
           {
               title: "END TIME",
               dataIndex: "endtime",
               key:'endtime'
           },
           {
               title: "SEQUENCE NUMBER",
               dataIndex: "sequencenumber",
               key:'sequencenumber'
           }
       ],
       data2: [{
           key:1,
           queryname: 'GROUP_1',
           time: '18/02/06 16:00',
           endtime: '2018/02/07 16:00',
           sequencenumber: '001'
       }, {
           key:2,
           queryname: 'GROUP_2',
           time: '18/02/06 16:00',
           endtime: '2018/02/07 16:00',
           sequencenumber: '002'
       }],
       options: [{
           value: 'SUCCESS',
           label: '全部'
       }, {
           value: 'FAIL',
           label: '时间'
       }],
       value: 'SUCCESS',
       isAdminLogin:false,
       currentLoginUser:''
   }
   componentWillMount(){
       this.getIsAdminLogin()
   }
   componentDidMount(){
       this.getQueryStatus()
   }
    
    getIsAdminLogin = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION, token)
            .then((res) => {
                console.log(res)
                this.setState({
                    isAdminLogin: res.data.identity === 'USER' ? false : true,
                    currentLoginUser: res.data.loginUser.firstName
                })
                sessionStorage.setItem("isAdminLogin", this.state.isAdminLogin)
            })
            .catch((err) => {
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
    showConfirm = () => {
        var that = this
        confirm({
            title: 'Information changed, please login again.',
            content: '',
            onOk() {
                that.props.history.push('/')
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    getQueryStatus = () => {
        let token = "Bearer " + sessionStorage.getItem('token')
        
        function add0(m) {
            return m < 10 ? '0' + m : m
        }
        
        function timeFormat(timestamp) {
            //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
            var time = new Date(timestamp);
            var year = time.getFullYear();
            var month = time.getMonth() + 1;
            var date = time.getDate();
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
        }
        
        HttpGet(QUERY_RUN_STATUS, token)
            .then((res) => {
                console.log(res.data)
                let data = []
                for (let i = 0; i < res.data.length; i++) {
                    data.push({
                        key: i + 0,
                        queryname: res.data[i].queryName,
                        starttime: timeFormat(res.data[i].dateLastRun),
                        status: res.data[i].runStatus === 'YES' ? 'FAIL' : 'SUCCESS'
                    })
                }
                this.setState({data})
            })
            .catch((err) => {
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
    reRunBtn=(queryname)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        confirm({
            title: 'Confirm To Run?',
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                HttpGet(RUN_QUERY + queryname, token)
                    .then((res) => {
                        console.log(res)
                        if (res.status === 200) {
                            message.success(`${queryname} has been run successfully`);
                            this.getQueryStatus()
                        }
                    })
                    .catch((err) => {
                        console.log(err.response)
                        if (err && err.response) {
                            switch (err.response.data) {
                                case 'Run error':
                                    message.error('Please check if SQL grammar is correct')
                                    break
                                case 'Sql exception':
                                    message.error('Please check if SQL grammar is correct')
                                    break
                                default:
                            }
                        }
                        return Promise.reject(err)
                    })
            },
            onCancel() {
        
            },
        })
    }
    render(){
       console.log(this.props.store)
        // debugger
        const { monitoringImg01,monitoringImg02,columns,data,columns2,data2 }=this.state
        return(
           <div>
               <NavHeader currentLoginUser={this.state.currentLoginUser}/>
               <div className="monitoringWrap">
                   <div className="moni-left">
                       <div className="moni-left-top">
                           <div className="moni-left-01">
                               <img src={monitoringImg01} alt=""/>
                           </div>
                           <div className="moni-left-02">
                               <img src={monitoringImg02} alt=""/>
                           </div>
                       </div>
                       <div className="moni-left-bottom">
                           <div className="HUBqueryanalysisPar">
                               <div className="left-con">
                                   <h3>RESULT DETAIL</h3>
                                   <Input className="search" icon="search" placeholder="SEARCH" />
                               </div>
                               <Select size="small" className="select" value={this.state.value}>
                                   {
                                       this.state.options.map(el => {
                                           return <Select.Option key={el.value} label={el.value} value={el.value} />
                                       })
                                   }
                               </Select>
                           </div>
                           <MyTable columns={columns2} data={data2}></MyTable>
                       </div>
                   </div>
                   <div className="moni-right">
                       <h3>DETAIL</h3>
                       <MyTable columns={columns} data={data}></MyTable>
                   </div>
               </div>
           </div>
        )
    }
}
export default withRouter(Monitoring)
