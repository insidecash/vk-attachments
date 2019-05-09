import React from 'react';

import Attachments from '../Attachments';
import Conversations from '../Conversations';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { peerId: null };
  }

  render() {
    const { peerId } = this.state;
    const handleSelect = selectedOption =>
      this.setState({
        peerId: selectedOption.value
      });

    return (
      <React.Fragment>
        <header>
          <Conversations peerId={peerId} onSelect={handleSelect}/>
        </header>

        <main>
          {
            peerId && <Attachments peerId={peerId}/>
          }
        </main>
      </React.Fragment>
    );
  }
}

export default App;
