import React,{Component} from 'react'
import {Switch,HashRouter as Router,Route} from 'react-router-dom'
// import { Provider } from 'react-redux'
// import store from '../reduxmodules/store/index'

import Monitoring from '../view/monitoring/monitoring'
import QueryGroup from '../view/querygroup/querygroup'
import DownloadReport from '../view/downloadreport/downloadreport'
import QueryInventory from '../view/queryinventory/queryinventory'
import Information from '../view/personal/information/information'
import UserConfiguration from '../view/personal/userconfiguration/userconfiguration'
import UserGroupConfiguration from '../view/personal/usergroupconfiguration/usergroupconfiguration'
import Login from '../view/login/login'
import UserList from '../view/personal/mireport/userlist/userlist'
import ReportList from '../view/personal/mireport/reportlist/reportlist'
import ReportAction from '../view/personal/mireport/reportaction/report-action'
import UserOrReportLink from '../view/personal/mireport/privatecomponents/userorreportlink/userorreportlink'
import AllReportList from "../view/personal/filelist/reportlist";
import ActivityLog from '../view/personal/activity-log/activity-log'
// import Logincomponent from '../component/input/second-input'
import Migration from '../view/personal/migration/migration'


export default class MyIndex  extends Component{
    render(){
        return(
                <Router>
                    <Switch>
                        <Route exact path="/" component={Login}/>
                        <Route path='/monitoring' component={Monitoring} />
                        <Route path='/querygroup' component={QueryGroup} />
                        <Route path='/downloadreport' component={DownloadReport} />
                        <Route path='/queryinventory' component={QueryInventory} />
                        <Route path='/information' component={Information} />
                        <Route path='/userconfiguration' component={UserConfiguration} />
                        <Route path='/usergroupconfiguration' component={UserGroupConfiguration} />
                        <Route path='/mireport' component={UserOrReportLink} />
                        <Route path='/userlist' component={UserList} />
                        <Route path='/reportlist' component={ReportList} />
                        <Route path='/reportaction' component={ReportAction} />
                        <Route path='/allreportlist' component={AllReportList} />
                        <Route path='/activity' component={ActivityLog} />
                        <Route path='/migration' component={Migration} />
                    </Switch>
                </Router>
        )
    }
}
