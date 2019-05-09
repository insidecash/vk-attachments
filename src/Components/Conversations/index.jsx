import React from 'react';

import { errors, VK } from 'vk-call';
import Select from 'react-select';

class Conversations extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, options: [] };
  }

  fetchConversations(offset) {
    const api = new VK({
      token: localStorage.getItem('user_token'),
      version: '5.92'
    });

    const processItems = (items, profiles, groups) =>
      items.map(({ conversation }) => {
        const { id, type } = conversation.peer;

        const getLabel = () => {
          switch (type) {
            case 'user':
              const { first_name, last_name } = profiles.find(x => x.id === id) || {};
              return first_name + ' ' + last_name;
            case 'chat':
              return conversation.chat_settings.title;
            case 'group':
              const { name } = groups.find(x => x.id === -id) || {};
              return name;
          }
        };

        return {
          value: id,
          label: getLabel()
        };
      });

    const getOptionsCount = () =>
      this.state.options.length;

    api.call('messages.getConversations', {
      ...offset && { offset: offset },
      count: 200,
      extended: 1
    })
      .then(({ items, profiles, groups }) => {
        this.setState(prevState => ({
            options: [
              ...prevState.options,
              ...processItems(items, profiles, groups)
            ]
          }), () => items.length > 0 ?
          this.fetchConversations(getOptionsCount()) :
          this.setState({ isLoading: false })
        );
      })
      .catch(error => {
        const repeat = () => this.fetchConversations(getOptionsCount());

        console.error(error);
        error.type === errors.TOO_MANY_REQUESTS ?
          setTimeout(repeat, 1000) :
          alert(error.message);
      });
  }

  componentDidMount() {
    this.fetchConversations();
  }

  render() {
    const { peerId, onSelect } = this.props;
    const { isLoading, options } = this.state;
    const selectedOption = options.find(x => x.value === peerId) || null;

    return (
      <Select
        className='select'
        value={selectedOption}
        onChange={onSelect}
        isLoading={isLoading}
        isSearchable={true}
        options={options}
      />
    );
  }
}

export default Conversations;
