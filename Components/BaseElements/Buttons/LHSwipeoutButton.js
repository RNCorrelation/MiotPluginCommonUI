/**
* @module LHCommonUI/LHSwipeoutButton
* @description 测滑删除、重命名、更多按钮组件
* @property {Object} style 按钮样式
* @property {string} text 按钮文案
* @property {string} [type=delete] 按钮类型，delete: 删除，rename: 重命名，more: 更多，默认删除
* @property {boolean} [hideIcon=false] 隐藏图标
* @property {string} [icon] 图标资源
* @example
* import { LHSwipeoutButton } from "LHCommonUI";
* <LHSwipeoutButton text={LHCommonLocalizableString.common_button_delete} />
*
*/

import React from 'react';
import {
  View,
  Image
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import {
  LHText,
  LHCommonIcon
} from 'LHCommonUI';

class LHSwipeoutButton extends React.Component {
  static defaultProps = {
    type: 'delete'
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      style,
      text,
      type,
      hideIcon,
      icon
    } = this.props;
    const iconEle = hideIcon ? null : (
      <Image
        resizeMode="contain"
        style={{
          width: LHUiUtils.GetPx(24),
          height: LHUiUtils.GetPx(24)
        }}
        source={icon || (type === 'more' ? LHCommonIcon.common.swipeBtnMore : (type === 'rename' ? LHCommonIcon.common.rename.white : LHCommonIcon.common.delete.white))}
      />
    );
    return (
      <View
        style={[{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: type === 'more' ? '#A1ADB8' : (type === 'rename' ? '#FCBD4E' : '#F43F31')
        }, style]}
      >
        {iconEle}
        <LHText
          style={{
            color: '#fff',
            fontSize: LHUiUtils.GetPx(12),
            lineHeight: LHUiUtils.GetPx(16)
          }}
        >
          {text}
        </LHText>
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHSwipeoutButton);
