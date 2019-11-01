
import React from 'react';
import {
  Image,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
  Device
} from 'miot';
import {
  LHPureRenderDecorator,
  LHMiServer
} from 'LHCommonFunction';

import {
  LHStandardCell
} from 'LHCommonUI';

const cacheObject = {};
class LHSwitchWithStatus extends React.Component {
  static initialState = {
  };

  static defaultProps = {
  };

  constructor(props) {
    super(props);
    const { cacheKey } = this.props;
    const status = status
    this.state = {
      status: '0'
    };
  }

  componentWillMount() {
    const { type } = this.props;
    if (type === 'spec') {
      this.getSettingStatus();
    } else {
      this.getSettingStatus();
    }
  }

  getSpecStatus() {
    const { statusKey, siid, piid } = this.props;
    LHMiServer.GetPropertiesValue([{
      did: Device.deviceID,
      siid: siid,
      piid: piid
    }], (res) => {
      let status = '0';
      if (res.length > 0 && res[0].code === 0) {
        status = res[0].value;
      }
      this.setState({
        status
      });
      console.log(res);
    }, () => {
    });
  }

  SetSpecStatus(newStatus, oldStatus) {
    const { statusKey, siid, piid } = this.props;
    LHMiServer.SetPropertiesValue([{
      did: Device.deviceID,
      siid: siid,
      piid: piid,
      value: newStatus
    }], (res) => {
      if (res.code !== 0) {
        this.setState({
          status: oldStatus
        });
      }
      console.log(res);
    }, () => {
    });
  }

  getSettingStatus() {
    const { statusKey } = this.props;
    LHMiServer.GetDeviceSetting({
      did: Device.deviceID,
      settings: [statusKey]
    }, (res) => {
      if (res.code === 0) {
        let status = typeof res.result.settings !== 'undefined' && res.result.settings[statusKey];
        if (typeof status === 'undefined') {
          status = '0';
        }
        this.setState({
          status
        });
      }
      console.log(res);
    }, () => {
    });
  }

  setSettingStatus(newStatus, oldStatus) {
    const { statusKey } = this.props;
    LHMiServer.SetDeviceSetting({
      did: Device.deviceID,
      settings: {
        [statusKey]: newStatus
      }
    }, (res) => {
      if (res.code !== 0) {
        this.setState({
          status: oldStatus
        });
      }
      console.log(res);
    }, () => {
    });
  }

  render() {
    const {
      status
    } = this.state;
    return (
      <LHStandardCell
        titleNumberOfLines={1}
        title={'设备检查提醒'}
        description={'允许每月1号推送通知检查设备，长按设备3秒进行自检'}
        hasSwitch
        switchValue={status === '1'}
        onSwitchChange={() => {
          const newStatus = status === '1' ? '0' : '1';
          this.setState({
            status: newStatus
          });
          const { type } = this.props;
          if (type === 'spec') {
            this.SetSpecStatus(newStatus, status);
          } else {
            this.setSettingStatus(newStatus, status);
          }
        }}
      />
    );
  }
}
export default LHPureRenderDecorator(LHSwitchWithStatus);
