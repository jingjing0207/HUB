import React, { Component } from 'react';
import 'es6-shim'
import './App.css';
import { Provider } from 'react-redux'
import './utils/font-awesome-4.7.0/css/font-awesome.min.css'
import './utils/font_148784_y7rvx0pkve2buik9/iconfont.css'
import SwitchCom from './router/index'
import 'element-theme-default'
import './assets/css/public.css'
import  store from './store/index'


class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <SwitchCom/>
                </div>
            </Provider>
        );
    }
}

export default App;
