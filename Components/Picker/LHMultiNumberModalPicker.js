/**
  <LHMultiNumberModalPicker
    title="侦测时间间隔"
    show={showPicker}
    data={[{
      defaultValue: 0,
      minValue: 0,
      maxValue: 9,
      unit: '时'
    },
    {
      defaultValue: 0,
      minValue: 0,
      maxValue: 59,
      unit: '分'
    },
    {
      defaultValue: 5,
      minValue: 0,
      maxValue: 59,
      unit: '秒'
    }]}
    onSelected={(data) => {
      console.log(data);
    }}
    onClose={() => {
      this.setState({
        showPicker: false
      });
    }}
  />
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
  },
  spinnerStyle: {
    flex: 1,
    height: 209
  }
});
class LHMultiNumberModalPicker extends React.Component {
  static defaultProps = {
    show: false,
    animated: true,
    maskClickClose: true,
    autoCloseWhenSelected: true,
    data: [],
    onRequestClose(modal) {
      modal.close();
    },
    onSelected() {

    },
    onClose() {

    },
    onChange() {

    }
  }

  constructor(props, context) {
    super(props, context);
    const {
      show,
      autoCloseWhenSelected,
      animated,
      maskClickClose,
      onRequestClose,
      onSelected,
      onClose,
      title,
      data,
      onChange
    } = this.props;
    this.valueCache = [];
    this.initValueCache(data);
    this.state = {
      show,
      autoCloseWhenSelected,
      animated,
      maskClickClose,
      onRequestClose,
      onSelected,
      onClose,
      title: title || '',
      onChange,
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
        this.initValueCache(data.data);
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
      onSelected
    } = this.state;
    if (autoCloseWhenSelected) this.close();
    onSelected(this.valueCache);
  }

  initValueCache(data) {
    for (let i = 0, len = data.length; i < len; i += 1) {
      if (!this.valueCache[i]) {
        this.valueCache[i] = typeof data[i].defaultValue === 'undefined' ? data[i].minValue : data[i].defaultValue;
      }
    }
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
    }
  }

  maskClick() {
    const { maskClickClose } = this.state;
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

  renderNumberSpinner(item, index) {
    const {
      show,
      onChange
    } = this.state;
    return (
      <NumberSpinner
        key={'NumberSpinner_' + index}
        style={styles.spinnerStyle}
        visible={show}
        valueFormat={item.valueFormat}
        maxValue={item.maxValue}
        minValue={item.minValue}
        defaultValue={item.defaultValue}
        unit={item.unit}
        onNumberChanged={(data) => {
          this.valueCache[index] = data.newValue;
          if (typeof onChange === 'function') onChange(this.valueCache);
        }}
      />
    );
  }

  render() {
    const {
      show,
      title,
      slideValue
    } = this.state;
    const {
      // unit,
      // minValue,
      // maxValue,
      // defaultValue
      data
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
              <View style={[styles.row, styles.borderTop]}>
                {data.map((item, index) => {
                  return this.renderNumberSpinner(item, index);
                })}
              </View>
              <View style={[styles.row, styles.borderTop]}>
                <Text suppressHighlighting style={[styles.Btn, styles.cancel]} onPress={() => { this.calcel(); }}>{LHCommonLocalizableString.common_cancel}</Text>
                <View style={styles.borderLeft} />
                <Text suppressHighlighting style={[styles.Btn, styles.confirm]} onPress={() => { this.onSelected(); }}>{LHCommonLocalizableString.common_ok}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
export default LHPureRenderDecorator(LHMultiNumberModalPicker);
