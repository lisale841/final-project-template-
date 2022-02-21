import React from 'react';
import './moodboard.css';

export default class MoodBoard extends React.Component {
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
          <div className="moodboard-section col ms-lg-3 mt-3 p-3">
            <div className="mood-board-height">

              <h1 className="mood-headers">Create your own Mood</h1>
            </div>
          </div>
        </div>
      </>
    );
  }
}
