import React, { Component } from 'react';
import { View } from 'react-native';
import { LHPureRenderDecorator } from 'LHCommonFunction';
import {
  LHStandardList,
  LHTitleBarCustom,
  LHCommonStyles,
  LHDatePicker
} from 'LHCommonUI';
import { ChoiceDialog } from 'miot/ui/Dialog';

class LHTimerPage extends Component {
  /**
   * index 1.时间段定时 2.定时开启 3.定时关闭
   */
  static navigationOptions = ({ navigation }) => {
    const leftButton = {
      type: 'deafultCloseBtn',
      press: () => { navigation.goBack(); }
    };
    const rightButton = {
      type: 'deafultCompleteBtn',
      press: () => { navigation.goBack(); }
    };
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title={navigation.getParam('title')}
            style={LHCommonStyles.navigatorWithBorderBotoom}
            leftButtons={[leftButton]}
            rightButtons={[rightButton]}
          />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      datePickerVisible: 0, // 0.不显示 1.定时开启 2.定时关闭
      choiceDialogVisible: 0, // 0.不显示 1.重复选项 2.自定义重复
      startTime: null, // 开启时间，数组[hour, minute]
      endTime: null, // 关闭时间，数组[hour, minute]
      startTimeStr: null, // 开启时间，字符串 'hour:minute'
      endTimeStr: null // 关闭时间，字符串 'hour:minute'
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getPageData() {
    const { navigation } = this.props;
    const { startTimeStr, endTimeStr } = this.state;
    const index = navigation.getParam('index');
    const data = [];
    // 开启时间
    let open = {
      title: '开启时间',
      description: startTimeStr === null ? '未设置' : startTimeStr,
      press: () => {
        this.setState({ datePickerVisible: 1 });
      }
    };
    // 关闭时间
    const close = {
      title: '关闭时间',
      description: endTimeStr === null ? '未设置' : endTimeStr,
      press: () => {
        this.setState({ datePickerVisible: 2 });
      }
    };
    // 加入数组
    if (index === 1 || index === 2) {
      open = Object.assign(open, { hideTopSeparatorLine: true });
      if (index === 1) {
        data.push(open);
        data.push(close);
      } else {
        data.push(open);
      }
    } else if (index === 3) {
      open = Object.assign(close, { hideTopSeparatorLine: true });
      data.push(close);
    }
    // 重复次数
    data.push({
      title: '重复',
      description: '每天',
      press: () => {
        this.setState({ choiceDialogVisible: 1 });
      }
    });
    return [{ data }];
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentTime() {
    const date = new Date();
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    return [hour, minute];
  }

  getDatePickerData() {
    const { datePickerVisible, startTime, endTime } = this.state;
    if (datePickerVisible === 1) {
      return {
        title: '开启时间',
        time: startTime === null ? this.getCurrentTime() : startTime
      };
    } else {
      return {
        title: '关闭时间',
        time: endTime === null ? this.getCurrentTime() : endTime
      };
    }
  }

  getChoiceDialogData() {
    const { choiceDialogVisible } = this.state;
    if (choiceDialogVisible === 1) {
      return {
        title: '重复选项',
        type: ChoiceDialog.TYPE.SINGLE,
        selectedIndexArray: [0],
        options: [
          { title: '执行一次' },
          { title: '每天' },
          { title: '工作日' },
          { title: '周末' },
          { title: '自定义' }
        ]
      };
    } else {
      return {
        title: '自定义重复',
        type: ChoiceDialog.TYPE.MULTIPLE,
        selectedIndexArray: [0],
        options: [
          { title: '周一' },
          { title: '周二' },
          { title: '周三' },
          { title: '周四' },
          { title: '周五' },
          { title: '周六' },
          { title: '周日' }
        ]
      };
    }
  }

  selectedDatePicker = (data) => {
    const { datePickerVisible } = this.state;
    const { rawArray, rawString } = data;
    if (datePickerVisible === 1) {
      this.setState({ startTime: rawArray, startTimeStr: rawString });
    } else {
      this.setState({ endTime: rawArray, endTimeStr: rawString });
    }
  }

  dialogSelected = (data) => {
    console.warn(data);
    // const { choiceDialogVisible } = this.state;
    this.setState({ choiceDialogVisible: 2 });
    // if (choiceDialogVisible === 1 && data[0] === 4) {
    //   this.setState({ choiceDialogVisible: 2 });
    // } else {}
  }

  renderChoiceDialog(visible, choiceDialogData) {
    const { choiceDialogVisible } = this.state;
    return (
      <ChoiceDialog
        visible={choiceDialogVisible === visible}
        title={choiceDialogData.title}
        type={choiceDialogData.type}
        options={choiceDialogData.options}
        selectedIndexArray={choiceDialogData.selectedIndexArray}
        onDismiss={() => { this.setState({ choiceDialogVisible: 0 }); }}
        onSelect={this.dialogSelected}
      />
    );
  }

  render() {
    const { datePickerVisible } = this.state;
    const pageData = this.getPageData();
    const datePickerData = this.getDatePickerData();
    const choiceDialogData = this.getChoiceDialogData();
    return (
      <View style={LHCommonStyles.pageGrayStyle}>
        <LHStandardList data={pageData} />
        <LHDatePicker
          visible={datePickerVisible > 0}
          title={datePickerData.title}
          current={datePickerData.time}
          type={LHDatePicker.TYPE.TIME24}
          onDismiss={() => { this.setState({ datePickerVisible: 0 }); }}
          onSelect={this.selectedDatePicker}
        />
        {this.renderChoiceDialog(1, choiceDialogData)}
        {this.renderChoiceDialog(2, choiceDialogData)}
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHTimerPage);