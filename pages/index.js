import React, {Component, useEffect} from 'react'
import Link from "next/link";
import {useRouter} from "next/router";
import axios from "axios";
import config from "../config";
import {useStore} from "../src/hooks/currentUser";

const containerStyle = {
    width: '100%',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const buttonStyle = {
    backgroundColor: '#4cdcac',
    color: 'white',
    padding: '10px 40px',
    borderRadius: '10px',
}

const titleStyle = {
    lineHeight: 'unset',
    marginTop: '0',
    marginBottom: '20px',
    fontWeight: '400'
}

const subtitleStyle = {
    textAlign: 'center',
    marginBottom: '100px',
    fontWeight: '400'
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const IndexPage = props =>  {
    const [user, updateUser] = useStore();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            let data
            try {
                data = await axios.get(`${config.domain}/backend/api/me`,{headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token ' + getCookie("token"),
                    }})
            } catch(e) {
                console.log(531,e)
                updateUser(false)
            }
            if (data && data.status === 200) {
                if(props.updateUser) {
                    props.updateUser(data.data.data)
                }
                updateUser(data.data.data);
                await router.push('/new-arrivals');
            } else {
                updateUser(false)

            }
        }
        fetchData()
    }, [])

    return (
        <div style={containerStyle}>
            <div style={{textAlign: 'center'}}>
                <h1 style={titleStyle}>dranbs</h1>
                <h5 style={subtitleStyle}>create diversity</h5>
                <Link href={"/login"}>
                    <a style={buttonStyle}>login / sign up</a>
                </Link>
            </div>
        </div>
    )
}

export default IndexPage
