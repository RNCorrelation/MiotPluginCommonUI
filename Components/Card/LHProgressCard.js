/*
 * @Date: 2019-08-05 11:33:15
 * @LastEditors: Lavie
 * @LastEditTime: 2019-10-23 12:10:47
 */
/**
* @module LHCommonUI/LHProgressCard
* @description 选择条卡片
* @property {string} progressTitle 卡片的标题
* @property {string} subTitleUnit 卡片副标题的单位
* @property {object} subTitleStyle 卡片副标题的样式
* @property {object} subTitleUnitStyle 卡片副标题的单位的样式
* @property {boolean} progressEnable 选择条是否可操作
* @property {number} minValue 选择条的最小值
* @property {number} maxValue 选择条的最大值
* @property {string} enableBgColor 选择条可操作时的背景颜色
* @property {string} enableProgressColor 选择条可操作时拖动后的背景颜色
* @property {string} disableBgColor 选择条不可操作时的背景颜色
* @property {string} disableProgressColor 选择条不可操作时拖动后的背景颜色
* @property {boolean} showImg=false 选择条左右两边显示图片还是文字
* @property {string} minImgOnSource 选择条左边显示图片可操作时的图片
* @property {string} minImgOffSource 选择条左边显示图片不可操作时的图片
* @property {string} maxImgOnSource 选择条右边显示图片可操作时的图片
* @property {string} maxImgOffSource 选择条右边显示图片不可操作时的图片
* @property {Object} minStyle 选择条左边显示的样式
* @property {Object} maxStyle 选择条右边显示的样式
* @property {Object} cardStyle 自定义卡片样式
* @property {function} changeProgressValue(value,failCallback) 选择条值改变之后的回调，有两个参数，一个值，一个是用于父组件改变值失败，将选择条复位的回调
* @property {function} enabledScroll(bool) 掉用页面的ScrollView是否可以滚动，搭配scrollEnabled一起使用
* @example
* import { LHProgressCard } from "LHCommonUI";
*
* <LHProgressCard
* progressTitle={LHLocalizedStrings.mi_linuxHub_main_light_intensity}
* subTitleUnit="%"
* value={brightnessValue}
* changeProgressValue={this.changeBrightness}
* progressEnable={rgbOn}
* minValue={3}
* maxValue={100}
* showImg
* minImgOnSource={Resources.MainPage.homepageOnMin}
* minImgOffSource={Resources.MainPage.homepageOffMin}
* maxImgOnSource={Resources.MainPage.homepageOnMax}
* maxImgOffSource={Resources.MainPage.homepageOffMax}
* />
*/
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  Easing,
  Dimensions
} from 'react-native';
import Card from 'miot/ui/Card';
import {
  LHPureRenderDecorator, LHUiUtils
} from 'LHCommonFunction';
import { LHText } from 'LHCommonUI';

const { width } = Dimensions.get('window');
const initWidth = LHUiUtils.GetPx(46);
const progressWidth = width - LHUiUtils.GetPx(20) - LHUiUtils.GetPx(40);
const titleHeight = LHUiUtils.GetPx(53, 360, 320);
const styles = StyleSheet.create({
  defaultCardStyle: {
    height: LHUiUtils.GetPx(119),
    marginLeft: LHUiUtils.GetPx(10),
    marginRight: LHUiUtils.GetPx(10),
    borderRadius: LHUiUtils.GetPx(8),
    marginBottom: LHUiUtils.GetPx(10),
    marginTop: 0,
    width: width - LHUiUtils.GetPx(10) * 2
  },
  lightCard: {
    height: LHUiUtils.GetPx(119),
    backgroundColor: '#fff',
    borderRadius: 10
  },
  cardTitle: {
    marginLeft: LHUiUtils.GetPx(19.1),
    marginTop: LHUiUtils.GetPx(16.2),
    fontSize: LHUiUtils.GetPx(14),
    color: '#333333',
    textAlignVertical: 'bottom',
    paddingVertical: 0
  },
  cardTitleLine: {
    color: 'rgba(0,0,0,0.3)',
    // opacity: 0.3,
    height: LHUiUtils.GetPx(14),
    width: LHUiUtils.GetPx(0.5),
    marginLeft: LHUiUtils.GetPx(5.9),
    marginRight: LHUiUtils.GetPx(6.5)
  },
  cardSubTitle: {
    fontSize: LHUiUtils.GetPx(12),
    color: '#666666',
    textAlignVertical: 'bottom',
    paddingVertical: 0
  },
  progressGreyBg: {
    marginTop: LHUiUtils.GetPx(17.8),
    marginBottom: LHUiUtils.GetPx(20),
    height: LHUiUtils.GetPx(46),
    backgroundColor: '#EBF2F7',
    borderRadius: LHUiUtils.GetPx(23),
    marginLeft: LHUiUtils.GetPx(20),
    marginRight: LHUiUtils.GetPx(20),
    justifyContent: 'center'
  },
  progressImgMin: {
    position: 'absolute',
    left: LHUiUtils.GetPx(13),
    width: LHUiUtils.GetPx(20),
    height: LHUiUtils.GetPx(20)
  },
  progressImgPickerBg: {
    backgroundColor: '#00BEFF',
    borderRadius: LHUiUtils.GetPx(23),
    width: progressWidth,
    height: LHUiUtils.GetPx(46),
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressImgPicker: {
    position: 'absolute',
    right: LHUiUtils.GetPx(5),
    width: LHUiUtils.GetPx(36),
    height: LHUiUtils.GetPx(36),
    borderRadius: LHUiUtils.GetPx(18),
    backgroundColor: '#fff'
  },
  progressImgMax: {
    position: 'absolute',
    right: LHUiUtils.GetPx(13),
    width: LHUiUtils.GetPx(20),
    height: LHUiUtils.GetPx(20),
    zIndex: -1
  }
});

class LHProgressCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progressValue: new Animated.Value(props.minValue),
      minValue: props.minValue,
      maxValue: props.maxValue
    };
  }

  componentWillMount() {
    this.brightnessPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => { return true; },
      onStartShouldSetPanResponderCapture: () => { return true; },
      onMoveShouldSetPanResponder: () => { return true; },
      onMoveShouldSetPanResponderCapture: () => { return true; },

      onPanResponderGrant: (evt, gestureState) => {
        // console.log('onPanResponderGrant onPanResponderMove', gestureState.x0);
        this.setScroll(false);
      },
      onPanResponderMove: (evt, gestureState) => {
        // console.log('onPanResponderMove', gestureState.vx, gestureState.vy, gestureState.dx);
        // if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dx) < LHUiUtils.GetPx(50)) {
        //   this.setScroll(true);
        //   return;
        // }
        // 哪些情况是不能让滑动的 1、只有垂直的滑动，没有水平的滑动
        // if (Math.abs(gestureState.vx) < Math.abs(gestureState.vy)) {
        //   this.setScroll(true);
        //   return;
        // }
        const { x0, dx } = gestureState;
        const mLocationX = x0 - 33 + dx;
        this.changeProgress(mLocationX, false);
      },
      onPanResponderTerminationRequest: () => { return false; },
      onPanResponderEnd: (evt, gestureState) => {
        // console.log('onPanResponderEnd', Math.abs(gestureState.dx), gestureState.x0, evt.nativeEvent.locationX, gestureState.x0 + gestureState.dx === evt.nativeEvent.locationX);
        // if (Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dx) < LHUiUtils.GetPx(50)) {
        //   this.setScroll(true);
        //   return;
        // }
        // if (Math.abs(gestureState.vx) < Math.abs(gestureState.vy)) {
        //   this.setScroll(true);
        //   return;
        // }
        this.setScroll(true);
        const { x0, dx } = gestureState;
        const mLocationX = x0 - 33 + dx;
        this.changeProgress(mLocationX, true);
      },
      onPanResponderTerminate: () => {
      },
      onShouldBlockNativeResponder: () => {
        return true;
      }
    });
  }

  componentDidMount() {
    const { value, minValue, maxValue } = this.props;
    this.setState({
      minValue,
      maxValue
    });
    this.setProgressValue(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value, minValue, maxValue } = this.props;
    const { progressValue } = this.state;
    const { _value } = progressValue;
    let newValue = _value;
    if (minValue !== nextProps.minValue) {
      newValue = newValue < nextProps.minValue ? nextProps.minValue : newValue;
      this.setState({
        minValue: nextProps.minValue
      });
    }
    if (maxValue !== nextProps.maxValue) {
      newValue = newValue > nextProps.maxValue ? nextProps.maxValue : newValue;
      this.setState({
        maxValue: nextProps.maxValue
      });
    }
    if (value !== nextProps.value) {
      newValue = nextProps.value;
      if (newValue < nextProps.minValue) {
        newValue = nextProps.minValue;
      }
      if (newValue > nextProps.maxValue) {
        newValue = nextProps.maxValue;
      }
    }
    progressValue.setValue(newValue);
    this.setState({
      progressValue
    });
  }

  setProgressValue = (value) => {
    const { progressValue, minValue, maxValue } = this.state;
    const showValue = value < minValue ? Number(minValue) : value > Number(maxValue) ? Number(maxValue) : value;
    progressValue.setValue(showValue);
    this.setState({
      progressValue
    });
  }

  /**
    * @description: 设置调用页面是否可以滑动
    * @param {type}
    * @return:
    */
   setScroll = (bool) => {
     const { enabledScroll } = this.props;
     if (typeof enabledScroll === 'function') {
       enabledScroll(bool);
     }
   }

  changeProgress = (currentX, isRelease) => {
    const { changeProgressValue } = this.props;
    const { progressValue, minValue, maxValue } = this.state;
    let progressX = minValue + (currentX - initWidth) / ((progressWidth - initWidth) / (Number(maxValue) - Number(minValue)));
    // console.warn(progressX);
    if (progressX <= Number(minValue)) {
      progressX = Number(minValue);
    }
    if (progressX >= Number(maxValue)) {
      progressX = Number(maxValue);
    }
    const value = progressX;
    progressValue.setValue(value);
    // console.log('LHLightProgressView componentWillMount changeBrightnessValue', progressX, progressWidth, initWidth / progressWidth);
    this.setState({
      progressValue
    });
    if (isRelease && typeof changeProgressValue === 'function') {
      const moveX = Math.ceil(progressX);
      changeProgressValue(moveX, (res, cacheValue) => {
        if (res) {
          this.setProgressValue(cacheValue);
        }
      });
    }
  }

  animateStart(value) {
    const { progressValue } = this.state;
    Animated.timing(
      progressValue,
      {
        toValue: value,
        duration: 0,
        easing: Easing.linear
      }
    ).start(() => {});
  }

  render() {
    const { progressValue, minValue, maxValue } = this.state;
    const { _value } = progressValue;
    const {
      progressTitle,
      subTitleUnit,
      titleStyle,
      subTitleStyle,
      subTitleUnitStyle,
      progressEnable,
      enableBgColor,
      enableProgressColor,
      disableBgColor,
      disableProgressColor,
      showImg,
      minImgOnSource,
      minImgOffSource,
      maxImgOnSource,
      maxImgOffSource,
      minStyle,
      maxStyle,
      cardStyle
    } = this.props;
    const minProgress = (initWidth / progressWidth * 100) + '%';
    const progress = progressEnable ? (
      <View style={[styles.progressGreyBg, { backgroundColor: enableBgColor || '#EBF2F7' }]} {...this.brightnessPanResponder.panHandlers} pointerEvents="box-only">
        <Animated.View
          style={[styles.progressImgPickerBg, {
            width: progressValue.interpolate({
              inputRange: [Number(minValue), Number(maxValue)],
              outputRange: [minProgress, '100%']
            }),
            backgroundColor: enableProgressColor || '#00BEFF'
          }]}
        >
          <View style={styles.progressImgPicker} />
        </Animated.View>
        {showImg ? <Image style={[styles.progressImgMin, minStyle || {}]} source={minImgOnSource} /> : <LHText style={[styles.progressImgMin, minStyle || {}]}>{minValue || ''}</LHText>}
        {showImg ? <Image style={[styles.progressImgMax, maxStyle || {}]} source={maxImgOnSource} /> : <LHText style={[styles.progressImgMax, maxStyle || {}]}>{maxValue || ''}</LHText>}
      </View>
    ) : (
      <View style={[styles.progressGreyBg, { backgroundColor: disableBgColor || 'rgba(223,226,227,0.3)' }]}>
        <Animated.View
          style={[styles.progressImgPickerBg, {
            width: progressValue.interpolate({
              inputRange: [Number(minValue), Number(maxValue)],
              outputRange: [minProgress, '100%']
            }),
            backgroundColor: disableProgressColor || 'rgba(176,182,184,0.3)'
          }]}
        >
          <View style={styles.progressImgPicker} />
        </Animated.View>
        {showImg ? <Image style={[styles.progressImgMin, minStyle || {}]} source={minImgOffSource} /> : <LHText style={[styles.progressImgMin, minStyle || {}]}>{minValue || ''}</LHText>}
        {showImg ? <Image style={[styles.progressImgMax, maxStyle || {}]} source={maxImgOffSource} /> : <LHText style={[styles.progressImgMax, maxStyle || {}]}>{maxValue || ''}</LHText>}
      </View>
    );

    const titleElement = progressTitle ? (
      <View
        style={{
          flex: 1,
          height: titleHeight,
          flexDirection: 'row',
          paddingLeft: LHUiUtils.GetPx(19),
          paddingRight: LHUiUtils.GetPx(19),
          alignItems: 'center'
        }}
      >
        <LHText
          numberOfLines={1}
          style={[{
            color: '#333',
            fontSize: LHUiUtils.GetPx(14),
            lineHeight: LHUiUtils.GetPx(19),
            letterSpacing: 0,
            maxWidth: '70%'
          }, titleStyle]}
        >
          {progressTitle}
        </LHText>

        <View
          style={[{
            width: LHUiUtils.MiJiaBorderWidth,
            height: LHUiUtils.GetPx(14),
            marginHorizontal: LHUiUtils.GetPx(6),
            backgroundColor: 'rgba(0,0,0,0.3)'
          }]}
        />

        <LHText style={[styles.cardSubTitle, subTitleStyle || {}]} includeFontPadding={false}>{Math.ceil(_value)}</LHText>
        <LHText style={[styles.cardSubTitle, subTitleUnitStyle || {}]} includeFontPadding={false}>{subTitleUnit || ''}</LHText>
      </View>
    ) : null;

    const renderInnerView = () => {
      return (
        <View style={[styles.lightCard, { backgroundColor: progressEnable ? '#fff' : 'rgba(255, 255, 255, 0.3)' }]}>
          <View style={{
            opacity: progressEnable ? 1 : 0.3,
            flex: 1,
            flexDirection: 'row'
          }}
          >
            {titleElement}
          </View>
          {progress}
        </View>
      );
    };

    return (
      <Card
        innerView={renderInnerView()}
        visible
        cardStyle={{
          ...StyleSheet.flatten(styles.defaultCardStyle),
          ...(cardStyle || {})
        }}
        showShadow
      />
    );
  }
}

export default LHPureRenderDecorator(LHProgressCard);