import PropTypes from 'prop-types';
import React from 'react';
import {View, FlatList} from 'react-native';

import shallowequal from 'shallowequal';
import md5 from 'md5';
import LoadEarlier from './LoadEarlier';
import Message from './Message';

export default class MessageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);

    this.state = {
      messages: this.prepareMessages(props.messages),
    };
  }

  prepareMessages(messages) {
    return messages.reduce((o, m, i) => {
      const previousMessage = messages[i + 1] || {};
      const nextMessage = messages[i - 1] || {};
      // add next and previous messages to hash to ensure updates
      const toHash = JSON.stringify(m) + previousMessage._id + nextMessage._id;
      return o.concat({
        ...m,
        previousMessage,
        nextMessage,
        hash: md5(toHash)
      });
    }, []);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowequal(this.props, nextProps)) {
      return true;
    }
    if (!shallowequal(this.state, nextState)) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages === nextProps.messages) {
      return;
    }
    this.setState({
      messages: this.prepareMessages(nextProps.messages),
    })
    ;
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return (
        <LoadEarlier {...loadEarlierProps}/>
      );
    }
    return null;
  }

  scrollToBottom(animated) {
    if (this.refs.flatListRef) {
      this.refs.flatListRef.scrollToOffset({y: 0, animated})
    } else {
      console.warn('Unable to scroll to bottom, flatListRef is not defined');
    }
  }

  renderRow({item}) {
    if (!item._id && item._id !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }
    if (!item.user) {
      console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
      item.user = {};
    }

    const messageProps = {
      ...this.props,
      key: item._id,
      currentMessage: item,
      previousMessage: item.previousMessage,
      nextMessage: item.nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps}/>;
  }

  keyExtractor = (item, index) => item._id;

  render() {
    return (
      <View ref='container' style={{flex: 1}}>
        <FlatList
          ref='flatListRef'
          inverted={true}
          automaticallyAdjustContentInsets={false}
          initialNumToRender={20}
          {...this.props.flatListKeyboardProps}
          {...this.props.flatListProps}
          data={this.state.messages}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderRow}
          ListHeaderComponent={this.renderFooter}
          ListFooterComponent={this.renderLoadEarlier}
          onEndReached={this.props.onTopReached}
          onEndReachedThreshold={this.props.onTopReachedThreshold}
        />
      </View>
    );
  }
}

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {
  },
};

MessageContainer.propTypes = {
  messages: PropTypes.array,
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  flatListProps: PropTypes.object,
  flatListKeyboardProps: PropTypes.object,
  onTopReached: PropTypes.func,
  onTopReachedThreshold: PropTypes.number,
};
