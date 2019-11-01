/**
 * @module LHLoadingDialog
 * @description 载入中弹框，
 * @property message:弹框文本
 * @property timeout:超时时间，默认为10秒
 * @property visible{boolean} :显示弹框与隐藏
 * @property cancelable{boolean} :点击Android是否隐藏当前弹框，默认为true
 * @property onDismiss{function} :弹框消失时的回调
 * @property contentStyle{object} :弹框文本样式（包括字体字体大小、颜色、边框等）
 * @example
 * import { CustomMessageDialog } from "LHCommonUI";
 *
 *
 *   //组件调用方式
 *<LHLoadingDialog
 *  message={customLoadingDialogObject.message}
 *  visible={customLoadingDialogObject.visible}
 *  cancelable={customLoadingDialogObject.cancelable}
 *  timeout={customLoadingDialogObject.timeout}
 *  onDismiss={() => {
            this.setState({
              customLoadingDialogObject: Object.assign({}, customLoadingDialogObject, { visible: false })
            });
          }}
 />

 *  //函数调用方式
 *   LHDialogUtils.showCustomLoadingDialog({
        message: LocalizedStrings.loading,
        timeout: 5000,
        cancelable: true,
        onDismiss: () => {
          LHDialogUtils.hideCustomLoadingDialog();
        }
      });
 *
 *
 */

import React from 'react';
import {
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  View, Platform, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { LHUiUtils, LHDeviceUtils } from 'LHCommonFunction';

const { width } = Dimensions.get('window');

const marginBottomDis = LHDeviceUtils.AppHomeIndicatorHeight || LHUiUtils.GetPx(10);// iPhoneX是34，其他手机时10

export default class LHLoadingDialog extends React.PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    visible: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/require-default-props
    message: PropTypes.string,
    timeout: PropTypes.number,
    cancelable: PropTypes.bool, // 是否可以取消
    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    contentStyle: PropTypes.object,
    // eslint-disable-next-line react/require-default-props
    onDismiss: PropTypes.func
  };

  static defaultProps = {
    cancelable: true, // 默认能点击遮罩取消
    // eslint-disable-next-line react/default-props-match-prop-types
    visible: false,
    timeout: 10000// 超时后自动关闭
  };

  constructor (props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment
      showModal: this.props.visible,
      rotateAnim: new Animated.Value(0)
    };
    this.rotateAnimIns = null;
    this.timeoutIns = null;
  }

  /**
   * 开始旋转
   */
  // eslint-disable-next-line react/sort-comp
  startRotate () {
    this.state.rotateAnim.setValue(0);//
    // eslint-disable-next-line react/destructuring-assignment
    this.rotateAnimIns = Animated.timing(this.state.rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true
    });
    Animated.loop(this.rotateAnimIns, -1)
      .start(); // loop无限循环

    // 超时后自动取消循环
    this.timeoutIns = setTimeout(() => {
      if (this.rotateAnimIns) {
        // 存在则停止动画
        Animated.loop(this.rotateAnimIns)
          .stop();
        this.rotateAnimIns = null;// 清空
      }
      this.timeoutIns = null;
      // eslint-disable-next-line react/destructuring-assignment
      this.props.onDismiss && this.props.onDismiss(); // 超时关闭Loading框
      // eslint-disable-next-line react/destructuring-assignment
    }, this.props.timeout);
  }

  /**
   * 因为当前此组件是放到根组件下使用，所有componentDidMount方法内不启动startRotate（）
   * 如果想在其他地方用时，startRotate（）就在componentDidMount中使用
   */
  componentDidMount () {
    // this.startRotate();
  }

  /**
   * 接收新props，
   */
  componentWillReceiveProps (nextProps, nextContext) {
    // eslint-disable-next-line react/destructuring-assignment
    if (nextProps.visible != this.props.visible) {
      this.setState({ showModal: nextProps.visible });

      if (this.rotateAnimIns) {
        // 存在则停止动画
        Animated.loop(this.rotateAnimIns)
          .stop();
        this.rotateAnimIns = null;// 清空
        if (this.timeoutIns) {
          clearTimeout(this.timeoutIns);
        }
      } else if (nextProps.visible) {
        this.startRotate();
      }
    }
  }

  render () {
    const {
      onDismiss, cancelable,
      contentStyle, message
    } = this.props;

    return (
      <Modal
        animationType="none"
        transparent
        visible={this.state.showModal}
        onRequestClose={() => {
          onDismiss && onDismiss();
        }}
        onShow={() => {
        }}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.cancelWrapper}
            onPress={() => {
              cancelable && onDismiss && onDismiss();
            }}
          />

          <View style={styles.wrapper}>
            <Animated.Image
              source={require('../../Resources/loading.png')}
              style={[{
                width: LHUiUtils.GetPx(18),
                height: LHUiUtils.GetPx(18)
              }, {
                transform: [{
                  // eslint-disable-next-line react/destructuring-assignment
                  rotate: this.state.rotateAnim.interpolate({
                    inputRange: [0, 1], // 输入值
                    outputRange: ['0deg', '360deg'] // 输出值
                  })
                }]
              }]}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.message, contentStyle]}
            >{message}
            </Text>
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
    padding: LHUiUtils.GetPx(27),
    alignItems: 'center',
    width: width - LHUiUtils.GetPx(20),
    flexDirection: 'row',
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
  message: {
    marginLeft: LHUiUtils.GetPx(15),
    // fontFamily: 'MI-LANTING_GB-OUTSIDE-YS',
    // width: '100%',
    fontSize: LHUiUtils.GetPx(15),
    color: '#000000',
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
  }
});
