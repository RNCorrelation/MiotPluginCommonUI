/**
* @module LHCommonUI/LHStandardListSwipeout
* @description 标准左滑list
* @property {Object[]} [style] 应用于SectionList上的样式
* @property {boolean} [noBounces=false] 去掉iOS回弹效果
* @property {boolean} [stickySectionHeadersEnabled=true] iOS页面滚动时list header是否固定在页面顶部
* @property {Object[]} data SectionList sections数据项
* @property {string} data.title SectionList header标题
* @property {Object[]} data.data SectionList 列表数据项
* @property {string} data.data.title 标题
* @property {number} [data.data.titleNumberOfLines] 标题最大显示行数，超出后显示...，默认不限制
* @property {Object} [data.data.titleStyle] 标题的样式
* @property {string} [data.data.description] 描述【位于标题下方】
* @property {number} [data.data.descriptionNumberOfLines] 描述最大显示行数，超出后显示...，默认不限制
* @property {string} [data.data.rightDescription] 右描述【位于右边，跟标题处于同一行】
* @property {Object} [data.data.rightDescriptionStyle] 右描述的样式
* @property {Object} [data.data.style] 最外层容器样式
* @property {Object} [data.data.rowContainerStyle] 内容容器的样式【不包含分割线】
* @property {boolean} [data.data.hideRightArrow=false] 是否隐藏右侧箭头
* @property {Object} [data.data.rightArrowStyle] 右侧箭头样式
* @property {string} [data.data.iconSource] 标题前面的icon资源
* @property {Object} [data.data.iconSourceStyle] 图标的属性
* @property {Object} [data.data.leftIconStyle] 标题前面的icon的样式
* @property {boolean} [data.data.hasBadge=false] 是否有badge
* @property {boolean} [data.data.showBadge=false] 是否显示badge
* @property {string|number} [data.data.badge] badge的值
* @property {string} [data.data.leftArrowSource] 左侧箭头资源【cell作为选择项的时候使用】
* @property {boolean} [data.data.active=false] cell作为当前选中项【cell作为选择项的时候使用】
* @property {string} [data.data.rightIconSource] 右侧图片资源
* @property {Object} [data.data.rightIconStype] 右侧图片资源样式
* @property {boolean} [data.data.hasSwitch=false] 右侧是否显示switch
* @property {boolean} [useControlledSwitch=false] 是否使用受控组件
* @property {number} [data.data.switchValue=0] switch值options: [data.data.0, 1], 1为选中态
* @property {string} [data.data.switchColor] switch选中颜色
* @property {Function} [data.data.onSwitchChange] switch状态改变回调
* @property {boolean} [data.data.hasSlider=false] 右侧是否显示slider
* @property {number} [data.data.sliderValue] slider的值
* @property {Function} [data.data.onSliderChange] slider改变回调
* @property {boolean} [data.data.hasCheckBox=false] 右侧是否显示checkBox
* @property {boolean} [data.data.checkBoxActive=false] checkBox状态是否被选中
* @property {number} [data.data.separatorMarginLeft=24] 上下分割线左边距
* @property {boolean} [data.data.topSeparatorLine=false] 是否显示上分割线
* @property {Object} [data.data.topSeparatorStyle] 上分割线样式
* @property {boolean} [data.data.bottomSeparatorLine=false] 是否显示下分割线
* @property {Object} [data.data.bottomSeparatorStyle] 下分割线样式
* @property {boolean} [data.data.useTouchableHighlight=false] 是否显示按下态
* @property {Function} [data.data.press] 点击事件回调
* @property {Function} [data.data.longPress] 长按事件回调
* @property {number} [data.data.minimumLongPressDuration] 长按多少毫秒触发事件
* @property {number} [data.data.marginLeft=24] cell左边距
* @property {number} [data.data.marginTop=15] cell上边距
* @property {number} [data.data.marginBottom=15] cell下边距，若只设置了marginTop，则marginBottom的值为marginTop
* @property {Object} [data.data.cellContainerStyle] 给cell指定高度的，应该传cellContainerStyle: { flex: 1 }
* @property {boolean} [data.data.disabled] 是否是disabled态
* @example
* import { LHStandardListSwipeout } from "LHCommonUI";
*
* <LHStandardListSwipeout
*   data={[{
*     title: '功能设置',
*     data: [{
*       title: '日志',
*       press: () => { console.log('sjfhjs');}
*     },
*     {
*       title: '设备自检'
*     }]
*   },{
*     title: '通用设置',
*     data: [{
*       title: '设备名称',
*       rightDescription: '123456'
*     },
*     {
*       title: '智能'
*     }]
*   }]}
* />
*/

import React from 'react';

import {
  StyleSheet,
  SectionList,
  Text,
  View,
  TouchableHighlight
} from 'react-native';
import {
  LHUiUtils,
  LHPureRenderDecorator
} from 'LHCommonFunction';
import { LHStandardCell, Swipeout } from 'LHCommonUI';

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: LHUiUtils.GetPx(20),
    paddingBottom: LHUiUtils.GetPx(8),
    backgroundColor: LHUiUtils.MiJiaBackgroundGray
  },
  listTitle: {
    color: LHUiUtils.MiJiaListHeaderColor,
    fontSize: LHUiUtils.GetPx(12),
    paddingLeft: LHUiUtils.GetPx(23)
  },
  btnContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    height: LHUiUtils.GetPx(50),
    alignItems: 'center'
  },
  btnText: {
    fontSize: LHUiUtils.GetPx(16),
    flex: 1,
    color: LHUiUtils.MiJiaRed,
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

class LHStandardListSwipeout extends React.Component {
  static defaultProps = {
    showsVerticalScrollIndicator: false
  }

  static dealData(data) {
    const result = data;
    for (let i = 0; i < result.length; i += 1) {
      // 添加数据索引
      result[i].index = i;
    }
    return result;
  }

  constructor(props) {
    super(props);
    this.prevScrollTop = 0;
    this.swipeoutScroll = false;
    const { data } = this.props;
    this.state = {
      data,
      scrollEnabled: true
    };
  }

  componentWillReceiveProps(data) {
    this.setState({
      data: data.data || []
    });
  }

  closeSwipeout(closeAll, sectionIndex, index) {
    const { data } = this.state;
    const copyData = data;
    for (let i = 0, len = copyData.length; i < len; i += 1) {
      for (let j = 0, len1 = copyData[i].data.length; j < len1; j += 1) {
        copyData[i].data[j].swipeoutClose = true;
      }
    }
    if (!closeAll) copyData[sectionIndex].data[index].swipeoutClose = false;
    this.forceUpdate();
  }

  render() {
    const {
      noBounces,
      stickySectionHeadersEnabled,
      style,
      ListEmptyComponent,
      contentContainerStyle,
      ListFooterComponent,
      refreshControl,
      showsVerticalScrollIndicator
    } = this.props;
    const {
      data,
      scrollEnabled
    } = this.state;
    return (
      <SectionList
        initialNumToRender={20}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={contentContainerStyle}
        style={style}
        bounces={!noBounces}
        sections={LHStandardListSwipeout.dealData(data)}
        stickySectionHeadersEnabled={typeof stickySectionHeadersEnabled === 'undefined' ? true : stickySectionHeadersEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        ListEmptyComponent={() => {
          if (ListEmptyComponent) {
            return ListEmptyComponent;
          } else {
            return (<View />);
          }
        }}
        ListFooterComponent={() => {
          if (ListFooterComponent) {
            return ListFooterComponent;
          } else {
            return (<View />);
          }
        }}
        refreshControl={typeof refreshControl === 'undefined' ? null : refreshControl}
        renderItem={({ item, index, section }) => {
          if (section.title === 'type:bottomButton') {
            return (
              <TouchableHighlight
                onPress={item.press}
              >
                <View style={styles.btnContainer}>
                  <Text style={styles.btnText}>{item.title}</Text>
                </View>
              </TouchableHighlight>
            );
          } else {
            const StandardCell = (
              <LHStandardCell
                marginLeft={item.marginLeft}
                marginBottom={item.marginBottom}
                marginTop={item.marginTop}
                separatorMarginLeft={item.separatorMarginLeft}
                iconSource={item.iconSource}
                iconSourceStyle={item.iconSourceStyle}
                showPlaceHolderImage={item.showPlaceHolderImage}
                isIconSourceNeedCache={item.isIconSourceNeedCache}
                leftIconStyle={item.leftIconStyle}
                hasRightArrow={!item.hideRightArrow}
                rightArrowStyle={item.rightArrowStyle}
                hasBadge={item.hasBadge}
                showBadge={item.showBadge}
                badge={item.badge}
                descriptionNumberOfLines={item.descriptionNumberOfLines}
                active={item.active}
                activeIconStyle={item.activeIconStyle}
                leftArrowSource={item.leftRrrowSource}
                description={item.description}
                descriptionStyle={item.descriptionStyle}
                rightDescriptionStyle={item.rightDescriptionStyle}
                rightDescriptionColor={item.rightDescriptionColor}
                rightDescription={item.rightDescription}
                rightIconSource={item.rightIconSource}
                rightIconStype={item.rightIconStype}
                hasSwitch={item.hasSwitch}
                switchColor={item.switchColor}
                switchValue={item.switchValue}
                useControlledSwitch={item.useControlledSwitch}
                switchDisabled={item.switchDisabled}
                onSwitchChange={item.onSwitchChange}
                hasSlider={item.hasSlider}
                sliderValue={item.sliderValue}
                onSliderChange={item.onSliderChange}
                hasCheckBox={item.hasCheckBox}
                checkBoxActive={item.checkBoxActive}
                rowContainerStyle={item.rowContainerStyle}
                titleStyle={item.titleStyle}
                title={item.title}
                titleNumberOfLines={item.titleNumberOfLines}
                style={item.style}
                topSeparatorStyle={(index === 0 && !section.title) ? { marginLeft: 0 } : item.topSeparatorStyle}
                topSeparatorLine={index !== 0 && !item.hideTopSeparatorLine}
                bottomSeparatorStyle={index === section.data.length - 1 ? { marginLeft: 0 } : item.bottomSeparatorStyle}
                bottomSeparatorLine={typeof item.bottomSeparatorLine !== 'undefined' ? item.bottomSeparatorLine : index === section.data.length - 1}
                useTouchableHighlight={!item.noTouchableHighlight}
                minimumLongPressDuration={item.minimumLongPressDuration}
                press={item.press}
                longPress={item.longPress}
                textContainer={item.textContainer}
                showOfflineIcon={item.showOfflineIcon}
                showDeletedIcon={item.showDeletedIcon}
                cellContainerStyle={item.cellContainerStyle}
                disabled={item.disabled}
              />
            );
            if (item.swipeoutBtns) {
              const { swipeoutBtns } = item;
              for (let i = 0, len = swipeoutBtns.length; i < len; i += 1) {
                const rowData = swipeoutBtns[i];
                delete rowData.onPress;
                if (rowData.press) {
                  rowData.onPress = () => {
                    rowData.press(item, section.index, index);
                  };
                }
              }
              return (
                <Swipeout
                  scroll={(e) => {
                    this.setState({
                      scrollEnabled: e
                    });
                  }}
                  sensitivity={5}
                  right={swipeoutBtns || []}
                  close={item.swipeoutClose}
                  buttonWidth={item.swipeoutButtonWidth}
                  onOpen={(sectionID, rowID, direction) => {
                    if (direction) {
                      this.closeSwipeout(false, section.index, index);
                    } else {
                      data[section.index].data[index].swipeoutClose = false;
                      this.forceUpdate();
                    }
                  }}
                >
                  {StandardCell}
                </Swipeout>
              );
            } else {
              return StandardCell;
            }
          }
        }}
        renderSectionHeader={({ section }) => {
          if (typeof section.sectionHeader === 'function') {
            return section.sectionHeader();
          } if (section.title === 'type:bottomButton') {
            return (
              <View style={{
                height: LHUiUtils.GetPx(20),
                backgroundColor: LHUiUtils.MiJiaBackgroundGray
              }}
              />
            );
          } else if (section.title) {
            console.log(section.title);
            return (
              <View style={styles.sectionHeader}>
                <Text style={styles.listTitle}>{section.title}</Text>
              </View>
            );
          } else {
            return null;
          }
        }}
        keyExtractor={(item, index) => { return index; }}
        onScroll={(e) => {
          if (Math.abs(e.nativeEvent.contentOffset.y - this.prevScrollTop) > 20) {
            this.prevScrollTop = e.nativeEvent.contentOffset.y;
            this.closeSwipeout(true);
          }
        }}
        scrollEventThrottle={500}
      />
    );
  }
}
export default LHPureRenderDecorator(LHStandardListSwipeout);
