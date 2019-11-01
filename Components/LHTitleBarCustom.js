/**
 * @module LHCommonUI/LHTitleBarCustom
 * @description 自定义导航栏
 * @property {string} [statusBarStyle=dark] 导航栏类型 options: ["dark", "light"]
 * @property {string} [title] 中间的标题
 * @property {Object} [titleStyle] 中间的标题样式
 * @property {Function} [onPressTitle] 点击标题的事件
 * @property {string} [subTitle]  中间的子标题
 * @property {Object} [subTitleStyle]  中间的子标题样式
 * @property {boolean} [showDot=false] 是否显示右侧更多按钮的红点
 * @property {Object} [style] 标题容器样式
 * @property {Function} [onPressLeft] 返回按钮点击事件，只在未传leftButtons的情况下传该函数才有效
 * @property {string} [backBtnIcon=black] 返回按钮颜色，options: ['black', 'white'],只有在配置为white的情况下为白色，其余值或不传为黑色，只在onPressLeft生效的情况下有效
 * @property {Object[]} [leftButtons] 不传默认有返回按钮
 * @property {string} [leftButtons.type] 默认按钮类型，options: ["deafultBackBtn"，"deafultMoreBtn"，"deafultShareBtn", "deafultCloseBtn", "deafultCompleteBtn", "defaultEditBtn"]，自定义按钮不用传
 * @property {string} [leftButtons.source] 图片资源，不是图片按钮不用传
 * @property {string} [leftButtons.disable] true为置灰状态
 * @property {string} [leftButtons.highlightedSource] 按下态图片资源，可不传
 * @property {string} [leftButtons.text] 按钮文字，传了leftButtons.source该配置无效
 * @property {Object} [leftButtons.style] 按钮样式
 * @property {Object} [leftButtons.textContainerStyle] 文字按钮样式
 * @property {Function} [leftButtons.press] 按钮点击事件
 * @property {string} [leftButtons.btnIconType=black] leftButtons.type为deafultBackBtn，deafultMoreBtn，deafultShareBtn时按钮颜色options: ['black', 'white']
 * @property {Object[]} [rightButtons] 右导航按钮配置，同leftButtons，区别在于rightButtons从右到左渲染，即数组中的第一个元素渲染在最右边
 * @property {boolean} [useOldIcon=false] sdk10020以上默认使用新版icon，若指定useOldIcon为true则使用旧版icon
 * @property {boolean} [showSeparator=false] 是否显示分割线
 * @example
 * import { LHTitleBarCustom } from "LHCommonUI";
 *
 * <LHTitleBarCustom
 *   title="首页"
 *   style={{backgroundColor: 'red'}}
 *   onPressLeft={() => { console.log('test'); }}
 * />
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { RkButton } from 'react-native-ui-kitten';
import { API_LEVEL } from 'miot';
import {
  CommonMethod,
  LHDeviceUtils,
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import { LHImageButton, LHSeparator } from 'LHCommonUI';
import Images from '../../../../../miot-sdk/resources/Images';

const { width } = Dimensions.get('window');
const titleHeight = LHUiUtils.TitleBarHeight;
const styles = StyleSheet.create({
  titleBarContainer: {
    width,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: LHUiUtils.MiJiaWhite,
    height: (StatusBar.currentHeight || 0) + titleHeight
  },
  textContainer: {
    height: titleHeight,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center'
  },
  titleText: {
    color: '#000000cc',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: LHUiUtils.DefaultFontFamily,
    fontWeight: 'bold'
  },
  subtitleText: {
    color: '#00000088',
    fontSize: 12,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  leftRightText: {
    flexDirection: 'column',
    backgroundColor: '#0000',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  leftRightTextFontStyle: {
    color: '#00000088',
    fontSize: 14,
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});

class LHTitleBarCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
    }
  }

  /**
   *  默认箭头返回按钮
   */
  getDeafultBackBtn(position, btns, btn, index) {
    const { backBtnIcon } = this.props;
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_back_' + index}
        style={[this.initIconResources().imgStyle, { height: resources.imgHeight }, { marginRight: 0 }, btn.style]}
        source={(backBtnIcon === 'white' || btn.btnIconType === 'white') ? resources.backBtnIconWhite : resources.backBtnIconBlack}
        highlightedSource={(backBtnIcon === 'white' || btn.btnIconType === 'white') ? resources.backBtnIconWhitePress : resources.backBtnIconBlackPress}
      />
    );
  }

  /**
   *  默认更多按钮
   */
  getDeafultMoreBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_more_' + index}
        style={[this.initIconResources().imgStyle, {
          height: resources.imgHeight,
          marginRight: position === 'right' ? (index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin) : resources.btnGap,
          marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap
        }, btn.style]}
        source={btn.btnIconType === 'white' ? resources.moreIconWhite : resources.moreIconBlack}
        highlightedSource={btn.btnIconType === 'white' ? resources.moreIconWhitePress : resources.moreIconBlackPress}
      />
    );
  }

  /**
   *  默认分享按钮
   */
  getDeafultShareBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_share_' + index}
        style={[this.initIconResources().imgStyle, {
          marginRight: position === 'right' ? (index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin) : resources.btnGap,
          marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap,
          height: resources.imgHeight
        }, btn.style]}
        source={btn.btnIconType === 'white' ? resources.shareIconWhite : resources.shareIconBlack}
        highlightedSource={btn.btnIconType === 'white' ? resources.shareIconWhitePress : resources.shareIconBlackPress}
      />
    );
  }

  /**
   *  默认关闭按钮
   */
  getDeafultCloseBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_close_' + index}
        style={[this.initIconResources().imgStyle, {
          marginRight: position === 'right' ? (index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin) : resources.btnGap,
          marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap,
          height: resources.imgHeight
        }, btn.style]}
        source={btn.btnIconType === 'white' ? resources.closeIconWhite : resources.closeIconBlack}
        highlightedSource={btn.btnIconType === 'white' ? resources.closeIconWhitePress : resources.closeIconBlackPress}
      />
    );
  }

  /**
   *  默认完成按钮
   */
  getDeafultCompleteBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_complete_' + index}
        style={[this.initIconResources().imgStyle, {
          marginRight: position === 'right' ? (index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin) : resources.btnGap,
          marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap,
          height: resources.imgHeight
        }, btn.style]}
        source={btn.btnIconType === 'white'
          ? (btn.disable ? resources.completeIconWhiteDisable : resources.completeIconWhite)
          : (btn.disable ? resources.completeIconBlackDisable : resources.completeIconBlack)}
        highlightedSource={btn.btnIconType === 'white'
          ? (btn.disable ? resources.completeIconWhiteDisable : resources.completeIconWhitePress)
          : (btn.disable ? resources.completeIconBlackDisable : resources.completeIconBlackPress)}
      />
    );
  }

  /**
   *  默认编辑按钮
   */
  getDefaultEditBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    return (
      <LHImageButton
        onPress={btn.press}
        key={'btn_edit_' + index}
        style={[this.initIconResources().imgStyle, {
          marginRight: position === 'right' ? (index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin) : resources.btnGap,
          marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap,
          height: resources.imgHeight
        }, btn.style]}
        source={btn.btnIconType === 'white'
          ? (btn.disable ? resources.editIconWhiteDisable : resources.editIconWhite)
          : (btn.disable ? resources.editIconBlackDisable : resources.editIconBlack)}
        highlightedSource={btn.btnIconType === 'white'
          ? (btn.disable ? resources.editIconWhiteDisable : resources.editIconWhitePress)
          : (btn.disable ? resources.editIconBlackDisable : resources.editIconBlackPress)}
      />
    );
  }

  balanceLeftRightButtons(leftButtons, rightBtns) {
    const gap = leftButtons.length - rightBtns.length;
    for (let i = 0; i < Math.abs(gap); i += 1) {
      const btn = {
        text: '',
        press: () => {},
        source: this.initIconResources().backBtnIconBlack,
        style: {
          opacity: 0
        }
      };
      // eslint-disable-next-line
      gap > 0 ? rightBtns.push(btn) : leftButtons.push(btn);
    }
  }

  initIconResources() {
    const { useOldIcon } = this.props;
    let btnGap;
    let leftRightBtnMargin;
    let imgHeight;
    let dotWidth;
    let result;
    if (API_LEVEL < 10021 || useOldIcon) { // 10021以下或指定使用旧版图标
      imgHeight = 28;
      btnGap = 14;
      leftRightBtnMargin = 14;
      dotWidth = 10;
      result = { // 使用旧版图标
        backBtnIconWhite: require('../../../../../miot-sdk/resources/title/back_white_normal.png'),
        backBtnIconWhitePress: require('../../../../../miot-sdk/resources/title/back_white_press.png'),
        backBtnIconBlack: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_back_normal.png'),
        backBtnIconBlackPress: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_back_press.png'),
        dotIcon: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_massage_point.png'),
        moreIconWhite: require('../../../../../miot-sdk/resources/title/more_white_normal.png'),
        moreIconWhitePress: require('../../../../../miot-sdk/resources/title/more_white_press.png'),
        moreIconBlack: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_more_normal.png'),
        moreIconBlackPress: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_more_press.png'),
        shareIconWhite: require('../../../../../miot-sdk/resources/title/share_white_normal.png'),
        shareIconWhitePress: require('../../../../../miot-sdk/resources/title/share_white_press.png'),
        shareIconBlack: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_share_normal.png'),
        shareIconBlackPress: require('../../../../../miot-sdk/resources/title/std_tittlebar_main_device_share_press.png'),
        closeIconWhite: require('../Resources/navigation/lumi_navigation_close.png'),
        closeIconWhitePress: require('../Resources/navigation/lumi_navigation_close.png'),
        closeIconBlack: require('../Resources/navigation/lumi_navigation_close.png'),
        closeIconBlackPress: require('../Resources/navigation/lumi_navigation_close.png'),
        completeIconWhite: require('../Resources/navigation/lumi_navigation_confirm.png'),
        completeIconWhiteDisable: require('../Resources/navigation/lumi_navigation_confirm.png'),
        completeIconWhitePress: require('../Resources/navigation/lumi_navigation_confirm.png'),
        completeIconBlack: require('../Resources/navigation/lumi_navigation_confirm.png'),
        completeIconBlackPress: require('../Resources/navigation/lumi_navigation_confirm.png'),
        completeIconBlackDisable: require('../Resources/navigation/lumi_navigation_confirm.png')
      };
    } else { // 使用新版图标
      imgHeight = 40;
      dotWidth = 40;
      btnGap = 0;
      leftRightBtnMargin = 9;
      result = {
        backBtnIconWhite: Images.navigation.dark.back.normal,
        backBtnIconWhitePress: Images.navigation.dark.back.press,
        backBtnIconBlack: Images.navigation.light.back.normal,
        backBtnIconBlackPress: Images.navigation.light.back.press,
        dotIcon: Images.navigation.dot,
        moreIconWhite: Images.navigation.dark.more.normal,
        moreIconWhitePress: Images.navigation.dark.more.press,
        moreIconBlack: Images.navigation.light.more.normal,
        moreIconBlackPress: Images.navigation.light.more.press,
        shareIconWhite: Images.navigation.dark.share.normal,
        shareIconWhitePress: Images.navigation.dark.share.press,
        shareIconBlack: Images.navigation.light.share.normal,
        shareIconBlackPress: Images.navigation.light.share.press,
        closeIconWhite: Images.navigation.dark.close.normal,
        closeIconWhitePress: Images.navigation.dark.close.press,
        closeIconBlack: Images.navigation.light.close.normal,
        closeIconBlackPress: Images.navigation.light.close.press,
        completeIconWhite: Images.navigation.dark.complete.normal,
        completeIconWhiteDisable: Images.navigation.dark.complete.disable,
        completeIconWhitePress: Images.navigation.dark.complete.press,
        completeIconBlack: Images.navigation.light.complete.normal,
        completeIconBlackPress: Images.navigation.light.complete.press,
        completeIconBlackDisable: Images.navigation.light.complete.disable,
        editIconWhite: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit.png'),
        editIconWhiteDisable: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit_disable.png'),
        editIconWhitePress: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit_press.png'),
        editIconBlack: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit.png'),
        editIconBlackPress: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit_press.png'),
        editIconBlackDisable: require('../Resources/navigation/edit_icon/lumi_gateway_a_mode_edit_disable.png')
      };
    }
    Object.assign(result, {
      imgHeight,
      btnGap,
      leftRightBtnMargin,
      imgStyle: {
        width: imgHeight,
        height: imgHeight,
        resizeMode: 'contain',
        marginLeft: leftRightBtnMargin,
        marginTop: (titleHeight - imgHeight) / 2,
        marginBottom: (titleHeight - imgHeight) / 2,
        marginRight: leftRightBtnMargin
      },
      dotStyle: {
        position: 'absolute',
        width: dotWidth,
        height: dotWidth,
        resizeMode: 'contain',
        right: leftRightBtnMargin,
        top: LHDeviceUtils.statusBarHeight + (titleHeight - imgHeight) / 2
      }
    });
    return result;
  }

  /**
   *  渲染左右导航按钮
   */
  renderBtn(position, btns, btn, index) {
    const resources = this.initIconResources();
    const { type } = btn;
    if (type === 'deafultBackBtn' || type === 'defaultBackBtn') {
      return this.getDeafultBackBtn(position, btns, btn, index);
    } else if (type === 'deafultShareBtn' || type === 'defaultShareBtn') {
      return this.getDeafultShareBtn(position, btns, btn, index);
    } else if (type === 'deafultMoreBtn' || type === 'defaultMoreBtn') {
      return this.getDeafultMoreBtn(position, btns, btn, index);
    } else if (type === 'deafultCloseBtn' || type === 'defaultCloseBtn') {
      return this.getDeafultCloseBtn(position, btns, btn, index);
    } else if (type === 'deafultCompleteBtn' || type === 'defaultCompleteBtn') {
      return this.getDeafultCompleteBtn(position, btns, btn, index);
    } else if (type === 'defaultEditBtn') {
      return this.getDefaultEditBtn(position, btns, btn, index);
    } else {
      return btn.source ? (
        <LHImageButton
          onPress={btn.press}
          key={position + index}
          style={[this.initIconResources().imgStyle, {
            height: resources.imgHeight,
            marginRight: position === 'right' ? (
              index !== btns.length - 1 ? 0 : resources.leftRightBtnMargin
            ) : resources.btnGap,
            marginLeft: position === 'left' ? (index === 0 ? resources.leftRightBtnMargin : 0) : resources.btnGap
          }, btn.style]}
          source={btn.source}
          highlightedSource={btn.highlightedSource}
        />
      ) : (
        <RkButton
          onPress={btn.press}
          key={position + index}
          contentStyle={[styles.leftRightTextFontStyle, btn.style]}
          style={[styles.leftRightText, {
            height: titleHeight,
            width: resources.imgHeight + resources.btnGap * 2
          }, btn.textContainerStyle]}
        >
          {btn.text}
        </RkButton>
      );
    }
  }

  render() {
    const resources = this.initIconResources();
    const { onPressLeft, statusBarStyle } = this.props;
    // 这种方式状态栏会闪几次
    // StatusBar.setBarStyle(statusBarStyle === 'light' ? 'light-content' : 'dark-content');
    // eslint-disable-next-line
    let leftButtons = CommonMethod.DeepClone(this.props.leftButtons || [], []);
    // eslint-disable-next-line
    let rightBtns = CommonMethod.DeepClone(this.props.rightButtons || [], []);
    // eslint-disable-next-line
    let rightButtons = [];
    if (onPressLeft && leftButtons.length === 0) {
      leftButtons.push({
        type: 'deafultBackBtn',
        press: onPressLeft
      });
    }
    // 保证左右两边按钮个数一样，这样标题才居中，给少的的那边加上空的文字按钮
    this.balanceLeftRightButtons(leftButtons, rightBtns);

    // 将右侧按钮反转，让传过来的第一个位置按钮渲染在最右边
    for (let i = rightBtns.length - 1; i > -1; i -= 1) {
      rightButtons.push(rightBtns[i]);
    }
    const {
      containerStyle,
      style,
      titleStyle,
      onPressTitle,
      title,
      subTitle,
      subTitleStyle,
      showDot,
      showSeparator
    } = this.props;
    const subTitleEle = subTitle ? (
      <Text
        numberOfLines={1}
        style={[styles.subtitleText, subTitleStyle]}
        onPress={onPressTitle}
      >
        {subTitle}
      </Text>
    ) : null;
    return (
      <View style={containerStyle}>
        <SafeAreaView style={[styles.titleBarContainer, style]}>
          <StatusBar
            backgroundColor="transparent"
            barStyle={statusBarStyle === 'light' ? 'light-content' : 'dark-content'}
          />
          {leftButtons.map((item, i) => {
            return this.renderBtn('left', leftButtons, item, i);
          })}
          <View style={[styles.textContainer]}>
            <Text
              numberOfLines={1}
              style={[styles.titleText, titleStyle]}
              onPress={onPressTitle}
            >
              {title}
            </Text>
            {subTitleEle}
          </View>
          {rightButtons.map((item, i) => {
            return this.renderBtn('right', rightButtons, item, i);
          })}
          {
            showDot && (
              <Image
                pointerEvents="none"
                style={resources.dotStyle}
                source={resources.dotIcon}
              />
            )
          }
        </SafeAreaView>
        {showSeparator ? <LHSeparator style={{ alignSelf: 'flex-end' }} /> : null}
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHTitleBarCustom);
