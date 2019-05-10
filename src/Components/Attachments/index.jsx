import React from 'react';

import Gallery from '../Gallery';
import { errors, VK } from 'vk-call';

class Attachments extends React.Component {
  constructor(props) {
    super(props);
    this.state = { images: [] };
  }

  fetchImages(next) {
    const { peerId, setLoading } = this.props;

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
      count: 200,
      preserve_order: 1
    })
      .then(({ items, next_from }) => {
        this.setState(({ images }) => ({
          images: [
            ...images,
            ...processItems(items)
          ]
        }));
        next_from ?
          this.fetchImages(next_from) :
          setLoading(false);
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
    const { setLoading } = this.props;

    this.fetchImages();
    setLoading(true);
  }

  componentDidUpdate(prevProps) {
    const { peerId, setLoading } = this.props;
    const { peerId: prevPeerId } = prevProps;

    if (peerId !== prevPeerId) {
      this.setState(
        { images: [] },
        () => {
          this.fetchImages();
          setLoading(true);
        }
      );
    }
  }

  render() {
    const { images } = this.state;
    return <Gallery images={images}/>;
  }
}

export default Attachments;
