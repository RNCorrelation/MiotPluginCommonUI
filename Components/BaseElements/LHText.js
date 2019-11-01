/**
* @module LHCommonUI/LHText
* @description 用法和Text一样
*/

import React from 'react';
import {
  Text,
  StyleSheet
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';

class LHText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { children, style } = this.props;
    const props = { ...this.props };
    delete props.style;
    return (
      <Text
        {...props}
        style={[{
          fontFamily: LHUiUtils.DefaultFontFamily
        }, StyleSheet.flatten(style)]}
      >
        {children}
      </Text>
    );
  }
}

export default LHPureRenderDecorator(LHText);
