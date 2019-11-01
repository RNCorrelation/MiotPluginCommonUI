import React, { Component } from 'react';
import { View, TouchableHighlight, Image } from 'react-native';
import { LHPureRenderDecorator } from 'LHCommonFunction';
import {
  LHStandardList,
  LHCommonIcon,
  LHImageButton,
  LHTitleBarCustom,
  LHCommonStyles
} from 'LHCommonUI';
import { ActionSheet } from 'miot/ui/Dialog';

class LHTimerPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title={navigation.getParam('title')}
            style={LHCommonStyles.navigatorWithBorderBotoom}
            onPressLeft={() => { navigation.goBack(); }}
          />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      actionSheetVisible: false
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getPageData() {
    return [{
      data: [{
        title: '17:22',
        hideRightArrow: true,
        description: '开启时间 | 今天',
        hasSwitch: true,
        switchValue: false,
        hideTopSeparatorLine: true
      }, {
        title: '12:02',
        hideRightArrow: true,
        description: '关闭时间 | 周末',
        hasSwitch: true,
        switchValue: true
      }, {
        title: '19:17-20:27',
        hideRightArrow: true,
        description: '开启时段 | 执行一次 | 2019-04-25 开启',
        hasSwitch: true,
        switchValue: true
      }, {
        title: '20:38-明天18:28',
        hideRightArrow: true,
        description: '开启时段 | 执行一次 | 2019-04-25 开启',
        hasSwitch: true,
        switchValue: true
      }]
    }];
  }

  // eslint-disable-next-line class-methods-use-this
  getActionSheetData() {
    const { navigation } = this.props;
    return [{
      title: '时间段定时',
      onPress: () => {
        navigation.navigate('LHNewTimerPage', { title: '时间段定时', index: 1 });
      }
    }, {
      title: '定时开启',
      onPress: () => {
        navigation.navigate('LHNewTimerPage', { title: '定时开启', index: 2 });
      }
    }, {
      title: '定时关闭',
      onPress: () => {
        navigation.navigate('LHNewTimerPage', { title: '定时关闭', index: 3 });
      }
    }];
  }

  addPress = () => {
    this.setState({ actionSheetVisible: true });
  };

  dismissAction = () => {
    this.setState({ actionSheetVisible: false });
  }

  render() {
    const { actionSheetVisible } = this.state;
    const pageData = this.getPageData();
    const actionSheetData = this.getActionSheetData();
    return (
      <View style={LHCommonStyles.pageGrayStyle}>
        <LHStandardList data={pageData} />
        <TouchableHighlight onPress={this.addPress}>
          <Image style={LHCommonStyles.bottomBtn} source={LHCommonIcon.common.add.normal} />
        </TouchableHighlight>
        <ActionSheet
          visible={actionSheetVisible}
          options={actionSheetData}
          buttons={[{ text: '取消', callback: this.dismissAction }]}
          onDismiss={this.dismissAction}
        />
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHTimerPage);