import React from 'react';
import './moodboard.css';
import { parseRoute } from '../../../lib';

export default class MoodBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      moodBoardId: null,
      moodBoardObjs: []
    };

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  zoomIn() {
    this.setState(({ zoom }) => ({ zoom: zoom + 0.25 }));
  }

  zoomOut() {
    this.setState(({ zoom }) => ({ zoom: zoom - 0.25 }));
  }

  componentDidMount() {
    const { params } = parseRoute(window.location.hash);
    const moodBoardId = params.get('id');

    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch(`/api/getmoodboard/${moodBoardId}`, req)
      .then(response => response.json())
      .then(result => {
        this.setState({ moodBoardId, moodBoardobjs: result });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  render() {
    return (
      <>
        <div className="row">
          <div className="tools col-xs-12 col-sm-12 col-lg-3 p-3">
            <h1 className="mood-headers mb-4">Tools</h1>
            <div className="row">
              <div className="col-6 col-md-12">
                <div>
                  <p className="m-0">Delete Photo/Text:</p>
                  <i className="fas fa-trash"></i>
                </div>
              </div>
              <div className="col-6 col-md-12">
                <div className="mt-md-3">
                  <p className="m-0">Add Photos:</p>
                  <button type="button" className="btn button-styles" data-bs-toggle="button">Upload</button>
                </div>
              </div>
              <div className="col">
                <div className="mt-3">
                  <p className="m-0">Add Text:</p>
                  <div className="input mb-3">
                    <input type="text" className="form-control" placeholder="create mood"></input>
                    <button type="button" className="btn button-styles" data-bs-toggle="button">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="moodboard-section col col-lg-9 mt-3 p-3">
            <h1 className="mood-headers">Edit your own Mood</h1>
            <div className="mood-board-container">
              <div className="mood-board-icons me-3 mt-3">
                <button className="btn btn-dark p-1 px-2 mb-2" onClick={this.zoomIn}>
                  <i className="fas fa-plus"></i>
                </button>
                <button className="btn btn-dark p-1 px-2" onClick={this.zoomOut}>
                  <i className="fas fa-minus"></i>
                </button>
              </div>
              <div className="mood-board-boundary">
                <div className="mood-board" style={{ transform: `scale(${this.state.zoom})` }}>
                  {/* TODO: Fill board with objects based on MoodObjects will be implemented in the
                  next few features */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
