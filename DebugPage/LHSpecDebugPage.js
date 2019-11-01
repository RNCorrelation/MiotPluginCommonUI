import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import {
  Package,
  Device,
  DeviceEvent
} from 'miot';
import {
  LHPureRenderDecorator,
  LHUiUtils,
  LHMiServer,
  CommonMethod,
  LHDateUtils
} from 'LHCommonFunction';
import { LHTitleBarCustom } from 'LHCommonUI';


const styles = StyleSheet.create({
  btn: {
    flex: 1.5,
    marginLeft: LHUiUtils.GetPx(10),
    backgroundColor: LHUiUtils.MiJiaBlue,
    height: LHUiUtils.GetPx(40),
    borderRadius: LHUiUtils.GetPx(5),
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    borderWidth: LHUiUtils.MiJiaBorderWidth,
    borderColor: LHUiUtils.MiJiaLineColor,
    height: LHUiUtils.GetPx(40),
    borderRadius: LHUiUtils.GetPx(5),
    fontSize: LHUiUtils.GetPx(16),
    color: 'rgba(0,0,0, 0.7)',
    textAlign: 'center',
    backgroundColor: LHUiUtils.MiJiaWhite,
    flex: 1,
    marginHorizontal: LHUiUtils.GetPx(8)
  },
  text: {
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(19),
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  btnText: {
    width: '100%',
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(19),
    fontFamily: LHUiUtils.DefaultFontFamily,
    color: '#fff',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: LHUiUtils.GetPx(23),
    paddingVertical: LHUiUtils.GetPx(10),
    alignItems: 'center'
  },
  params: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(17),
    fontFamily: LHUiUtils.DefaultFontFamily,
    color: '#333'
  },
  checkBox: {
    width: 18,
    height: 18
  },
  checkBoxWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkBoxText: {
    marginLeft: LHUiUtils.GetPx(10),
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(19),
    fontFamily: LHUiUtils.DefaultFontFamily
  }
});

let subscribeMessagesErrorCount = 0;
class LHSpecDebugPage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title="Spec调试页面"
            style={[{
              backgroundColor: LHUiUtils.MiJiaWhite,
              borderBottomWidth: LHUiUtils.MiJiaBorderWidth,
              borderBottomColor: LHUiUtils.MiJiaLineColor
            }]}
            onPressLeft={() => {
              if (navigation.dangerouslyGetParent().state && navigation.dangerouslyGetParent().state.index === 0) {
                Package.exit();
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
      )
    };
  }

  constructor(props, context) {
    super(props, context);
    console.log(Device);
    this.hasListenerKey = [];
    this.state = {
      did: Device.deviceID,
      readSiid: '',
      readPiid: '',
      readParams: '',
      readResult: '',
      writeSiid: '',
      writePiid: '',
      writeValue: '',
      writeParams: '',
      writeResult: '',
      listenerType: 'event',
      currentListener: '',
      listenerResult: []
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.deviceStatusListener = DeviceEvent.deviceReceivedMessages.addListener(
      (device, map, res) => {
        const {
          currentListener,
          listenerResult
        } = this.state;
        const index = CommonMethod.Find(res, 'key', currentListener);
        if (index > -1) {
          const data = CommonMethod.DeepClone(listenerResult, []);
          data.unshift({
            time: LHDateUtils.DateFormat('hh:mm:ss', +new Date()),
            data: JSON.stringify(res[index])
          });
          console.log(data);
          this.setState({
            listenerResult: data
          });
        }
        console.log(res);
      }
    );
  }

  componentWillUnmount() {
    if (this.deviceStatusListener) this.deviceStatusListener.remove();
    if (this.subscribeMessagesListener) this.subscribeMessagesListener.remove();
  }

  GetSpecValue(did, siid, piid) {
    const params = [{
      did,
      siid,
      piid
    }];
    this.setState({
      readParams: JSON.stringify(params),
      readResult: '读取中...'
    });
    console.log(JSON.stringify(params));
    LHMiServer.GetPropertiesValue(params, (res) => {
      console.log(res);
      this.setState({
        readResult: JSON.stringify(res)
      });
    }, (res) => {
      this.setState({
        readResult: '读取失败：' + JSON.stringify(res)
      });
    });
  }

  SetSpecValue(did, siid, piid, value) {
    const params = [{
      did,
      siid,
      piid,
      value
    }];
    this.setState({
      writeParams: JSON.stringify(params),
      writeResult: '写入中...'
    });
    console.log(JSON.stringify(params));
    LHMiServer.SetPropertiesValue(params, (res) => {
      console.log(res);
      this.setState({
        writeResult: JSON.stringify(res)
      });
    }, (res) => {
      this.setState({
        writeResult: '写入失败：' + JSON.stringify(res)
      });
    });
  }

  subscribeMessages(params) {
    this.setState({
      currentListener: params,
      listenerResult: []
    });
    if (this.hasListenerKey.indexOf(params) > -1) { // 已经监听过
      return;
    }
    this.hasListenerKey.push(params);
    console.log(params);
    Device.getDeviceWifi().subscribeMessages(params).then((subcription) => {
      subscribeMessagesErrorCount = 0;
      this.subscribeMessagesListener = subcription;
    }).catch(() => {
      console.log('subscribe failed');
      for (let i = 0, len = this.hasListenerKey.length; i < len; i += 1) {
        if (params === this.hasListenerKey[i]) {
          this.hasListenerKey.splice(i, 1);
          break;
        }
      }
      subscribeMessagesErrorCount += 1;
      if (subscribeMessagesErrorCount < 3) {
        this.subscribeMessages(params);
      }
    });
  }

  AddListenerEvent(did, listenerSiid, listenerPiid) {
    const { listenerType } = this.state;
    this.subscribeMessages(listenerType + '.' + listenerSiid + '.' + listenerPiid);
  }

  // eslint-disable-next-line
  renderListenerResultItem(item, index) {
    return (
      <View key={'key_' + index} style={[styles.row]}>
        <Text>{item.time + '：' + item.data}</Text>
      </View>
    );
  }

  render() {
    const {
      did,
      readParams,
      readResult,
      writeParams,
      writeResult,
      listenerType,
      currentListener,
      listenerResult
    } = this.state;
    const currentListenerEl = currentListener !== '' ? (
      <View style={[styles.row, { paddingTop: 0 }]}>
        <Text>{'当前监听：' + currentListener}</Text>
      </View>
    ) : null;
    return (
      <ScrollView style={{
        flex: 1,
        backgroundColor: LHUiUtils.MiJiaBackgroundGray
      }}
      >
        <View
          style={styles.row}
        >
          <Text style={styles.text}>did:</Text>
          <TextInput
            maxLength={20}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            defaultValue={did}
            onChangeText={(text) => {
              this.setState({
                did: text
              });
            }}
          />
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.text}>siid:</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                readSiid: Number(text)
              });
            }}
          />
          <Text style={styles.text}>piid:</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                readPiid: Number(text)
              });
            }}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              const { readSiid, readPiid } = this.state;
              console.log(readSiid + ' ' + readPiid);
              if (did === '' || readSiid === '' || readPiid === '') return false;
              return this.GetSpecValue(did, readSiid, readPiid);
            }}
          >
            <Text
              style={styles.btnText}
            >
              读取
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.params}>
            读取参数:
            {readParams}
          </Text>
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.params}>
            读取结果:
            {readResult}
          </Text>
        </View>

        <View
          style={styles.row}
        >
          <Text style={styles.text}>siid:</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                writeSiid: Number(text)
              });
            }}
          />
          <Text style={styles.text}>piid:</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                writePiid: Number(text)
              });
            }}
          />
          <Text style={styles.text}>val:</Text>
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              console.log(text);
              let value = text;
              if (text === 'false') {
                value = false;
              } else if (text === 'true') {
                value = true;
              } else if (text > -1) {
                value = Number(text);
              }
              console.log(value);
              this.setState({
                writeValue: value
              });
            }}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              const { writeSiid, writePiid, writeValue } = this.state;
              console.log(writeSiid + ' ' + writePiid);
              if (did === '' || writeSiid === '' || writePiid === '') return false;
              return this.SetSpecValue(did, writeSiid, writePiid, writeValue);
            }}
          >
            <Text
              style={styles.btnText}
            >
              写
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.params}>
            写入参数:
            {writeParams}
          </Text>
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.params}>
            写入结果:
            {writeResult}
          </Text>
        </View>
        <View
          style={styles.row}
        >
          <TouchableOpacity
            style={styles.checkBoxWrap}
            onPress={() => {
              this.setState({
                listenerType: 'event'
              });
            }}
          >
            <Image style={styles.checkBox} source={listenerType === 'event' ? require('../Resources/checkBox/check1.png') : require('../Resources/checkBox/check2.png')} />
            <Text style={styles.checkBoxText}>事件</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkBoxWrap}
            onPress={() => {
              this.setState({
                listenerType: 'prop'
              });
            }}
          >
            <Image style={styles.checkBox} source={listenerType === 'event' ? require('../Resources/checkBox/check2.png') : require('../Resources/checkBox/check1.png')} />
            <Text style={styles.checkBoxText}>属性</Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.row}
        >
          <Text style={styles.text}>siid:</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                listenerSiid: Number(text)
              });
            }}
          />
          <Text style={styles.text}>{listenerType === 'event' ? 'eiid:' : 'piid:'}</Text>
          <TextInput
            maxLength={2}
            style={styles.input}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            onChangeText={(text) => {
              this.setState({
                listenerPiid: Number(text)
              });
            }}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              const { listenerSiid, listenerPiid } = this.state;
              console.log(listenerSiid + ' ' + listenerPiid);
              if (did === '' || listenerSiid === '' || listenerPiid === '') return false;
              return this.AddListenerEvent(did, listenerSiid, listenerPiid);
            }}
          >
            <Text
              style={styles.btnText}
            >
              订阅
            </Text>
          </TouchableOpacity>
        </View>
        {currentListenerEl}
        {listenerResult.map((item, index) => {
          return this.renderListenerResultItem(item, index);
        })}
      </ScrollView>
    );
  }
}

export default LHPureRenderDecorator(LHSpecDebugPage);
