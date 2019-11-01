/**
* @module LHCommonUI/LHImagesAnimate
* @description 图集动画组件
* @property {Array} images 图片资源数组
* @property {Object} imagesStyle 图片样式
* @property {boolean} [loop=false] 是否循环播放
* @property {boolean} [autoAnimate=true] 是否自动播放，为false时可通过ref来通过调用AnimateStart方法开始执行动画
* @property {number} time 一次主体动画执行时间（不包含delayTime和lastDelayTime）
* @property {number} [delayTime=0] 延迟执行动画时间，延迟阶段显示第一张图片
* @property {number} [lastDelayTime=0] 一次动画结束时最后一张图片停留时间
* @property {Function} [animateEnd] 一次动画执行结束回调
*
* @example
* import { LHImagesAnimate } from "LHCommonUI";
*
* <LHImagesAnimate
*   images={[require('图片资源地址'), require('图片资源地址1'), require('图片资源地址2'), require('图片资源地址3')]}
*   loop
*   time={1200}
*   imagesStyle={{width: 100, height: 100}}
* />
*
* <LHImagesAnimate
*   ref={(e) => {
*     this.ImagesAnimate = e; // 开始动画调用： this.ImagesAnimate.AnimateStart();
*   }}
*   autoAnimate={false}
*   images={[require('图片资源地址'), require('图片资源地址1'), require('图片资源地址2'), require('图片资源地址3')]}
*   loop
*   time={1200}
*   imagesStyle={{width: 100, height: 100}}
* />
*/
import React from 'react';
import {
  Animated,
  Easing
} from 'react-native';

import {
  LHPureRenderDecorator
} from 'LHCommonFunction';

const cacheInterpolate = {}; // 缓存Interpolate
class LHImagesAnimate extends React.Component {
  static defaultProps = {
    autoAnimate: true,
    images: [],
    loop: false,
    delayTime: 0,
    lastDelayTime: 0
  }

  static getInterpolate = (startValue, endValue, len) => {
    const key = startValue + '_' + endValue + '_' + len;
    // 输入一样，输出肯定一样
    if (cacheInterpolate[key]) return cacheInterpolate[key];
    const multiple = 100000000000;
    const increaseValue = (endValue - startValue) / len;
    const increase = increaseValue * multiple;
    const start = startValue * multiple;
    const result = {
      0: {
        input: [startValue, (start + increase) / multiple, (start + increase + 1) / multiple, endValue, endValue],
        output: [1, 1, 0, 0, 0]
      }
    };
    for (let i = 1; i < len - 1; i += 1) {
      const input = [startValue, (start + increase * i) / multiple, (start + increase * i + 1) / multiple, (start + increase * (i + 1)) / multiple, (start + increase * (i + 1) + 1) / multiple, endValue];
      const output = [0, 0, 1, 1, 0, 0];
      result[i] = {
        input,
        output
      };
    }
    result[len - 1] = {
      input: [startValue, (start + increase * (len - 1)) / multiple, (start + increase * (len - 1) + 1) / multiple, endValue],
      output: [0, 0, 1, 1]
    };
    // 缓存Interpolate
    cacheInterpolate[key] = result;
    return result;
  }

  constructor(props) {
    super(props);
    this.state = {
      imagesAnimate: new Animated.Value(0)
    };
  }

  componentDidMount() {
    const { autoAnimate } = this.props;
    if (autoAnimate) this.AnimateStart();
  }

  componentWillUnmount() {
    const { imagesAnimate } = this.state;
    if (imagesAnimate) imagesAnimate.stopAnimation();
  }

  AnimateStart() {
    const { imagesAnimate } = this.state;
    const {
      loop,
      time,
      delayTime,
      lastDelayTime,
      animateEnd
    } = this.props;
    imagesAnimate.setValue(0);
    Animated.timing(
      imagesAnimate,
      {
        toValue: 1,
        duration: (time || 1000) + delayTime + lastDelayTime,
        easing: Easing.linear
      }
    ).start((e) => {
      if (e.finished) {
        if (typeof animateEnd === 'function') animateEnd(this);
        if (loop) this.AnimateStart();
      }
    });
  }

  renderInnerImg(item, index) {
    const { imagesAnimate } = this.state;
    const {
      imagesStyle,
      images,
      time,
      delayTime,
      lastDelayTime
    } = this.props;
    const startValue = delayTime / (time + delayTime + lastDelayTime);
    const endValue = 1 - (lastDelayTime / (time + delayTime + lastDelayTime));
    const interpolates = LHImagesAnimate.getInterpolate(startValue || 0, endValue, images.length);
    return (
      <Animated.Image
        key={'imagesAnimate_' + index}
        style={[imagesStyle, {
          opacity: imagesAnimate.interpolate({
            inputRange: interpolates[index].input,
            outputRange: interpolates[index].output
          })
        }]}
        source={item}
      />
    );
  }

  render() {
    const {
      images
    } = this.props;
    return images.map((item, i) => { return this.renderInnerImg(item, i); });
  }
}
export default LHPureRenderDecorator(LHImagesAnimate);
