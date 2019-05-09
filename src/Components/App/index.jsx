import React from 'react';

import Attachments from '../Attachments';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { peerId: 0 };
  }

  render() {
    const { peerId } = this.state;

    return (
      <React.Fragment>
        <header>

        </header>

        <main>
          <Attachments peerId={peerId}/>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
