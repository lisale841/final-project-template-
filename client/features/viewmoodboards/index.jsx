import React from 'react';
import './viewmoods.css';

export default class ViewMoodBoards extends React.Component {
  constructor() {
    super();
    this.state = { moodBoards: [], title: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleCreateMoodBoard = this.handleCreateMoodBoard.bind(this);
    this.handleMoodBoardClick = this.handleMoodBoardClick.bind(this);
  }

  handleChange(event) {
    this.setState({ title: event.target.value });
  }

  getMoodBoards() {
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/getmoodboards', req)
      .then(response => response.json())
      .then(result => {
        this.setState({ moodBoards: result });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleCreateMoodBoard() {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: 1, title: this.state.title })
    };
    fetch('/api/createmoodboard', req)
      .then(response => response.json())
      .then(result => {
        window.location.href = `#editmoodboard?id=${result.moodBoardId}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  handleMoodBoardClick(moodboardId) {
    window.location.href = `#editmoodboard?id=${moodboardId}`;
  }

  componentDidMount() {
    this.getMoodBoards();
  }

  createMoodboardIcons() {
    return this.state.moodBoards.map(item => (
      <div className="col col-sm-3 col-lg-2 mb-3" key={item.moodBoardId}>
        <button className="py-3 px-5" onClick={() => this.handleMoodBoardClick(item.moodBoardId)}>{item.title}</button>
      </div>
    ));
  }

  render() {
    return (
      <>
        <div className="tools row mb-3">
          <div className="col">
            <div className="position-relative">
              <h1 className="mood-headers">
                My Mood Boards
              </h1>
              <button type="btn" className="btn position-absolute add-button" data-bs-toggle="modal" data-bs-target="#createBoard">
                  <i
                    className="fas fa-plus-circle">
                  </i>
              </button>
            </div>
          </div>
        </div>
        <div className="row text-center">
          {this.createMoodboardIcons()}
        </div>
        <div className="modal fade" id="createBoard" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="createBoard">Create a new mood board?</h5>
                <button type="button" className="btn btn-close" data-bs-dismiss="modal" aria-label="Close">
                </button>
              </div>
              <div className="modal-body">
                <div className="input mb-3">
                  <p>Title:</p>
                  <input type="text" className="form-control" placeholder="Title" value={this.state.title} onChange={this.handleChange}></input>
                  </div>
              </div>
              <div className="modal-footer">
              <button type="button" className="btn btn-green" onClick={this.handleCreateMoodBoard} data-bs-dismiss="modal">YES</button>
              </div>
            </div>
          </div>
        </div>
        </>
    );
  }
}
