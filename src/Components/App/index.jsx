import React from 'react';
import { errors, VK } from 'vk-call';
import List from '../List';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      peerId: 0
    };
  }

  fetchImages() {
    const { peerId } = this.state;

    const api = new VK({
      token: localStorage.getItem('user_token'),
      version: '5.92'
    });

    const processItems = items =>
      items.map(({ attachment }) => {
        const { id, sizes } = attachment.photo;

        sizes.sort((a, b) => {
          const types = 'wzyrqpoxms';
          return types.indexOf(a.type) - types.indexOf(b.type);
        });

        return {
          id: id,
          links: sizes.map(size => size.url)
        };
      });

    const fetchMore = next =>
      api.call('messages.getHistoryAttachments', {
        peer_id: peerId,
        media_type: 'photo',
        ...next && { start_from: next },
        preserve_order: 1
      })
        .then(({ items, next_from }) => {
          this.setState(({ images }) => ({
            images: [
              ...images,
              ...processItems(items)
            ]
          }));
          next_from && fetchMore(next_from);
        })
        .catch(error => {
          const repeat = () => next && fetchMore(next);

          console.error(error);
          error.type === errors.TOO_MANY_REQUESTS ?
            setTimeout(repeat, 1000) :
            alert(error.message);
        });

    fetchMore();
  }

  componentDidMount() {
    this.fetchImages();
  }

  render() {
    const { images } = this.state;

    return <List images={images}/>;
  }
}

export default App;
