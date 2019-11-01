/**
* @module LHCommonUI/LHImageButton
* @description 图片按钮,跟米家ImageButton一样，区别在于优化热区，米家的热区只有图片，这个组件的热区包括图片的外边距
* @property {string} source 图片资源
* @property {string} [highlightedSource] 按下态图片资源，不传没有按下态
* @property {Object} [style] 作用于图片资源上的样式
* @property {Function} onPress 图片按钮点击事件
* @example
* import { LHImageButton } from "LHCommonUI";
*
* <LHImageButton
*   source={require('图片资源路径')}
*   highlightedSource={require('图片资源路径')}
*   onPress={() => { console.log('test'); }}
* />
*/
import React from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { LHPureRenderDecorator } from 'LHCommonFunction';

class LHImageButton extends React.Component {
  static initialState = {
    buttonPressed: false
  };

  static defaultProps = {
    source: null,
    highlightedSource: null,
    onPress: null
  };

  constructor(props) {
    super(props);
    this.state = {
      buttonPressed: false
    };
  }

  buttonPressIn() {
    this.setState({ buttonPressed: true });
  }

  buttonPressOut() {
    this.setState({ buttonPressed: false });
  }

  isButtonPressed() {
    const { buttonPressed } = this.state;
    return buttonPressed;
  }

  render() {
    let { source } = this.props;
    const { highlightedSource, style, onPress } = this.props;
    if (this.isButtonPressed() && highlightedSource) {
      source = highlightedSource;
    }
    // const Touchable =
    //   Platform.OS === 'android' ? TouchableNativeFeedback : TouchableWithoutFeedback;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (typeof onPress === 'function') onPress();
        }}
        onPressIn={() => { this.buttonPressIn(); }}
        onPressOut={() => { this.buttonPressOut(); }}
      >
        <View>
          <Image
            style={style}
            source={source}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
export default LHPureRenderDecorator(LHImageButton);
