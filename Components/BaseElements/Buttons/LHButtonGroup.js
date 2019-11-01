/**
* @module LHCommonUI/LHButtonGroup
* @description 按钮组
* @property {Object} style 按钮组样式
* @property {Object[]} buttons 按钮配置数据
* @property {number} buttons.buttonType 按钮类型，0: 按下态背景变灰，disabled态文字变灰；1:按下态背景使用深色，disabled态透明度变30%
* @property {string} buttons.btnText 按钮文字
* @property {Object} buttons.btnTextStyle 按钮文字样式
* @property {Object} buttons.textDisabledStyle 按钮文字disabled态样式
* @property {Object} buttons.style 按钮样式
* @property {Object} buttons.btnDisabledStyle 按钮disabled态样式
* @property {boolean} buttons.disabled 是否是disabled
* @property {Function} buttons.onPress 点击事件
* @property {string} buttons.pressBackgroundColor 按压态背景色
* @example
* import { LHButtonGroup } from "LHCommonUI";
* <LHButtonGroup
    style={{
      marginHorizontal: LHUiUtils.GetPx(10)
    }}
    buttons={[{
      btnText: '操作描述'
    },
    {
      btnText: '操作描述'
    }]}
  />
*
*/

import React from 'react';
import {
  View
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import {
  LHButton
} from 'LHCommonUI';

class LHButtonGroup extends React.Component {
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line
  renderButtons(item, index, buttonLength) {
    const borderLeft = {
      borderLeftWidth: LHUiUtils.MiJiaBorderWidth,
      borderLeftColor: LHUiUtils.MiJiaLineColor
    };
    return (
      <View
        key={'LHButtonGroup_' + index}
        style={[{
          flex: 1
        }, index > 0 ? borderLeft : null]}
      >
        <LHButton
          btnText={item.btnText}
          style={Object.assign({ height: buttonLength > 1 ? LHUiUtils.GetPx(42) - LHUiUtils.MiJiaBorderWidth * 2 : LHUiUtils.GetPx(42) }, item.style || {}, { borderRadius: 0, borderWidth: 0 })}
          buttonType={item.buttonType}
          btnTextStyle={item.btnTextStyle}
          disabled={item.disabled}
          pressBackgroundColor={item.pressBackgroundColor}
          textDisabledStyle={item.textDisabledStyle}
          btnDisabledStyle={item.btnDisabledStyle}
          onPress={() => {
            if (typeof item.onPress === 'function') item.onPress();
          }}
        />
      </View>
    );
  }

  render() {
    const {
      style,
      buttons
    } = this.props;
    return (
      <View
        style={[{
          flexDirection: 'row',
          borderWidth: LHUiUtils.MiJiaBorderWidth,
          borderColor: LHUiUtils.MiJiaLineColor,
          borderRadius: LHUiUtils.GetPx(5),
          overflow: 'hidden'
        }, style]}
      >
        {buttons.map((item, index) => {
          return this.renderButtons(item, index, buttons.length);
        })}
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHButtonGroup);
