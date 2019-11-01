/*
 * @Date: 2019-08-14 17:10:16
 * @LastEditors: Lavie
 * @LastEditTime: 2019-08-15 12:23:47
 */
/**
* @module LHCommonUI/LHSetting
* @description 设置页面组件
* @property {Object} navigation 必传，不然无法跳转更多设置二级页面
* @property {Object} PolicyLicenseUrl 必传，用户协议和隐私政策url(包含全部的)
* @property {Function} [getPolicyLicenseUrl] 可定义如何从PolicyLicenseUrl中选择正确的url，默认使用LHPolicyLicenseUtils.GexPolicyLicenseUrl方式选用
* @property {Array} [settingItems] 功能设置项,不传不显示该项
* @property {boolean} [showShare=false] 是否显示分享设备项，网关默认都显示，除非指定hideGatewayShare为true
* @property {boolean} [hideGatewayShare=false] 是否隐藏网关的分享项
* @property {boolean} [showBtGateway=false] 是否显示蓝牙网关项
* @property {boolean} [showVoiceAuth=false] 是否显示语音授权项
* @property {boolean} [showSwitchSetting=false] 是否显示按键设置项
* @property {boolean} [showIftt=true] 是否显示智能场景项
* @property {boolean} [showFirmwareUpgrate=true] 是否显示固件升级项
* @property {boolean} [needFirmwareUpgrateDot=true] 是否需要固件升级红点提示逻辑
* @property {boolean} [showIsHomeKitDevice=false] 是否显示HomeKit绑定项
* @property {boolean} [showDeviceTimeZone=true] 更多设置二级页面里面是否需要显示设备时区项
* @property {boolean} [syncDeviceTimeZoneToDevice=false] 更多设置二级页面里面是否需要同步设备时区到设备端
* @property {boolean} [hideLegalInformation] 是否隐藏法律信息
* @property {Function} [AdjustmentCommonItems] 通过改方法可以调整通用设置项
*
* @example
* import { LHSetting } from "LHCommonUI";
* const languageCode = navigation.getParam('languageCode');
* const policyLicenseUrl = LHPolicyLicenseUtils.GexPolicyLicenseUrl(Resources.PolicyLicense, languageCode);
* <LHSetting
*   navigation={navigation}
*   PolicyLicenseUrl={policyLicenseUrl}
*   settingItems={settingItems}
*   AdjustmentCommonItems={(items) => {
*     // 最好不要直接改源数据
*     const data = CommonMethod.DeepClone(items, []);
*     // 把前面的项定义好，根据每个项上面的定义的index指定，这里把分享放到第二个
*     const sort = [1, 9];
*     const result = [];
*     for (let i = 0, len = sort.length; i < len; i += 1) {
*       const index = CommonMethod.Find(data, 'index', sort[i]);
*       if (index > -1) {
*         result.push(data[index]);
*         data.splice(index, 1);
*       }
*     }
*     return result.concat(data);
*   }}
* />
*/
import React from 'react';
import {
  Platform
} from 'react-native';
import {
  Device,
  DeviceEvent,
  Host
} from 'miot';
import {
  LHSettingItem,
  LHCommonLocalizableString,
  LHPureRenderDecorator,
  LHHardwareUpdateUtils,
  LHAuthorizationUtils
} from 'LHCommonFunction';
import { LHStandardList } from 'LHCommonUI';

const { isShared } = Device;
class LHSetting extends React.Component {
  static defaultProps = {
    showFirmwareUpgrate: true,
    needFirmwareUpgrateDot: true,
    showIftt: true,
    hideLegalInformation: false,
    showDeviceTimeZone: true,
    syncDeviceTimeZoneToDevice: false
  }

  constructor(props) {
    super(props);
    this.state = {
      deviceName: Device.name,
      isHomeKitDevice: false,
      pairedHomeKit: false,
      showFirmwareUpgrateDot: false
    };
  }

  componentDidMount() {
    const {
      showIsHomeKitDevice,
      showFirmwareUpgrate,
      needFirmwareUpgrateDot
    } = this.props;
    if (showIsHomeKitDevice && Platform.OS !== 'android') {
      const majorVersionIOS = parseInt(Platform.Version, 10);
      if (majorVersionIOS >= 10) {
        Device.checkIsHomeKitDevice().then((res1) => {
          if (res1) {
            this.setState({
              isHomeKitDevice: true
            });

            Device.checkHomeKitConnected().then((res2) => {
              this.setState({
                pairedHomeKit: !!res2
              });
            });
          }
        });
      }
    }
    if (showFirmwareUpgrate && needFirmwareUpgrateDot) {
      this.hardwareUpdateInstance = new LHHardwareUpdateUtils(true);
      this.checkHardwareUpdateCallback = this.hardwareUpdateInstance.addCallback((res) => {
        this.setState({
          showFirmwareUpgrateDot: !res.isLatest
        });
      });
      this.hardwareUpdateInstance.checkHardwareUpdate();
    }
    this.deviceNameChangedListener = DeviceEvent.deviceNameChanged.addListener((event) => {
      this.setState({
        deviceName: event.name
      });
    });
  }

  componentWillUnmount() {
    if (this.deviceNameChangedListener) this.deviceNameChangedListener.remove();
    if (this.checkHardwareUpdateCallback) this.checkHardwareUpdateCallback.remove();
  }

  getPageData() {
    const {
      deviceName,
      isHomeKitDevice,
      pairedHomeKit,
      showFirmwareUpgrateDot
    } = this.state;
    const {
      navigation,
      settingItems,
      PolicyLicenseUrl,
      showShare,
      showBtGateway,
      showVoiceAuth,
      showSwitchSetting,
      showIftt,
      showDeviceTimeZone,
      syncDeviceTimeZoneToDevice,
      showFirmwareUpgrate,
      hideLegalInformation,
      AdjustmentCommonItems,
      hideGatewayShare
    } = this.props;
    if (typeof PolicyLicenseUrl === 'undefined') {
      console.warn('请传入PolicyLicenseUrl');
    }
    const items = (typeof settingItems === 'undefined' || settingItems.length === 0) ? [] : [
      {
        title: LHCommonLocalizableString.common_setting_feature_setting,
        data: settingItems
      }
    ];
    const conmonSettingsData = [
      isShared ? null : LHSettingItem.getSettingItem('deviceName', {
        rightDescription: deviceName
      }),
      isShared ? null : LHSettingItem.roomManagementItem,
      // 按键设置
      isShared ? null : (showSwitchSetting ? LHSettingItem.switchSettingItem : null),
      // 网关默认都有共享项
      isShared ? null : ((showShare || (!hideGatewayShare && Device.model.indexOf('gateway') > -1)) ? LHSettingItem.shareDeviceItem : null),
      isShared ? null : (showBtGateway ? LHSettingItem.btGatewayItem : null),
      isShared ? null : (showVoiceAuth ? LHSettingItem.voiceAuthItem : null),
      isShared ? null : (showIftt ? LHSettingItem.iftttAutoItem : null),
      isShared ? null : (showFirmwareUpgrate ? LHSettingItem.getSettingItem('firmwareUpgrate', {
        hasDot: showFirmwareUpgrateDot,
        press: () => {
          if (this.hardwareUpdateInstance) this.hardwareUpdateInstance.needCheck = true;
          Host.ui.openDeviceUpgradePage();
        }
      }) : null),
      isShared ? null : (isHomeKitDevice ? LHSettingItem.getSettingItem('pairWithHomeKitiOS', {
        rightDescription: pairedHomeKit ? LHCommonLocalizableString.common_setting_homekit_device_bound : LHCommonLocalizableString.common_setting_homekit_device_noBind,
        // 门锁要拿去HomeKit验证就需要加上该设备可在Apple家庭APP配置和使用的描述
        description: (Device.model.indexOf('lumi.lock') > -1 && pairedHomeKit) ? LHCommonLocalizableString.common_setting_homekit_device_desc : null,
        hideRightArrow: pairedHomeKit,
        press: () => {
          const {
            pairedHomeKit: newPairedHomeKit
          } = this.state;
          // 已绑定不响应点击操作
          if (newPairedHomeKit) return;
          Device.bindToHomeKit().then((res) => {
            console.log(res);
            this.setState({
              pairedHomeKit: true
            });
          }).catch((error) => {
            console.log(error);
          });
        }
      }) : null),
      LHSettingItem.GetMoreSettingItem(navigation, showDeviceTimeZone, syncDeviceTimeZoneToDevice),
      LHSettingItem.helpPageItem,
      (isShared || hideLegalInformation) ? null : LHSettingItem.GetPrivacyLicenseItem(PolicyLicenseUrl)
    ];

    // 将通用设置中为null的数据去掉
    for (let i = 0; i < conmonSettingsData.length; i += 1) {
      if (!conmonSettingsData[i]) {
        conmonSettingsData.splice(i, 1);
        i -= 1;
      }
    }

    const conmonSettings = {
      title: LHCommonLocalizableString.common_setting_general_setting,
      // 如果需要调整通用设置项，可以通过AdjustmentCommonItems调整
      data: typeof AdjustmentCommonItems === 'function' ? AdjustmentCommonItems(conmonSettingsData) : conmonSettingsData
    };

    items.push(conmonSettings);
    items.push({
      title: 'type:bottomButton',
      data: [LHSettingItem.deleteDeviceItem]
    });
    return items;
  }

  render() {
    const pageData = this.getPageData();
    return (
      <LHStandardList
        data={pageData}
      />
    );
  }
}
export default LHPureRenderDecorator(LHSetting);
