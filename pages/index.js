import { Component } from 'react'
import { connect } from 'react-redux'
import AppWrapper from './AppWrapper'
import { serverRender } from './store'

class Index extends Component {
  static getInitialProps ({ reduxStore, req }) {
    const isServer = !!req
    if(isServer && req.hasOwnProperty("query") ) 
      reduxStore.dispatch(serverRender(isServer,req.query.group_id,req.query.viewer_id))
    return {}
  }
  render () {
    return <AppWrapper />
  }
}

export default connect()(Index)