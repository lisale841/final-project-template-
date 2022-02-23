import React from 'react';
import './navbar.css';
import Logo from '../../images/logo.png';

export default class NavBar extends React.Component {

  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-dark nav-bar">
          <div className="container-fluid">
            <div>
              <button className="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <i
                  className="fas fa-bars">
                </i>
              </button>
              <a href="#">
                <img className="logo-img" src={Logo}></img>
              </a>
            </div>
            <div>
              <ul className="navbar-nav flex-row">
                <li className="nav-item me-3">
                  <a className="nav-link" href="#">Sign In</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Register</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="modal fade" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog m-0 h-100 nav-sidebar">
            <div className="row h-100">
              <div className="h-100 col col-xs-3 col-sm-6 col-lg-3 p-0">
                <div className="navbar-nav modal-content h-100">
                  <div className="bg-white">
                    <button type="button" className="btn-close float-end m-3" data-bs-dismiss="modal"></button>
                    <ul className="mt-5" data-bs-dismiss="modal">
                      <li className="">
                        <a className="" href="#moodboard" >My Mood Boards</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
    );
  }
}
