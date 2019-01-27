import React, { Component } from "react";
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../Navigation/Navigation";
import * as routes from "../../constants/routes";

const content = [
  {
    title: "Meet new inspiring people",
    description:
      "Matcha is offering you the opportunity to meet people sharing your interests",
    image:
      "https://d39l2hkdp2esp1.cloudfront.net/img/photo/122824/122824_00_2x.jpg?20170602010137"
  },
  {
    title: "Share with the one",
    description:
      "Thanks to our strong algorithm, we make sure you talk to the right person",
    image:
      "https://theme.fm/wp-content/uploads/2017/05/soyez-vigilant-lorsque-conversez-via-un-site-rencontre.png",
    button: "Create Account",
    link: routes.SIGN_UP
  },
  {
    title: "Have a good time",
    description: "People close to you and close to what you love",
    image:
      "https://www.chepstow-racecourse.co.uk/images/upload/xmas-party-50-50.jpg",
    button: "Sign In",
    link: routes.SIGN_IN
  }
];

class HomePage extends Component {
  render() {
    const isLoggedIn = sessionStorage.getItem("userData");

    if (isLoggedIn) {
      return <Redirect to={`/users/${isLoggedIn}`} />;
    }

    return (
      <div>
        <Header isLoggedIn={false} />
        <Helmet>
          <style>{"body { background-color: #EE7260 }"}</style>
        </Helmet>
        <Slider autoplay={3000} className="slider-wrapper">
          {content.map((item, index) => (
            <div
              key={index}
              className="slider-content"
              style={{
                background: `url('${item.image}') no-repeat center center`
              }}
            >
              <div className="inner">
                <h1>{item.title}</h1>
                <p>{item.description}</p>
                {item.link && item.button ?
                  <Link to={item.link}>
                    <button className="sliderButton">{item.button}</button>
                  </Link> : ""}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}

export default HomePage;
