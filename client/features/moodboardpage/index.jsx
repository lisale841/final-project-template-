import React from 'react';
import './moodboard.css';
import { parseRoute } from '../../../lib';
import interact from 'interactjs';

interact('.resize-drag')
  .resizable({
    // resize from all edges and corners
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move: function (event) {
        let { x, y } = event.target.dataset;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x}px, ${y}px)`
        });

        Object.assign(event.target.dataset, { x, y });
        // https://interactjs.io/docs/resizable/
      }
    },
    modifiers: [
      // keep the edges inside the parent
      interact.modifiers.restrictEdges({
        outer: 'parent'
      }),
      interact.modifiers.aspectRatio({ ratio: 'preserve' })
    ],

    inertia: true
  })
  .draggable({
    listeners: {
      move(event) {
        const target = event.target;
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    },
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ]
  });

export default class MoodBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
      moodBoardId: null,
      moodBoardObjs: [],
      text: ''
    };

    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.fileInputRef = React.createRef();
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
  }

  // react-file-upload
  handlePhotoUpload(event) {
    if (!this.fileInputRef.current.files[0] || !this.state.moodBoardId) {
      return;
    }

    const formData = new FormData();
    formData.append('moodBoardId', this.state.moodBoardId);
    formData.append('image', this.fileInputRef.current.files[0]);

    const req = {
      method: 'POST',
      body: formData
    };
    fetch('/api/uploads', req)
      .then(response => response.json())
      .then(result => {
        this.fileInputRef.current.value = null;
      })
      .catch(error => {
        console.error('Error:', error);
      });
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

        this.setState({ moodBoardId, moodBoardObjs: result });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  renderMoodBoardObjs(moodObjs) {
    const { moodBoardObjs } = this.state;
    return moodBoardObjs.map(item => {
      const {
        moodObjectId,
        url
        // text will be added in a different feature will be null for now. x&y coordinates are zero for now.
        // height, width
      } = item;
      return (
        <div key={moodObjectId} className="resize-drag"
        >
        <img style={{
          height: '100%',
          width: '100%'
        }} src={url}/>
      </div>
      );
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
                  <p className="m-0">Add Photo:</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <input
                      type="file"
                      name="image"
                      ref={this.fileInputRef}
                      accept=".png, .jpg, .jpeg, .gif" />
                    <button className="btn button-styles" onClick={this.handlePhotoUpload}>
                      Upload
                    </button>
                  </div>
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
                  {this.renderMoodBoardObjs()}
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
