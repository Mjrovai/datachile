import React, {Component} from "react";
import {connect} from "react-redux";
import { GEO } from "helpers/dictionary";
import { GEOMAP } from "helpers/GeoData";
import FeaturedBox from "components/FeaturedBox";
import SourceNote from "components/SourceNote";
import Search from "components/Search";
import {translate} from "react-i18next";

import "./Home.css";

class Home extends Component {

  render() {

    const {focus, message, t} = this.props;

    const featured = focus.map(f => GEOMAP.getRegion(f));

    return (
      <div className="home">
        <div className="splash">
          <div className="image"></div>
          <div className="gradient"></div>
        </div>
        <div className="intro dc-container">
          <div className="text">
            <h2 className="title">
              <span>Data Chile</span>
            </h2>
            <p className="lead">{ t("Interactive data visualization platform about Chilean public data") }</p>
          </div>
          <div className="search-home-wrapper">
            <Search className="search-home" local={ true } limit={ 5 } />
          </div>
        </div>
        <div className="dc-container">
          <h3 className="title-tiles">{ t("Explore featured profiles") }</h3>
        </div>
        <div className="tiles">
          <div className="dc-container">
            <div className="tiles-container">
              {
                featured.map(f =>
                    <FeaturedBox key={f.key} item={f} />
                )
              }
            </div>
            <div className="source-container">
              <SourceNote icon="/images/icons/icon-camera-source.svg">
                  <strong>{ t("Pic by") }:</strong> Example Author
              </SourceNote>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default translate()(connect(state => ({
    focus: state.focus
}), {})(Home));
