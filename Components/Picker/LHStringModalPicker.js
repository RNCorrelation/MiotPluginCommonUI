/**
* @module LHCommonUI/LHStringModalPicker
* @description 滑动选择弹窗
* @property {boolean} show 是否显示弹窗
* @property {Array} dataSource 滑动选择器数据
* @property {string} title 滑动选择弹窗标题
* @property {string} unit 滑动选择器的单位
* @property {string} defaultValue 滑动选择器的默认选中值
* @property {Object} okTextStyle 确认按钮样式
* @property {Object} cancelStyle 取消按钮样式
* @property {boolean} [maskClickClose=true] 点击蒙版是否收起弹窗
* @property {Object} innerStyle 滑动选择器的样式，注意该样式跟RN的样式不一样，参考StringSpinner的pickerInnerStyle
* @property {Function} onChange 数据改变时的回调
* @property {Function} onSelected 确认按钮点击回调
* @property {Function} onRequestClose 取消按钮点击回调，默认关闭弹窗
* @property {Function} onClose 弹窗关闭后回调
* @example
* import { LHStringModalPicker } from "LHCommonUI";

<LHStringModalPicker
  title={LHCommonLocalizableString.common_date_selfdefine}
  show={showPicker}
  dataSource={['1', '2', '3', '4', '5', '6']}
  defaultValue={'1'}
  unit="s"
  okTextStyle={{ color: LHUiUtils.MiJiaBlue }}
  onSelected={(data) => {
  }}
  onClose={() => {
    this.setState({
      showPicker: false
    });
  }}
/>
*
*/
/* eslint-disable prefer-destructuring */
import React from 'react';

import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Modal,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { StringSpinner } from 'miot/ui';
import {
  LHUiUtils,
  LHDeviceUtils,
  LHCommonLocalizableString
} from 'LHCommonFunction';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  backgroundMask: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  modal: {
    flex: 1
  },
  modalMask: {
    flex: 1
  },
  modalContent: {
    backgroundColor: LHUiUtils.MiJiaWhite,
    overflow: 'hidden',
    width: width - 20,
    marginLeft: 10,
    borderRadius: 20,
    marginBottom: 10 + LHDeviceUtils.AppHomeIndicatorHeight
  },
  row: {
    flexDirection: 'row'
    // justifyContent:'flex-start',
  },
  title: {
    color: '#000',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
    paddingTop: 17,
    paddingBottom: 16,
    fontWeight: 'bold'
  },
  Btn: {
    flex: 1,
    paddingTop: 14.5,
    paddingBottom: 16,
    fontSize: 14,
    lineHeight: 19,
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center'
  },
  confirm: {
    color: LHUiUtils.MiJiaBlue
  },
  borderLeft: {
    borderLeftWidth: LHUiUtils.MiJiaBorderWidth,
    borderColor: LHUiUtils.MiJiaLineColor
  },
  borderTop: {
    borderTopWidth: LHUiUtils.MiJiaBorderWidth,
    borderColor: LHUiUtils.MiJiaLineColor
  }
});

const pickerInnerStyle = {
  lineColor: '#26000000',
  textColor: '#666666',
  selectTextColor: '#000000',
  fontSize: 13,
  selectFontSize: 16,
  rowHeight: 50,
  selectBgColor: '#F3F3F3',
  unitFontSize: 8,
  unitTextColor: '#000000'
};

class LHStringModalPicker extends React.Component {
  static defaultProps = {
    show: false,
    defaultValue: '',
    animated: true,
    maskClickClose: true,
    autoCloseWhenSelected: true,
    onRequestClose(modal) {
      modal.close();
    },
    onSelected() {

    },
    onClose() {

    }
  }

  constructor(props, context) {
    super(props, context);
    const {
      show,
      defaultValue,
      autoCloseWhenSelected,
      animated,
      maskClickClose,
      onRequestClose,
      onSelected,
      onClose,
      dataSource
    } = this.props;
    let value = defaultValue;
    if (!(defaultValue in dataSource)) {
      value = dataSource[0];
    }
    this.state = {
      value: {
        newValue: value
      },
      show,
      autoCloseWhenSelected,
      animated,
      maskClickClose,
      onRequestClose,
      onSelected,
      onClose,
      slideValue: new Animated.Value(0),
      hideValue: new Animated.Value(0)
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(data) {
    const { show } = this.state;
    if (typeof data.show !== 'undefined') {
      if (show && !data.show) {
        this.close();
      } else {
        this.setState({ show: data.show });
      }
    }
    if (!show && data.show) this.showModalAnimate();
  }

  componentWillUnmount() {
  }

  onSelected() {
    const {
      autoCloseWhenSelected,
      onSelected,
      value
    } = this.state;
    if (autoCloseWhenSelected) this.close();
    onSelected(value);
  }

  calcel() {
    const { onRequestClose } = this.state;
    onRequestClose(this);
  }

  closeWithoutAnimate() {
    const { onClose } = this.state;
    this.setState({ show: false });
    onClose();
  }

  close() {
    const { animated } = this.state;
    if (animated) {
      this.hideModalAnimate();
    } else {
      this.closeWithoutAnimate();
      this.isHiding = false;
    }
  }

  maskClick() {
    const { maskClickClose } = this.state;
    if (this.isHiding) return;
    this.isHiding = true;
    if (maskClickClose) this.close();
  }

  hideModalAnimate() {
    const { slideValue, hideValue } = this.state;
    slideValue.setValue(1);
    hideValue.setValue(0);
    Animated.parallel([Animated.timing(
      slideValue, {
        toValue: 0,
        duration: 500,
        easing: Easing.bezier(0.445, 0.05, 0.55, 0.95)
      }
    ).start(), Animated.timing(
      hideValue, {
        toValue: 0,
        duration: 320,
        easing: Easing.bezier(0.42, 0, 0.58, 1)
      }
    ).start((e) => {
      if (e.finished) {
        this.closeWithoutAnimate();
        this.isHiding = false;
      }
    })]);
  }

  showModalAnimate() {
    const { slideValue } = this.state;
    slideValue.setValue(0);
    Animated.timing(
      slideValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.2833, 0.99, 0.31833, 0.99)
      }
    ).start();
  }

  render() {
    const {
      show,
      slideValue
    } = this.state;
    const {
      title,
      unit,
      dataSource,
      defaultValue,
      onChange,
      okTextStyle,
      cancelStyle,
      innerStyle
    } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={show}
        onRequestClose={() => { this.close(); }}
        onShow={() => { }}
      >
        <View style={styles.backgroundMask}>
          <Animated.View style={[
            styles.modal,
            {
              transform: [{
                translateY: slideValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height, 0]
                })
              }]
            }]}
          >
            <TouchableWithoutFeedback onPress={() => { this.maskClick(); }}>
              <View style={styles.modalMask} />
            </TouchableWithoutFeedback>
            <View style={[styles.modalContent]}>
              <Text numberOfLines={1} style={styles.title}>{title}</Text>
              <View style={styles.borderTop}>
                <StringSpinner
                  style={{ width: '100%', height: 209 }}
                  visible={show}
                  dataSource={dataSource}
                  defaultValue={defaultValue}
                  unit={unit}
                  pickerInnerStyle={{ ...pickerInnerStyle, ...StyleSheet.flatten(innerStyle || {}) }}
                  onValueChanged={(data) => {
                    this.setState({
                      value: data
                    });
                    if (typeof onChange === 'function') onChange(data);
                  }}
                />
              </View>
              <View style={[styles.row, styles.borderTop]}>
                <Text suppressHighlighting style={[styles.Btn, styles.cancel, cancelStyle]} onPress={() => { this.calcel(); }}>{LHCommonLocalizableString.common_cancel}</Text>
                <View style={styles.borderLeft} />
                <Text suppressHighlighting style={[styles.Btn, styles.confirm, okTextStyle]} onPress={() => { this.onSelected(); }}>{LHCommonLocalizableString.common_ok}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

/**
 *  这里考虑到一个页面复用一个Picker
 *  更改Picker的defaultValue需要重新render一次
 *  没有使用LHPureRenderDecorator
 */
export default LHStringModalPicker;
