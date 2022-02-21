import React from 'react';
import './viewmoods.css';

export default class ViewMoodBoards extends React.Component {
  constructor() {
    super();
    this.handleCreateMoodBoard = this.handleCreateMoodBoard.bind(this);
  }

  handleCreateMoodBoard() {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: 1 })
    };
    fetch('/api/createmoodboard', req)
      .then(response => response.json())
      .then(result => {
        window.location.href = '#createmoodboard';
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <>
        <div className="tools row">
          <div className="col">
            <div className="position-relative">
              <h1 className="mood-headers">
                My Mood Boards
              </h1>
              <button className="position-absolute add-button" onClick={this.handleCreateMoodBoard}>
                <i className="fas fa-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="moodboard-section">
            </div>
          </div>
        </div>
      </>
    );
  }
}
