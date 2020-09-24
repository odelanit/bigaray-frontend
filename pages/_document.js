import Document, { Head, Main, NextScript } from 'next/document'
import {GA_TRACKING_ID} from "../src/helpers/gtag";

export default class MyDocument extends Document {

    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <html className="no-js" lang="en-US">
            <head>
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}');
                  `
                            }}
                        />
                    <meta name="viewport" content="height=device-height,width=device-width, initial-scale=1.0, user-scalable=0"/>
                    <link rel="manifest" href="../static/manifest.json"></link>
                    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500" rel="stylesheet"
                          type="text/css" />

                        <link rel="stylesheet" id="default-style-css" href="../static/css/style.css" type="text/css"
                              media="all"/>
                        <link rel="stylesheet" id="fontawesome-style-css" href="../static/css/font-awesome.min.css"
                              type="text/css" media="all"/>
                        <link rel="stylesheet" id="ionic-icons-style-css" href="../static/css/ionicons.css" type="text/css"
                              media="all"/>
                        {/*<link rel="stylesheet" id="isotope-style-css" href="../static/css/isotope.css" type="text/css"*/}
                              {/*media="all"/>*/}
                        <link rel="stylesheet" id="owlcarousel-css" href="../static/css/owl.carousel.css" type="text/css"
                              media="all"/>
                        <link rel="stylesheet" id="responsive-css" href="../static/css/mqueries.css" type="text/css"
                              media="all"/>

                        <link rel="shortcut icon" href="../static/uploads/favicon.png"/>

                        <title>Stylaray | A multifaceted style! </title>

            </head>

            <body>


            <Main />
            <NextScript />


            <script src="../static/js/jquery-1.12.4.min.js"></script>
            <script type="text/javascript" src="../static/js/plugins.js"></script>
            <script type="text/javascript" src="../static/js/jquery.owl.carousel.min.js"></script>
            <script type="text/javascript" src="../static/js/jquery.sticky-kit.min.js"></script>
            <script type="text/javascript" src="../static/js/script.js"></script>

            </body>
            </html>
        )
    }
}