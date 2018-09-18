import React from 'react'
import {NavLink} from 'react-router-dom'
import './private-link.css'

export default function MyPrivateLink(props) {
    return <NavLink {...props} activeClassName='sliderActiveClass'/>
}

