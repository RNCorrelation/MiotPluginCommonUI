import { StyleSheet, Dimensions } from 'react-native';
import { LHUiUtils, LHDeviceUtils } from 'LHCommonFunction';

const { height } = Dimensions.get('window');
const LHCommonStyles = StyleSheet.create({
  navigatorWithBorderBotoom: {
    backgroundColor: LHUiUtils.MiJiaWhite,
    borderBottomWidth: LHUiUtils.MiJiaBorderWidth,
    borderBottomColor: LHUiUtils.MiJiaLineColor
  },
  navigatorWithoutBorderBotoom: {
    backgroundColor: LHUiUtils.MiJiaPageBgColor
  },
  pageGrayStyle: {
    flex: 1,
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  pageWhiteStyle: {
    flex: 1,
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  bottomBtn: {
    width: LHUiUtils.GetPx(66),
    height: LHUiUtils.GetPx(66),
    position: 'absolute',
    bottom: LHUiUtils.GetPx(12) + LHDeviceUtils.AppHomeIndicatorHeight,
    right: LHUiUtils.GetPx(12)
  },
  emptyImg: {
    width: LHUiUtils.GetPx(240),
    height: LHUiUtils.GetPx(240),
    marginTop: LHUiUtils.GetPx(83 * (height - 44 - LHDeviceUtils.statusBarHeight - LHDeviceUtils.AppHomeIndicatorHeight - LHUiUtils.GetPx(240)) / (83 + 250)),
    alignSelf: 'center'
  },
  emptyView: {
    height: height - LHUiUtils.TitleBarHeight - LHDeviceUtils.statusBarHeight,
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  emptyPageWrap: {
    height: height - LHUiUtils.TitleBarHeight - LHDeviceUtils.statusBarHeight,
    backgroundColor: LHUiUtils.MiJiaWhite
  }
});
export { LHCommonStyles as default };
