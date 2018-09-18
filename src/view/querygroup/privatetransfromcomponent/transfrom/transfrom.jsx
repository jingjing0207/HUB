import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import { IndexRoute } from 'react-router'
import { Transfer } from 'antd'
import propTypes from 'prop-types'
// import '../../../../utils/js/TweenMax.min'
// import '../../../../utils/js/draggable'
import Sortable from 'sortablejs/Sortable.js'
import './transfrom.css'


class Transfrom extends Component{
    state = {
        mockData: [],
        targetKeys: [],
        havenChose:'',
        selectedKeys: []
    }
    static propTypes={
        headertitle:propTypes.array.isRequired,
        currentQueryIds:propTypes.array.isRequired,
        allQueries:propTypes.array.isRequired
    }
    componentDidMount(){
        document.getElementsByClassName('ant-transfer-list-content')[1].id="onlyContent"
        Sortable.create(document.getElementById('onlyContent'), {
            draggable:'.is-visible',
            animation: 150,
            onStart:function(evt){ //开始拖拽出发该函数
                console.log('onStart.foo:', [evt.item, evt.from]);
                // for(var i=0, len=evt.from.children.length; i<len; i++){
                //     evt.from.children[i].setAttribute('drag-id',i)
                // }
            },
            onEnd:(evt)=> {
                console.log(evt.item);
                // var id_arr=''
                // console.log(evt.from.children)
                // for(var i=0, len=evt.from.children.length; i<len; i++){
                //     id_arr+=','+ evt.from.children[i].getAttribute('drag-id');
                // }
                // id_arr=id_arr.substr(1);
                // //然后请求后台ajax 这样就完成了拖拽排序
                // console.log(id_arr);
            }
        })
    }
    componentWillReceiveProps (nextProps){
        (nextProps.allQueries !== this.props.allQueries || nextProps.currentQueryIds !== this.props.currentQueryIds) && this.setState({
            allQueries:nextProps.allQueries,
            currentQueryIds:nextProps.currentQueryIds
        },() => {
            console.log(nextProps)
            let currentQueryId=[]
            if(nextProps.currentQueryIds!==''){
                console.log(nextProps.currentQueryIds)
                for(let j=0;j<nextProps.currentQueryIds.length;j++){
                    currentQueryId.push(nextProps.currentQueryIds[j].queryId)
                }
            }else{
                currentQueryId=[]
            }
            this.setState({
                targetKeys:currentQueryId
            })
            const mockData = [];
            for (let i = 0; i < nextProps.allQueries.length; i++) {
                const data = {
                    key: nextProps.allQueries[i].queryId,
                    title:nextProps.allQueries[i].queryName,
                    description: nextProps.allQueries[i].queryDescription,
                    disabled:nextProps.allQueries[i].selected===true && currentQueryId.includes(nextProps.allQueries[i].queryId)===false
                };
                mockData.push(data);
            }
            this.setState({ mockData });
            
            sessionStorage.setItem('tartgetData',currentQueryId)
        })
    }
    
   
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        console.log('02130987435')
        this.setState({ targetKeys:nextTargetKeys });
        nextTargetKeys === '' ? '' : nextTargetKeys
        if(this.props.isShowEdit===false){
            sessionStorage.setItem('tartgetData',nextTargetKeys)
        }
        
    }
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    }
    renderItem = (item) => {
        const customLabel = (
                <span className="custom-item">
                    {item.title} - {item.description}
                </span>
        );
        return {
            label: customLabel, // for displayed item
            value: item.title, // for title and filter matching
        };
    }
    filterOption = (inputValue, option) => {
        return option.title.toLowerCase().indexOf(inputValue) > -1;
    }
    //option.props.children.toLowerCase().indexOf(input.toLowerCase())
    render(){
        const { mockData,targetKeys,selectedKeys }=this.state
        const { headertitle }=this.props
        return(
            <div className="transfrom-wrap queryTransfrom">
                <Transfer
                    dataSource={mockData}
                    showSearch
                    listStyle={{
                        width: 280,
                        height: 470,
                    }}
                    searchPlaceholder='Search'
                    titles={headertitle}
                    targetKeys={targetKeys}
                    selectedKeys={selectedKeys}
                    filterOption={this.filterOption}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    render={this.renderItem}
                />
            </div>
        )
    }
}
export default withRouter(Transfrom)
