/**
 * @module LHCommonUI/LHMessageDialog
 * @description 弹窗，由于米家弹窗-消息弹窗-MessageDialog行为比较怪异，所以基于AbstractDialog封装了该弹窗
 * @property {string} [title] 弹框主标题
 * @property {Object} [titleStyle] 弹框主标题样式
 * @property {string} [message] 弹窗消息内容
 * @property {Function} [message] 弹窗消息内容
 * @property {Object} [messageStyle]  弹窗消息内容样式
 * @property {Object[]} [buttons] 弹窗按钮数组
 * @property {string} [buttons.text] 按钮文字
 * @property {Object} [buttons.style] 按钮样式
 * @property {string} [leftButtons.callback] 按钮点击回调
 * @example
 * import { LHMessageDialog } from "LHCommonUI";
 *
 * <LHMessageDialog
 *   title="弹窗标题"
 *   message="弹窗内容"
 *   buttons={[
 *      text: '确定'
 *      callback: () => {}
 *      style: { color: '#32BAC0' }
 *   ]}
 * />
 */

import React from 'react';

import {
  View,
  StyleSheet
} from 'react-native';
import { AbstractDialog } from 'miot/ui/Dialog';
import {
  LHPureRenderDecorator,
  CommonMethod,
  LHUiUtils,
  LHDeviceUtils
} from 'LHCommonFunction';
import { LHSeparator, LHText } from 'LHCommonUI';

const styles = StyleSheet.create({
  title: {
    color: '#000',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    paddingTop: 23,
    fontWeight: 'bold',
    letterSpacing: 0,
    paddingHorizontal: 64
  },
  message: {
    color: '#666',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
    paddingTop: 22,
    letterSpacing: 0,
    paddingHorizontal: 29
  },
  bottomGap: {
    height: 27
  },
  btn: {
    fontFamily: LHUiUtils.DefaultFontFamily,
    color: '#666',
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0,
    fontWeight: 'bold'
  }
});

class LHMessageDialog extends React.Component {
  static defaultProps = {
    closeAfterBtnClick: true
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      visible: false
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps) {
    const { visible } = this.state;
    if (newProps.visible !== visible) {
      this.setState({ visible: newProps.visible });
    }
  }

  componentWillUnmount() {
  }

  closeDialog() {
    this.setState({
      visible: false
    });
    const {
      onDismiss
    } = this.props;
    if (typeof onDismiss === 'function') {
      onDismiss();
    }
  }

  render() {
    const {
      closeAfterBtnClick,
      buttons,
      title,
      message,
      titleStyle,
      messageStyle
    } = this.props;
    const { visible } = this.state;
    let btns = null;
    if (buttons && buttons.length > 0) {
      btns = CommonMethod.DeepClone(buttons, []);
      for (let i = 0, len = btns.length; i < len; i += 1) {
        // 处理按钮的回调，点击后默认关闭
        if (closeAfterBtnClick) {
          btns[i].callback = () => {
            this.closeDialog();
            if (typeof buttons[i].callback === 'function') buttons[i].callback();
          };
        }
        btns[i].style = Object.assign({}, StyleSheet.flatten(styles.btn), StyleSheet.flatten(btns[i].style));
      }
    }
    return (
      <AbstractDialog
        ref={(Dialog) => { this.Dialog = Dialog; }}
        style={{
          bottom: LHDeviceUtils.AppHomeIndicatorHeight || LHUiUtils.GetPx(10)
        }}
        visible={visible}
        showTitle={false}
        canDismiss={false}
        onDismiss={() => {
          this.closeDialog();
        }}
        buttons={btns}
      >
        <View>
          {title ? (<LHText style={[styles.title, titleStyle]}>{title}</LHText>) : null}
          {message ? (<LHText style={[styles.message, messageStyle]}>{message}</LHText>) : null}
          <View style={styles.bottomGap} />
          <LHSeparator
            style={[
              { alignSelf: 'flex-end', height: 0.6 }
            ]}
          />
        </View>
      </AbstractDialog>
    );
  }
}

export default LHPureRenderDecorator(LHMessageDialog);
