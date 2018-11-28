import React from "react";
import { Container, Footer } from "mdbreact";

class FooterPage extends React.Component {
    render() {
        return (
            <Footer className="footer-matcha font-small pt-4 mt-4">
                <Container fluid className="text-center">
                    <ul className="list-unstyled list-inline text-center">
                        <li className="list-inline-item">
                            <a href="https://github.com/cnairi" className="btn-floating btn-fb mx-1">
                                <i className="fa fa-facebook"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="https://github.com/cnairi" className="btn-floating btn-tw mx-1">
                                <i className="fa fa-twitter"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="https://github.com/cnairi" className="btn-floating btn-gplus mx-1">
                                <i className="fa fa-google-plus"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="https://github.com/cnairi" className="btn-floating btn-li mx-1">
                                <i className="fa fa-linkedin"> </i>
                            </a>
                        </li>
                        <li className="list-inline-item">
                            <a href="https://github.com/cnairi" className="btn-floating btn-dribbble mx-1">
                                <i className="fa fa-dribbble"> </i>
                            </a>
                        </li>
                    </ul>
                </Container>
                <div className="footer-copyright text-center py-3">
                    <Container fluid>
                        &copy; {new Date().getFullYear()} Copyright:{" "}
                        <a href="https://github.com/cnairi"> cnairi </a> and <a href="https://github.com/dcirlig">dcirlig</a>
                    </Container>
                </div>
            </Footer>
        );
    }
}

export default FooterPage;