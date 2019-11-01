
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  Host,
  Device,
  PackageEvent
} from 'miot';
import {
  LHPureRenderDecorator,
  LHUiUtils,
  LHMiServer,
  LHCommonLocalizableString,
  LHDialogUtils,
  LHToastUtils,
  LHDeviceUtils,
  CommonMethod,
  LHDeviceModel,
  LHStringUtils
} from 'LHCommonFunction';
import {
  LHTitleBarCustom,
  LHStandardListSwipeout,
  LHCommonIcon,
  LHSeparator,
  LHStandardEmpty,
  LHText,
  LHSwipeoutButton,
  LHBottomButtonGroup
} from 'LHCommonUI';
import CommonStyle from './LHSubDeviceListStyle';

function LHSubDeviceModel(device) {
  const {
    type: pid,
    deviceID: did,
    model,
    iconURL,
    name: title,
    isOnline
  } = device;

  return {
    pid,
    did,
    model,
    iconURL,
    title,
    subTitle: isOnline ? '' : LHCommonLocalizableString.sub_device_list_device_offline,
    selected: false
  };
}
const cacheKey = 'LHSubDeviceListKey';
let Instance;

class LHSubDevicesListPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isEditStatus = navigation.getParam('isEditStatus');
    const showSeparator = navigation.getParam('showSeparator');
    const pageTitle = navigation.getParam('pageTitle');

    let props = {
      showSeparator
    };
    if (isEditStatus) {
      props = {
        ...props,
        title: LHCommonLocalizableString.sub_device_list_selected.replace('{XX}', navigation.getParam('selectedCount')),
        leftButtons: [{
          type: 'deafultCloseBtn',
          press: () => {
            Instance.changePageEditStatus(false);
          }
        }],
        rightButtons: [{
          type: 'deafultCompleteBtn',
          press: () => {
            Instance.changePageEditStatus(false);
          }
        }]
      };
    } else {
      props = {
        ...props,
        title: pageTitle || LHCommonLocalizableString.sub_device_list_title,
        onPressLeft: () => { navigation.goBack(); }
      };
    }
    return {
      header: (
        <View>
          <LHTitleBarCustom {...props} />
        </View>
      )
    };
  };

  /**
   * 删除子设备方法（支持多个）
   * @param {*} devices 设备列表 [LHDeviceModel, LHDeviceModel, ...]
   * @memberof LHSubDevicesPage
   */
  static deleteDevices(devices, onSuccess, onFail) {
    if (devices.length === 0) return;
    const message = devices.length === 1 ? LHCommonLocalizableString.common_setting_device_delete_confirm : LHCommonLocalizableString.sub_device_list_delete_multi_device.replace('{XX}', devices.length);
    LHDialogUtils.MessageDialogShow({
      message,
      messageStyle: { textAlign: 'center' },
      confirm: LHCommonLocalizableString.common_ok,
      cancel: LHCommonLocalizableString.common_cancel,
      confirmStyle: {
        color: LHUiUtils.MiJiaBlue
      },
      onConfirm: () => {
        setTimeout(() => {
          const deleteDevicesData = [];
          for (let i = 0, len = devices.length; i < len; i += 1) {
            deleteDevicesData.push({
              did: devices[i].did,
              pid: devices[i].pid
            });
          }
          LHDialogUtils.LoadingDialogShow({ title: LHCommonLocalizableString.common_tips_setting });
          LHMiServer.DeleteDevices(deleteDevicesData, () => {
            LHDialogUtils.LoadingDialogHide();
            LHToastUtils.showShortToast(LHCommonLocalizableString.common_tips_delete_succeed);
            if (typeof onSuccess === 'function') onSuccess();
          }, () => {
            LHDialogUtils.LoadingDialogHide();
            LHToastUtils.showShortToast(LHCommonLocalizableString.common_tips_delete_failed);
            if (typeof onFail === 'function') onFail();
          });
        }, 300);
      }
    });
  }

  static renameDevice(device, onSuccess, onFail) {
    LHDialogUtils.InputDialogShow({
      defaultText: device.title,
      visible: true,
      message: '',
      title: LHCommonLocalizableString.common_button_changename,
      confirm: LHCommonLocalizableString.common_ok,
      cancel: LHCommonLocalizableString.common_cancel,
      onConfirm: (config) => {
        const newName = config.text;
        if (newName === '' || newName === undefined || newName === null) {
          LHToastUtils.showShortToast(LHCommonLocalizableString.sub_device_list_name_cant_empty);
          return;
        } else if (LHStringUtils.isContainsEmoji(newName)) {
          LHToastUtils.showShortToast(LHCommonLocalizableString.sub_device_list_name_cant_support_emoji);
          return;
        } else if (LHStringUtils.isContainsNotSupportChar(newName)) {
          LHToastUtils.showShortToast(LHCommonLocalizableString.sub_device_list_name_cant_support_special_char);
          return;
        } else if (newName.length > 40) {
          LHToastUtils.showShortToast(LHCommonLocalizableString.sub_device_list_name_cant_more_forty);
          return;
        } else if (newName === device.title) {
          LHToastUtils.showShortToast(LHCommonLocalizableString.sub_device_list_name_cant_same);
          return;
        }
        LHMiServer.ChangeDeviceName(newName, device.did, () => {
          if (typeof onSuccess === 'function') onSuccess(newName);
        }, (err) => {
          LHToastUtils.showShortToast(LHCommonLocalizableString.common_tips_request_failed);
          if (typeof onFail === 'function') onFail(err);
        });
      }
    });
  }

  static openZigbeeConnectDeviceList() {
    Host.ui.openZigbeeConnectDeviceList(Device.did);
  }

  constructor(props, context) {
    super(props, context);
    // this.isEditStatus = false;
    let deviceIconSource = null;
    if (Device.model === LHDeviceModel.DeviceModelMijiaMultiModeHub()) {
      deviceIconSource = LHCommonIcon.deviceIcon.lumiGatewaymgl03;
    } else if (Device.model === LHDeviceModel.DeviceModelAqaraHubAqHM01()
    || Device.model === LHDeviceModel.DeviceModelAqaraHubAqHM02()
    || Device.model === LHDeviceModel.DeviceModelAqaraHubAqHM03()) {
      deviceIconSource = LHCommonIcon.deviceIcon.lumiAqaraLinuxHub;
    } else if (Device.model === LHDeviceModel.DeviceModelAqaraHubLmUK01()
    || Device.model === LHDeviceModel.DeviceModelAqaraHubMiEU01()
    || Device.model === LHDeviceModel.DeviceModelAqaraHubMiTW01()
    || Device.model === LHDeviceModel.DeviceModelAqaraHubMiHK01()) {
      deviceIconSource = LHCommonIcon.deviceIcon.lumiMijiaLinuxHub;
    }
    this.deviceIconSource = deviceIconSource;
    this.state = {
      // 子设备列表
      devicesList: [],
      // 当前网关的 iconurl
      selfIconUrl: '',
      // 当前页面是否编辑状态
      isEditStatus: false,
      // 当前页面是否在loading状态
      isLoading: false,
      renameBtnWidth: 0,
      deleteBtnWidth: 0
    };
    const { navigation } = this.props;
    navigation.setParams({
      isEditStatus: false,
      selectedCount: 0
    });
    Instance = this;
    this.haveGotPageData = false;
  }

  componentWillMount() {
    const { navigation } = this.props;
    // 发现快速点击返回，c --> b --> a；c的生命周期又会走一次，这里有loading，处理一下
    if (!navigation.isFocused()) return;
    this.loadLogDataFromCache();
    const subDeviceList = navigation.getParam('subDeviceList');
    this.getSubDevices(subDeviceList === null);
    this.getSelfIconUrl();
    this.addViewWillAppearListener();
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.removeViewWillAppearListener();
    this.clearSetLoadingFalseTimeoutId();
  }

  // eslint-disable-next-line react/sort-comp
  addViewWillAppearListener() {
    this.packageViewWillAppearListener = PackageEvent.packageViewWillAppear.addListener(() => {
      this.getSubDevices(false);
    });
  }

  removeViewWillAppearListener() {
    if (this.packageViewWillAppearListener) {
      this.packageViewWillAppearListener.remove();
      this.packageViewWillAppearListener = null;
    }
  }

  getSelfIconUrl() {
    if (this.deviceIconSource === null) {
      LHMiServer.LoadRealDeviceConfig(Device.model, (config) => {
        this.setState({
          selfIconUrl: config.deviceIconURL
        });
      }, () => {
      });
    }
  }

  getSubDevices(isNeedShowRefreshControl = true) {
    if (isNeedShowRefreshControl) {
      this.setState({
        isLoading: true
      });
    }
    LHMiServer.GetSubDevices((devices) => {
      // 在拿到新的设备数据的时候，先进行一次UI刷新，再更新当前页面(防止用户通过三次物理点击添加设备后，在app上点击不跳转问题)
      Host.ui.refreshDeviceList().then(() => {
        this.refreshDeviceList(devices);
      }).catch(() => {
        this.refreshDeviceList(devices);
      });
    }, () => {
      this.setLoadingFalse();
    });
  }

  refreshDeviceList(devices) {
    this.haveGotPageData = true;
    console.log(devices);
    const newDevices = [];
    if (devices.length !== 0) {
      for (let i = 0, len = devices.length; i < len; i += 1) {
        newDevices.push(LHSubDeviceModel(devices[i]));
      }
    }
    this.setState({ devicesList: newDevices });
    this.setDevivceListCache(newDevices);
    this.setLoadingFalse();
  }

  setLoadingFalse() {
    this.clearSetLoadingFalseTimeoutId();
    this.setLoadingFalseTimeoutId = setTimeout(() => {
      this.setState({ isLoading: false });
    }, 200);
  }

  clearSetLoadingFalseTimeoutId() {
    if (this.setLoadingFalseTimeoutId) {
      clearTimeout(this.setLoadingFalseTimeoutId);
      this.setLoadingFalseTimeoutId = null;
    }
  }

  getPageData() {
    const {
      devicesList, selfIconUrl, isEditStatus, renameBtnWidth, deleteBtnWidth
    } = this.state;

    // 有本地图就显示本地图，没有的话，先显示默认图，再显示网络图
    const source = this.deviceIconSource === null ? selfIconUrl === '' ? LHCommonIcon.deviceIcon.default : { uri: selfIconUrl } : this.deviceIconSource;
    const headerImage = (<Image style={CommonStyle.headerImageStyle} source={source} />);
    const headerBottomSpaceView = devicesList.length !== 0 ? (
      <View style={CommonStyle.headerBottomViewStyle} />
    ) : null;
    const headerBottomLine = devicesList.length !== 0 ? (
      <LHSeparator style={[{ alignSelf: 'flex-end' }]} />
    ) : null;
    // 头部视图
    const headerView = (
      <View>
        <View style={CommonStyle.headerViewStyle}>
          {headerImage}
          <LHText style={CommonStyle.headerTitleTextStyle}>{devicesList.length === 0 ? LHCommonLocalizableString.sub_device_list_empty_tips : LHCommonLocalizableString.sub_device_list_header_tips}</LHText>
        </View>
        <LHSeparator style={[{ alignSelf: 'flex-start' }]} />
        {headerBottomSpaceView}
        {headerBottomLine}
      </View>
    );
    // 显示数据
    const data = [];
    if (devicesList.length !== 0) {
      for (let i = 0, len = devicesList.length; i < len; i += 1) {
        const device = devicesList[i];
        data.push({
          title: device.title,
          titleNumberOfLines: 1,
          description: device.subTitle,
          showPlaceHolderImage: true,
          iconSource: { uri: device.iconURL },
          leftIconStyle: {
            width: LHUiUtils.GetPx(42),
            height: LHUiUtils.GetPx(42)
          },
          marginLeft: LHUiUtils.GetPx(19),
          swipeoutClose: true,
          hideRightArrow: isEditStatus,
          hasCheckBox: isEditStatus,
          checkBoxActive: device.selected,
          hideTopSeparatorLine: i === 0,
          rowContainerStyle: {
            height: LHUiUtils.GetPx(60)
          },
          textContainer: {
            alignSelf: 'center'
          },
          // 左滑操作：删除，重命名(编辑状态下不可用)
          // swipeoutButtonWidth: LHUiUtils.GetPx(100),
          swipeoutBtns: isEditStatus === true ? null : [
            {
              component: <LHSwipeoutButton type="rename" text={LHCommonLocalizableString.common_button_changename} />,
              width: (renameBtnWidth + LHUiUtils.GetPx(10)) < LHUiUtils.GetPx(66) ? LHUiUtils.GetPx(66) : renameBtnWidth + LHUiUtils.GetPx(10),
              // 重命名
              press: () => {
                LHSubDevicesListPage.renameDevice(device, (newName) => {
                  const { devicesList: newDevicesList } = this.state;
                  newDevicesList[i].title = newName;
                  this.setDevivceListCache(newDevicesList);
                  this.forceUpdate();
                }, () => {

                });
              }
            },
            {
              component: <LHSwipeoutButton text={LHCommonLocalizableString.common_button_delete} />,
              width: (deleteBtnWidth + LHUiUtils.GetPx(10)) < LHUiUtils.GetPx(66) ? LHUiUtils.GetPx(66) : deleteBtnWidth + LHUiUtils.GetPx(10),
              // 删除
              press: () => {
                LHSubDevicesListPage.deleteDevices([device], () => {
                  const { devicesList: newDevicesList } = this.state;
                  newDevicesList.splice(i, 1);
                  this.setDevivceListCache(newDevicesList);
                  this.forceUpdate();
                  this.changePageEditStatus(false);
                });
              }
            }
          ],
          // 点击操作：跳转到设备页（存在的问题：iOS 跳转比较缓慢，android 不能跳转）
          // eslint-disable-next-line no-loop-func
          press: () => {
            if (isEditStatus === false) {
              Host.ui.openDevice(device.did, device.model, { dismiss_current_plug: false });
            } else {
              const { devicesList: newDevicesList } = this.state;
              newDevicesList[i].selected = !newDevicesList[i].selected;
              this.forceUpdate();

              let selectedCount = 0;
              for (let j = 0, devicesLen = devicesList.length; j < devicesLen; j += 1) {
                if (devicesList[j].selected === true) {
                  selectedCount += 1;
                }
              }
              const { navigation } = this.props;
              navigation.setParams({
                selectedCount
              });
            }
          },
          // 长按操作：进入编辑状态
          minimumLongPressDuration: 500,
          longPress: () => {
            if (isEditStatus === false) {
              const { devicesList: newDevicesList } = this.state;
              newDevicesList[i].selected = true;
              this.changePageEditStatus(true, 1);
            }
          }
        });
      }
    }

    return [{
      // 头部视图
      sectionHeader: () => {
        return headerView;
      },
      data
    }];
  }

  changePageEditStatus(editStatus, selectedCount = 0) {
    const { devicesList } = this.state;
    let isChange = false;
    if (editStatus === false) {
      for (let i = 0, devicesLen = devicesList.length; i < devicesLen; i += 1) {
        if (devicesList[i].selected === true) {
          isChange = true;
          devicesList[i].selected = false;
        }
      }
    }
    if (isChange) {
      this.forceUpdate();
    }
    this.setState({
      isEditStatus: editStatus
    });

    const { navigation } = this.props;
    navigation.setParams({
      isEditStatus: editStatus,
      selectedCount
    });
  }

  didClickBottomDeleteButton() {
    const { devicesList } = this.state;

    const deleteList = [];
    for (let i = 0, devicesLen = devicesList.length; i < devicesLen; i += 1) {
      if (devicesList[i].selected === true) {
        deleteList.push(devicesList[i]);
      }
    }
    if (deleteList.length > 0) {
      LHSubDevicesListPage.deleteDevices(deleteList, () => {
        const newDevice = [];
        for (let i = 0, devicesLen = devicesList.length; i < devicesLen; i += 1) {
          if (devicesList[i].selected === false) {
            newDevice.push(devicesList[i]);
          }
        }
        this.setDevivceListCache(newDevice);
        this.setState({ devicesList: newDevice });
        this.changePageEditStatus(false);
      });
    }
  }

  didClickButtomRenameButton() {
    const { devicesList } = this.state;

    let renameDevice = null;
    for (let i = 0, devicesLen = devicesList.length; i < devicesLen; i += 1) {
      if (devicesList[i].selected === true) {
        renameDevice = devicesList[i];
        break;
      }
    }

    LHSubDevicesListPage.renameDevice(renameDevice, (newName) => {
      renameDevice.title = newName;
      this.forceUpdate();
      this.changePageEditStatus(false);
    });
  }

  loadLogDataFromCache() {
    const { navigation } = this.props;
    const subDeviceList = navigation.getParam('subDeviceList');
    if (subDeviceList) {
      if (subDeviceList.length > 0) {
        this.setState({
          devicesList: subDeviceList
        });
      }
    } else {
      LHMiServer.GetHostStorage(CommonMethod.CreatCacheKey(cacheKey)).then((res) => {
        if (!res || this.haveGotPageData === true) return;
        this.setState({
          devicesList: res
        });
      });
    }
  }

  // eslint-disable-next-line
  setDevivceListCache(data) {
    LHMiServer.SetHostStorage(CommonMethod.CreatCacheKey(cacheKey), data);
  }

  render() {
    const pageData = this.getPageData();
    const { isEditStatus, isLoading } = this.state;
    const { navigation } = this.props;
    const selectedCount = navigation.getParam('selectedCount');
    let BottomViewComponent = null;
    let BottomAddSubDeviceComponent = null;
    if (isEditStatus === true) {
      BottomViewComponent = (
        <LHBottomButtonGroup
          buttons={[{
            text: LHCommonLocalizableString.common_button_delete,
            type: 'delete',
            disabled: selectedCount === 0,
            onPress: () => {
              this.didClickBottomDeleteButton();
            }
          },
          {
            text: LHCommonLocalizableString.common_button_changename,
            type: 'rename',
            disabled: selectedCount !== 1,
            onPress: () => {
              this.didClickButtomRenameButton();
            }
          }]}
        />
      );
    } else {
      let iconSource = LHCommonIcon.common.add.normal;
      if (Device.model === LHDeviceModel.DeviceModelMijiaMultiModeHub()) {
        iconSource = LHCommonIcon.common.add.mgl03;
      }
      BottomAddSubDeviceComponent = (
        <TouchableOpacity style={CommonStyle.addSubDeviceViewStyle} onPress={() => { LHSubDevicesListPage.openZigbeeConnectDeviceList(); }}>
          <Image style={CommonStyle.addSubDeviceButtonStyle} source={iconSource} />
        </TouchableOpacity>
      );
    }
    let listViewPaddingBottom = 0;
    if (pageData.length > 0) {
      if (isEditStatus === true) {
        listViewPaddingBottom = 10;
      } else {
        listViewPaddingBottom = LHDeviceUtils.AppHomeIndicatorHeight + LHUiUtils.GetPx(86);
      }
    }
    return (
      <View style={CommonStyle.listViewStyle}>
        <LHStandardListSwipeout
          data={pageData}
          contentContainerStyle={{ paddingBottom: listViewPaddingBottom }}
          stickySectionHeadersEnabled={false}
          ListEmptyComponent={(
            <View pointerEvents="none">
              <LHStandardEmpty
                pointerEvents="none"
                text={LHCommonLocalizableString.sub_device_list_empty_tips}
              />
            </View>
          )}
          ListFooterComponent={(
            <View style={CommonStyle.footer} />
          )}
          refreshControl={isEditStatus ? null : (
            <RefreshControl
              refreshing={isLoading === true && isEditStatus === false}
              onRefresh={() => {
                this.getSubDevices(true);
              }}
            />
          )}
        />
        {BottomViewComponent}
        {BottomAddSubDeviceComponent}
        {
          // 用于动态计算重命名的宽度
          <LHText
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0,
                fontSize: LHUiUtils.GetPx(12)
              }]}
            onLayout={(e) => {
              this.setState({
                renameBtnWidth: e.nativeEvent.layout.width
              });
            }}
          >
            {LHCommonLocalizableString.common_button_changename}
          </LHText>
        }
        {
          // 用于动态计算删除的宽度
          <LHText
            style={[
              {
                position: 'absolute',
                left: 0,
                top: 0,
                opacity: 0,
                fontSize: LHUiUtils.GetPx(12)
              }]}
            onLayout={(e) => {
              this.setState({
                deleteBtnWidth: e.nativeEvent.layout.width
              });
            }}
          >
            {LHCommonLocalizableString.common_button_delete}
          </LHText>
        }
      </View>
    );
  }
}

export default LHPureRenderDecorator(LHSubDevicesListPage);
