/**
* @module LHCommonUI/LHPopover
* @description 气泡提示组件
* @property {boolean} visible 是否显示
* @property {string} text 提示文案
* @property {Object} [textStyle] 文字样式
* @property {Object} [textContainerStyle] 文字容器样式，popover背景色设置在这里
* @property {string} [type] popover类型，值为fullScreen覆盖全屏，点击区域为全屏，其余值点击区域为popover
* @property {Function} [press] 点击回调
* @property {string} [position] 三角箭头的位置,options: ['top', 'right', 'bottom', 'left'], 暂时只实现了top
* @property {Object} [arrowStyle] 三角箭头样式
*
* @example
* import { LHPopover } from "LHCommonUI";
*
* <LHPopover
*   visible
*   text="1234567"
* />
*/
import React from 'react';
import {
  Modal,
  Image,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';

import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  fullScreen: {
    width,
    height
  },
  popoverContainer: {
    // paddingHorizontal: LHUiUtils.GetPx(15),
    paddingTop: 7,
    zIndex: 1
  },
  textContainer: {
    paddingHorizontal: LHUiUtils.GetPx(13),
    paddingVertical: LHUiUtils.GetPx(12),
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: LHUiUtils.GetPx(7)
    // shadowOffset: {
    //   width: 0,
    //   height: LHUiUtils.GetPx(5)
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: LHUiUtils.GetPx(25),
    // shadowColor: '#000'
  },
  text: {
    color: LHUiUtils.MiJiaWhite,
    opacity: 0.8,
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    letterSpacing: -0.11,
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  posA: {
    position: 'absolute'
  },
  arrow: {
    zIndex: 3
  }
});
class LHPopover extends React.Component {
  static defaultProps = {
    type: 'fullScreen',
    position: 'top'
  };

  static getArrowImg = (position, arrowStyle) => {
    let style = null;
    const source = require('../../Resources/lumi_smoke_bubble_top.png');
    if (position === 'top') {
      style = {
        width: 15,
        height: 8,
        top: -1,
        transform: [{ translateX: -7.5 }]
      };
    } else if (position === 'bottom') {
      style = {
        bottom: 0,
        left: '50%',
        width: LHUiUtils.GetPx(15),
        height: LHUiUtils.GetPx(8),
        transform: [{ translateX: LHUiUtils.GetPx(-7.5) }]
      };
    } else if (position === 'left') {
      style = {
        bottom: '50%',
        left: 0,
        width: LHUiUtils.GetPx(15),
        height: LHUiUtils.GetPx(8),
        transform: [{ translateY: LHUiUtils.GetPx(-4) }]
      };
    } else if (position === 'right') {
      style = {
        bottom: '50%',
        right: 0,
        width: LHUiUtils.GetPx(15),
        height: LHUiUtils.GetPx(8),
        transform: [{ translateY: LHUiUtils.GetPx(-4) }]
      };
    }
    return (<Image source={source} style={[styles.posA, styles.arrow, style, arrowStyle]} />);
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      visible,
      text,
      popoverContainerStyle,
      textStyle,
      textContainerStyle,
      press,
      type,
      position,
      arrowStyle
    } = this.props;
    const arrowImg = LHPopover.getArrowImg(position, arrowStyle);
    const popover = (
      <View
        style={[
          styles.popoverContainer,
          {
            paddingLeft: position === 'left' ? LHUiUtils.GetPx(15) : 0,
            paddingRight: position === 'right' ? LHUiUtils.GetPx(15) : 0
          },
          popoverContainerStyle,
          type === 'fullScreen' ? null : { opacity: visible ? 1 : 0 }
        ]}
      >
        <View style={[styles.textContainer, textContainerStyle]}>
          <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
        {arrowImg}
      </View>
    );
    if (type === 'fullScreen') {
      return (
        <Modal
          animationType="none"
          transparent
          visible={visible}
          onRequestClose={() => { }}
          onShow={() => { }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              if (typeof press === 'function') press();
            }}
          >
            <View
              style={styles.fullScreen}
            >
              {popover}
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    } else {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            if (visible && typeof press === 'function') press();
          }}
        >
          {popover}
        </TouchableWithoutFeedback>
      );
    }
  }
}
export default LHPureRenderDecorator(LHPopover);
