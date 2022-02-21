import React from 'react';
import Home from './features/homepage';

import ViewMoodBoards from './features/viewmoodboards';
import MoodBoard from './features/moodboardpage';
import NavBar from './features/navbar';
import { parseRoute } from '../lib';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  /**
     * Listen for hash change events on the window object
     * Each time the window.location.hash changes, parse
     * it with the parseRoute() function and update state
     */

  renderPage() {
    const { route } = this.state;
    // console.log(route.params.get('moodboardId'));
    switch (route.path) {
      case '':
        return <Home/>;
      case 'createmoodboard':
        return <MoodBoard />;
      case 'moodboard':
        return <ViewMoodBoards/>;
      default:
        return <Home/>;
    }
  }

  render() {
    return (
      <div>
        <NavBar />
        <div className="container">
          {this.renderPage()}
        </div>
      </div>
    );
  }
}
