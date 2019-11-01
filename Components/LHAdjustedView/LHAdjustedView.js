/**
* @module LHCommonUI/LHAdjustedView
* @description 传入header和footer两个View及其高度，
* 如果两个view的高度大于屏幕高度，scrollView可以滑动；
* 如果两个view的高度小于屏幕高度，scrollView不能滑动，而且中间填充view
* @property {component} headerView headerView
* @property {number} headerHeight headerView的高度
* @property {component} footerView footerView
* @property {number} footerHeight footerView的高度
* @property {number} bottomHeight bottomHeight
* @property {boolean} shouldRenderAnimated 是否平滑变化 default:true
* @property {function} onScrollViewScroll 页面滑动回调
* @property {object} style scrollview style
* @property {object} scrollViewContainerStyle scrollview container style
* @example
* import { LHAdjustedView } from "LHCommonUI";
*
*  render() {
  *    const { isOn, isPlugged } = this.state;
  *    return (
  *      <View style={[isOn ? styles.scrollView : styles.mainPageDarkBg, styles.flex]}>
  *        <LHAdjustedView
  *          headerView={this.renderHeaderView()}
  *          headerHeight={LHUiUtils.GetPx(213 + 57 * 2)}
  *          footerView={this.renderFooterView()}
  *          footerHeight={90 * 4 + (isPlugged ? 0 : 60) - (Device.isShared ? 90 * 2 : 0) + 10}
  *        />
  *      </View>
  *    );
*/

import React from 'react';
import {
  View,
  Animated,
  Easing,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import {
  LHUiUtils,
  LHPureRenderDecorator,
  LHDeviceUtils
} from 'LHCommonFunction';

const { height: windowHeight } = Dimensions.get('window');
const DURATION_OUT = 250;
// const DURATION_IN = 250;

let ScreenHeight = windowHeight;

class LHAdjustedView extends React.Component {
  static defaultProps = {
    shouldRenderAnimated: true
  }

  constructor(props) {
    super(props);
    const toGapHeightNum = this.getViewHeight(props);
    this.contentSizeHeight = props.headerHeight + props.footerHeight;
    this.offsetY = 0;
    this.state = {
      toGapHeightNum,
      gapHeight: new Animated.Value(toGapHeightNum),
      scrollEnabled: toGapHeightNum <= 0
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        this.getAndroidHeight();
      }, 0);
    }
  }

  // eslint-disable-next-line react/sort-comp
  componentWillUnmount() {
    this.willUnmount = true;
  }

  componentWillReceiveProps(newProps) {
    const toGapHeightNum = this.getViewHeight(newProps);
    const { shouldRenderAnimated, headerHeight, footerHeight } = newProps;
    const { gapHeight } = this.state;
    const scrollEnabled = toGapHeightNum <= 0;
    const { willUnmount, offsetY, contentSizeHeight } = this;

    // 中间填充的view高度变化的animation
    if (shouldRenderAnimated) {
      gapHeight.stopAnimation();
      Animated.timing(gapHeight, {
        toValue: toGapHeightNum,
        duration: DURATION_OUT,
        easing: Easing.ease
      }).start((e) => {
        if (e.finished) {
          if (willUnmount) return;

          // 如果headerView和footerView的高度不满一屏，那就将scrollView置为不能滑动，并且offset置0
          if (this.scrollView && !scrollEnabled) {
            this.scrollView.scrollTo({ x: 0, y: 0, animated: true });
          }

          // 针对iOS上scrollView滑到底部向上缩可能会在底部留空白的情况做一下处理
          const isSmaller = contentSizeHeight > (headerHeight + footerHeight); // 缩小
          const validHeight = ScreenHeight - LHDeviceUtils.statusBarHeight - LHUiUtils.TitleBarHeight; // 屏幕除了导航栏和状态栏的高度
          // 如果算出 offset+屏幕除了导航栏和状态栏的高度 > 两个view内容的高度，则表示底下留白了
          if ((validHeight + offsetY > headerHeight + footerHeight) && isSmaller) {
            this.scrollView.scrollToEnd();
          }
        }
      });
    }


    this.setState({
      toGapHeightNum,
      scrollEnabled
    });
  }

  getAndroidHeight() {
    // 安卓全面屏的高度需要异步获得
    LHDeviceUtils.GetPhoneScreenHeight((value) => {
      ScreenHeight = value;
      const { gapHeight } = this.state;
      const toGapHeightNum = this.getViewHeight();
      gapHeight.setValue(toGapHeightNum);
      this.setState({ toGapHeightNum });
    });
  }

  // 计算中间填充的view的高度
  getViewHeight(prop = this.props) {
    const { headerHeight, footerHeight } = prop;
    const tagetHeight = ScreenHeight - headerHeight - footerHeight - LHDeviceUtils.statusBarHeight - LHUiUtils.TitleBarHeight;
    return tagetHeight < 0 ? 0 : tagetHeight;
  }

  render() {
    const { gapHeight, toGapHeightNum, scrollEnabled } = this.state;

    const {
      headerView,
      footerView,
      shouldRenderAnimated,
      onScrollViewScroll,
      style,
      scrollViewContainerStyle,
      headerHeight,
      footerHeight,
      bounces
    } = this.props;

    return (
      <ScrollView
        style={[style]}
        bounces={bounces}
        contentContainerStyle={[scrollViewContainerStyle]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        scrollEventThrottle={20}
        onScroll={(e) => {
          this.offsetY = e.nativeEvent.contentOffset.y;
          this.contentSizeHeight = e.nativeEvent.contentSize.height;
          if (typeof onScrollViewScroll === 'function') {
            onScrollViewScroll(e);
          }
        }}
        ref={(ref) => {
          this.scrollView = ref;
        }}
      >
        <View style={{ height: headerHeight }}>
          {headerView}
        </View>

        {<Animated.View style={{ height: shouldRenderAnimated ? gapHeight : toGapHeightNum }} />}

        <View style={{ height: footerHeight }}>
          {footerView}
        </View>
      </ScrollView>
    );
  }
}

export default LHPureRenderDecorator(LHAdjustedView);
