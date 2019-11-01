

class LHCommonIcon {
  static navigation =
    {
      add: {
        disable: require('./navigation/navigation_dis/add_dis.png'),
        normal: require('./navigation/navigation_nor/add_nor.png'),
        press: require('./navigation/navigation_pes/add_pes.png')
      },
      back: {
        disable: require('./navigation/navigation_dis/back_dis.png'),
        normal: require('./navigation/navigation_nor/back_nor.png'),
        press: require('./navigation/navigation_pes/back_pes.png')
      },
      cancel: {
        disable: require('./navigation/navigation_dis/cancel_dis.png'),
        normal: require('./navigation/navigation_nor/cancel_nor.png'),
        press: require('./navigation/navigation_pes/cancel_pes.png')
      },
      confirm: {
        disable: require('./navigation/navigation_dis/confirm_dis.png'),
        normal: require('./navigation/navigation_nor/confirm_nor.png'),
        press: require('./navigation/navigation_pes/confirm_pes.png')
      },
      info: {
        disable: require('./navigation/navigation_dis/info_dis.png'),
        normal: require('./navigation/navigation_nor/info_nor.png'),
        press: require('./navigation/navigation_pes/info_pes.png')
      },
      like: {
        disable: require('./navigation/navigation_dis/like_dis.png'),
        normal: require('./navigation/navigation_nor/like_nor.png'),
        press: require('./navigation/navigation_pes/like_pes.png')
      },
      more: {
        disable: require('./navigation/navigation_dis/more_dis.png'),
        normal: require('./navigation/navigation_nor/more_nor.png'),
        press: require('./navigation/navigation_pes/more_pes.png')
      },
      my: {
        disable: require('./navigation/navigation_dis/my_dis.png'),
        normal: require('./navigation/navigation_nor/my_nor.png'),
        press: require('./navigation/navigation_pes/my_pes.png')
      },
      next: {
        disable: require('./navigation/navigation_dis/next_dis.png'),
        normal: require('./navigation/navigation_nor/next_nor.png'),
        press: require('./navigation/navigation_pes/next_pes.png')
      },
      scan: {
        disable: require('./navigation/navigation_dis/scan_dis.png'),
        normal: require('./navigation/navigation_nor/scan_nor.png'),
        press: require('./navigation/navigation_pes/scan_pes.png')
      },
      search: {
        disable: require('./navigation/navigation_dis/search_dis.png'),
        normal: require('./navigation/navigation_nor/search_nor.png'),
        press: require('./navigation/navigation_pes/search_pes.png')
      },
      select: {
        disable: require('./navigation/navigation_dis/select_dis.png'),
        normal: require('./navigation/navigation_nor/select_nor.png'),
        press: require('./navigation/navigation_pes/select_pes.png')
      },
      selectReverse: {
        disable: require('./navigation/navigation_dis/select_reverse_dis.png'),
        normal: require('./navigation/navigation_nor/select_reverse_nor.png'),
        press: require('./navigation/navigation_pes/select_reverse_pes.png')
      },
      setting: {
        disable: require('./navigation/navigation_dis/setting_dis.png'),
        normal: require('./navigation/navigation_nor/setting_nor.png'),
        press: require('./navigation/navigation_pes/setting_pes.png')
      },
      share: {
        disable: require('./navigation/navigation_dis/share_dis.png'),
        normal: require('./navigation/navigation_nor/share_nor.png'),
        press: require('./navigation/navigation_pes/share_pes.png')
      }
    }

    static common = {
      emptyImage: {
        normal: require('./other/mj_list_empty.png')
      },
      rename: {
        normal: require('./other/rename_nor.png'),
        white: require('./other/rename_nor_white.png')
      },
      delete: {
        normal: require('./other/delete_nor.png'),
        white: require('./other/delete_nor_white.png')
      },
      swipeoutBtnMore: require('./other/swipeout_btn_more.png'),
      add: {
        normal: require('./other/add_button_nor.png'),
        mgl03: require('./other/add_button_mgl03_nor.png')
      },
      navigation_close: require('./navigation/lumi_navigation_close.png'),

      navigation_confirm: require('./navigation/lumi_navigation_confirm.png')

    }

    // 底栏编辑图标
    static bottomViewIcon = {
      bottom_bar_collect: require('./other/bottom_bar_collect.png'),
      bottom_bar_move: require('./other/bottom_bar_move.png'),
      bottom_bar_top: require('./other/bottom_bar_top.png')
    }

    static cellIcon = {
      checkActive: require('../Resources/checkBox/check1.png'),
      checkNotActive: require('../Resources/checkBox/check2.png'),
      offLine: require('../Resources/other/device_offline.png'),
      rightArrow: require('../Resources/select_icon.png'),
      deleted: require('../Resources/other/device_deleted.png')
    }

    static deviceIcon = {
      default: require('./deviceIcon/device_icon_default.png'),
      lumiGatewaymgl03: require('./deviceIcon/lumi.gateway.mgl03.png'),
      lumiAqaraLinuxHub: require('./deviceIcon/lumi_aqara_linuxhub.png'),
      lumiMijiaLinuxHub: require('./deviceIcon/lumi_mijia_linuxhub.png')
    }
}

export default LHCommonIcon;