import React from 'react';

class List extends React.Component {
  render() {
    const { images } = this.props;
    const styles = {
      div: {
        height: '100vh',
        overflowY: 'scroll'
      },
      img: {
        maxHeight: '16em'
      }
    };

    return (
      <div style={styles.div}>
        {
          images.map(({ id, links }) =>
            <img
              key={id}
              src={links[0]}
              alt="Вложение"
              style={styles.img}
            />
          )
        }
      </div>
    );
  }
}

export default List;
