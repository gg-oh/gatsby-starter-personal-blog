import React from 'react';
import { graphql } from 'gatsby';

class NotFoundPage extends React.Component {
    render() {
        const { data } = this.props;
        const siteTitle = data.site.siteMetadata.title;

        return (
            <LayoutWrapper>
                <h1>Not Found</h1>
            </LayoutWrapper>
        )
    }
}

export default NotFoundPage