import { StyleSheet, Dimensions } from 'react-native';
import { LHUiUtils, LHDeviceUtils } from 'LHCommonFunction';

const { height } = Dimensions.get('window');

const LHSubDeviceListStyle = StyleSheet.create({
  headerViewStyle: {
    width: '100%',
    // height: LHUiUtils.GetPx(197),
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  headerImageStyle: {
    marginTop: LHUiUtils.GetPx(30),
    width: LHUiUtils.GetPx(100),
    height: LHUiUtils.GetPx(100),
    alignSelf: 'center'
  },
  bottomViewTopLineStyle: {
    width: '100%',
    backgroundColor: LHUiUtils.MiJiaLineColor,
    position: 'absolute',
    height: 0.5
  },
  headerTitleTextStyle: {
    marginTop: LHUiUtils.GetPx(14),
    marginLeft: LHUiUtils.GetPx(20),
    marginRight: LHUiUtils.GetPx(20),
    marginBottom: LHUiUtils.GetPx(33),
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(20),
    alignSelf: 'center',
    color: '#000000',
    textAlign: 'center'
  },
  headerBottomViewStyle: {
    backgroundColor: LHUiUtils.MiJiaBackgroundGray,
    height: LHUiUtils.GetPx(8)
  },
  navigateButton: {
    height: LHUiUtils.GetPx(30),
    width: LHUiUtils.GetPx(30)
  },
  bottomViewStyle: {
    height: LHUiUtils.GetPx(67) + LHDeviceUtils.AppHomeIndicatorHeight,
    width: '100%',
    backgroundColor: LHUiUtils.MiJiaWhite,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  bottomButtonStyle: {
    height: LHUiUtils.GetPx(67),
    minWidth: LHUiUtils.GetPx(63),
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: LHUiUtils.GetPx(14)
  },
  bottomButtonImageStyleDisable: {
    width: LHUiUtils.GetPx(25),
    height: LHUiUtils.GetPx(25),
    opacity: 0.4
  },
  bottomButtonImageStyleNormal: {
    width: LHUiUtils.GetPx(25),
    height: LHUiUtils.GetPx(25),
    opacity: 1
  },
  bottomButtonTextStyle: {
    fontSize: LHUiUtils.GetPx(10),
    alignSelf: 'center',
    opacity: 1
  },
  bottomButtonTextDisableStyle: {
    fontSize: LHUiUtils.GetPx(10),
    alignSelf: 'center',
    opacity: 0.38
  },
  addSubDeviceButtonStyle: {
    width: LHUiUtils.GetPx(66),
    height: LHUiUtils.GetPx(66)
  },
  addSubDeviceViewStyle: {
    position: 'absolute',
    right: LHUiUtils.GetPx(20),
    bottom: LHUiUtils.GetPx(20),
    width: LHUiUtils.GetPx(66),
    height: LHUiUtils.GetPx(66)
  },
  listViewStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  bottomBtn: {
    width: LHUiUtils.GetPx(66),
    height: LHUiUtils.GetPx(66),
    position: 'absolute',
    bottom: LHUiUtils.GetPx(12) + LHDeviceUtils.AppHomeIndicatorHeight,
    right: LHUiUtils.GetPx(12)
  },
  renameComponent: {
    backgroundColor: '#FCBD4E',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteComponent: {
    backgroundColor: '#F43F31',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  swipeoutImage: {
    width: LHUiUtils.GetPx(25),
    height: LHUiUtils.GetPx(25)
  },
  swipeoutText: {
    fontSize: LHUiUtils.GetPx(12),
    color: '#ffffff'
  },
  emptyPageWrap: {
    height: height - LHUiUtils.TitleBarHeight - LHDeviceUtils.statusBarHeight,
    backgroundColor: LHUiUtils.MiJiaWhite
  }
});
export { LHSubDeviceListStyle as default };
