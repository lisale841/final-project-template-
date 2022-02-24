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

  renderPage() {
    const { route } = this.state;

    switch (route.path) {
      case '':
        return <Home/>;
      case 'editmoodboard':
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
