import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleSearch } from "actions/index";
import { translate } from "react-i18next";
import { Link, browserHistory } from "react-router";
import { debounce } from "lodash";

import { request } from "d3-request";

import "./Search.css";

import { GEOARRAY } from "helpers/GeoData";
import { slugifyItem } from "helpers/formatters";

import { strip } from "d3plus-text";
import { dataFold } from "d3plus-viz";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      results: []
    };
    this.handleChange = debounce(this.handleChange, 500);
  }

  handleChange(userQuery) {
    const { limit } = this.props;

    if (userQuery.length <= 3) {
      // bail out early on empty query
      this.setState({ active: true, results: [] });
      return;
    }

    request(
      `https://chilecube.datawheel.us/search?q=${encodeURIComponent(
        userQuery
      )}`,
      (error, data) => {
        const r = JSON.parse(data.responseText);
        this.setState({ active: true, results: r });
      }
    );
  }

  onChange(e) {
    e.persist();
    this.handleChange(e.target.value);
  }

  componentDidMount() {
    document.addEventListener(
      "keydown",
      () => {
        const { local, searchActive, toggleSearch } = this.props;
        const { active } = this.state;
        const key = event.keyCode;
        const DOWN = 40,
          ENTER = 13,
          ESC = 27,
          S = 83,
          UP = 38;

        const enabled = local ? active : searchActive;
        const toggle = local
          ? () => this.setState({ active: !active })
          : toggleSearch;

        if (
          !local &&
          !enabled &&
          key === S &&
          event.target.tagName.toLowerCase() !== "input"
        ) {
          event.preventDefault();
          toggle();
        } else if (enabled && key === ESC && event.target === this.refs.input) {
          event.preventDefault();
          toggle();
        } else if (enabled && event.target === this.refs.input) {
          const highlighted = document.querySelector(".highlighted");

          if (key === ENTER && highlighted) {
            //this.refs.input.value = highlighted.querySelector("a").innerHTML;
            toggle();
            setTimeout(() => {
              browserHistory.push(highlighted.querySelector("a").href);
              //window.location = highlighted.querySelector("a").href;
            }, 500);
          } else if (key === DOWN || key === UP) {
            if (!highlighted) {
              if (key === DOWN)
                document
                  .querySelector(".results > li:first-child")
                  .classList.add("highlighted");
            } else {
              const results = document.querySelectorAll(".results > li");

              const currentIndex = [].indexOf.call(results, highlighted);

              if (key === DOWN && currentIndex < results.length - 1) {
                results[currentIndex + 1].classList.add("highlighted");
                highlighted.classList.remove("highlighted");
              } else if (key === UP) {
                if (currentIndex > 0)
                  results[currentIndex - 1].classList.add("highlighted");
                highlighted.classList.remove("highlighted");
              }
            }
          }
        }
      },
      false
    );
  }

  getProfileType(result) {
    const { t } = this.props;
    var profileType = "";
    switch (result.index_as) {
      case undefined: {
        profileType = "";
        break;
      }
      case "countries": {
        profileType = result.ancestor_key ? t("Country") : t("Area");
        break;
      }
      case "institutions": {
        profileType = result.ancestor_key
          ? t("Institution")
          : t("Institution Type");
        break;
      }
      case "careers": {
        profileType = result.ancestor_key ? t("Career") : t("Field of Science");
        break;
      }
      case "products": {
        profileType = result.ancestor_key ? t("Product") : t("Product Type");
        break;
      }
      case "industries": {
        profileType = result.ancestor_key ? t("Sector") : t("Sector Type");
        break;
      }
      case "geo": {
        profileType = result.ancestor_key ? t("Comuna") : t("Region");
        break;
      }
    }
    return profileType;
  }

  render() {
    const { className, searchActive, local, t } = this.props;
    const { active, results } = this.state;
    const enabled = local ? active : searchActive;

    const availableClass =
      results && results.length > 0 ? "available" : "not-available";

    if (this.refs.input) {
      if (enabled) this.refs.input.focus();
      else this.refs.input.blur();
    }

    return (
      <div
        className={`${className} ${enabled ? "active" : ""} search-component`}
      >
        <div className="input">
          <input
            type="text"
            ref="input"
            onChange={this.onChange.bind(this)}
            placeholder={t("Search a location, industry, product, career, etc")}
          />
        </div>
        <ul className={`results ${availableClass}`}>
          {results.map(result => (
            <li key={`${result.index_as}-${result.key}`} className="result">
              <Link
                to={slugifyItem(
                  result.index_as,
                  result.ancestor_key ? result.ancestor_key : result.key,
                  result.ancestor_name ? result.ancestor_name : result.content,
                  result.ancestor_key ? result.key : result.ancestor_key,
                  result.ancestor_name ? result.content : result.ancestor_name
                )}
              >
                <span className="icon-container">
                  <img
                    className="icon"
                    src={`/images/icons/icon-${result.index_as}.svg`}
                  />
                </span>
                <span className="content">{result.content}</span>
                <span className="separator">|</span>
                <span className="type">{this.getProfileType(result)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Search.defaultProps = {
  className: "search-nav"
};

export default translate()(
  connect(
    state => ({
      searchActive: state.search.searchActive
    }),
    { toggleSearch }
  )(Search)
);
