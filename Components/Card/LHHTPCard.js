/**
* @module LHCommonUI/LHHTPCard
* @description 首页温湿度功率卡片
* @property {boolean} visible 是否显示card
* @property {Object} cardStyle card容器样式
* @property {boolean} [languageAdaptation=true] 是否根据语言适配卡片，区分中文和非中文
 * @property {Object[]} data card配置数据，list卡片的配置同LHCardBase
* @property {string} data.title 主标题
* @property {Object} data.titleStyle 标题的样式
* @property {string} data.subTitle 副标题
* @property {Object} [data.subTitleStyle] 副标题的样式
* @property {number} [data.disabled=false] 不可操作态
* @property {string} [data.iconSource] 图片资源
* @property {Function} [data.onPress] 点击回调，参数返回当前项的索引
 activeIcon
* @example
*
import { LHHTPCard } from "LHCommonUI";
<LHHTPCard
  data={[{
    title: '26.8',
    subTitle: '温度(℃)',
    iconSource: Resources.MainPage.homepageMode,
    disabled: true,
    onPress: () => {}
  },
  {
    title: '78.6',
    subTitle: '湿度(%)',
    iconSource: Resources.MainPage.homepageMode,
    onPress: () => {}
  },
  {
    title: '101.3',
    subTitle: '气压(kPa)',
    iconSource: Resources.MainPage.homepageMode,
    onPress: () => {}
  }]}
/>
*
*/
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Host } from 'miot';
import Card from 'miot/ui/Card';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import {
  LHText,
  LHCardBase
} from 'LHCommonUI';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  defaultCardStyle: {
    height: LHUiUtils.GetPx(80),
    marginTop: 0,
    width: width - LHUiUtils.GetPx(10) * 2,
    marginLeft: LHUiUtils.GetPx(10),
    borderRadius: LHUiUtils.GetPx(10)
  },
  innerViewWrap: {
    height: '100%'
  }
});

class LHHTPCard extends React.Component {
  static defaultProps = {
    visible: true,
    data: [],
    languageAdaptation: true
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line
  renderItem(item, index, dataLength) {
    return (
      <TouchableOpacity
        key={'cardItem_' + index}
        style={{
          flex: 1,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity: item.disabled ? 0.3 : 1
        }}
        disabled={item.disabled}
        onPress={() => {
          if (typeof item.onPress === 'function') {
            item.onPress(index);
          }
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <LHText
            numberOfLines={1}
            style={[{
              color: '#35414E',
              fontSize: LHUiUtils.GetPx(32),
              lineHeight: LHUiUtils.GetPx(38),
              letterSpacing: -1.3,
              textAlign: 'center',
              fontFamily: Platform.OS === 'android' ? 'Mitype2018-60' : 'PingFangSC-Regular'
            }, item.titleStyle]}
          >
            {item.title}
          </LHText>
          <LHText
            numberOfLines={1}
            style={[{
              color: '#7F7F7F',
              fontSize: LHUiUtils.GetPx(13),
              lineHeight: LHUiUtils.GetPx(18),
              letterSpacing: 0,
              textAlign: 'center',
              marginTop: LHUiUtils.GetPx(3)
            }, item.subTitleStyle]}
          >
            {item.subTitle}
          </LHText>
        </View>
      </TouchableOpacity>
    );
  }

  renderInnerView() {
    const {
      data
    } = this.props;
    return (
      <View style={[styles.innerViewWrap, {
        flexDirection: 'row',
        overflow: 'hidden',
        borderRadius: LHUiUtils.GetPx(8),
        height: '100%',
        paddingHorizontal: LHUiUtils.GetPx(data.length === 2 ? 38 : 10)
      }]}
      >
        {data.map((item, index) => {
          return this.renderItem(item, index, data.length);
        })}
      </View>
    );
  }

  render() {
    const {
      visible,
      cardStyle,
      data,
      languageAdaptation
    } = this.props;
    const singleCard = (
      <Card
        innerView={this.renderInnerView()}
        visible={visible}
        cardStyle={{
          ...StyleSheet.flatten(styles.defaultCardStyle),
          ...({ height: LHUiUtils.GetPx(115) }),
          ...(cardStyle || {})
        }}
        showShadow
      />
    );
    if (languageAdaptation) {
      // 中文环境
      if (Host.locale.language === 'zh') {
        return singleCard;
      } else {
        return (
          <LHCardBase
            data={data}
            cardStyle={{
              ...StyleSheet.flatten(cardStyle),
              height: LHUiUtils.GetPx(80) * data.length
            }}
          />
        );
      }
    } else {
      return singleCard;
    }
  }
}

export default LHPureRenderDecorator(LHHTPCard);
