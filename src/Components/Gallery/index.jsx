import React from 'react';

class Gallery extends React.Component {
  render() {
    const { images } = this.props;
    const getXSizeUrl = links =>
      links[links.length - 3];

    return (
      <div id='images-container'>
        {
          images.map(({ id, links }) =>
            <img
              key={id}
              src={getXSizeUrl(links)}
              alt="Вложение"
            />
          )
        }
      </div>
    );
  }
}

export default Gallery;
