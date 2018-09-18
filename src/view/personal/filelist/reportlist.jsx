import React,{Component} from 'react'



import PublicSlider from '../privatecomponents/publicslider/publicslider'
import NavHeader from '../../../component/navlink/navheader'
import MyTable from '../../../component/mytable/mytable'
import SearchInput from '../../../component/search-input/search-input-chang'
import './reportlist.css'
import {GET_INFORMATION,GET_USER_FILE_LIST,SEARCH_FILE_LIST} from "../../../constants/constants";
import {HttpGet} from "../../../server/get";


class AllReportList extends Component{
    state={
        columns: [
            {
                title: "HUB Lib",
                dataIndex: "fromLib",
                key:'fromLib'
            },
            {
                title: "HUB File",
                dataIndex: "fromFile",
                key:'fromFile'
            },
            // {
            //     title: "Oracle Table",
            //     dataIndex: "toLib",
            //     key:'toLib'
            // },
            {
                title: "Oracle Table",
                dataIndex: "toFile",
                key:'toFile'
            },
            // {
            //     title: "Status(Completed/Pending)",
            //     dataIndex: "status",
            //     key:'status'
            // },
            // {
            //     title: "Last Update Date",
            //     dataIndex: "lastUpdateDate",
            //     key:'lastUpdateDate'
            // },
            // {
            //     title: "Last Update Time",
            //     dataIndex: "lastUpdateTime",
            //     key:'lastUpdateTime'
            // },
        ],
        data:[],
        currentLoginUser:'',
        searchFileList:[],
        searchFileListData:[],
    }
    componentDidMount(){
        this.getIsAdminLogin()
        this.getFileListData()
    }
    getIsAdminLogin=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        HttpGet(GET_INFORMATION,token)
            .then((res) => {
                console.log(res)
                this.setState({
                    currentLoginUser:res.data.loginUser.firstName
                })
            })
            .catch((err)=>{
            
            })
    }
    getFileListData=()=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let data=[]
        let searchFileList=[]
        HttpGet(GET_USER_FILE_LIST,token)
            .then((res) => {
                console.log(res)
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        fromLib:res.data[i].fromLib,
                        fromFile:res.data[i].fromFile,
                        toLib:res.data[i].toLib,
                        toFile:res.data[i].toFile,
                        status:res.data[i].status,
                        lastUpdateDate:res.data[i].lastUpdateDate,
                        lastUpdateTime:res.data[i].lastUpdateTime,
                    })
                    searchFileList.push({
                        value:res.data[i].toFile,
                        label:res.data[i].toFile
                    })
                }
                this.setState({data,searchFileList})
            })
            .catch((err)=>{
            
            })
    }
    searchEarchUserConfig=(id)=>{
        let token="Bearer "+sessionStorage.getItem('token')
        let data=[]
        HttpGet(SEARCH_FILE_LIST+id,token)
            .then((res) => {
                console.log('search=fileList=>',res)
                for(let i=0;i<res.data.length;i++){
                    data.push({
                        key:i+1,
                        fromLib:res.data[i].fromLib,
                        fromFile:res.data[i].fromFile,
                        toLib:res.data[i].toLib,
                        toFile:res.data[i].toFile,
                        status:res.data[i].status,
                        lastUpdateDate:res.data[i].lastUpdateDate,
                        lastUpdateTime:res.data[i].lastUpdateTime,
                    })
                }
                this.setState({data})
            })
            .catch((err)=>{
            
            })
    }
    render(){
        const {columns,data,searchFileList}=this.state
        return(
            <div className="info">
                <NavHeader currentLoginUser={this.state.currentLoginUser}></NavHeader>
                <div className="pernalWrap">
                    <PublicSlider></PublicSlider>
                    <div className="informationSlider">
                        <div className="query-con">
                            <SearchInput
                                getTableData={this.getFileListData}
                                states={searchFileList}
                                searchContent={this.searchEarchUserConfig}
                            >
                            </SearchInput>
                        </div>
                        <div className="gropTable user-config reportlistCon">
                            <MyTable columns={columns} data={data} ></MyTable>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AllReportList
