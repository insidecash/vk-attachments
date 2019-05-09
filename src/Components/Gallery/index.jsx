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
            <a key={id} href={links[0]} download>
              <img src={getXSizeUrl(links)} alt="Вложение"/>
            </a>
          )
        }
      </div>
    );
  }
}

export default Gallery;
