/**
* @module LHCommonUI/LHSelectPage
* @description 选择页面，使用需要在路由中注入
* @param {Object} params 进入页面传参
* @param {string} params.title 页面标题
* @param {string} [params.activeColor=LHUiUtils.MiJiaBlue] 页面选中项、弹窗确定按钮的颜色值
* @param {boolean} [params.hasSaveButton=false] 导航栏是否有保存按钮
* @param {Function} [params.saveButtonPress] 导航栏保存按钮点击回调，返回参数 (activeValue,instance)，通过instance.goBack()可返回，instance.setActiveValue(value)可以改变页面的选中值
* @param {Function} [params.backFunction] 返回按钮点击回调，不传默认返回上一页，返回参数 (activeValue,instance)，通过instance.goBack()可返回，instance.setActiveValue(value)可以改变页面的选中值
* @param {boolean} [params.exitQuery] 返回是否需要弹窗确认
* @param {boolean} [params.exitQueryText=确认放弃本次操作？] 返回弹窗确认文案
* @param {string|number} [params.activeValue] 进入页面选中的值
* @param {Function} [params.itemPress] 每一项点击回调，返回参数 (newValue, oldValue,instance)，通过instance.goBack()可返回，instance.setActiveValue(value)可以改变页面的选中值
* @param {Object[]} params.pageData 页面数据
* @param {string} params.pageData.title 选项标题
* @param {string|number} params.pageData.value 选项的值，当为custom时该项为自定义项，点击会弹出picker供选择
* @param {Function} 【params.customRightDescriptionFormat] 自定义项右边选中值格式化规则，默认value+单位
* @param {Function} 【params.pickerTitle] picker标题，默认跟自定义一选项标题一样
* @param {Function} 【params.getPickerData] picker的数据源
* @param {Function} 【params.unit=s] picker的单位
* @param {number} 【params.pageData.min=0] 不传params.getPickerData时默认是数值picker，可选数值最小值
* @param {number} 【params.pageData.max=59] 不传params.getPickerData时默认是数值picker，可选数值最大值
* @param {Function} [params.pageWillExit] 页面将要退出时的回调，返回参数 (activeValue)
* @example
*
import {
  LHSelectPage
} from 'LHCommonUI';

将LHSelectPage注入页面路由

const { navigation } = this.props;
navigation.navigate('LHSelectPage', {
  hasSaveButton: true,
  saveButtonPress: (activeValue, instance) => {
    console.log(activeValue);
    instance.goBack();
  },
  unit: 's',
  customRightDescriptionFormat: (value) => {
    return value + 's';
  },
  itemPress: (newValue, oldValue, instance) => {
    // instance.setActiveValue(oldValue);
  },
  // backFunction: (activeValue, instance) => {
  //   console.log(activeValue);
  //   instance.goBack();
  // },
  exitQuery: false,
  title: '风速',
  activeValue: 0,
  pageData: [{
    title: '自动',
    value: 0
  },
  {
    title: '高速',
    value: 1
  },
  {
    title: '中速',
    value: 2
  },
  {
    title: '低速',
    value: 3
  },
  {
    title: '自定义-滑动选择picker',
    value: 'custom',
    min: 1,
    max: 59
  }]
});
*/
import React from 'react';
import {
  View,
  BackHandler
} from 'react-native';
import {
  LHTitleBarCustom,
  LHStandardList,
  LHStringModalPicker
} from 'LHCommonUI';
import {
  LHUiUtils,
  LHDialogUtils,
  LHCommonLocalizableString,
  LHPureRenderDecorator
} from 'LHCommonFunction';

class LHSelectPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  }

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.activeColor = navigation.getParam('activeColor') || LHUiUtils.MiJiaBlue;
    this.pickerTitle = navigation.getParam('pickerTitle') || '';
    this.state = {
      activeValue: navigation.getParam('activeValue'),
      showPicker: false
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const exitQuery = navigation.getParam('exitQuery');
    // 有修改时点击返回时弹窗询问
    if (exitQuery) {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.goBackTrigger();
        return true;
      });
    }
  }

  componentWillUnmount() {
    const {
      navigation
    } = this.props;
    const pageWillExit = navigation.getParam('pageWillExit');

    if (typeof pageWillExit === 'function') {
      const { activeValue } = this.state;
      pageWillExit(activeValue);
    }
    if (this.backHandler) this.backHandler.remove();
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
      const { activeValue } = this.state;
      backFunction(activeValue, this);
    } else {
      this.goBack();
    }
  }

  goBackTrigger() {
    const { activeValue } = this.state;
    const {
      navigation
    } = this.props;
    const exitQuery = navigation.getParam('exitQuery');
    if (exitQuery && activeValue !== navigation.getParam('activeValue')) {
      const exitQueryText = navigation.getParam('exitQueryText');
      LHDialogUtils.MessageDialogShow({
        message: exitQueryText || LHCommonLocalizableString.common_tips_discard_operation, // 确认放弃本次操作？
        confirm: LHCommonLocalizableString.common_ok,
        confirmStyle: {
          color: this.activeColor
        },
        onConfirm: () => {
          this.back();
        },
        cancel: LHCommonLocalizableString.common_cancel,
        onCancel: () => {}
      });
    } else {
      this.back();
    }
  }

  // eslint-disable-next-line
  getConstomActiveStatus(pageData, activeValue) {
    for (let i = 0, len = pageData.length; i < len; i += 1) {
      if (pageData[i].value === activeValue && activeValue !== 'custom') return false;
    }
    return true;
  }

  // eslint-disable-next-line
  getRightDescription(activeValue) {
    const { navigation } = this.props;
    const customRightDescriptionFormat = navigation.getParam('customRightDescriptionFormat') || [];
    const unit = navigation.getParam('unit');
    if (typeof customRightDescriptionFormat === 'function') {
      return customRightDescriptionFormat(activeValue);
    }
    return activeValue + (unit || 's');
  }

  getPageData() {
    const { navigation } = this.props;
    const pageData = navigation.getParam('pageData') || [];
    const { activeValue } = this.state;
    const data = [];
    for (let i = 0, len = pageData.length; i < len; i += 1) {
      const active = pageData[i].value !== 'custom' ? (activeValue === pageData[i].value) : this.getConstomActiveStatus(pageData, activeValue);
      data.push({
        title: pageData[i].title,
        hideRightArrow: pageData[i].value !== 'custom',
        hideTopSeparatorLine: i === 0,
        active,
        activeIconStyle: {
          tintColor: this.activeColor
        },
        titleStyle: active ? {
          color: this.activeColor
        } : null,
        rightDescription: (pageData[i].value === 'custom' && active) ? this.getRightDescription(activeValue) : null,
        press: () => {
          if (pageData[i].value === 'custom') {
            this.min = pageData[i].min || 0;
            this.max = pageData[i].max || 59;
            if (!this.pickerTitle) {
              this.pickerTitle = pageData[i].title;
            }
            this.setState({
              showPicker: true
            });
          } else {
            const { activeValue: oldValue } = this.state;
            this.itemPress(pageData[i].value, oldValue);
          }
        }
      });
    }
    return [{
      title: '',
      data
    }];
  }

  itemPress(newValue, oldValue) {
    this.setActiveValue(newValue);
    const {
      navigation
    } = this.props;
    const itemPress = navigation.getParam('itemPress');
    if (typeof itemPress === 'function') {
      itemPress(newValue, oldValue, this);
    }
  }

  setActiveValue(value) {
    this.setState({
      activeValue: value
    });
  }

  getStringModalPickerData() {
    const { navigation } = this.props;
    const getPickerData = navigation.getParam('getPickerData');
    if (typeof getPickerData === 'function') {
      return getPickerData();
    } else {
      const { min, max } = this;
      const result = [];
      for (let i = min; i <= max; i += 1) {
        result.push('' + i);
      }
      return result;
    }
  }

  render() {
    const {
      navigation
    } = this.props;
    const {
      activeValue,
      showPicker
    } = this.state;
    const hasSaveButton = navigation.getParam('hasSaveButton');
    const saveButtonPress = navigation.getParam('saveButtonPress');
    const oldActiveValue = navigation.getParam('activeValue');
    const unit = navigation.getParam('unit');
    return (
      <View style={[{
        flex: 1,
        backgroundColor: '#f7f7f7'
      }]}
      >
        <LHTitleBarCustom
          title={navigation.getParam('title') || ''}
          showSeparator
          onPressLeft={() => { this.goBackTrigger(); }}
          rightButtons={
            hasSaveButton ? [{
              type: 'deafultCompleteBtn',
              disable: oldActiveValue === activeValue,
              press: () => {
                const { activeValue: newActiveValue } = this.state;
                if (oldActiveValue !== newActiveValue) {
                  if (typeof saveButtonPress === 'function') {
                    saveButtonPress(newActiveValue, this);
                  }
                }
              }
            }] : null
          }
        />
        <LHStandardList
          data={this.getPageData()}
        />
        <LHStringModalPicker
          title={this.pickerTitle}
          show={showPicker}
          dataSource={this.getStringModalPickerData()}
          defaultValue={'' + activeValue}
          unit={unit || 's'}
          okTextStyle={{ color: this.activeColor }}
          onSelected={(data) => {
            this.itemPress(data.newValue, navigation.getParam('activeValue'));
          }}
          onClose={() => {
            this.setState({
              showPicker: false
            });
          }}
        />
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHSelectPage);