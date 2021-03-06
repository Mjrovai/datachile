import React, { Component } from "react";
import { translate } from "react-i18next";
import find from "lodash/find";

import TopicSlider from "components/TopicSlider";
import TopicSliderBullets from "components/TopicSliderBullets";
import TopicSliderSections from "components/TopicSliderSections";

class Topic extends Component {
  static need = [];

  constructor(props) {
    super(props);
    this.goTo = this.goTo.bind(this);
    this.state = { selected: 0 };
  }

  goTo(n) {
    this.setState({ selected: n });
  }

  render() {
    const { t, children, name, id, slider } = this.props;
    const { selected } = this.state;

    let i = 0;
    const sections = this.props.sections.map(s => {
      return {
        name: s.name,
        slides: s.slides.map(sl => ({
          ix: i++,
          name: sl
        }))
      };
    });

    const selectedSection = find(sections, function(s) {
      return find(s.slides, function(slid) {
        return slid.ix == selected;
      });
    });

    return (
      <div className="topic-block">
        <span id={id} className="topic-anchor-link" />
        <div className="topic-header">
          <div className="topic-title">
            <h2>
              {name}
              <span className="small">
                <span className="pipe">|</span>
                {selectedSection.name}
              </span>
            </h2>
            {slider && (
              <TopicSliderBullets
                name={id}
                slides={children}
                selected={selected}
                goTo={this.goTo}
              />
            )}
          </div>
          {slider && (
            <div className="topic-go-to-targets">
              <TopicSliderSections
                name={id}
                sections={sections}
                selected={selected}
                goTo={this.goTo}
              />
            </div>
          )}
        </div>
        <div className="topic-slide-container">
          {slider && (
            <TopicSlider id={id} selected={selected} goTo={this.goTo}>
              {children}
            </TopicSlider>
          )}
          {!slider && <div> {children} </div>}
        </div>
      </div>
    );
  }
}

Topic.defaultProps = {
  slider: true
};

export default translate()(Topic);
