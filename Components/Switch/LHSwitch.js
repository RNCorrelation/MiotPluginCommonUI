/**
* @module LHCommonUI/LHSleepMode
* @description 米家Switch控件，区别在于该控件是一个受控组件
* @property {bool} value - 开关状态，默认值 false
* @property {style} style - 开关样式，仅支持宽高
* @property {string} onTintColor - 打开时的背景颜色
* @property {string} tintColor - 关闭时的背景颜色，默认#f0f0f0
* @property {string} onTintDisabledColor - 打开时disabled态的背景颜色，不值得时disabled态使用透明度0.3，中间白色圆圈会看到后面背景色
* @property {string} tintDisabledColor - 关闭时disabled态的背景颜色,指定onTintDisabledColor时才有效 默认rgba(240, 240, 240, 0.3)
* @property {bool} disabled - 是否禁用，默认值 false
* @property {function} onValueChange - 切换开关的回调函数
*/

import PropTypes from 'prop-types';
import React from 'react';
import {
  Animated, StyleSheet, TouchableOpacity, View
} from 'react-native';
import {
  LHUiUtils
} from 'LHCommonFunction';

const OFF_COLOR = '#f0f0f0';
const BORDER_COLOR = 'rgba(0,0,0,0.1)';
const BACK_WIDTH = LHUiUtils.GetPx(44); // 默认宽度
const BACK_HEIGHT = LHUiUtils.GetPx(24); // 默认高度
const BORDER_WIDTH = LHUiUtils.MiJiaBorderWidth;
// const ratio = LHUiUtils.GetPx(6.5); // 容器高度和滚球尺寸比例
const minMargin = LHUiUtils.GetPx(3); // 容器和滚球之间的最小间距
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  back: {
    justifyContent: 'center',
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR
  },
  circle: {
    position: 'absolute',
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    backgroundColor: '#fff'
  }
});

export default class LHSwitch extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    value: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    style: PropTypes.object,
    onTintColor: PropTypes.string,
    tintColor: PropTypes.string,
    disabled: PropTypes.bool,
    onValueChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    value: false,
    style: {},
    onTintColor: LHUiUtils.MiJiaBlue,
    tintColor: OFF_COLOR,
    disabled: false
  }

  constructor(props) {
    super(props);
    this.state = {};
    const { style, value } = this.props;
    // 根据style的宽度计算出滚球的大小和间距
    const { width, height } = style;
    const backWidth = width || BACK_WIDTH;
    const backHeight = height || BACK_HEIGHT;
    // const margin = (backHeight / ratio) < minMargin
    //   ? minMargin
    //   : Math.round(backHeight / ratio);
    const margin = minMargin;
    const circleSize = backHeight - 2 * margin;
    // 滚球滚动最大距离
    this.offsetXMax = backWidth - backHeight;
    // 容器实际样式
    this.backStyle = {
      width: backWidth,
      height: backHeight,
      borderRadius: backHeight / 2
    };
    // 滚球实际样式
    this.circleStyle = {
      margin,
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2
    };
    this.offsetX = new Animated.Value(value ? this.offsetXMax : 0);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const { value } = this.props;
    if (newProps.value !== value) {
      this.animated(newProps.value);
    }
  }

  render() {
    const {
      value,
      onTintColor,
      tintColor,
      disabled
    } = this.props;
    const { width, height } = this.backStyle;
    const backgroundColor = value ? onTintColor : tintColor;
    const opacity = disabled ? 0.3 : 1;
    return (
      <View
        key={'LHSwitch_' + disabled}
        style={[styles.container, {
          borderWidth: BORDER_WIDTH,
          borderColor: BORDER_COLOR,
          width,
          height,
          borderRadius: height / 2,
          overflow: 'hidden'
        }]}
      >
        <TouchableOpacity
          style={[this.backStyle, { backgroundColor, opacity }]}
          disabled={disabled}
          activeOpacity={0.8}
          onPress={() => { return this.onValueChange(); }}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.circle, this.circleStyle, { transform: [{ translateX: this.offsetX }] }]}
        />
      </View>
    );
  }

  animated(value) {
    const toValue = value ? this.offsetXMax : 0;
    Animated.spring(this.offsetX,
      {
        toValue,
        bounciness: 9,
        speed: 9
      }).start();
  }

  onValueChange() {
    const { value, onValueChange } = this.props;
    if (onValueChange) {
      onValueChange(!value);
    }
  }
}
