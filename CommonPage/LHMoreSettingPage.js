/**
* @module LHCommonUI/LHMoreSettingPage
* @description 更多设置页面，使用需要在路由中注入
* @param {Object} params 进入页面传参
* @param {string} [params.showDeviceTimeZone=false] 是否显示设备时区项
* @example
*
import {
  LHMoreSettingPage
} from 'LHCommonUI';

将LHSelectPage注入页面路由

const { navigation } = this.props;
navigation.navigate('LHMoreSettingPage', {
  showDeviceTimeZone: true
});
*/
import React from 'react';
import { View } from 'react-native';
import {
  Device,
  DeviceEvent,
  Host
} from 'miot';
import {
  LHSettingItem,
  LHCommonLocalizableString,
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import { LHStandardList, LHTitleBarCustom } from 'LHCommonUI';

const { isShared } = Device;
class LHMoreSettingPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title={LHCommonLocalizableString.common_setting_more_setting}
            style={[{
              backgroundColor: LHUiUtils.MiJiaWhite,
              borderBottomWidth: LHUiUtils.MiJiaBorderWidth,
              borderBottomColor: LHUiUtils.MiJiaLineColor
            }]}
            onPressLeft={() => { navigation.goBack(); }}
          />
        </View>
      )
    };
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      timeZone: Device.timeZone || '' // 从未设置过时区的话，为空字符串
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    const { navigation } = this.props;
    const showDeviceTimeZone = navigation.getParam('showDeviceTimeZone');
    if (showDeviceTimeZone) {
      this.deviceTimeZoneChangedListener = DeviceEvent.deviceTimeZoneChanged.addListener((device) => {
        this.setState({
          timeZone: device.timeZone
        });
      });
      // android 无法直接获取常量 Device.timeZone
      Device.getDeviceTimeZone()
        .then((result) => {
          console.log(result);
          this.setState({
            timeZone: (result && result.timeZone) || ''
          });
        })
        .catch((error) => {
          console.log('获取设备时区失败，错误：', error);
        });
    }
  }

  componentWillUnmount() {
    if (this.deviceTimeZoneChangedListener) this.deviceTimeZoneChangedListener.remove();
  }

  getPageData() {
    const { navigation } = this.props;
    const showDeviceTimeZone = navigation.getParam('showDeviceTimeZone');
    const syncDeviceTimeZoneToDevice = navigation.getParam('syncDeviceTimeZoneToDevice') || false;
    const { timeZone } = this.state;
    const items = [{
      title: '',
      data: [
        isShared ? null : LHSettingItem.getSettingItem('securitySetting', {
          hideTopSeparatorLine: !isShared
        }),
        LHSettingItem.getSettingItem('feedbackInput', {
          hideTopSeparatorLine: isShared
        }),
        showDeviceTimeZone ? LHSettingItem.getSettingItem('deviceTimeZone', {
          rightDescription: timeZone,
          rightDescriptionStyle: timeZone ? {
            flex: 1
          } : null,
          textContainer: timeZone ? {
            flex: 0
          } : null,
          press: () => {
            Host.ui.openDeviceTimeZoneSettingPage({ sync_device: syncDeviceTimeZoneToDevice });
          }
        }) : null,
        LHSettingItem.addToDesktopItem
      ]
    }];
    for (let i = 0; i < items[0].data.length; i += 1) {
      if (!items[0].data[i]) {
        items[0].data.splice(i, 1);
        i -= 1;
      }
    }
    return items;
  }

  render() {
    const pageData = this.getPageData();
    return (
      <View style={{
        flex: 1,
        backgroundColor: LHUiUtils.MiJiaBackgroundGray
      }}
      >
        <LHStandardList
          data={pageData}
        />
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHMoreSettingPage);
