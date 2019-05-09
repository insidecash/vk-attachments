import React from 'react';

import Attachments from '../Attachments';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { peerId: 0 };
  }

  render() {
    const { peerId } = this.state;
    return <Attachments peerId={peerId}/>;
  }
}

export default App;
