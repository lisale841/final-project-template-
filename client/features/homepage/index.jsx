import React from 'react';
import './home.css';

import MoodBackground from '../../images/background-mood.png';
import MoodCircle from '../../images/mood-circle.png';
import HappyCircle from '../../images/happy-circle.png';

export default class Home extends React.Component {

  render() {
    return (
      <>
        <div className="row">
          <div className="col">
            <div className="py-3">
              <div style={{ backgroundImage: `url(${MoodBackground})` }} className="heading-background">
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="about-section mt-3 p-3">
              <img className="about-circle" src={MoodCircle}></img>
              <h1 className="mood-header">About Mood</h1>
              <h2 className="quote-header">{'"Creativity is the way I show my soul with the world." - brene brown'}</h2>
              <p>With it&apos;s a Mood you can create inspiration boards to organize your thoughts and ideas.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="about-section mt-3 p-3">
              <h1 className="share-mood">Come share your Mood with us!</h1>
              <img className="about-circle" src={HappyCircle}></img>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="mood-board-tools">
              <i className="fa-solid fa-trash-can"></i>
            <div>
            </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
