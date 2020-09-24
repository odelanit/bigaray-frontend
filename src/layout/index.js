import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter, withRouter} from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import Router from 'next/router'
import {useStore, store} from "../hooks/currentUser";
import axios from "axios";
import config from "../../config";
// const showOn = ["/brands", "/"]
const showOnArrow = ["/my-brands"]


const getName = (props) => {
    if(props.router.asPath === "/my-brands") {
        return "my Brands"
    } else if (props.brandName) {
        return props.brandName
    }
}
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}
const Layout = props => {
    const [isOpen, toggleMenu] = useState(false);
    const [user, updateUser] = useStore();
    const router = useRouter();

    useEffect( () => {
        let didCancel = false;

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
            } else {
                updateUser(false)

            }
        }
        fetchData()
        return () => {
            didCancel = true;
        };
    }, []);
    return (
        <div>
            <header id="header" className={`header-left ${isOpen ? 'menu-is-open' : ''}`} style={{zIndex: '9999999 !important'}}>

                <div className="header-inner clearfix">
                    {(showOnArrow.includes(props.router.asPath) || props.router.asPath.includes("/brand/") ) &&
                    <div className="is-hidden-tablet" >
                        <Link href={"/"}><span style={{position: 'absolute', top: '20px', left: '30px'}}><FaArrowLeft size={'1.6em'} color={'#64F0E7'} /></span></Link>
                        <div className="has-text-weight-bold" style={{position: 'absolute', top: '17px', left: '60px'}}>{getName(props)}</div>
                    </div>}
                    {props.router.asPath === "/"  &&
                    <div className="is-hidden-tablet" >
                        <div className="has-text-weight-bold" style={{position: 'absolute', top: '17px', left: '40px'}}>Stylaray</div>
                    </div>}
                    {/* MAIN NAVIGATION */}
                    <div id="menu" className="clearfix">
                        <div className="menu-actions" >

                            <div className="menu-toggle"  style={{overflow: 'inherit'}}>

                                <div className="is-hidden-tablet">
                                <Link href={'/'}>
                                    <a className="is-hidden-mobile" style={{fontSize: '3rem', paddingTop: '5px', fontWeight: 500, color: 'black'}}>{isOpen ? 'Stylaray' : 'S'}</a>
                                </Link>
                                </div>

                                <div className="is-hidden-mobile" style={{paddingBottom: '30px'}}>
                                    <Link href={'/'}>
                                        <a className="is-hidden-mobile" style={{fontSize: '3rem', paddingTop: '5px', fontWeight: 500, color: 'black'}}>{isOpen ? 'Stylaray' : 'S'}</a>
                                    </Link>
                                </div>

                                <div onClick={() => toggleMenu(!isOpen)} className={`container ${isOpen ? 'change' : ''}`}>
                                    <div className="bar1"></div>
                                    <div className="bar2"></div>
                                    <div className="bar3"></div>
                                </div>
                            </div>
                        </div> {/* END .menu-actions */}
                        <div id="menu-inner" style={{visibility: 'visible'}}>
                            <nav id="main-nav">

                                <ul><li style={{paddingRight: '20px'}}>We embrace styles diversity. Follow all your favorite fashion brands in one place.</li></ul>
                                <br/>
                                <ul>
                                    <li><Link href={"/"}><a>Home</a></Link></li>
                                    <li><Link href={"/my-profile"}><a>my Profile</a></Link></li>
                                    <li><Link prefetch href={"/my-brands"}><a>my Brands</a></Link></li>

                                    <li><Link prefetch href={"/contact"}><a>Contact</a></Link></li>
                                    {user ? <li onClick={() => {
                                            var cookies = document.cookie.split(";");

                                            for (var i = 0; i < cookies.length; i++) {
                                                var cookie = cookies[i];
                                                var eqPos = cookie.indexOf("=");
                                                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                                                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                            }
                                            Router.push("/")
                                            window.location.reload()
                                        }}><a>Logout</a></li> :
                                        <li><Link href={"/login"}><a>Login</a></Link></li>

                                    }
                                </ul>
                            </nav>
                        </div>{/* END #menu-inner */}
                    </div>{/* END #menu */}

                    <div id="header-widget" className="custom">
                        {/*<div className="copyright">Copyright by <a href="http://g-nesia.com">G-nesia</a></div>*/}
                    </div>
                </div> {/* END .header-inner */}
                <span className="pseudo-close header-close" />
            </header>
            {props.children}
            {/*eslint-disable*/}
            {/*language=CSS*/}
            <style jsx>{`
              .container {
                  display: inline-block;
                  cursor: pointer;
                  width: 30px;
                }

                .bar1, .bar2, .bar3 {
                  width: 27px;
                  height: 2px;
                  background-color: #333;
                  margin: 6px 0;
                  transition: 0.4s;
                }

                .change .bar1 {
                  -webkit-transform: rotate(-45deg) translate(-9px, 6px);
                  transform: rotate(-45deg) translate(-9px, 6px);
                }

                .change .bar2 {opacity: 0;}

                .change .bar3 {
                  -webkit-transform: rotate(45deg) translate(-8px, -8px);
                  transform: rotate(45deg) translate(-5px, -3px);
                }

            `}</style>
            {/*language=SCSS*/}
            <style jsx global>{`

        @import "node_modules/bulma/sass/utilities/_all.sass";
        @import "node_modules/bulma/sass/grid/_all.sass";
        @import "node_modules/bulma/sass/layout/_all.sass";
        @import "node_modules/bulma/sass/elements/container.sass";
        @import "node_modules/bulma/sass/elements/form.sass";
        @import "node_modules/bulma/sass/base/helpers.sass";
        @import 'node_modules/pretty-checkbox/src/pretty-checkbox.scss';

        //$menu-item-color: lightgrey !important;

        //@import "node_modules/bulma/bulma.sass";

        `}</style>
            {/*eslint-enable*/}
        </div>
    )
}

export default withRouter(Layout)