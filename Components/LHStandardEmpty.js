/**
* @module LHCommonUI/LHStandardEmpty
* @description 空页面
* @property {string} [emptyIcon] 图片资源
* @property {string} [text] 空页面文案
* @property {Object} [style] 作用于外层元素的样式
* @property {Object} [emptyIconStyle] 图标样式
* @property {Object} [emptyTextStyle] 文案样式
* @example
* import { LHStandardEmpty } from "LHCommonUI";
*
* <LHStandardEmpty
*   emptyIcon={require('图片资源路径')}
*   text="暂无数据"
* />
*/

import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Platform
} from 'react-native';
import { LHUiUtils, LHDeviceUtils } from 'LHCommonFunction';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  emptyWrap: {
    alignItems: 'center'
  },
  emptyPageWrap: {
    height: height - LHUiUtils.TitleBarHeight - LHDeviceUtils.statusBarHeight,
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  emptyImg: {
    marginTop: LHUiUtils.GetPx(139),
    width: LHUiUtils.GetPx(128),
    height: LHUiUtils.GetPx(101),
    alignSelf: 'center'
  },
  emptyText: {
    marginTop: LHUiUtils.GetPx(19),
    marginLeft: LHUiUtils.GetPx(40),
    marginRight: LHUiUtils.GetPx(40),
    textAlign: 'center',
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(20),
    color: '#999999',
    fontFamily: LHUiUtils.DefaultFontFamily
  }

});
export default class LHStandardEmpty extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: height
    };
  }

  componentDidMount() {
    if (Platform.OS === 'android') this.getAndroidHeight();
  }

  getAndroidHeight() {
    LHDeviceUtils.GetPhoneScreenHeight((value) => {
      this.setState({ screenHeight: value });
    });
  }

  render() {
    const {
      emptyPageStyle,
      text,
      emptyIcon,
      emptyIconStyle,
      style,
      emptyTextStyle,
      onClicked
    } = this.props;
    const { screenHeight } = this.state;
    return (
      <View style={[styles.emptyPageWrap, { height: screenHeight - LHUiUtils.TitleBarHeight - LHDeviceUtils.statusBarHeight }, emptyPageStyle]}>
        <View style={[styles.emptyWrap, style]}>
          <TouchableWithoutFeedback onPress={onClicked}>
            <View>
              <Image style={[styles.emptyImg, emptyIconStyle]} source={emptyIcon || require('../Resources/list_blank.png')} />
              <Text style={[styles.emptyText, emptyTextStyle]}>{text}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
