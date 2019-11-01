/**
* @module LHCommonUI/LHBottomButtonGroup
* @description 底部按钮组：删除、重命名、收藏、置顶、移动等
* @property {Object} style 容器样式
* @property {Object[]} buttons 按钮配置数据
* @property {number} [buttons.icon] 按钮图标
* @property {number} [buttons.type] 默认按钮图标类型，delete、rename、move、top、collect
* @property {string} buttons.text 按钮文字
* @property {Object} buttons.btnDisabledStyle 按钮disabled态样式
* @property {boolean} buttons.disabled 是否是disabled
* @property {Function} buttons.onPress 点击事件
* @example
* import { LHBottomButtonGroup } from "LHCommonUI";
* <LHBottomButtonGroup
    buttons={[{
      text: '删除',
      type: 'delete'
    },
    {
      text: '重命名',
      type: 'delete'
    }]}
  />
*
*/

import React from 'react';
import {
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils,
  LHDeviceUtils
} from 'LHCommonFunction';
import {
  LHSeparator,
  LHText,
  LHCommonIcon
} from 'LHCommonUI';

class LHBottomButtonGroup extends React.Component {
  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line
  renderButtons(item, index) {
    return (
      <TouchableOpacity
        key={'LHBottomButtonGroup_' + index}
        disabled={item.disabled || false}
        style={{
          height: '100%',
          minWidth: LHUiUtils.GetPx(49),
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          marginHorizontal: LHUiUtils.GetPx(7)
        }}
        onPress={() => {
          if (typeof item.onPress === 'function') item.onPress();
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            width: LHUiUtils.GetPx(25),
            height: LHUiUtils.GetPx(25),
            opacity: item.disabled ? 0.38 : 1
          }}
          source={item.icon || (
            item.type === 'rename' ? LHCommonIcon.common.rename.normal : (
              item.type === 'collect' ? LHCommonIcon.bottomViewIcon.bottom_bar_collect : (
                item.type === 'move' ? LHCommonIcon.bottomViewIcon.bottom_bar_move : (
                  item.type === 'top' ? LHCommonIcon.bottomViewIcon.bottom_bar_top : LHCommonIcon.common.delete.normal
                )
              )
            )
          )}
        />
        <LHText
          style={{
            fontSize: LHUiUtils.GetPx(10),
            lineHeight: LHUiUtils.GetPx(13),
            color: '#333',
            textAlign: 'center',
            marginBottom: LHUiUtils.GetPx(4),
            opacity: item.disabled ? 0.38 : 1
          }}
        >
          {item.text}
        </LHText>
      </TouchableOpacity>
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
          height: LHUiUtils.GetPx(67) + LHDeviceUtils.AppHomeIndicatorHeight,
          paddingBottom: LHDeviceUtils.AppHomeIndicatorHeight,
          width: '100%',
          backgroundColor: LHUiUtils.MiJiaWhite,
          justifyContent: 'center',
          flexDirection: 'row'
        }, style]}
      >
        {buttons.map((item, index) => {
          return this.renderButtons(item, index);
        })}
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <LHSeparator
            style={{
              alignSelf: 'flex-start'
            }}
          />
        </View>
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHBottomButtonGroup);
