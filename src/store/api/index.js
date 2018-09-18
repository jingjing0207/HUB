// const DEVBASEURL = 'http://192.168.88.168:8080'
// const ONLINEBASEURL = 'http://cnl20044511.cn.hsbc:8080'
const ONLINEBASEURL = 'http://192.168.88.168:8080'

const LOGIN = `${ONLINEBASEURL}/auth/login`
const LOGIN_OUT = `${ONLINEBASEURL}/auth/logout`
const SEARCH_ALL_QUERY = `${ONLINEBASEURL}/api/all/query`
const SEARCH_ALL_GROUP = `${ONLINEBASEURL}/api/groups`
const ADD_GUERY = `${ONLINEBASEURL}/api/add/query`
const GET_EACH_GUERY = `${ONLINEBASEURL}/api/getquery?queryId=`
const GET_ALL_GROUP = `${ONLINEBASEURL}/api/groups`
const UPDATA_QUERY = `${ONLINEBASEURL}/api/update/query`
const DELETE_QUERY = `${ONLINEBASEURL}/api/delete/query`
const GET_EARCH_QUERY = `${ONLINEBASEURL}/api/getquery?queryId=`
const GET_EARCH_QROUP = `${ONLINEBASEURL}/api/group?groupId=`
const ADD_NEW_GROUP = `${ONLINEBASEURL}/api/group`
const UPDATA_GROUP = `${ONLINEBASEURL}/api/update/group`
const DELETE_GROUP = `${ONLINEBASEURL}/api/delete/group`
const GET_REPORT = `${ONLINEBASEURL}/api/report`
const DOWNLOAD = `${ONLINEBASEURL}/api/download?fileURL=`
const RUN_QUERY = `${ONLINEBASEURL}/api/query/getexcel?queryName=`
const VIEW_REPORT = `${ONLINEBASEURL}/api/preview?id=`
const RUN_GROUP = `${ONLINEBASEURL}/api/group/run?groupId=`
const GET_INFORMATION = `${ONLINEBASEURL}/api/whoami`
const GET_ALL_USER = `${ONLINEBASEURL}/api/backup/page?userId=`
const ADD_NEW_USER = `${ONLINEBASEURL}/api/backup`
const DELETE_USER_DEMAND = `${ONLINEBASEURL}/api/backup/delete?id=`
const SELECT_USER_GROUP = `${ONLINEBASEURL}/api/user/page`
const ADD_USER_GROUP = `${ONLINEBASEURL}/api/user`
const GET_ALL_USER_CONFIG = `${ONLINEBASEURL}/api/user/all`
const GET_ALL_GROUP_USER = `${ONLINEBASEURL}/api/user/group/`
const ADD_NEW_USER_GROUP = `${ONLINEBASEURL}/api/user/group`
const DELETE_USER_CONFIG = `${ONLINEBASEURL}/api/user/delete?id=`
const GET_ALL_USER_GROUP = `${ONLINEBASEURL}/api/user/group/all`
const DELETE_USER_GROUP = `${ONLINEBASEURL}/api/user/group/delete?groupId=`
const QUERY_RUN_STATUS = `${ONLINEBASEURL}/api/query/state`
const GET_ALL_USER_GROUP_GUERY = `${ONLINEBASEURL}/api/query/toaddorupdata/page`

const GET_USER_LIST = `${ONLINEBASEURL}/api/mireport/userlist`
const GET_ONCE_USER_LIST = `${ONLINEBASEURL}/api/mireport/userlistdetail?userId=`
const GET_REPORT_LIST = `${ONLINEBASEURL}/api/mireport/reportlist`
const GET_ONCE_REPORT_LIST = `${ONLINEBASEURL}/api/mireport/reportlistdetail?reportId=`
const GET_ACTIVITY_LOG = `${ONLINEBASEURL}/api/activitylog`
const REPORT_ACTION = `${ONLINEBASEURL}/api/mireport/reportaction`
const IMPORT_QUERY = `${ONLINEBASEURL}/api/import/query`
const IMPORT_GROUP = `${ONLINEBASEURL}/api/import/querygroup`
const IMPORT_USERDATA = `${ONLINEBASEURL}/api/import/userdata`
const GET_EARCH_MI_REPORT_USER_LIST = `${ONLINEBASEURL}/api/mireport/userlist?userId=`
const GET_EARCH_MI_REPORT_REPORT_LIST = `${ONLINEBASEURL}/api/mireport/reportlist?reportId=`
const GET_EARCH_MI_REPORT_REPORT_ACTION_LIST = `${ONLINEBASEURL}/api/mireport/reportaction?userName=`
const SEARCH_EARCH_ACTIVITY_LOG = `${ONLINEBASEURL}/api/activitylog?userName=`
const GET_USER_FILE_LIST = `${ONLINEBASEURL}/api/user/filelist`



const CHECK_GROUP_NAME_IS_EXST = `${ONLINEBASEURL}/api/user/group/getname?groupName=`
const CHECK_USER_NAME_IS_EXST = `${ONLINEBASEURL}/api/user/getname?userName=`
const CHECK_QUERY_NAME_IS_EXST = `${ONLINEBASEURL}/api/query/getname?queryName=`
const CHECK_USER_GROUP_NAME_IS_EXST = `${ONLINEBASEURL}/api/user/group/getname?groupName=`

///user/group/getname?groupName=


module.exports = {
    LOGIN:LOGIN,
    LOGIN_OUT:LOGIN_OUT,
    IMPORT_QUERY:IMPORT_QUERY,
    IMPORT_GROUP:IMPORT_GROUP,
    IMPORT_USERDATA:IMPORT_USERDATA,
    SEARCH_ALL_QUERY: SEARCH_ALL_QUERY,
    SEARCH_ALL_GROUP:SEARCH_ALL_GROUP,
    ADD_GUERY:ADD_GUERY,
    GET_EACH_GUERY:GET_EACH_GUERY,
    GET_ALL_GROUP:GET_ALL_GROUP,
    UPDATA_QUERY:UPDATA_QUERY,
    DELETE_QUERY:DELETE_QUERY,
    GET_EARCH_QUERY:GET_EARCH_QUERY,
    GET_EARCH_QROUP:GET_EARCH_QROUP,
    ADD_NEW_GROUP:ADD_NEW_GROUP,
    UPDATA_GROUP:UPDATA_GROUP,
    DELETE_GROUP:DELETE_GROUP,
    GET_REPORT:GET_REPORT,
    DOWNLOAD:DOWNLOAD,
    RUN_QUERY:RUN_QUERY,
    VIEW_REPORT:VIEW_REPORT,
    RUN_GROUP:RUN_GROUP,
    GET_INFORMATION:GET_INFORMATION,
    GET_ALL_USER:GET_ALL_USER,
    ADD_NEW_USER:ADD_NEW_USER,
    DELETE_USER_DEMAND:DELETE_USER_DEMAND,
    SELECT_USER_GROUP:SELECT_USER_GROUP,
    ADD_USER_GROUP:ADD_USER_GROUP,
    GET_ALL_USER_CONFIG:GET_ALL_USER_CONFIG,
    GET_ALL_GROUP_USER:GET_ALL_GROUP_USER,
    ADD_NEW_USER_GROUP:ADD_NEW_USER_GROUP,
    GET_ALL_USER_GROUP:GET_ALL_USER_GROUP,
    DELETE_USER_CONFIG:DELETE_USER_CONFIG,
    DELETE_USER_GROUP:DELETE_USER_GROUP,
    QUERY_RUN_STATUS:QUERY_RUN_STATUS,
    GET_ALL_USER_GROUP_GUERY:GET_ALL_USER_GROUP_GUERY,
    GET_USER_LIST:GET_USER_LIST,
    GET_ONCE_USER_LIST:GET_ONCE_USER_LIST,
    GET_REPORT_LIST:GET_REPORT_LIST,
    GET_ONCE_REPORT_LIST:GET_ONCE_REPORT_LIST,
    GET_ACTIVITY_LOG:GET_ACTIVITY_LOG,
    REPORT_ACTION:REPORT_ACTION,
    GET_EARCH_MI_REPORT_USER_LIST:GET_EARCH_MI_REPORT_USER_LIST,
    GET_EARCH_MI_REPORT_REPORT_LIST:GET_EARCH_MI_REPORT_REPORT_LIST,
    GET_EARCH_MI_REPORT_REPORT_ACTION_LIST:GET_EARCH_MI_REPORT_REPORT_ACTION_LIST,
    SEARCH_EARCH_ACTIVITY_LOG:SEARCH_EARCH_ACTIVITY_LOG,
    GET_USER_FILE_LIST:GET_USER_FILE_LIST,
    CHECK_QUERY_NAME_IS_EXST:CHECK_QUERY_NAME_IS_EXST
}