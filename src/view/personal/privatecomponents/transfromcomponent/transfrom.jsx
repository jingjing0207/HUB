import React,{Component} from 'react'
import {Transfer} from 'antd'
import propTypes from 'prop-types'

import './transfrom.css'


class Transfrom extends Component{
    constructor(props){
        super(props)
        this.state={
            selectedKeys:[],
            mockData:[],
            targetKeys:[]
        }
    }
    static propTypes={
        // userList:propTypes.array.isRequired
    }
    componentWillReceiveProps (nextProps){
        (nextProps.userList !== this.props.userList) && this.setState({
            userList:nextProps.userList,
        },() => {
            console.log(nextProps)
            // const mockData = [];
            // for (let i = 0; i < nextProps.userList.length; i++) {
            //     const data = {
            //         key: nextProps.userList[i].id,
            //         title:nextProps.userList[i].groupname,
            //     };
            //     mockData.push(data);
            // }
            // this.setState({ mockData });
        })
    }
    shouldComponentUpdate(nextProps, nextState){
        return true;
    }
    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });
        
        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
    }
    
    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
        
        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    }
    
    handleScroll = (direction, e) => {
        console.log('direction:', direction);
        console.log('target:', e.target);
    }
    
    get style() {
        return {
            marginLeft: '20px',
            padding: '6px 5px'
        }
    }
    render(){
        const state = this.state;
        const { headerTitle }=this.props
        return(
            <div className="transfrom-wrap">
                <Transfer
                    listStyle={{
                        width: 250,
                        height: 350,
                    }}
                    dataSource={state.mockData}
                    titles={headerTitle}
                    targetKeys={state.targetKeys}
                    selectedKeys={state.selectedKeys}
                    onChange={this.handleChange}
                    onSelectChange={this.handleSelectChange}
                    onScroll={this.handleScroll}
                    render={item => item.title}
                />
            </div>
        )
    }
}
export default Transfrom
