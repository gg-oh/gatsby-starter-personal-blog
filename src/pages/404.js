import React from "react";
import { graphql } from "gatsby";
import LayoutWrapper from "../components/LayoutWrapper/";

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <LayoutWrapper>
        <h1>Not Found</h1>
      </LayoutWrapper>
    );
  }
}

export default NotFoundPage;
