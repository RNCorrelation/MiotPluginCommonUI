/**
* @module LHCommonUI/LHUnExpectedGuidePage
* @description 异常指引页面，使用需要在路由中注入
* @param {Object} params 进入页面传参
* @param {string} params.title 页面标题
* @param {string} params.imgSource 图片资源
* @param {Object} [params.imgStyle] 图片样式，默认150*150的图片，marginTop: 150
* @param {string} params.desc 描述文案
* @param {Object} [params.descStyle] 描述样式，默认marginTop: 60
* @param {string} [params.btnText] 置底按钮文案，默认我知道了
* @param {Object} [params.btnStyle] 置底按钮样式
* @param {Function} [params.pageWillExit] 页面将要退出时的回调
* @example
*
* navigation.navigate('LHUnExpectedGuidePage', {
*   imgSource: require('图片资源路径'),
*   title: '更换电池',
*   desc: '请按图示更换电池',
*   pageWillExit: () => {}
* });
*/
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import {
  LHTitleBarCustom,
  LHText
} from 'LHCommonUI';
import {
  LHUiUtils,
  LHDeviceUtils,
  LHCommonLocalizableString,
  LHPureRenderDecorator
} from 'LHCommonFunction';

class LHUnExpectedGuidePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title={navigation.getParam('title') || ''}
            style={[{
              backgroundColor: LHUiUtils.MiJiaWhite,
              borderBottomWidth: LHUiUtils.MiJiaBorderWidth,
              borderBottomColor: LHUiUtils.MiJiaLineColor
            }]}
            onPressLeft={() => { navigation.goBack(); }}
          />
        </View>
      )
    };
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillUnmount() {
    const {
      navigation
    } = this.props;
    const pageWillExit = navigation.getParam('pageWillExit');
    if (typeof pageWillExit === 'function') pageWillExit();
  }

  render() {
    const {
      navigation
    } = this.props;
    const imgStyle = navigation.getParam('imgStyle');
    const imgSource = navigation.getParam('imgSource');
    const desc = navigation.getParam('desc');
    const descStyle = navigation.getParam('descStyle');
    const btnText = navigation.getParam('btnText');
    const btnStyle = navigation.getParam('btnStyle');
    return (
      <View style={[{
        flex: 1,
        backgroundColor: LHUiUtils.MiJiaWhite
      }]}
      >
        <View style={{
          flex: 1
        }}
        >
          <Image
            style={[{
              width: LHUiUtils.GetPx(150),
              height: LHUiUtils.GetPx(150),
              marginTop: LHUiUtils.GetPx(150)
            }, imgStyle]}
            source={imgSource}
          />
          <LHText
            style={[{
              color: '#333',
              fontSize: LHUiUtils.GetPx(14),
              lineHeight: LHUiUtils.GetPx(19),
              letterSpacing: 0,
              width: '100%',
              paddingHorizontal: LHUiUtils.GetPx(24),
              textAlign: 'center',
              marginTop: LHUiUtils.GetPx(60)
            }, descStyle]}
          >
            {desc || '请传入desc'}
          </LHText>
        </View>
        <View style={{
          width: '100%',
          marginBottom: LHUiUtils.GetPx(24) + LHDeviceUtils.AppHomeIndicatorHeight,
          paddingHorizontal: LHUiUtils.GetPx(24)
        }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: '100%'
            }}
          >
            <View
              style={[{
                width: '100%',
                height: LHUiUtils.GetPx(42),
                backgroundColor: '#32BAC0',
                borderRadius: LHUiUtils.GetPx(5),
                justifyContent: 'center'
              }, btnStyle]}
            >
              <LHText
                style={{
                  width: '100%',
                  fontSize: LHUiUtils.GetPx(12),
                  lineHeight: LHUiUtils.GetPx(18),
                  color: '#fff',
                  textAlign: 'center'
                }}
              >
                {btnText || LHCommonLocalizableString.common_tips_iknow}
              </LHText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHUnExpectedGuidePage);