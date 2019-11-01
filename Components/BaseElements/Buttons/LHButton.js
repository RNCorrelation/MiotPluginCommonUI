/**
* @module LHCommonUI/LHButton
* @description 按钮
* @property {number} buttonType 按钮类型，0: 按下态背景变灰，disabled态文字变灰；1:按下态背景使用深色，disabled态透明度变30%
* @property {string} btnText 按钮文字
* @property {Object} btnTextStyle 按钮文字样式
* @property {Object} textDisabledStyle 按钮文字disabled态样式
* @property {Object} style 按钮样式
* @property {Object} btnDisabledStyle 按钮disabled态样式
* @property {boolean} disabled 是否是disabled
* @property {Function} onPress 点击事件
* @property {string} pressBackgroundColor 按压态背景色
* @example
* import { LHButton } from "LHCommonUI";
* <LHButton
    btnText="确定"
    style={{
      marginHorizontal: LHUiUtils.GetPx(10)
    }}
    onPress={() => {
      console.log('dfsdf');
    }}
  />
*
*/

import React from 'react';
import {
  TouchableHighlight,
  View
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import {
  LHText
} from 'LHCommonUI';

// 默认按压态背景色
const defaultPressBackgroundColor = {
  0: 'rgba(0,0,0,0.05)',
  1: '#25A9AF'
};
// 默认disabled态透明度
const defaultBtnDisabledStyle = {
  0: null,
  1: { opacity: 0.3 }
};
// 默认disabled态文字颜色
const defaultTextDisabledStyle = {
  0: { color: '#cccccc' },
  1: null
};
const defaultStyle = {
  0: {
    height: LHUiUtils.GetPx(42),
    backgroundColor: '#ffffff',
    borderRadius: LHUiUtils.GetPx(5),
    justifyContent: 'center',
    borderWidth: LHUiUtils.MiJiaBorderWidth,
    borderColor: LHUiUtils.MiJiaLineColor
  },
  1: {
    height: LHUiUtils.GetPx(42),
    backgroundColor: '#32BAC0',
    borderRadius: LHUiUtils.GetPx(5),
    justifyContent: 'center'
  }
};
class LHButton extends React.Component {
  static defaultProps = {
    disabled: false,
    buttonType: 0 // 按钮类型，0: 按下态背景变灰，disabled态文字变灰；1:按下态背景使用深色，disabled态透明度变30%
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      style,
      btnTextStyle,
      btnText,
      disabled,
      pressBackgroundColor,
      buttonType,
      btnDisabledStyle,
      textDisabledStyle,
      onPress
    } = this.props;
    // 按压态背景色
    const btnPressBackgroundColor = pressBackgroundColor || defaultPressBackgroundColor[buttonType];
    return (
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={btnPressBackgroundColor}
        disabled={disabled}
        onPress={() => {
          if (typeof onPress === 'function') onPress();
        }}
        style={[defaultStyle[buttonType], style, disabled ? (btnDisabledStyle || defaultBtnDisabledStyle[buttonType]) : null]}
      >
        <View>
          <LHText
            style={[{
              width: '100%',
              fontSize: LHUiUtils.GetPx(13),
              lineHeight: LHUiUtils.GetPx(18),
              letterSpacing: 0,
              color: buttonType === 0 ? '#4C4C4C' : '#ffffff',
              textAlign: 'center',
              paddingHorizontal: LHUiUtils.GetPx(20)
            }, btnTextStyle, disabled ? (textDisabledStyle || defaultTextDisabledStyle[buttonType]) : null]}
          >
            {btnText || ''}
          </LHText>
        </View>
      </TouchableHighlight>
    );
  }
}

export default LHPureRenderDecorator(LHButton);
