import React, { Component } from 'react';

import './app.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import Index from './pages/auth';
import Dashboard from './pages/dashboard';
import Reports from './pages/reports/reportController';

export default class App extends Component {
  componentDidMount() {
    if (window.location.hash === '') {
      window.location.hash = '#/';
    }
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div className="base">
          <img src="https://vinvi.id" alt="bg" />
        </div>
        <Router basename={`${window.location.pathname}#`}>
          <div style={{ height: '100%' }}>
            <Route path="/" exact component={withRouter(Index)} />
            <Route path="/dashboard" component={withRouter(Dashboard)} />
            <Route path="/reports" component={Reports} />
          </div>
        </Router>
      </div>
    );
  }
}
