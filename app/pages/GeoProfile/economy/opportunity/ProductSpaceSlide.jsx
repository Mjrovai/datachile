import React from "react";
import { translate } from "react-i18next";
import { Section } from "datawheel-canon";

import FeaturedDatum from "components/FeaturedDatum";

class ProductSpaceSlide extends Section {
  static need = [];

  render() {
    const { children, t } = this.props;
    const { geo } = this.context.data;

    const text = { geo };

    return (
      <div className="topic-slide-block">
        <div className="topic-slide-intro">
          <div className="topic-slide-title">
            {t("Opportunity in Products")}
          </div>
          <div
            className="topic-slide-text-full"
            dangerouslySetInnerHTML={{
              __html: t("geo_profile.economy.product_space", text)
            }}
          />
        </div>
        <div className="topic-slide-charts">{children}</div>
      </div>
    );
  }
}

export default translate()(ProductSpaceSlide);
