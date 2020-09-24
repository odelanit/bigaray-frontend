import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import * as gtag from '../src/helpers/gtag'
Router.events.on('routeChangeComplete', url => gtag.pageview(url))

class MyApp extends App {
    state = {loaded: false}
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    toggleLoaded = (neww) => {
        this.setState({loaded: neww})
    }



    render () {
        const { Component, pageProps } = this.props

        return (
            <Container>
                <Component {...pageProps} toggleLoaded={this.toggleLoaded} loaded={this.state.loaded} />
            </Container>
        )
    }
}

export default MyApp