import React from 'react'
import { Navbar,Container,Nav,NavDropdown } from 'react-bootstrap'
import './navbar.css'
export default function NavBar() {
    return (
        <>
          <header>
          <div className="bgLightDark headerTopBar textLightDark">
							<div className="container-fluid">
								<div className="row">
									<div className="col-xs-6 col-sm-4">
										<time datetime="2011-01-12" className="TopBarTime">Mon - Sat: 08.00 AM - 18.00 PM</time>
									</div>
									<div className="col-xs-6 col-sm-8 text-right">
										<ul className="list-unstyled topBarPanelList">
											<li className="d-none d-sm-block">
												<ul className="list-unstyled socialNetworks topBarPanelListSocial">
													<li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
													<li><a href="#"><i className="fab fa-twitter"></i></a></li>
													<li><a href="#"><i className="fab fa-instagram"></i></a></li>
													<li><a href="#"><i className="fab fa-google"></i></a></li>
												</ul>
											</li>
											<li>
												<div className="dropdown topBarPanelListDropdown">
													<button className="dropdown-toggle buttonReset" type="button" id="dropdownDol" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">USD ($)
                          </button>
													<ul className="dropdown-menu" aria-labelledby="dropdownDol">
														<li><a href="#">USD</a></li>
														<li><a href="#">EURO</a></li>
														<li><a href="#">YTL</a></li>
													</ul>
												</div>
											</li>
											<li>
												<div className="dropdown topBarPanelListDropdown">
													<button className="dropdown-toggle buttonReset" type="button" id="dropdownLang" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">English<span className="caret"></span></button>
													<ul className="dropdown-menu" aria-labelledby="dropdownLang">
														<li className="dropdown-item"><a href="#">English</a></li>
														<li className="dropdown-item"><a href="#">Turkish</a></li>
														<li className="dropdown-item"><a href="#">French</a></li>
													</ul>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

          </header>
            <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
  <Container>
  <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="#features">Features</Nav.Link>
      <Nav.Link href="#pricing">Pricing</Nav.Link>
      <NavDropdown title="Dropdown" id="collasible-nav-dropdown" renderMenuOnMount={true}>
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
      <Nav.Link href="#deets">More deets</Nav.Link>
      <Nav.Link eventKey={2} href="#memes">
        Dank memes
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
  </Container>
</Navbar>
        </>
    )
}
