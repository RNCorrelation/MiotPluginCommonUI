/**
 * @module LHMagicDialog
 * @description 提示弹框，常用于确认、取消或者提示时使用
 *
 * @property message: 弹框文本（一定要传）
 * @property title:   弹框标题（不需要显示标题时可以不传）
 * @property btns:[{    //需要展示的按钮，数组形式，默认不超过5个按钮
      text: '知道了',                //按钮标题
      callback: () => {             //按钮点击回调
      },
      textStyles: {}               //按钮样式，包括字体字体大小、颜色、边框等
    }, {
      text: '确定',
      callback: () => {
      },
      textStyles: { color: '#32BAC0' }
    }]
 * @property visible{boolean} :显示弹框与隐藏
 * @property cancelable{boolean} :点击Android是否隐藏当前弹框，默认为true
 * @property onDismiss{function} :弹框消失时的回调
 * @property titleStyle{object} :弹框标题样式（包括字体字体大小、颜色、边框等）
 * @property contentStyle{object} :弹框文本样式（包括字体字体大小、颜色、边框等）
 *  @example(调用函数的方式)
 *  LHDialogUtils.showConfirmDialog({
          message: msg,
          cancelable: true,
          btns: [
            {
              text: LocalizedStrings.cancel,
              callback: () => {
                this.hackSwipeoutClose(true);
                LHDialogUtils.hideConfirmDialog();
              },
              textStyles: {}
            },
            {
              text: LocalizedStrings.ok,
              callback: () => {
                this.deleteConfirm(rowData);
                LHDialogUtils.hideConfirmDialog();
              },
              textStyles: {}
            }]
        });
 *
 * @example(引用组件的方式)
 * import { CustomMessageDialog } from "LHCommonUI";
 *
 *  <CustomMessageDialog
 *   btns={confirmDialogObject.btns}
 *   title={confirmDialogObject.title}
 *   message={confirmDialogObject.message}
 *   visible={confirmDialogObject.visible}
 *   cancelable={confirmDialogObject.cancelable}
 *   onDismiss={() => {
            this.setState({
              confirmDialogObject: Object.assign({}, confirmDialogObject, { visible: false })
            });
          }}
 />
 *
 */

import React from 'react';
import {
  Text,
  Modal,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View, Platform, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { LHUiUtils, LHDeviceUtils} from 'LHCommonFunction';

const { width } = Dimensions.get('window');

const marginBottomDis = LHDeviceUtils.AppHomeIndicatorHeight || LHUiUtils.GetPx(10);// iPhoneX是34，其他手机时10

export default class CustomMessageDialog extends React.PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    visible: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/require-default-props
    title: PropTypes.string,
    // eslint-disable-next-line react/require-default-props
    message: PropTypes.string.isRequired,
    cancelable: PropTypes.bool, // 是否可以取消

    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    titleStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    contentStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types
    btns: PropTypes.array, // 所有按钮
    // eslint-disable-next-line react/require-default-props
    onDismiss: PropTypes.func
  };

  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    message: '米家门锁',
    // eslint-disable-next-line react/default-props-match-prop-types
    visible: false,
    cancelable: true,
    btns: [{
      text: '知道了',
      callback: () => {
      },
      textStyles: {}
    }, {
      text: '确定',
      callback: () => {
      },
      textStyles: { color: '#32BAC0' }
    }]
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: this.props.visible
    };
  }

  /**
   * 接收新props，
   */
  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.visible != this.props.visible) {
      this.setState({ showModal: nextProps.visible });
    }
  }

  render () {
    const {
      btns, onDismiss, cancelable,
      title, titleStyle, contentStyle, message
    } = this.props;

    return (
      <Modal
        animationType="none"
        transparent
        visible={this.state.showModal}
        onRequestClose={() => {
          onDismiss && onDismiss();// 可以取消时点击Android返回键取消
        }}
        onShow={() => {
        }}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.cancelWrapper}
            onPress={() => {
              cancelable && onDismiss();// 可以取消时点击遮罩取消
            }}
          />

          <View style={styles.wrapper}>
            {/* 如果有title则显示title */}
            {title && <Text style={[styles.title, titleStyle]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>}
            <Text style={[styles.message, contentStyle, !title && { marginTop: LHUiUtils.GetPx(27) }]}>{message}</Text>
            {/* button，以数组的形式展示 */}
            <View style={[styles.btnWrapper]}>
              {(() => {
                const btnContent = [];
                btns.forEach((btn, index) => {
                  btnContent.push(
                    <TouchableOpacity
                      onPress={() => {
                        onDismiss && onDismiss();// 先消失弹框
                        btn.callback && btn.callback();
                      }}
                      key={'btnTouch' + index}
                      style={styles.btnBox}
                    >
                      <Text
                        adjustsFontSizeToFit={false}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        allowFontScaling={false}
                        style={[styles.btnText, btn.textStyles]}>{btn.text}
                      </Text>
                    </TouchableOpacity>);

                  // eslint-disable-next-line react/no-array-index-key
                  index !== btns.length - 1 && btnContent.push(<View style={styles.btnLine} key={'btnLine' + index}/>);
                });
                return btnContent;
              })()}
            </View>
          </View>

        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  wrapper: {
    alignItems: 'center',
    width: width - LHUiUtils.GetPx(20),
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: LHUiUtils.GetPx(10),
    marginRight: LHUiUtils.GetPx(10),
    marginBottom: marginBottomDis,
    backgroundColor: '#FFFFFF',
    borderRadius: 20
  },
  cancelWrapper: {
    width: '100%', //  flex: 1,都不行，一定要 width: '100%'？
    flex: 1

  },
  title: {
    ...Platform.select({
      android: {
        fontFamily: 'MI-LANTING--GBK1-Bold' // ios 会奔溃，
      }
    }),
    marginTop: LHUiUtils.GetPx(22),
    fontSize: LHUiUtils.GetPx(15),
    color: '#000000',
    textAlign: 'center'
  },
  message: {
    // fontFamily: 'MI-LANTING_GB-OUTSIDE-YS',
    // width: '100%',
    paddingHorizontal: LHUiUtils.GetPx(29),
    marginTop: LHUiUtils.GetPx(23),
    marginBottom: LHUiUtils.GetPx(27),
    fontSize: LHUiUtils.GetPx(15),
    color: '#666666',
    textAlign: 'left',
    textAlignVertical: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'PingFangSC-Regular'// android 字体显示正常，ios没有垂直居中，故另外设置PingFangSC-Regular
      },
      android: {
        fontFamily: 'MI-LANTING_GB-OUTSIDE-YS'
      }
    })
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: 'rgba(0,0,0,0.15)',
    borderTopWidth: 1 / PixelRatio.get() // 使用MHGlobal.MiJiaBorderWidth做宽值时导致两个平台不一致

  },
  btnBox: {
    flex: 1,
    height: LHUiUtils.GetPx(50),
    justifyContent: 'center',
    alignItems: 'center'

  },
  btnText: {
    fontSize: LHUiUtils.GetPx(14),
    color: '#666666',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'PingFangSC-Regular'// android 字体显示正常，ios没有垂直居中，故另外设置PingFangSC-Regular
      },
      android: {
        fontFamily: 'MI-LANTING_GB-OUTSIDE-YS'
      }
    })
  },
  btnLine: {
    height: LHUiUtils.GetPx(50),
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: 1 / PixelRatio.get()
  }

});
