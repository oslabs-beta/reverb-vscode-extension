import React from 'react';
import ParseForm from './settings/ParseForm';

function Welcome() {
  return (
    <div className="welcome__view flexC">
      <h1>
        Welcome to <span style={{ color: '#2B74A3' }}>re</span>
        <span style={{ color: '#FF9A1A' }}>V</span>
        <span style={{ color: '#2B74A3' }}>erb!</span>
      </h1>

      <h3>Before reVerb can do its thing, we need the following from you: </h3>
      <ul>
        <li>ensure the server you will be testing is running</li>
        <li>select your primary server file from the dropdown</li>
        <li>enter the port number the server is listening on</li>
        <li>press confirm!</li>
      </ul>

      <ParseForm />
    </div>
  );
}

export default Welcome;
