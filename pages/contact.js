import React from 'react'
import Layout from "../src/layout";
export default () => (<Layout>
    <div id="hero-and-body">

        <section id="page-body">

            <div className="wrapper">


                <div className="spacer-big"></div>

                <div className="column-section clearfix">
                    <div className="column one-fourth">
                        <h5 className="title-alt"><strong>Write Us</strong></h5>
                    </div>

                    <div className="column three-fourth last-col">
                        <form id="contact-form" className="checkform sendemail" action="https://formcarry.com/s/3LLn3oWAwnH" method="POST">

                            <div className="form-row">
                                <label htmlFor="name">Name <abbr title="required" className="required">*</abbr></label>
                                <input type="text" name="name" id="name" className="name req" />
                            </div>

                            <div className="form-row">
                                <label htmlFor="email">Email <abbr title="required"
                                                                   className="required">*</abbr></label>
                                <input type="text" name="email" id="email" className="email req" />
                            </div>

                            <div className="form-row">
                                <label htmlFor="message">Message <abbr title="required"
                                                                       className="required">*</abbr></label>
                                <textarea name="message" id="message" className="message req" rows="30"
                                          cols="50"></textarea>
                            </div>

                            <div className="form-row form-note">
                                <div className="alert-error">
                                    <p>Please check your entries!</p>
                                </div>
                            </div>

                            <div className="form-row hidden">
                                <input type="text" id="form-check" name="form-check" value="" className="form-check"/>
                            </div>

                            <div className="form-row">
                                <input type="submit" name="submit" className="submit" value="Send Message"/>
                            </div>

                            <input type="hidden" name="subject" value="Stylaray contact"/>
                            <input type="hidden" name="fields" value="name,email,message"/>
                        </form>
                    </div>
                </div>

            </div>


        </section>

    </div>

</Layout>)