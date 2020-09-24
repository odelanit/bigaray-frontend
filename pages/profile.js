import { Component } from 'react'
import Layout from '../src/layout'
import React from "react";

class Profile extends Component {
    static async getInitialProps({query}) {
        console.log(3, query)
        return {username: query.username}
    }
    render () {
        console.log(this.props)
        return (
            <Layout>
                <div className="container">
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div id="page-body">
                                <div style={{paddingLeft: '20px', paddingRight: '5px', paddingBottom: '5px'}} className="columns is-multiline is-mobile">
                                    <h1>Coming Soon.</h1>
                                    <br/>
                                    <hr/>
                                    <div style={{width: '100%'}}><span className="has-text-weight-bold">{this.props.username}'s</span> profile page.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*eslint-disable*/}
                {/*language=CSS*/}
                <style jsx >{`
                    #page-body {
                        margin-top: 40px;
                    }

                     @media (max-width: 769px) {
                        #page-body {
                            padding-left: 30px;
                            padding-right: 30px;
                        }
                    }

        `}</style>
                {/*eslint-enable*/}
            </Layout>
        )
    }
}

export default Profile