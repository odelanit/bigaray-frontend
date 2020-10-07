import React, {Component} from 'react'
import axios from 'axios'
import Switch from 'react-switch';
import config from '../config/index'
import Link from 'next/link'
import {shuffle} from "../src/helpers";
import MasonryLayout from 'react-masonry-layout'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const repackDebounced = AwesomeDebouncePromise(() => (true), 50);
import Layout from '../src/layout'
import nextCookie from "next-cookies";
import Sticky from 'react-stickynode';
import Router from "next/dist/client/router";
import {withAuthSync} from "../utils/auth";
import cookie from "js-cookie";

class Homepage extends Component {
    state = {
        originalData: [],
        dataLeft: [],
        sites: [],
        data: [],
        hasMore: true,
        width: '300px',
        filterBy: 1,
        stickyNav: true,
        fullyMounted: false,
        exploreAll: false
    }

    static async getInitialProps(ctx) {
        const {token} = nextCookie(ctx)
        return {token}
    }

    async fetchData() {
        let headers = {'Content-Type': 'application/json'}
        if (this.props.token) {
            headers['Authorization'] = 'Token ' + this.props.token
        }

        let data = []
        data = await axios.get(`${config.domain}/backend/api/homepage-data?page=0&site_type=2&all=${this.state.exploreAll}`, {
            withCredentials: true,
            headers
        })
        if (!data.data) {
            return Router.push('/login')
        }
        data = shuffle(data.data.data)
        let dataLeft = [] // not used but i wont go trhough the code and check what would it broke

        let sites
        sites = await axios.get(`${config.domain}/backend/api/sites`)
        sites = sites.data.data

        this.setState({originalData: data, dataLeft, sites, dataPage: 1}, this.loadMoreImages)
        this.props.toggleLoaded(true)
    }

    async componentDidMount() {
        this.props.toggleLoaded(false)

        let exploreAll = cookie.get('exploreall');
        this.setState({
            exploreAll: exploreAll === 'true'
        },  async () => {
            await this.fetchData()
        })
    }


    initOwlCarousel() {
        var timer = setInterval(function () {
            if (jQuery().owlCarousel) {
                jQuery(".owl-slider").owlCarousel({
                    items: 1,
                    nav: false,
                    navText: false,
                    dots: true,
                    smartSpeed: 600,
                    singleItem: true,
                    autoHeight: true,
                    loop: false,
                    autoplay: false,
                    autoplayHoverPause: true,
                    navRewind: false
                });

                clearInterval(timer)
            }
        }, 200);
    }

    mount = () => {
        if (!this.state.fullyMounted) {
            this.initOwlCarousel()
            window.addEventListener('resize', this.handleResize);
            const event = new Event('load');
            window.dispatchEvent(event)
            this.props.toggleLoaded(true)
            this.setState({fullyMounted: true}, this.handleResize)
        }
    }

    loadMoreImages = async () => {
        let data = this.getNextImageBatch()

        if (this.state.originalData.length <= this.state.data.length + 20) {
            await this.loadMoreData()
            data = this.getNextImageBatch()
        }

        this.setState({data: this.state.data.concat(data.slice(this.state.data.length, this.state.data.length + 20))}, this.mount)
    }

    getNextImageBatch = () => {
        // return this.state.originalData.filter(x => {
        //     const site = this.state.sites.find(y => (y.id === x.site_id))
        //     return site.type === this.state.filterBy
        // })
        return this.state.originalData
    }

    loadMoreData = async () => {
        if (this.state.isLoadingData)
            return

        this.setState({isLoadingData: true}, this.mount)

        const headers = {'Content-Type': 'application/json'}
        if (this.props.token) {
            headers['Authorization'] = 'Token ' + this.props.token
        }
        let data = await axios.get(`${config.domain}/backend/api/homepage-data?page=${this.state.dataPage}&site_type=2&all=${this.state.exploreAll}`, {
            withCredentials: true,
            headers
        })
        data = shuffle(data.data.data)

        this.setState({
            originalData: this.state.originalData.concat(data),
            dataPage: this.state.dataPage + 1,
            isLoadingData: false
        }, this.mount)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.props.toggleLoaded(false)
    }


    handleResize = () => {
        const parentWidth = document.querySelector(".wrapper").getBoundingClientRect().width
        const browserWidth = Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
        console.log(`Size: ${parentWidth}px`)
        console.log(`Browser Width: ${browserWidth}px`)
        let width
        if (browserWidth <= 768) {
            width = parentWidth
        } else if (browserWidth <= 1024) {
            width = (parentWidth) / 3.3
        } else {
            width = (parentWidth - 60) / 6.3
        }

        this.setState({width})
    }

    repackItems = () => {
        const bricksInstance = this.instance.getBricksInstance();
        bricksInstance.pack()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.width !== this.state.width)) {
            this.repackItems()
        }
        if (prevState.filterBy !== this.state.filterBy) {
            this.initOwlCarousel()
            window.scrollTo({top: 0, behavior: 'smooth'});
            await this.fetchData()
            await this.loadMoreImages()
        }
    }

    debounce = async () => {
        await repackDebounced()
        this.repackItems()
    }

    updateUser = (user) => {
        this.setState({user})
    }

    reachedBottom = () => {
        const end = (document.body.scrollHeight - document.body.offsetHeight);
        return document.body.scrollTop >= end;
    }

    handleSelection = (exploreAll) => {

        this.setState({exploreAll: exploreAll, data: []}, async () => {
            this.props.toggleLoaded(false)
            cookie.set('exploreall', exploreAll);
            await this.fetchData()
        });
    }


    render() {
        if (!this.props.loaded) {
            return <div id="page-loader" className="show-logo">
                <span className="loader-icon bullets-jump"><span/><span/><span/></span>
            </div>
        }

        return (
            <Layout updateUser={this.updateUser}>
                <div>

                    <div id="page-content">
                        <div id="hero-and-body">
                            <section id="page-body" className="brand-body is-hidden-tablet">
                                <div className="columns is-multiline is-mobile is-hidden-tablet">
                                    <Link href={"/"}>
                                        <a className="is-hidden-mobile column is-narrow is-marginless">
                                            <img style={{border: '1px solid #64F0E7', padding: '17px'}}
                                                 src={'../static/assets/arrow_back.png'}/>
                                        </a>
                                    </Link>
                                    <div style={{marginLeft: '10px', marginTop: '15px'}}
                                         className="column is-paddingless brand-text">
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            paddingTop: '10px',
                                            paddingBottom: '20px'
                                        }}>
                                            <span
                                                onClick={() => {
                                                    // if (this.state.filterBy !== 1) {
                                                    //     this.props.toggleLoaded(false)
                                                    //     this.setState({ filterBy: 1 })
                                                    // }
                                                    if (Router.pathname !== 'new-arrivals') {
                                                        Router.push('/new-arrivals')
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black'
                                                }}
                                                // className={`${this.state.filterBy === 1 && "has-text-weight-semibold"}`}
                                            >
                                                New Arrivals</span>

                                            <span
                                                onClick={() => {
                                                    if (Router.pathname !== 'sale') {
                                                        Router.push('/sale')
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black',
                                                    fontWeight: '500'
                                                }}
                                                // className={`${this.state.filterBy === 2 && "has-text-weight-semibold"}`}
                                            >Sale</span>
                                            <span>{' | '}</span>
                                            <span><Link href="/my-brands"><a style={{
                                                color: '#64F0E7',
                                                marginRight: '10px',
                                                fontSize: '20px',
                                                marginLeft: '10px'
                                            }}>my Brands</a></Link></span>
                                        </div>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                                            <span style={{marginLeft: '10px', marginRight: '10px'}}>My Selection</span>
                                            <Switch onChange={this.handleSelection}
                                                    checked={this.state.exploreAll}
                                                    checkedIcon={false}
                                                    uncheckedIcon={false}
                                                    height={14}
                                                    width={28}
                                                    onColor={'#737373'}
                                                    offColor={'#737373'}
                                            />
                                            <span style={{marginLeft: '10px', marginRight: '10px'}}>Explore</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* PAGEBODY */}
                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted && this.state.user) &&
                                <div className="after-register">
                                    {this.state.filterBy === 1 ? <div>
                                            <h2>Follow your favorite brands.</h2>
                                            <h3><Link href={'/my-brands'}><a style={{textDecoration: 'underline'}}>Click on
                                                my Brands to select them.</a></Link></h3>
                                        </div> :
                                        <div>
                                            <h2>Selected brands have no sale styles.</h2>
                                            <h3><Link href={'/my-brands'}><a style={{textDecoration: 'underline'}}>Click
                                                on my Brands to select additional brands.</a></Link></h3>
                                        </div>
                                    }
                                </div>)}

                            {this.props.loaded && ((this.state.data.length === 0 && this.props.loaded && this.state.fullyMounted && !this.state.user) &&
                                <div className="after-register">
                                    {this.state.filterBy === 1 ? <div>
                                            <h2>There are no sale styles.</h2>
                                        </div> :
                                        <div>
                                            <h2>There are no sale styles.</h2>
                                        </div>
                                    }
                                </div>)}
                            <section id="page-body">
                                <div className="is-hidden-mobile">
                                    <Sticky enabled={this.state.stickyNav} top={0} bottomBoundary={0} innerZ={1500}
                                            activeClass={'sticky-active'} releasedClass={'sticky-released'}>
                                        <div className="sticky-container"
                                             style={{backgroundColor: 'white', width: '98%'}}>
                                            <span
                                                onClick={() => {
                                                    if (Router.pathname !== 'new-arrivals') {
                                                        Router.push('/new-arrivals')
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black'
                                                }}
                                            >New Arrivals</span>

                                            <span
                                                onClick={() => {
                                                    if (Router.pathname !== 'sale') {
                                                        Router.push('/sale')
                                                    }
                                                }
                                                }
                                                style={{
                                                    cursor: 'pointer',
                                                    marginRight: '10px',
                                                    fontSize: '20px',
                                                    color: 'black'
                                                }}
                                                className={"has-text-weight-bold"}
                                            >Sale</span>

                                            <span>{' | '}</span>
                                            <span><Link href="/my-brands"><a style={{
                                                color: '#64F0E7',
                                                marginRight: '10px',
                                                fontSize: '20px',
                                                marginLeft: '10px'
                                            }}>my Brands</a></Link></span>
                                            {/*<hr/>*/}
                                            <span>{' | '}</span>
                                            <span>
                                                <span style={{marginLeft: '10px', marginRight: '10px'}}>My Selection</span>
                                                <Switch onChange={this.handleSelection}
                                                        checked={this.state.exploreAll}
                                                        checkedIcon={false}
                                                        uncheckedIcon={false}
                                                        height={14}
                                                        width={28}
                                                        onColor={'#737373'}
                                                        offColor={'#737373'}
                                                />
                                                <span style={{marginLeft: '10px', marginRight: '10px'}}>Explore</span>
                                            </span>
                                        </div>
                                    </Sticky>
                                </div>
                                <div className="is-hidden-tablet" style={{height: '20px'}}/>
                                <div className="wrapper">

                                    <MasonryLayout
                                        ref={instance => this.instance = instance}
                                        id="masonry-layout"
                                        sizes={[{columns: 1, gutter: 20}, {
                                            mq: '769px',
                                            columns: 3,
                                            gutter: 20
                                        }, {mq: '1025px', columns: 6, gutter: 20}]}
                                        infiniteScroll={async () => {
                                            await this.loadMoreImages()
                                        }}
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
                                                        <a href={product.product_link} target={"_blank"}
                                                           className="thumb-hover scale">
                                                            <img
                                                                onLoad={() => this.debounce()}
                                                                style={{objectFit: 'contain', width: '100%'}}
                                                                src={`${config.image_domain}/images/${product.image_filename}`}
                                                            />
                                                        </a>
                                                        <div className="blog-info">
                                                            <div className="post-meta clearfix">
                                                            <span className="post-cat">
                                                                <Link prefetch href={`brand?name=${product.name}`}
                                                                      as={`brand/${product.name}`}>
                                                                    <a>{product.display_name} <span style={{
                                                                        color: '#64F0E7',
                                                                        marginLeft: '10px'
                                                                    }}>more...</span></a>
                                                                </Link>
                                                            </span>
                                                            </div>
                                                            <h4 className="post-name" style={{marginTop: '0px'}}>
                                                                <a href={product.product_link}
                                                                   target={"_blank"}>{product.title}</a>
                                                            </h4>
                                                            {product.sale_price ? <div>
                                                                    <span className="post-pricebar">{product.price}</span>
                                                                    <span className="post-pricesale">{product.sale_price}</span>
                                                                </div> :
                                                                <span className="post-price">{product.price}</span>
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}

                                    </MasonryLayout>
                                    {/*</div>*/}
                                </div>
                                {/* END .wrapper */}
                            </section>
                            {/* PAGEBODY */}
                        </div>

                    </div>
                </div>

                {/*eslint-disable */}
                {/* language=CSS */}
                <style jsx>{`
                    @media (min-width: 769px) {
                        .after-register {
                            margin-top: 80px;
                            margin-left: 70px;
                        }
                    }

                    @media (max-width: 768px) {
                        .after-register {
                            margin-top: 30px;
                        }
                    }

                `}</style>
                {/* eslint-enable */}
            </Layout>

        )
    }
}

export default withAuthSync(Homepage)