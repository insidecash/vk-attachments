import React from 'react';

import Attachments from '../Attachments';
import Conversations from '../Conversations';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem('user_token') || '',
      attachmentsAreLoading: undefined,
      peerId: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target }) {
    this.setState({ token: target.value });
  }

  handleSubmit(event) {
    localStorage.setItem('user_token', this.state.token);
    window.location.reload(true);

    event.preventDefault();
  }

  render() {
    const { peerId, token, attachmentsAreLoading } = this.state;
    const handleSelect = selectedOption =>
      this.setState({
        peerId: selectedOption.value
      });
    const setLoading = value =>
      this.setState({
        attachmentsAreLoading: value
      });

    return (
      <React.Fragment>
        <header>
          <form onSubmit={this.handleSubmit} className='token-form'>
            <input
              type='text'
              placeholder='User Token'
              value={token}
              onChange={this.handleChange}
            />
          </form>

          <Conversations peerId={peerId} isDisabled={attachmentsAreLoading}
                         onSelect={handleSelect}/>
        </header>

        <main>
          {
            peerId && <Attachments peerId={peerId} setLoading={setLoading}/>
          }
        </main>
      </React.Fragment>
    );
  }
}

export default App;
