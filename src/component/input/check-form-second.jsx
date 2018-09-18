import React,{Component} from 'react'
import { Form,Input,message } from 'antd'
import propTypes from 'prop-types'


import './input.css'
const createForm = Form.create;
const FormItem = Form.Item;


function noop() {
    return false;
}
class CheckFormSecond  extends Component{
    state={
        maxlength:380,
        horizontal:'true',
        phoneNumber:'',
        initPassword:'',
        initialremember:'checked'
    }
    static propTypes={
        value:propTypes.string.isRequired,
        addGroupData:propTypes.func.isRequired,
        Rule:propTypes.func.isRequired
    }
    handleReset=(e)=> {
        e.preventDefault();
        this.props.form.resetFields();
    }
    alertmessage= (type,message)=>{
        message[type](message);
    }
    phoneNumberTest=(rule, value, callback)=> {
        this.props.addGroupData(value)
        this.props.Rule(rule, value, callback)
    }
    render(){
        const { getFieldError, isFieldValidating, getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };
        const { maxlength } =this.state
        return(
            <div className="inputPar">
                <div className="leftPar1"> </div>
                <div className="rightPar1">
                    <span className="spanLabel">{this.props.groupcode.spanlabel}</span>
                    <Form horizontal={this.state.horizontal} form={this.props.form}>
                        <FormItem
                            {...formItemLayout}
                            hasFeedback
                            wrapperCol={{span: 20, offset: 2}}
                            help={isFieldValidating(this.props.propsLabel) ? '校验中...' : (getFieldError(this.props.propsLabel) || []).join(', ')}
                        >
                            {
                                getFieldDecorator(this.props.propsLabel,{
                                    initialValue:this.props.value,
                                    rules: [
                                        {max:5},
                                        {validator: this.phoneNumberTest},
                                    ]
                                })(
                                    <span>
                                        <Input className="selectCon"
                                               value={this.props.value}
                                               maxLength={maxlength}
                                               placeholder={this.props.groupcode.select}
                                               onBlur={this.handleBlur}
                                        >
                                        </Input>
                                    </span>
                                )
                            }
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}
export default  (createForm()(CheckFormSecond))
