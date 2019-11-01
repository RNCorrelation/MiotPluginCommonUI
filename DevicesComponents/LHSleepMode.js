/**
* @module LHCommonUI/LHSleepMode
* @description 安睡模式温度选择
* @property {Array} value 选中的温度值
* @property {Array} time 时间段
* @property {number} [max=30] 温度最大值，默认30
* @property {number} [min=0] 温度最小值，默认0
* @property {Object} style 容器样式
* @property {boolean} [showTopSeparator=true] 是否显示上分割线
* @property {boolean} [showBottomSeparator=true] 是否显示下分割线
* @property {Function} touchStart 触摸开始事件，可以在这里锁定页面滑动
* @property {Function} touchEnd 触摸结束事件，可以在这里解除锁定页面滑动，返回参数(index, value)改变数据的索引值和数值
* @property {Function} onChange 值改变事件事件，返回参数(index, value)改变数据的索引值和数值
* @example
this.state = {
  value: [20, 30, 27, 18],
  scrollEnabled: true // 可滑动页面用这个来控制滑动
}
<LHSleepMode
  max={30}
  min={0}
  time={['23:00', '00:00', '06:00', '07:00']}
  value={value}
  touchEnd={(index, value) => {
    const { value: newValue } = this.state;
    newValue[index] = value;
    console.log(value);
    this.setState({
      scrollEnabled: true
    });
  }}
  touchStart={() => {
    this.setState({
      scrollEnabled: false
    });
  }}
/>
*
*/

import React from 'react';
import {
  PanResponder,
  View,
  Image,
  Dimensions
} from 'react-native';
import {
  LHPureRenderDecorator,
  LHUiUtils,
  CommonMethod
} from 'LHCommonFunction';
import {
  LHText,
  LHSeparator
} from 'LHCommonUI';

const { width } = Dimensions.get('window');
class LHSleepMode extends React.Component {
  static defaultProps = {
    showTopSeparator: true,
    showBottomSeparator: true,
    max: 30,
    min: 0
  }

  constructor(props) {
    super(props);
    // 当前拖动的项的索引
    this.dragIndex = null;
    this.state = {
      value: props.value
    };
  }

  componentWillMount() {
    let startValue = 0;
    let startY = 0;
    let startLocationY = 0;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => { return true; },
      onStartShouldSetPanResponderCapture: () => { return true; },
      onMoveShouldSetPanResponder: () => { return true; },
      onMoveShouldSetPanResponderCapture: () => { return true; },
      onPanResponderGrant: (evt, gestureState) => {
        const { touchStart } = this.props;
        if (typeof touchStart === 'function') touchStart();
        startLocationY = evt.nativeEvent.locationY;
        startY = gestureState.dy;
        this.dragIndex = this.getDragIndex(evt.nativeEvent.locationX);
        const { value } = this.state;
        startValue = value[this.dragIndex];
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          max,
          min,
          onChange
        } = this.props;
        const { value } = this.state;
        const copyValue = CommonMethod.DeepClone(value, []);
        let newValue = startValue + (startY - gestureState.dy) / LHUiUtils.GetPx(175) * (max - this.getMin());
        if (newValue < min) newValue = min;
        if (newValue > max) newValue = max;
        copyValue[this.dragIndex] = newValue;
        this.setState({
          value: copyValue
        });
        if (typeof onChange === 'function') onChange(this.dragIndex, Math.round(copyValue[this.dragIndex]));
      },
      onPanResponderTerminationRequest: () => { return false; },
      onPanResponderRelease: (evt) => {
        const {
          max,
          min,
          touchEnd,
          onChange
        } = this.props;
        const { value } = this.state;
        const copyValue = CommonMethod.DeepClone(value, []);
        const { locationY } = evt.nativeEvent;
        // 点击的处理
        if (Math.abs(startLocationY - locationY) < 1) {
          let newValue = this.getMin() + (1 - locationY / LHUiUtils.GetPx(175)) * (max - this.getMin());
          if (newValue < min) newValue = min;
          if (newValue > max) newValue = max;
          copyValue[this.dragIndex] = newValue;
          console.log(newValue);
          this.setState({
            value: copyValue
          });
        }
        if (typeof onChange === 'function') onChange(this.dragIndex, Math.round(copyValue[this.dragIndex]));
        if (typeof touchEnd === 'function') touchEnd(this.dragIndex, Math.round(copyValue[this.dragIndex]));
      },
      onPanResponderTerminate: () => {
        // 解决 onPanResponderRelease 在Android上快速滑动时不会回调。
        const {
          touchEnd
        } = this.props;
        const { value } = this.state;
        const copyValue = CommonMethod.DeepClone(value, []);
        if (typeof touchEnd === 'function') touchEnd(this.dragIndex, Math.round(copyValue[this.dragIndex]));
      },
      onShouldBlockNativeResponder: () => { return true; }
    });
  }

  componentWillReceiveProps(newProps) {
    const { value } = this.state;
    const newValue = newProps.value;
    const copyValue = CommonMethod.DeepClone(value, []);
    let valueChange = false;
    for (let i = 0, len = newValue.length; i < len; i += 1) {
      if (newValue[i] !== Math.round(copyValue[i])) {
        copyValue[i] = newValue[i];
        valueChange = true;
      }
    }
    if (valueChange) {
      this.setState({
        value: copyValue
      });
    }
  }

  // eslint-disable-next-line
  getDragIndex(x) {
    const dragViewWidth = width - LHUiUtils.GetPx(24) * 2;
    const xRate = x / dragViewWidth;
    if (xRate < (50 + 0.5) / 312) {
      return 0;
    } else if (xRate >= (50 + 0.5) / 312 && xRate < (50 + 142 + 1.5) / 312) {
      return 1;
    } else if (xRate >= (50 + 142 + 1.5) / 312 && xRate < (50 + 142 + 50 + 2.5) / 312) {
      return 2;
    } else {
      return 3;
    }
  }

  // 底部要预留19dp的值，所以实际最小值要适配一下
  getMin() {
    const { max, min } = this.props;
    const range = max - min;
    return min - range / ((LHUiUtils.GetPx(175) - LHUiUtils.GetPx(19)) / LHUiUtils.GetPx(19));
  }

  // eslint-disable-next-line
  renderValue(value, index) {
    return (
      <View
        key={'LHSleepModeValue_' + index}
        style={{
          flex: index === 1 ? 142 : (index === 3 ? 67 : 50),
          marginBottom: LHUiUtils.GetPx(12),
          alignItems: 'center'
        }}
      >
        <LHText
          style={{
            fontSize: LHUiUtils.GetPx(12),
            lineHeight: LHUiUtils.GetPx(16),
            color: '#999',
            letterSpacing: 0
          }}
        >
          {Math.round(value) + '°C'}
        </LHText>
      </View>
    );
  }

  // eslint-disable-next-line
  renderBar(value, index) {
    const { max } = this.props;
    return (
      <View
        pointerEvents="none"
        key={'LHSleepMode_' + index}
        style={{
          backgroundColor: '#F2F2F2',
          flex: index === 1 ? 142 : (index === 3 ? 67 : 50),
          height: '100%',
          borderRightWidth: index === 3 ? 0 : LHUiUtils.GetPx(1),
          borderRightColor: '#fff',
          justifyContent: 'flex-end',
          overflow: 'hidden'
        }}
      >
        <View
          pointerEvents="none"
          style={{
            backgroundColor: '#5FA7FE',
            width: '100%',
            alignItems: 'center',
            height: '100%',
            // height: (value - this.getMin()) / (max - this.getMin()) * 100 + '%'
            transform: [{
              translateY: (1 - (value - this.getMin()) / (max - this.getMin())) * LHUiUtils.GetPx(175)
            }]
          }}
        >
          <View
            pointerEvents="none"
            style={{
              width: LHUiUtils.GetPx(20),
              marginTop: LHUiUtils.GetPx(6)
            }}
          >
            <Image
              pointerEvents="none"
              resizeMode="contain"
              style={{
                width: LHUiUtils.GetPx(20),
                height: LHUiUtils.GetPx(7)
              }}
              source={require('../Resources/other/ac_sleep_adjust_icon.png')}
            />
          </View>
        </View>
      </View>
    );
  }

  // eslint-disable-next-line
  renderTime(time, index) {
    return (
      <View
        key={'LHSleepModeTime_' + index}
        style={{
          flex: index === 1 ? 142 : (index === 3 ? 67 : 50),
          marginTop: LHUiUtils.GetPx(6)
        }}
      >
        <LHText
          style={{
            fontSize: LHUiUtils.GetPx(8),
            lineHeight: LHUiUtils.GetPx(10),
            color: '#7F7F7F',
            letterSpacing: 0,
            marginLeft: index !== 0 ? LHUiUtils.GetPx(-10) : 0
          }}
        >
          {time}
        </LHText>
      </View>
    );
  }

  render() {
    const {
      style,
      showTopSeparator,
      showBottomSeparator,
      time
    } = this.props;
    const { value } = this.state;
    return (
      <View
        style={[{
          backgroundColor: '#fff'
        }, style]}
      >
        {
          showTopSeparator ? (
            <LHSeparator
              style={{
                alignSelf: 'flex-start',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0
              }}
            />
          ) : null
        }
        <View
          style={{
            paddingHorizontal: LHUiUtils.GetPx(24),
            paddingVertical: LHUiUtils.GetPx(24)
          }}
        >
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            {value.map((item, index) => {
              return this.renderValue(item, index);
            })}
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F2F2F2',
              height: LHUiUtils.GetPx(175)
            }}
            {...this.panResponder.panHandlers}
          >
            {value.map((item, index) => {
              return this.renderBar(item, index);
            })}
          </View>
          <View
            style={{
              flexDirection: 'row'
            }}
          >
            {time.map((item, index) => {
              return this.renderTime(item, index);
            })}
          </View>
        </View>
        {
          showBottomSeparator ? (
            <LHSeparator
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
              }}
            />
          ) : null
        }
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHSleepMode);
