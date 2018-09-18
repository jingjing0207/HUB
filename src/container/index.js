import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as actions from '../store/actions'

const mapStateToProps = (state, ownProps) => {
    return state
}

const mapDispatchToProps = (dispatch, ownProps) => {
    let injectedActions = ownProps.injectedActions
    return {
        ...bindActionCreators({
            ...actions,
            ...injectedActions,
        }, dispatch)
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})

class WebContainer extends Component {
    constructor(props) {
        super(props)
        this.Connected = connector(props.component)
    }
    
    render() {
        const {component, ...otherProps} = this.props
        return <this.Connected {...otherProps} />
    }
}

export default WebContainer
