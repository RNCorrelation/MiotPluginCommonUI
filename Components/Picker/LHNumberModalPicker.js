/**
* @module LHCommonUI/LHNumberModalPicker
* @description 数字滑动选择弹窗，不再推荐使用该组件，请使用LHStringModalPicker替代
*
*/
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
import { NumberSpinner } from 'miot/ui';
import {
  LHUiUtils,
  LHDeviceUtils,
  LHCommonLocalizableString,
  LHPureRenderDecorator
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
class LHNumberModalPicker extends React.Component {
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
      title,
      minValue,
      maxValue
    } = this.props;
    let value = defaultValue;
    if (defaultValue < minValue || defaultValue > maxValue) {
      value = minValue;
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
      title: title || '',
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
      title,
      slideValue
    } = this.state;
    const {
      unit,
      minValue,
      maxValue,
      defaultValue,
      onChange,
      step,
      okTextStyle,
      cancelStyle,
      pickerInnerStyle
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
                <NumberSpinner
                  style={{ width: '100%', height: 209 }}
                  visible={show}
                  maxValue={maxValue}
                  minValue={minValue}
                  defaultValue={defaultValue}
                  unit={unit}
                  interval={step || 1}
                  pickerInnerStyle={pickerInnerStyle}
                  onNumberChanged={(data) => {
                    this.setState({
                      value: data
                    });
                    if (typeof onChange === 'function') onChange(data);
                  }}
                />
              </View>
              <View style={[styles.row, styles.borderTop]}>
                <Text suppressHighlighting style={[styles.Btn, styles.cancel, cancelStyle || {}]} onPress={() => { this.calcel(); }}>{LHCommonLocalizableString.common_cancel}</Text>
                <View style={styles.borderLeft} />
                <Text suppressHighlighting style={[styles.Btn, styles.confirm, okTextStyle || {}]} onPress={() => { this.onSelected(); }}>{LHCommonLocalizableString.common_ok}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
export default LHPureRenderDecorator(LHNumberModalPicker);
