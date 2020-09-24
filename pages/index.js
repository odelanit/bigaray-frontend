import React, {Component} from 'react'
import Link from "next/link";

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

class IndexPage extends Component {
    render() {
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
}

export default IndexPage
