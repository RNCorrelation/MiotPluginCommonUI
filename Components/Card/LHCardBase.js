/**
* @module LHCommonUI/LHCardBase
* @description 标准card
* @property {boolean} visible 是否显示card
* @property {Object} cardStyle card容器样式
* @property {boolean} [autoHeight=false] 是否使用高度自适应，只支持单卡片
* @property {boolean} [paddingVertical] 使用高度自适应时，上下边距
 * @property {Object[]} data card配置数据
* @property {string} data.title 标题
* @property {number} [data.titleNumberOfLines] 标题最大显示行数，超出后显示...，默认1行
* @property {Object} [data.titleStyle] 标题的样式
* @property {string} [data.subTitle] 描述【位于标题下方】
* @property {Object} [data.subTitleStyle] 描述的样式
* @property {number} [data.subTitleNumberOfLines] 描述最大显示行数，超出后显示...，默认1行
* @property {string} [data.iconSource] 左侧图片资源
* @property {Object} [data.iconStyle] 左侧图片样式
* @property {boolean} [data.rightIconType] 默认右侧图标,有箭头和关闭图标两种，传rightIconType: 'close'时显示关闭图标
* @property {boolean} [data.hideRightIcon=false] 是否隐藏右侧图标
* * @property {string} [data.rightIconSource] 右侧图片资源
* @property {Object} [data.rightIconStyle] 右侧图片样式
* @property {Object} [data.rightIconWrapStyle] 右侧图片容器样式
* @property {Function} [data.rightIconPress] 右侧图片点击回调
* @property {boolean} [data.hasSwitch=false] 右侧是否显示switch
* @property {boolean} [data.switchValue=false] switch值
* @property {string} [data.switchColor] switch选中颜色
* @property {string} [data.switchTintColor] switch未选中时背景颜色
* @property {boolean} [data.switchDisabled=false] 是否禁用，默认值 false
* @property {Function} [data.onValueChange] switch状态改变回调
* @property {Function} [data.onPress] card点击回调
* @property {Function} [data.disabled] card不可点击态

* @example
*
import { LHCardBase } from "LHCommonUI";
const { showAlertCard } = this.state;
<LHCardBase
  data={[{
    title: '标题',
    subTitle: '描述',
    iconSource: Resources.MainPage.homepageLog,
    iconStyle: { width: LHUiUtils.GetPx(40), height: LHUiUtils.GetPx(40) },
    hasSwitch: true,
    switchValue: showAlertCard,
    onValueChange: () => {
      const { showAlertCard: showAlertCard1 } = this.state;
      this.setState({
        showAlertCard: !showAlertCard1
      });
    }
  }]}
  cardStyle={{ height: LHUiUtils.GetPx(80), marginTop: LHUiUtils.GetPx(10), marginBottom: LHUiUtils.GetPx(10) }}
/>
*
*/
import React from 'react';
import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import Card from 'miot/ui/Card';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import { LHSwitch } from 'LHCommonUI';
import Images from '../../../../../../miot-sdk/resources/Images';

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
  },
  borderLine: {
    backgroundColor: LHUiUtils.MiJiaLineColor,
    height: LHUiUtils.MiJiaBorderWidth,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: LHUiUtils.GetPx(40),
    height: LHUiUtils.GetPx(40),
    marginLeft: LHUiUtils.GetPx(20),
    marginRight: LHUiUtils.GetPx(13)
  },
  title: {
    fontSize: LHUiUtils.GetPx(15),
    lineHeight: LHUiUtils.GetPx(20),
    color: '#000',
    letterSpacing: -0.14,
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  subTitle: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    color: '#999999',
    letterSpacing: -0.11,
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  textWrap: {
    flex: 1
  },
  rightIcon: {
    width: LHUiUtils.GetPx(24),
    height: LHUiUtils.GetPx(24)
  },
  rightIconWrap: {
    paddingRight: LHUiUtils.GetPx(18),
    height: '100%',
    justifyContent: 'center'
  }
});

class LHCardBase extends React.Component {
  static initialState = {};

  static defaultProps = {
    visible: true,
    data: []

  };

  constructor(props) {
    super(props);
    this.state = {
      cardHeight: 0
    };
  }

  // eslint-disable-next-line
  renderItem (item, index, len) {
    const borderTop = index !== 0 ? (<View style={styles.borderLine} />) : null;
    const subTitle = typeof item.subTitle !== 'undefined' ? (<Text numberOfLines={item.subTitleNumberOfLines || 1} style={[styles.subTitle, item.subTitleStyle]}>{item.subTitle}</Text>) : null;
    const rightIcon = (item.hideRightIcon || item.hasSwitch) ? null : (
      <Image
        resizeMode="contain"
        style={[styles.rightIcon, item.rightIconStyle]}
        source={item.rightIconSource || (item.rightIconType === 'close' ? require('../../Resources/default_card_close.png') : Images.common.right_arrow)}
      />
    );
    const rightIconWrap = item.rightIconPress ? (
      <TouchableHighlight
        style={[styles.rightIconWrap, item.rightIconWrapStyle, { opacity: item.disabled ? 0.3 : 1 }]}
        underlayColor="transparent"
        activeOpacity={1}
        onPress={() => {
          item.rightIconPress();
        }}
      >
        {rightIcon}
      </TouchableHighlight>
    ) : (
      item.hasSwitch ? null : (
        <View
          style={[styles.rightIconWrap, item.rightIconWrapStyle, { opacity: item.disabled ? 0.3 : 1 }]}
        >
          {rightIcon}
        </View>
      )
    );

    const rightSwitch = item.hasSwitch ? (
      <TouchableOpacity
        style={{
          height: '100%',
          justifyContent: 'center',
          paddingRight: LHUiUtils.GetPx(20),
          marginLeft: LHUiUtils.GetPx(12),
          alignItems: 'flex-end'
        }}
        activeOpacity={1}
        onPress={() => {}}
      >
        <LHSwitch
          style={{
            width: LHUiUtils.GetPx(44),
            height: LHUiUtils.GetPx(24)
          }}
          disabled={item.switchDisabled || item.disabled || false}
          tintColor={item.switchTintColor || '#f0f0f0'}
          onTintColor={item.switchColor || LHUiUtils.MiJiaBlue}
          onValueChange={(state) => {
            if (typeof item.onValueChange === 'function') item.onValueChange(state);
          }}
          value={item.switchValue}
          ref={(switchBtn) => { this.switchBtn = switchBtn; }}
        />
      </TouchableOpacity>
    ) : null;

    const icon = !item.hasNest ? (// 左边的图标是否被嵌套，默认是没有，正常使用时不用管这个变量，当有需要嵌套时才需要到这个参数
      <Image
        resizeMode="contain"
        style={[styles.icon, item.iconStyle, { opacity: item.disabled ? 0.3 : 1 }]}
        source={item.iconSource}
      />
    ) : (
      <View style={[styles.icon, item.nestWrapperStyle, { alignItems: 'center', justifyContent: 'center', opacity: item.disabled ? 0.3 : 1 }]}>
        <Image
          resizeMode="contain"
          style={[{
            width: LHUiUtils.GetPx(40),
            height: LHUiUtils.GetPx(40)
          }, item.iconStyle]}
          source={item.iconSource}
        />
      </View>
    );
    const textWrap = (
      <View
        style={[styles.textWrap, item.textWrapStyle, { opacity: item.disabled ? 0.3 : 1 }]}
        onLayout={(e) => {
          const {
            autoHeight,
            paddingVertical
          } = this.props;
          console.log('触发重新布局');
          if (autoHeight) {
            this.setState({
              cardHeight: e.nativeEvent.layout.height + (paddingVertical || 0) * 2
            });
          }
        }}
      >
        <Text numberOfLines={item.titleNumberOfLines || 1} style={[styles.title, item.titleStyle]}>{item.title || ''}</Text>
        {subTitle}
      </View>
    );
    const content = item.onPress ? (
      <TouchableHighlight
        disabled={item.disabled || false}
        key={'item_' + index}
        style={[styles.itemWrap, { height: (1 / len * 100) + '%', backgroundColor: item.disabled ? 'rgba(255, 255, 255, 0.3)' : '#fff' }]}
        underlayColor={LHUiUtils.MiJiaCellSelBgColor}
        activeOpacity={1}
        onPress={() => {
          item.onPress();
        }}
      >
        <View style={[styles.itemWrap, {
          height: '100%',
          flex: 1
        }]}
        >
          {borderTop}
          {icon}
          {textWrap}
          {rightSwitch}
          {rightIconWrap}
        </View>
      </TouchableHighlight>
    ) : (
      <View
        key={'item_' + index}
        style={[styles.itemWrap, { height: (1 / len * 100) + '%', backgroundColor: item.disabled ? 'rgba(255, 255, 255, 0.3)' : '#fff' }]}
      >
        {borderTop}
        {icon}
        {textWrap}
        {rightSwitch}
        {rightIconWrap}
      </View>
    );
    return content;
  }

  renderInnerView() {
    const { data } = this.props;
    return (
      <View style={[styles.innerViewWrap, {
        overflow: 'hidden',
        borderRadius: LHUiUtils.GetPx(10)
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
      autoHeight // 只支持单卡片
    } = this.props;
    const { cardHeight } = this.state;
    return (
      <Card
        key={cardHeight}
        innerView={this.renderInnerView()}
        visible={visible}
        cardStyle={{
          ...StyleSheet.flatten(styles.defaultCardStyle),
          ...(cardStyle || {}),
          ...(autoHeight ? { height: cardHeight } : {})
        }}
        showShadow
      />
    );
  }
}

export default LHPureRenderDecorator(LHCardBase);
