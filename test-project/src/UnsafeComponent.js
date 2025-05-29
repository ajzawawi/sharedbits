import React from 'react';

class UnsafeComponent extends React.Component {
  componentWillMount() {
    console.log('about to mount');
  }

  render() {
    return <div>Hello</div>;
  }
}

export default UnsafeComponent;