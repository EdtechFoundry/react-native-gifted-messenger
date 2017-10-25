import PropTypes from 'prop-types';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  MIN_COMPOSER_HEIGHT,
  COMPOSER_MARGIN_TOP,
  COMPOSER_MARGIN_BOTTOM,
} from './Constants';

export default class Composer extends React.Component {
  onContentSizeChange(e) {
    const contentSize = e.nativeEvent.contentSize;

    // Support earlier versions of React Native on Android.
    if (!contentSize) return;

    if (!this.contentSize || this.contentSize.width !== contentSize.width || this.contentSize.height !== contentSize.height) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  render() {
    return (
      <TextInput
        placeholder={this.props.placeholder}
        placeholderTextColor={this.props.placeholderTextColor}
        multiline={this.props.multiline}

        onChange={(e) => this.onContentSizeChange(e)}
        onContentSizeChange={(e) => this.onContentSizeChange(e)}

        onChangeText={text => this.onChangeText(text)}

        style={[styles.textInput, this.props.textInputStyle, {height: this.props.composerHeight}]}

        value={this.props.text}
        accessibilityLabel={this.props.text || this.props.placeholder}
        enablesReturnKeyAutomatically={true}
        underlineColorAndroid="transparent"
        {...this.props.textInputProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 16,
    marginTop: COMPOSER_MARGIN_TOP,
    marginBottom: COMPOSER_MARGIN_BOTTOM,
  },
});

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: '#b2b2b2',
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  onTextChanged: () => {
  },
  onInputSizeChanged: () => {
  },
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
};
