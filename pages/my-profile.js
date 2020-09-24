import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Layout from '../src/layout'
import React from "react";
import config from '../config/index'
import { Radio } from 'pretty-checkbox-react';
const countriesNames = require('countries-names');
import Select from 'react-select';
const countries = countriesNames.all().map(x => ({value: x.name, label: x.name}))
import { withAuthSync } from '../utils/auth'
import axios from "axios";
import nextCookie from "next-cookies";


class MyProfile extends Component {
    static async getInitialProps(ctx) {
        const req = ctx.req
        const { token } = nextCookie(ctx)
        const isServer = !!req;
        let data
        try {
            if (isServer) {
                data = await axios.get(`${config.domain}/backend/api/me`, {headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token ' + token,
                    }})

            } else {
                data = await axios.get(`${config.domain}/backend/api/me`,{headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token ' + token,
                    }})
            }

        } catch(e) {
            console.log(e)
        }

        if(data && data.data && data.data.data) {
            return { data: data.data.data }
        }
        return {data: null}

    }
    constructor (props) {
        super(props)
        this.state = {
            // loginUsername: '',
            // loginPassword: '',
            registerFirstName: '',
            registerLastName: '',
            registerGender: '1',
            registerBirthdayMM: '',
            registerBirthdayDD: '',
            registerBirthdayYYYY: '',
            registerCountry: '',
            registerEmail: '',
            // registerUsername: '',
            password: '',
            passwordAgain: '',
            error: '',
            message: ''
        }
        // this.handleChange = this.handleChange.bind(this)
        this.register = this.register.bind(this)
    }
    componentDidMount() {
        console.log(6, this.props)
        const [year, month, day] = this.props.data.birthday ? this.props.data.birthday.split("-") : ["","",""]
        let gender
        switch (this.props.data.gender) {
            case 1:
                gender = "1"
                break
            case 2:
                gender = "2"
                break
            default:
                gender = "1"
        }
        this.setState({
            registerFirstName: this.props.data.first_name,
            registerLastName: this.props.data.last_name,
            registerGender: gender,
            registerCountry: {label: this.props.data.country, value: this.props.data.country},
            registerEmail: this.props.data.email,
            registerUsername: this.props.data.username,
            registerBirthdayMM: month,
            registerBirthdayDD: day,
            registerBirthdayYYYY: year,
        })
    }




    async register (event) {
        event && event.preventDefault()
        this.setState({ error: '' })


        try {
            const response = await fetch(`${config.domain}/backend/api/users/${this.props.data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: {
                        first_name: this.state.registerFirstName,
                        last_name: this.state.registerLastName,
                        gender: parseInt(this.state.registerGender),
                        birthday: `${this.state.registerBirthdayYYYY}-${this.state.registerBirthdayMM}-${this.state.registerBirthdayDD}`,
                        country: this.state.registerCountry.value,
                        email: this.state.registerEmail,
                        username: this.state.registerUsername,
                        password: this.state.password,
                        password_confirm: this.state.passwordAgain
                    }
                })
            })
            if (response.ok) {
                this.setState({message: "Success !"})
            } else {
                console.log('Update failed.')
                // https://github.com/developit/unfetch#caveats
                let error = new Error(response.statusText)
                error.response = response
                throw error
            }
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            )
            this.setState({ error: error.message })
        }
    }

    render () {
        // const disable = !!this.validator()
        // console.log(55, disable)
        console.log(3, this.state)
        return (
            <Layout>
                <div className="container">
                    <div id="page-content">
                        <div id="hero-and-body">
                            <div id="page-body">
                                <div style={{marginLeft: '30px', paddingRight: '60px'}} className="columns is-multiline is-mobile">
                                    <div className="column is-5-desktop is-12-touch is-paddingless is-marginless">
                                        <form className="form" onSubmit={this.register}>
                                            <div className="columns is-multiline is-mobile">
                                                <div className="column is-12 is-marginless">
                                                    <label>Username</label>
                                                    <input
                                                        disabled
                                                        type="text"
                                                        className="input"
                                                        value={this.state.registerUsername}
                                                        onChange={e => this.setState({registerUsername: e.target.value})}
                                                    />
                                                </div>
                                                <div className="column is-12 is-marginless">
                                                    <label>First Name</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={this.state.registerFirstName}
                                                        placeholder={"First Name"}
                                                        onChange={e => this.setState({registerFirstName: e.target.value})}
                                                    />
                                                </div>
                                                <div    style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <label>Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={this.state.registerLastName}
                                                        placeholder={"Last Name"}
                                                        onChange={e => this.setState({registerLastName: e.target.value})}
                                                    />
                                                </div>
                                                <div style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <label>Gender</label>
                                                    <>
                                                        <Radio onChange={e => this.setState({registerGender: "1"})} checked={this.state.registerGender === "1"} name="1">Women</Radio>
                                                        <Radio onChange={e => this.setState({registerGender: "2"})} checked={this.state.registerGender === "2"} name="2">Men</Radio>
                                                    </>
                                                </div>
                                                <div    style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <label>Birthday</label>
                                                    <div className="columns">
                                                        <div className="column">
                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={this.state.registerBirthdayMM}
                                                                placeholder={"MM"}
                                                                onChange={e => this.setState({registerBirthdayMM: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="column">

                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={this.state.registerBirthdayDD}
                                                                placeholder={"DD"}
                                                                onChange={e => this.setState({registerBirthdayDD: e.target.value})}
                                                            />
                                                        </div>
                                                        <div className="column">

                                                            <input
                                                                type="text"
                                                                className="input"
                                                                value={this.state.registerBirthdayYYYY}
                                                                placeholder={"YYYY"}
                                                                onChange={e => this.setState({registerBirthdayYYYY: e.target.value})}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div    style={{paddingTop: '0px', paddingRight: '0px'}} className="column is-12  is-marginless is-gapless">
                                                    <label>Country</label>
                                                    <Select
                                                        // style={{width: '100%'}}
                                                        value={this.state.registerCountry}
                                                        onChange={e => this.setState({registerCountry: e})}
                                                        options={countries}
                                                    />
                                                </div>
                                                <div    style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <label>Email</label>
                                                    <input
                                                        type="email"
                                                        className="input"
                                                        value={this.state.registerEmail}
                                                        placeholder={"Email"}
                                                        onChange={e => this.setState({registerEmail: e.target.value})}
                                                    />
                                                </div>

                                                <br/>
                                                <br/>
                                                <br/>

                                                <div    style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <label>Leave empty unless you want to change it</label>
                                                    <input
                                                        type="password"
                                                        className="input"
                                                        value={this.state.password}
                                                        placeholder={"New Password"}
                                                        onChange={e => this.setState({password: e.target.value})}
                                                    />
                                                </div>

                                                <div    style={{paddingTop: '0px'}} className="column is-12  is-marginless">
                                                    <input
                                                        type="password"
                                                        className="input"
                                                        value={this.state.passwordAgain}
                                                        placeholder={"New Password Again"}
                                                        onChange={e => this.setState({passwordAgain: e.target.value})}
                                                    />
                                                </div>

                                                <div className="column is-12">
                                                    <button
                                                        onClick={() => this.register()}
                                                        className="button" type='submit'>Update</button>
                                                </div>
                                                <div className="column is-12">
                                                    <p className={`error ${this.state.error && 'show'}`}>
                                                        {this.state.error && `Error: ${this.state.error}`}
                                                    </p>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
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

export default withAuthSync(MyProfile)