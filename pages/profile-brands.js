import React, {Component} from 'react'
import axios from 'axios'
import config from '../config/index'
import Link from 'next/link'
import {shuffle} from "../src/helpers";
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';
const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Layout from '../src/layout'

export default class ProfileBrands extends Component {
    state = {data: [], hasMore: true, width: '300px'}
    static async getInitialProps({req, query}) {
        const isServer = !!req;
        let data = []
        try {
            if (isServer) {
                data = await axios.get(`${config.domain}/backend/api/by-users-brands/${query.username}?page=0`)

            } else {
                data = await axios.get(`/backend/api/by-users-brands/${query.username}?page=0`)
            }

        } catch(e) {
            console.log(e)
        }
        data = shuffle(data.data.data)
        let dataLeft = []

        return { data, dataLeft }
    }



    componentDidMount(){
        this.loadMoreImages()
        this.handleResize()
        window.addEventListener('resize', this.handleResize);
        const event = new Event('load');
        window.dispatchEvent(event)
        this.props.toggleLoaded(true)
    }

    loadMoreImages = () => {
        this.setState({data: this.state.data.concat(this.props.data.slice(this.state.data.length, this.state.data.length + 20))})
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.toggleLoaded(false)
    }


    handleResize = () => {
        const parentWidth = document.querySelector(".wrapper").getBoundingClientRect().width
        const browserWidth =  Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
        console.log(`Size: ${parentWidth}px`)
        console.log(`Browser Width: ${browserWidth}px`)
        let width
        if (browserWidth <= 768){
            width = parentWidth
        }
        else if (browserWidth <= 1024){
            width = (parentWidth ) / 2
        } else {
            width = (parentWidth - 60 ) / 4
        }

        this.setState({width})
    }

    repackItems = () => {
        const bricksInstance = this.instance.getBricksInstance();
        bricksInstance.pack()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
    }




    render() {
        const data = this.state.data.length >= 1 ? this.state.data : this.props.data.slice(0,20)
        return(
            <Layout>
                <div>
                    {/* PAGE LOADER */}
                    {!this.props.loaded && <div id="page-loader" className="show-logo">
                        <span className="loader-icon bullets-jump"><span /><span /><span /></span>
                    </div>}
                    {/* PAGE LOADER */}
                    {/* PAGE CONTENT */}
                    <div id="page-content">
                        {/* HERO & BODY */}
                        <div id="hero-and-body">
                            {/* PAGEBODY */}
                            <section id="page-body">
                                <div className="spacer-small" />
                                <div className="wrapper">
                                    <div>New Arrivals</div>
                                    {/*<div>*/}
                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[ { columns: 1, gutter: 20 }, { mq: '769px', columns: 2, gutter: 20 }, { mq: '1025px', columns: 4, gutter: 20 } ]}
                                        infiniteScroll={() => {this.loadMoreImages()}}
                                        infiniteScrollDistance={400}
                                    >





                                        {this.state.data.map((product, i) => {
                                            // let height = i % 2 === 0 ? 200 : 100;
                                            return (
                                                <div
                                                    className="blog-media"
                                                    key={i}
                                                    style={{
                                                        width: this.state.width,
                                                        // height: `${height}px`,
                                                        // lineHeight: `${height}px`,
                                                        // color: 'white',
                                                        // fontSize: '32px',
                                                        // display: 'block',
                                                        // background: 'rgba(0,0,0,0.7)'
                                                    }}>
                                                    <a href={product.product_link} target={"_blank"} className="thumb-hover scale">
                                                        <img
                                                            onLoad={() => this.debounce()}
                                                            style={{objectFit: 'contain', width: '100%'}}
                                                            src={`${config.image_domain}/images/${product.image_filename}`}
                                                        />
                                                    </a>
                                                    <div className="blog-info">
                                                        <div className="post-meta clearfix">
                                                                <span className="post-cat">
                                                                    <Link prefetch href={`brand?name=${product.name}`} as={`brand/${product.name}`}>
                                                                    <a>{product.display_name}</a>
                                                                    </Link>
                                                                </span>
                                                        </div>
                                                        <h4 className="post-name" style={{marginTop: '0px'}}>
                                                            <a href={product.product_link} target={"_blank"}>{product.title}</a>
                                                        </h4>
                                                        {product.sale_price ? <div>
                                                                <span className="post-pricebar">{product.price}</span>
                                                                <span className="post-pricesale">{product.sale_price}</span>
                                                            </div> :
                                                            <span className="post-price">{product.price}</span>
                                                        }
                                                    </div>
                                                </div>
                                            )}
                                        )}

                                    </MasonryLayout>
                                    {/*</div>*/}
                                </div> {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>

                {/*eslint-disable */}
                {/* language=SCSS */}
                {/*<style jsx global>{`*/}
                {/*@import "node_modules/bulma/sass/utilities/initial-variables";*/}
                {/*@import "node_modules/bulma/sass/utilities/functions";*/}
                {/*//$menu-item-color: lightgrey !important;*/}

                {/*@import "node_modules/bulma/bulma.sass";*/}

                {/*`}</style>*/}
                {/* eslint-enable */}
            </Layout>

        )
    }
}
