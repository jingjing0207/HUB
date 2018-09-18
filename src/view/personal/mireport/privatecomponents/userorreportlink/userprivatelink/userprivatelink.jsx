import React from 'react'
import {NavLink} from 'react-router-dom'
import './user-private-link.css'

export default function MyPrivateLink(props) {
    return <NavLink {...props} activeClassName='private-user-or-report'/>
}
