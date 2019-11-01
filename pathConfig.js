/*
 * @Date: 2019-08-20 11:23:26
 * @LastEditors: Lavie
 * @LastEditTime: 2019-08-22 18:44:00
 */
const LHImageButton = './Components/Image/LHImageButton';
const LHStandardCell = './Components/LHStandardCell';
const LHStandardList = './Components/List/LHStandardList';
const LHStandardListSwipeout = './Components/List/LHStandardListSwipeout';
const LHStandardLog = './Components/Log/LHStandardLog';
const LHStandardLogUI = './Components/Log/LHStandardLogUI';
const LHTitleBarCustom = './Components/LHTitleBarCustom';
const LHStandardEmpty = './Components/LHStandardEmpty';
const LHPopover = './Components/Popover/LHPopover';
const LHImagesAnimate = './Components/Animate/LHImagesAnimate';
const LHNumberModalPicker = './Components/Picker/LHNumberModalPicker';
const LHStringModalPicker = './Components/Picker/LHStringModalPicker';
const LHMultiNumberModalPicker = './Components/Picker/LHMultiNumberModalPicker';
const LHDatePicker = './Components/Picker/LHDatePicker';
const LHCardBase = './Components/Card/LHCardBase';
const LHSwitchWithStatus = './Components/SwitchWithStatus/LHSwitchWithStatus';
const LHMoreSettingPage = './CommonPage/LHMoreSettingPage';
const LHInitPage = './CommonEntrance/index';
const LHCommonIcon = './Resources/LHCommonIcon';
const LHSubDevicesListPage = './CommonPage/SubDevice/LHSubDevicesListPage';
const LHMoreDialogCard = './Components/LHMoreDialogCard';
const LHProgressCard = './Components/Card/LHProgressCard';
const LHSpecDebugPage = './DebugPage/LHSpecDebugPage';
const LHCurve = './LHCurve/LHCurve';
const LHCurvePage = './LHCurve/LHCurvePage';
const LHAlarmIFTTTPage = './CommonPage/IFTTT/LHAlarmIFTTTPage';
const LHAlarmSubDevicesPage = './CommonPage/IFTTT/LHAlarmSubDevicesPage';
const LHAdjustedView = './Components/LHAdjustedView/LHAdjustedView';
const LHText = './Components/BaseElements/LHText';
const LHUnExpectedGuidePage = './CommonPage/Tips/LHUnExpectedGuidePage';
const LHCommonStyles = './Components/Style/LHCommonBaseStyle';
const LHSeparator = './Components/BaseElements/Separator/LHSeparator';
const LHTimerPage = './CommonPage/Timer/LHTimerPage';
const LHNewTimerPage = './CommonPage/Timer/LHNewTimerPage';
const LHSetting = './Components/Setting/LHSetting';
const LHDoubleStringSpinner = './Components/Picker/LHDoubleStringSpinner';
const LHMessageDialog = './Components/Dialog/LHMessageDialog';
const LHLoadingDialog = './Components/Dialog/LHLoadingDialog';
const CustomMessageDialog = './Components/Dialog/CustomMessageDialog';
const CustomSingleChooseDialog = './Components/Dialog/CustomSingleChooseDialog';
const LHPlaceHolderImage = './Components/Image/LHPlaceHolderImage';
const LHButton = './Components/BaseElements/Buttons/LHButton';
const LHButtonGroup = './Components/BaseElements/Buttons/LHButtonGroup';
const LHSwipeoutButton = './Components/BaseElements/Buttons/LHSwipeoutButton';
const LHBottomButtonGroup = './Components/BaseElements/Buttons/LHBottomButtonGroup';
const LHSelectCard = './Components/Card/LHSelectCard';
const Swipeout = './Components/react-native-swipeout/swipeout';
const LHSleepMode = './DevicesComponents/LHSleepMode';
const LHHTPCard = './Components/Card/LHHTPCard';
const LHSelectPage = './CommonPage/SelectPage/LHSelectPage';
const LHSwitch = './Components/Switch/LHSwitch';
const LHReplaceIconPage = './CommonPage/ReplaceIconPage/LHReplaceIconPage';
const LHTipsPage = './CommonPage/Tips/LHTipsPage';
const LHPercentageCircle = './Components/PercentageCircle/LHPercentageCircle';


module.exports = {
  LHPercentageCircle: {
    path: LHPercentageCircle
  },
  LHTipsPage: {
    path: LHTipsPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom
      },
      LHText: {
        path: LHText
      },
      LHButton: {
        path: LHButton
      }
    }]
  },
  LHReplaceIconPage: {
    path: LHReplaceIconPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom
      }
    }]
  },
  LHSwitch: {
    path: LHSwitch
  },
  LHSelectPage: {
    path: LHSelectPage,
    dependencies: [{
      LHStandardList: {
        path: LHStandardList
      },
      LHTitleBarCustom: {
        path: LHTitleBarCustom
      },
      LHSwitch: {
        path: LHSwitch
      }
    }]
  },
  LHHTPCard: {
    path: LHHTPCard,
    dependencies: [{
      LHText: {
        path: LHText
      },
      LHSeparator: {
        path: LHSeparator
      },
      LHCardBase: {
        path: LHCardBase,
        dependencies: [{
          LHSwitch: {
            path: LHSwitch
          }
        }]
      }
    }]
  },
  LHSleepMode: {
    path: LHSleepMode,
    dependencies: [{
      LHText: {
        path: LHText
      },
      LHSeparator: {
        path: LHSeparator
      }
    }]
  },
  Swipeout: {
    path: Swipeout
  },
  LHSelectCard: {
    path: LHSelectCard,
    dependencies: [{
      LHText: {
        path: LHText
      }
    }]
  },
  LHBottomButtonGroup: {
    path: LHBottomButtonGroup,
    dependencies: [{
      LHText: {
        path: LHText
      },
      LHSeparator: {
        path: LHSeparator
      },
      LHCommonIcon: {
        path: LHCommonIcon
      }
    }]
  },
  LHSwipeoutButton: {
    path: LHSwipeoutButton,
    dependencies: [{
      LHText: {
        path: LHText
      },
      LHCommonIcon: {
        path: LHCommonIcon
      }
    }]
  },
  LHButtonGroup: {
    path: LHButtonGroup,
    dependencies: [{
      LHButton: {
        path: LHButton
      }
    }]
  },
  LHButton: {
    path: LHButton,
    dependencies: [{
      LHText: {
        path: LHText
      }
    }]
  },
  LHPlaceHolderImage: {
    path: LHPlaceHolderImage
  },
  LHMessageDialog: {
    path: LHMessageDialog,
    dependencies: [{
      LHSeparator: {
        path: LHSeparator
      },
      LHText: {
        path: LHText
      }
    }]
  },
  LHLoadingDialog: {
    path: LHLoadingDialog
  },
  CustomMessageDialog: {
    path: CustomMessageDialog
  },
  CustomSingleChooseDialog: {
    path: CustomSingleChooseDialog
  },
  LHSetting: {
    path: LHSetting,
    dependencies: [{
      LHStandardList: {
        path: LHStandardList
      }
    }]
  },
  LHDoubleStringSpinner: {
    path: LHDoubleStringSpinner
  },
  LHTimerPage: {
    path: LHTimerPage,
    dependencies: [{
      LHStandardList: {
        path: LHStandardList,
        dependencies: [{
          LHStandardCell: {
            path: LHStandardCell
          }
        }]
      },
      LHCommonStyles: {
        path: LHCommonStyles
      },
      LHCommonIcon: {
        path: LHCommonIcon
      },
      LHImageButton: {
        path: LHImageButton
      },
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          },
          LHSeparator: {
            path: LHSeparator
          }
        }]
      }
    }]
  },
  LHNewTimerPage: {
    path: LHNewTimerPage,
    dependencies: [{
      LHStandardList: {
        path: LHStandardList,
        dependencies: [{
          LHStandardCell: {
            path: LHStandardCell
          }
        }]
      },
      LHCommonStyles: {
        path: LHCommonStyles
      },
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          },
          LHSeparator: {
            path: LHSeparator
          }
        }]
      },
      LHDatePicker: {
        path: LHDatePicker
      }
    }]
  },
  LHSeparator: {
    path: LHSeparator
  },
  LHCommonStyles: {
    path: LHCommonStyles
  },
  LHImageButton: {
    path: LHImageButton
  },
  LHStandardCell: {
    path: LHStandardCell,
    dependencies: [{
      LHSeparator: {
        path: LHSeparator
      },
      LHPlaceHolderImage: {
        path: LHPlaceHolderImage
      },
      LHSwitch: {
        path: LHSwitch
      }
    }]
  },
  LHStandardList: {
    path: LHStandardList,
    dependencies: [{
      LHStandardCell: {
        path: LHStandardCell
      }
    }]
  },
  LHStandardListSwipeout: {
    path: LHStandardListSwipeout,
    dependencies: [{
      LHStandardCell: {
        path: LHStandardCell
      },
      LHSwipeoutButton: {
        path: LHSwipeoutButton
      },
      Swipeout: {
        path: Swipeout
      }
    }]
  },
  LHStandardLogUI: {
    path: LHStandardLogUI,
    dependencies: [{
      LHStandardEmpty: {
        path: LHStandardEmpty
      },
      LHSeparator: {
        path: LHSeparator
      }
    }]
  },
  LHStandardLog: {
    path: LHStandardLog,
    dependencies: [{
      LHStandardLogUI: {
        path: LHStandardLogUI
      }
    }]
  },
  LHTitleBarCustom: {
    path: LHTitleBarCustom,
    dependencies: [{
      LHImageButton: {
        path: LHImageButton
      },
      LHSeparator: {
        path: LHSeparator
      }
    }]
  },
  LHStandardEmpty: {
    path: LHStandardEmpty
  },
  LHPopover: {
    path: LHPopover
  },
  LHImagesAnimate: {
    path: LHImagesAnimate
  },
  LHNumberModalPicker: {
    path: LHNumberModalPicker
  },
  LHStringModalPicker: {
    path: LHStringModalPicker
  },
  LHMultiNumberModalPicker: {
    path: LHMultiNumberModalPicker
  },
  LHDatePicker: {
    path: LHDatePicker
  },
  LHCardBase: {
    path: LHCardBase
  },
  LHSwitchWithStatus: {
    path: LHSwitchWithStatus,
    dependencies: [{
      LHStandardCell: {
        path: LHStandardCell
      }
    }]
  },
  LHMoreDialogCard: {
    path: LHMoreDialogCard
  },
  LHProgressCard: {
    path: LHProgressCard,
    dependencies: [{
      LHText: {
        path: LHText
      }
    }]
  },
  LHMoreSettingPage: {
    path: LHMoreSettingPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      },
      LHStandardList: {
        path: LHStandardList,
        dependencies: [{
          LHStandardCell: {
            path: LHStandardCell
          }
        }]
      }
    }]
  },
  LHInitPage: {
    path: LHInitPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      },
      LHMessageDialog: {
        path: LHMessageDialog
      }
    }]
  },
  LHCommonIcon: {
    path: LHCommonIcon
  },
  LHSubDevicesListPage: {
    path: LHSubDevicesListPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      },
      LHStandardListSwipeout: {
        path: LHStandardListSwipeout,
        dependencies: [{
          LHStandardCell: {
            path: LHStandardCell
          }
        }]
      },
      LHCommonIcon: {
        path: LHCommonIcon
      },
      LHCommonStyles: {
        path: LHCommonStyles
      },
      LHBottomButtonGroup: {
        path: LHBottomButtonGroup
      }
    }]
  },
  LHSpecDebugPage: {
    path: LHSpecDebugPage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      }
    }]
  },
  LHCurve: {
    path: LHCurve
  },
  LHCurvePage: {
    path: LHCurvePage
  },
  LHAlarmIFTTTPage: {
    path: LHAlarmIFTTTPage,
    dependencies: [{
      LHCommonIcon: {
        path: LHCommonIcon
      },
      LHStandardListSwipeout: {
        path: LHStandardListSwipeout,
        dependencies: [{
          LHStandardCell: {
            path: LHStandardCell
          }
        }]
      },
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      }
    }]
  },
  LHAlarmSubDevicesPage: {
    path: LHAlarmSubDevicesPage
  },
  LHAdjustedView: {
    path: LHAdjustedView
  },
  LHText: {
    path: LHText
  },
  LHUnExpectedGuidePage: {
    path: LHUnExpectedGuidePage,
    dependencies: [{
      LHTitleBarCustom: {
        path: LHTitleBarCustom,
        dependencies: [{
          LHImageButton: {
            path: LHImageButton
          }
        }]
      }
    },
    {
      LHText: {
        path: LHText
      }
    }]
  }
};
