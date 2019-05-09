import React from 'react';

import Gallery from '../Gallery';
import { errors, VK } from 'vk-call';

class Attachments extends React.Component {
  constructor(props) {
    super(props);
    this.state = { images: [] };
  }

  fetchImages(next) {
    const { peerId } = this.props;

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
        next_from && this.fetchImages(next_from);
      })
      .catch(error => {
        const repeat = () => next && this.fetchImages(next);

        console.error(error);
        error.type === errors.TOO_MANY_REQUESTS ?
          setTimeout(repeat, 1000) :
          alert(error.message);
      });
  };

  componentDidMount() {
    this.fetchImages();
  }

  componentDidUpdate(prevProps) {
    const { peerId } = this.props;
    const { peerId: prevPeerId } = prevProps;

    if (peerId !== prevPeerId) {
      this.setState({ images: [] });
      this.fetchImages();
    }
  }

  render() {
    const { images } = this.state;
    return <Gallery images={images}/>;
  }
}

export default Attachments;
