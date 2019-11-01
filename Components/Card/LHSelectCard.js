/**
* @module LHCommonUI/LHSelectCard
* @description 标准card
* @property {boolean} visible 是否显示card
* @property {Object} cardStyle card容器样式
* @property {number} activeOpacity item 按下态的不透明度， 默认为1，如果想要有一个明显的按下态，请用0.2
* @property {string} [title] 标题
* @property {Object} [titleStyle] 标题样式
* @property {Object} [subTitleStyle] 副标题样式
* @property {number} selectIndex 选中的项的索引
* @property {string} activeColor 选中的项文字颜色，默认#5FA7FE
* @property {number} disabled 不可操作态
 * @property {Object[]} data card配置数据
* @property {string} data.text 文字
* @property {string} [data.icon] 图片资源
* @property {string} [data.activeIcon] 选中时的图片资源
* @property {Function} [data.onPress] card点击回调，参数返回当前项的索引
 activeIcon
* @example
*
import { LHSelectCard } from "LHCommonUI";
<LHSelectCard
  title="模式"
  selectIndex={1}
  data={[{
    text: '制冷',
    icon: require('../Resources/assets/mijia_ac_boot_quick_cooling.png'),
    activeIcon: require('../Resources/assets/mijia_ac_boot_quick_cooling.png'),
    onPress: () => {
    }
  },
  {
    text: '制热',
    icon: require('../Resources/assets/mijia_ac_boot_quick_cooling.png'),
    activeIcon: require('../Resources/assets/mijia_ac_boot_quick_cooling.png'),
    onPress: () => {
    }
  }]}
  cardStyle={{ marginTop: LHUiUtils.GetPx(10) }}
/>
*
*/
import React from 'react';
import {
  Image,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Card from 'miot/ui/Card';
import {
  LHPureRenderDecorator,
  LHUiUtils
} from 'LHCommonFunction';
import {
  LHText,
  LHSwitch
} from 'LHCommonUI';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  defaultCardStyle: {
    height: LHUiUtils.GetPx(80, 360, 320),
    marginTop: 0,
    width: width - LHUiUtils.GetPx(10, 360, 320) * 2,
    marginLeft: LHUiUtils.GetPx(10, 360, 320),
    borderRadius: LHUiUtils.GetPx(10, 360, 320)
  },
  innerViewWrap: {
    height: '100%'
  }
});
const titleHeight = LHUiUtils.GetPx(53, 360, 320);

class LHSelectCard extends React.Component {
  static defaultProps = {
    visible: true,
    data: [],
    disabled: false,
    activeColor: '#5FA7FE'
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // eslint-disable-next-line
  getDate(data) {
    if (data.length < 5) return [data];
    const groupData = {};
    let index = -1;
    const len = Math.ceil(data.length / 4) * 4;
    for (let i = 0; i < len; i += 1) {
      if (i % 4 === 0) {
        index += 1;
        groupData[index] = [];
      }
      groupData[index].push(data[i] || null);
    }
    const result = [];
    for (let i = 0; i <= index; i += 1) {
      result[i] = groupData[i];
    }
    return result;
  }

  getCardHeight() {
    const {
      title,
      data
    } = this.props;
    const dataTotalLength = data.length;
    const contentHeight = dataTotalLength > 3 ? (LHUiUtils.GetPx(77, 360, 320) + LHUiUtils.GetPx(25, 360, 320)) * Math.ceil(dataTotalLength / 4)
      : LHUiUtils.GetPx(84, 360, 320) + (dataTotalLength === 2 ? LHUiUtils.GetPx(27, 360, 320) : LHUiUtils.GetPx(25, 360, 320));
    return contentHeight + (title ? titleHeight + LHUiUtils.GetPx(8, 360, 320) : LHUiUtils.GetPx(30, 360, 320));
  }

  // eslint-disable-next-line
  renderItem (item, rowIndex, index, dataTotalLength) {
    // 文字最大宽度
    const itemWidth = dataTotalLength < 4 ? LHUiUtils.GetPx(86, 360, 320) : LHUiUtils.GetPx(74, 360, 320);
    const iconWidth = dataTotalLength < 4 ? LHUiUtils.GetPx(56, 360, 320) : LHUiUtils.GetPx(50, 360, 320);
    if (!item) {
      return (
        <View
          key={'cardItem_' + index}
          style={{
            width: itemWidth
          }}
        />
      );
    }
    const {
      disabled,
      selectIndex,
      activeColor,
      activeOpacity
    } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={typeof activeOpacity !== 'undefined' ? activeOpacity : 1}
        key={'cardItem_' + index}
        style={{
          width: itemWidth,
          alignItems: 'center',
          marginBottom: LHUiUtils.GetPx(25, 360, 320)
        }}
        disabled={disabled}
        onPress={() => {
          if (typeof item.onPress === 'function') {
            item.onPress(rowIndex * 4 + index);
          }
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode="contain"
            style={{
              width: iconWidth,
              height: iconWidth
            }}
            source={selectIndex === rowIndex * 4 + index ? (item.activeIcon || item.icon) : item.icon}
          />
          <LHText
            numberOfLines={1}
            style={{
              color: selectIndex === rowIndex * 4 + index ? activeColor : '#7F7F7F',
              fontSize: LHUiUtils.GetPx(13),
              lineHeight: LHUiUtils.GetPx(18),
              letterSpacing: 0,
              textAlign: 'center',
              marginTop: LHUiUtils.GetPx(9, 360, 320)
            }}
          >
            {item.text}
          </LHText>
        </View>
      </TouchableOpacity>
    );
  }

  renderRow(data, index, dataTotalLength) {
    const { title } = this.props;
    return (
      <View
        key={'rowItem_' + index}
        style={{
          marginTop: index === 0 ? (title ? LHUiUtils.GetPx(dataTotalLength < 4 ? 10 : 8, 360, 320) : LHUiUtils.GetPx(28, 360, 320)) : 0,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: dataTotalLength === 2 ? (69 / 340 * 100 + '%') : (dataTotalLength === 3 ? (30 / 340 * 100 + '%') : (8 / 340 * 100 + '%'))
        }}
      >

        {data.map((item, itemIndex) => {
          return this.renderItem(item, index, itemIndex, dataTotalLength);
        })}
      </View>
    );
  }

  renderInnerView() {
    const {
      data,
      title,
      subTitle,
      selectIndex,
      disabled,
      titleStyle,
      subTitleStyle,
      hasSwitch,
      switchDisabled,
      switchTintColor,
      switchColor,
      switchValue,
      onSwitchValueChange
    } = this.props;
    const dataTotalLength = data.length;
    // 将数据分成4个一组
    const pageData = this.getDate(data);
    const selectText = typeof subTitle !== 'undefined' ? subTitle : (typeof selectIndex !== 'undefined' && data[selectIndex] && data[selectIndex].text);
    const titleElement = title ? (
      <View
        style={{
          height: titleHeight,
          flexDirection: 'row',
          paddingLeft: LHUiUtils.GetPx(19),
          paddingRight: LHUiUtils.GetPx(hasSwitch ? 18 : 19),
          alignItems: 'center'
        }}
      >
        <LHText
          numberOfLines={1}
          style={[{
            color: '#333',
            fontSize: LHUiUtils.GetPx(14),
            lineHeight: LHUiUtils.GetPx(19),
            letterSpacing: 0,
            maxWidth: '70%'
          }, titleStyle]}
        >
          {title}
        </LHText>
        {
          selectText ? (
            <View
              style={[{
                width: LHUiUtils.MiJiaBorderWidth,
                height: LHUiUtils.GetPx(14),
                marginHorizontal: LHUiUtils.GetPx(6),
                backgroundColor: 'rgba(0,0,0,0.3)'
              }]}
            />
          ) : null
        }
        <LHText
          numberOfLines={1}
          style={[{
            flex: 1,
            color: '#666',
            fontSize: LHUiUtils.GetPx(12),
            lineHeight: LHUiUtils.GetPx(16),
            letterSpacing: 0,
            opacity: selectText ? 1 : 0
          }, subTitleStyle]}
        >
          {selectText}
        </LHText>
        {
          hasSwitch ? (
            <View style={{ paddingBottom: LHUiUtils.GetPx(2) }}>
              <LHSwitch
                disabled={switchDisabled || disabled || false}
                tintColor={switchTintColor || '#f0f0f0'}
                onTintColor={switchColor || LHUiUtils.MiJiaBlue}
                onValueChange={(state) => {
                  if (typeof onSwitchValueChange === 'function') onSwitchValueChange(state);
                }}
                value={switchValue}
              />
            </View>
          ) : null
        }
      </View>
    ) : null;
    return (
      <View style={[styles.innerViewWrap, {
        overflow: 'hidden',
        borderRadius: LHUiUtils.GetPx(8, 360, 320),
        opacity: disabled ? 0.3 : 1
      }]}
      >
        {titleElement}
        {pageData.map((item, index) => {
          return this.renderRow(item, index, dataTotalLength);
        })}
      </View>
    );
  }

  render() {
    const {
      visible,
      cardStyle,
      data
    } = this.props;
    if (data.length < 2) {
      console.warn('该组件至少要有两个元素以上');
      return (<View />);
    }
    return (
      <Card
        innerView={this.renderInnerView()}
        visible={visible}
        cardStyle={{
          ...StyleSheet.flatten(styles.defaultCardStyle),
          ...(cardStyle || {}),
          ...({ height: this.getCardHeight() })
        }}
        showShadow
      />
    );
  }
}

export default LHPureRenderDecorator(LHSelectCard);
