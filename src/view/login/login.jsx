import React,{Component} from 'react'
import { Form, Icon, Input, Button,Radio,message,Spin } from 'antd';
// import { connect } from 'react-redux'
import {withRouter} from 'react-router'
import './login.css'
import logoImg from './../../utils/image/logo.png'
import { HttpPost } from '../../server/post'
import {LOGIN} from '../../constants/constants'
import WebContainer from '../../container/index'


const FormItem = Form.Item;
const createForm = Form.create;

class Login  extends Component{
    state={
        logoImg:logoImg,
        username:'',
        password:'',
        selectUserRadio:[{value:1,label:"ADMIN"},{value:2,label:"USER"}],
        isError:false,
        loading:false,
        loginLoading:false
    }
    componentWillMount(){
        sessionStorage.clear();
    }
    alertmessage =(type,message)=>{
        message[type](message);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.submitLogin(values)
            }
        });
    }
    submitLogin=(submitvalue)=>{
        this.setState({loading: true,loginLoading:true})
        let loginData={
            username:submitvalue.username,
            password:submitvalue.password
        }
        HttpPost(LOGIN,loginData,'')
            .then((res) => {
                console.log(res)
                if(res.status===200){
                    sessionStorage.setItem('token',res.data.access_token)
                    setTimeout(()=>{
                        this.props.history.push('/downloadreport')
                    },2000)
                    // this.setState({loading: false})
                }
            })
            .catch((err)=>{
                this.setState({loading:false})
                console.log(err.response)
                if (err && err.response) {
                    switch (err.response.data.message) {
                        case 'User is disabled':
                            message.error('User is disabled')
                            break;
                        case 'Bad credentials':
                            message.error('Login failure: unknown user name or bad password!')
                            break;
                        default:
                    }
                }
                return Promise.reject(err)
            })
    }
    onUserChange=(e)=>{
        console.log(`radio checked:${e.target.value}`)
    }
    render(){
        const { logoImg,username,password }=this.state
        const { getFieldDecorator } = this.props.form;
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
        return(
            <div className="login-bg">
                {/*<Spin spinning={this.state.loginLoading}>*/}
                    <div className="login-con">
                        <div className="login-con-top">
                            <img src={logoImg} alt=""/>
                        </div>
                        <div className="login-con-center">
                            <span>L O G I N</span>
                        </div>
                        <div className="login-con-bot">
                            <Form className="login-form">
                                <FormItem>
                                    {getFieldDecorator('username', {
                                        initialValue:username,
                                        rules: [{
                                            required: true,
                                            message: 'Please input your username!'
                                        }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                                    )}
                                </FormItem>
                                <FormItem className="password">
                                    {getFieldDecorator('password', {
                                        initialValue:password,
                                        rules: [{
                                            required: true,
                                            message: 'Please input your Password!'
                                        }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                    )}
                                </FormItem>
                                {
                                    this.state.isError===true ?
                                        <label className="errorLabel">Login failure: unknown user name or bad password!</label> : ''
                        
                                }
                    
                                <FormItem className="login-Btn">
                                    <Button loading={this.state.loading} onClick={this.handleSubmit} type="primary" htmlType="submit" className="login-form-button loginBtn">
                                        SIGN IN
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                {/*</Spin>*/}
            </div>
        )
    }
}
export default withRouter(createForm()(Login))

// const LoginView =withRouter(createForm()(Login))
//
// export default class LoginWrapper extends Component {
//     render(){
//         return <WebContainer component={LoginView} />
//     }
// }
