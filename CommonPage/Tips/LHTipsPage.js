/**
* @module LHCommonUI/LHTipsPage
* @description 空白页、结果页、提示页，使用需要在路由中注入
* @param {Object} params 进入页面传参
* @param {string} params.backgroundColor 页面背景色
* @param {string} params.pageTitle 页面标题
* @param {string} params.imgSource 图片资源
* @param {Object} [params.imgStyle] 图片样式，默认138*138的图片
* @param {string} params.title 描述文字
* @param {Object} params.titleStyle 描述文字样式
* @param {string} params.desc 附加描述文字
* @param {Object} params.descStyle 附加描述文字样式
* @param {string} params.linkDesc 超链接说明文字
* @param {Object} params.linkDescStyle 超链接说明文字样式
* @param {Function} params.linkDescOnPress 超链接说明文字点击回调
* @param {string} params.bottomDesc 底部附加描述文字
* @param {Object} params.bottomDescStyle 底部附加描述文字样式
* @param {string} params.bottomLinkDesc 底部超链接说明文字
* @param {Object} params.bottomLinkDescStyle 底部超链接说明文字样式
* @param {Function} params.bottomLinkDescOnPress 底部超链接说明文字点击回调
* @param {Object} [params.button] 底部按钮
* @property {number} [params.button.buttonType] 按钮类型，0: 按下态背景变灰，disabled态文字变灰；1:按下态背景使用深色，disabled态透明度变30%，默认1
* @property {string} params.button.btnText 按钮文字
* @property {Object} [params.button.btnTextStyle] 按钮文字样式
* @property {Object} [params.button.textDisabledStyle] 按钮文字disabled态样式
* @property {Object} [params.button.style] 按钮样式
* @property {Object} [params.button.btnDisabledStyle] 按钮disabled态样式
* @property {boolean} [params.button.disabled] 是否是disabled
* @property {Function} params.button.onPress 点击事件，返回参数 (instance)，通过调用instance.goBack()可返回
* @property {string} [params.button.pressBackgroundColor] 按压态背景色
* @param {Function} [params.pageWillExit] 页面将要退出时的回调
* @param {Function} [params.backFunction] 点击返回调用的方法，默认返回上一个界面不要传该方法，返回参数 (instance)，通过调用instance.goBack()可返回，若要跳到下一个界面，则需要调用instance.removeBackHandler()解除安卓实体返回监听
* @example
*
import {
  LHTipsPage
} from 'LHCommonUI';

将LHTipsPage注入页面路由

const { navigation } = this.props;
navigation.navigate('LHTipsPage', {
  pageTitle: '标题',
  imgSource: require('../Resources/assets/success_icon.png'),
  title: '描述文字居中最多12字节',
  desc: '段落附加文字，居中，字体：小米兰亭Regular，字号：13，字色：#999999，最多支持三行文字',
  button: {
    buttonType: 1,
    btnText: '操作描述',
    onPress: (instance) => {
      instance.goBack();
    }
  }
});

*/
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  BackHandler
} from 'react-native';
import {
  LHTitleBarCustom,
  LHText,
  LHButton
} from 'LHCommonUI';
import {
  LHUiUtils,
  LHDeviceUtils,
  LHPureRenderDecorator
} from 'LHCommonFunction';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  textBaseStyle: {
    color: '#999',
    fontSize: LHUiUtils.GetPx(13),
    lineHeight: LHUiUtils.GetPx(20),
    letterSpacing: 0,
    width: '100%',
    paddingHorizontal: LHUiUtils.GetPx(40),
    textAlign: 'center'
  },
  linkTextStyle: {
    color: '#32BAC0',
    fontSize: LHUiUtils.GetPx(13),
    lineHeight: LHUiUtils.GetPx(18),
    letterSpacing: 0,
    width: '100%',
    paddingHorizontal: LHUiUtils.GetPx(40),
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});

class LHTipsPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const gesturesEnabled = navigation.getParam('gesturesEnabled', true);
    return {
      gesturesEnabled,
      header: null
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      screenHeight: height
    };
  }

  componentWillMount() {
    const {
      navigation
    } = this.props;
    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      () => {
        this.registeredBackHandler();
      }
    );
  }

  componentDidMount() {
    if (Platform.OS === 'android') this.getAndroidHeight();
  }

  componentWillUnmount() {
    const {
      navigation
    } = this.props;
    const pageWillExit = navigation.getParam('pageWillExit');
    if (typeof pageWillExit === 'function') pageWillExit();
    this.removeBackHandler();
  }

  getAndroidHeight() {
    LHDeviceUtils.GetPhoneScreenHeight((value) => {
      this.setState({ screenHeight: value });
    });
  }

  registeredBackHandler() {
    const {
      navigation
    } = this.props;
    const backFunction = navigation.getParam('backFunction');
    if (typeof backFunction === 'function' && !this.backHandler) {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        backFunction(this);
        return true;
      });
    }
  }

  // 解除安卓实体返回键监听
  removeBackHandler() {
    if (this.backHandler) {
      this.backHandler.remove();
      this.backHandler = null;
    }
  }

  goBack() {
    const {
      navigation
    } = this.props;
    navigation.goBack();
  }

  back() {
    const {
      navigation
    } = this.props;
    const backFunction = navigation.getParam('backFunction');
    if (typeof backFunction === 'function') {
      backFunction(this);
    } else {
      this.goBack();
    }
  }

  render() {
    const {
      screenHeight
    } = this.state;
    const {
      navigation
    } = this.props;
    const style = navigation.getParam('style');
    const imgStyle = navigation.getParam('imgStyle');
    const imgSource = navigation.getParam('imgSource');
    const title = navigation.getParam('title');
    const titleStyle = navigation.getParam('titleStyle');
    const desc = navigation.getParam('desc');
    const descStyle = navigation.getParam('descStyle');
    const linkDesc = navigation.getParam('linkDesc');
    const linkDescStyle = navigation.getParam('linkDescStyle');
    const linkDescOnPress = navigation.getParam('linkDescOnPress');
    const bottomDesc = navigation.getParam('bottomDesc');
    const bottomDescStyle = navigation.getParam('bottomDescStyle');
    const bottomLinkDesc = navigation.getParam('bottomLinkDesc');
    const bottomLinkDescStyle = navigation.getParam('bottomLinkDescStyle');
    const bottomLinkDescOnPress = navigation.getParam('bottomLinkDescOnPress');
    const button = navigation.getParam('button');
    const buttonProps = {
      buttonType: 1
    };
    // 处理LHButton的props
    if (button) {
      const keys = Object.keys(button);
      for (let i = 0, len = keys.length; i < len; i += 1) {
        if (keys[i] === 'onPress') {
          buttonProps.onPressControl = button[keys[i]];
        } else {
          buttonProps[keys[i]] = button[keys[i]];
        }
      }
    }
    let marginTop = 146 * screenHeight / 780;
    const gap = marginTop - LHUiUtils.GetPx(146);
    marginTop += (gap > 0 ? gap : 2 * gap) / 3;
    return (
      <View style={[{
        flex: 1,
        backgroundColor: '#F7F7F7',
        paddingBottom: LHDeviceUtils.AppHomeIndicatorHeight ? LHDeviceUtils.AppHomeIndicatorHeight - LHUiUtils.GetPx(24) : 0
      }, style]}
      >
        <View>
          <LHTitleBarCustom
            title={navigation.getParam('pageTitle') || ''}
            style={navigation.getParam('navStyle')}
            showSeparator={navigation.getParam('showSeparator') || false}
            onPressLeft={() => { this.back(); }}
          />
        </View>
        <View style={{
          flex: 1,
          alignItems: 'center'
        }}
        >
          <Image
            resizeMode="contain"
            style={[{
              width: LHUiUtils.GetPx(138),
              height: LHUiUtils.GetPx(138),
              marginTop
            }, imgStyle]}
            source={imgSource}
          />
          {
            // 描述文字
            title ? (
              <LHText
                style={[styles.textBaseStyle, {
                  fontSize: LHUiUtils.GetPx(15),
                  marginTop: LHUiUtils.GetPx(-5)
                }, titleStyle]}
              >
                {title || ''}
              </LHText>
            ) : null
          }
          {
            // 附加描述文字
            desc ? (
              <LHText
                style={[styles.textBaseStyle, {
                  marginTop: LHUiUtils.GetPx(10)
                }, descStyle]}
              >
                {desc || ''}
              </LHText>
            ) : null
          }
          {
            // 链接说明文字
            linkDesc ? (
              <LHText
                suppressHighlighting
                style={[styles.linkTextStyle, {
                  marginTop: 1
                }, linkDescStyle]}
                onPress={() => {
                  if (typeof linkDescOnPress === 'function') linkDescOnPress(this);
                }}
              >
                {linkDesc}
              </LHText>
            ) : null
          }
        </View>
        {
          // 底部附加文字
          bottomDesc ? (
            <LHText
              style={[styles.textBaseStyle, {
                marginBottom: button ? LHUiUtils.GetPx(20) : LHUiUtils.GetPx(87)
              }, bottomDescStyle]}
            >
              {bottomDesc || ''}
            </LHText>
          ) : null
        }
        {
          // 底部链接文字
          bottomLinkDesc ? (
            <LHText
              suppressHighlighting
              style={[styles.linkTextStyle, {
                marginBottom: button ? LHUiUtils.GetPx(20) : LHUiUtils.GetPx(40)
              }, bottomLinkDescStyle]}
              onPress={() => {
                if (typeof bottomLinkDescOnPress === 'function') bottomLinkDescOnPress(this);
              }}
            >
              {bottomLinkDesc}
            </LHText>
          ) : null
        }
        {
          // 底部按钮
          button ? (
            <View style={{
              width: '100%',
              marginBottom: LHUiUtils.GetPx(24),
              paddingHorizontal: LHUiUtils.GetPx(24)
            }}
            >
              <LHButton
                {...(buttonProps || {})}
                onPress={() => {
                  if (typeof buttonProps.onPressControl === 'function') buttonProps.onPressControl(this);
                }}
              />
            </View>
          ) : null
        }
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHTipsPage);