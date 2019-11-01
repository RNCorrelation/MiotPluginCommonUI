/**
* @module LHCommonUI/LHStandardList
* @description 标准list
* @property {Object} [style] 应用于SectionList上的样式
* @property {Object} [contentContainerStyle] 应用于SectionList上的content样式
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
* @property {Object} [data.data.leftIconStyle] 标题前面的icon的样式
* @property {boolean} [data.data.hasBadge=false] 是否有badge
* @property {boolean} [data.data.showBadge=false] 是否显示badge
* @property {string|number} [data.data.badge] badge的值
* @property {string} [data.data.leftArrowSource] 左侧箭头资源【cell作为选择项的时候使用】
* @property {boolean} [data.data.active=false] cell作为当前选中项【cell作为选择项的时候使用】
* @property {string} [data.data.rightIconSource] 右侧图片资源
* @property {Object} [data.data.rightIconStype] 右侧图片资源样式
* @property {boolean} [data.data.hasDot=false] 右侧是否有红点dot
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
* @property {boolean} [data.data.noTouchableHighlight=false] 是否显示按下态
* @property {Function} [data.data.press] 点击事件回调
* @property {Function} [data.data.longPress] 长按事件回调
* @property {number} [data.data.minimumLongPressDuration] 长按多少毫秒触发事件
* @property {number} [data.data.marginLeft=24] cell左边距
* @property {number} [data.data.marginTop=15] cell上边距
* @property {number} [data.data.marginBottom=15] cell下边距，若只设置了marginTop，则marginBottom的值为marginTop
* @property {Object} [data.data.cellContainerStyle] 给cell指定高度的，应该传cellContainerStyle: { flex: 1 }
* @property {boolean} [data.data.disabled] 是否是disabled态
* @example
* import { LHStandardList } from "LHCommonUI";
*
* <LHStandardList
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

import { LHUiUtils, LHPureRenderDecorator } from 'LHCommonFunction';
import { LHStandardCell, LHSeparator } from 'LHCommonUI';

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: LHUiUtils.GetPx(9),
    paddingBottom: LHUiUtils.GetPx(8),
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  listTitle: {
    color: LHUiUtils.MiJiaListHeaderColor,
    fontSize: LHUiUtils.GetPx(11),
    lineHeight: LHUiUtils.GetPx(14),
    paddingLeft: LHUiUtils.GetPx(23.5)
  },
  btnContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    height: LHUiUtils.GetPx(42),
    alignItems: 'center'
  },
  btnText: {
    fontSize: LHUiUtils.GetPx(13),
    flex: 1,
    color: '#f43f31',
    textAlign: 'center',
    fontFamily: LHUiUtils.DefaultFontFamily
  }
});

class LHStandardList extends React.Component {
  static defaultProps = {
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'never'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps() {
  }

  scrollToLocation(sectionIndex, itemIndex, viewOffset) {
    if (this.sectionList) {
      console.log(sectionIndex + ',' + itemIndex + ',' + viewOffset);
      this.sectionList.scrollToLocation({
        sectionIndex,
        itemIndex,
        viewOffset
      });
    }
  }

  render() {
    const {
      data,
      noBounces,
      stickySectionHeadersEnabled,
      style,
      contentContainerStyle,
      ListFooterComponent,
      refreshControl,
      ListEmptyComponent,
      showsVerticalScrollIndicator,
      keyboardShouldPersistTaps,
      getItemLayout,
      sectionHeaderStyle,
      onScroll,
      initialNumToRender,
      keyExtractor,
      onMomentumScrollBegin
    } = this.props;
    return (
      <SectionList
        onScroll={onScroll}
        onMomentumScrollBegin={onMomentumScrollBegin}
        getItemLayout={getItemLayout}
        ref={(view) => { this.sectionList = view; }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        initialNumToRender={initialNumToRender || 20}
        style={style}
        contentContainerStyle={contentContainerStyle}
        bounces={!noBounces}
        sections={data}
        ListFooterComponent={ListFooterComponent}
        refreshControl={typeof refreshControl === 'undefined' ? null : refreshControl}
        stickySectionHeadersEnabled={typeof stickySectionHeadersEnabled === 'undefined' ? true : stickySectionHeadersEnabled}
        ListEmptyComponent={() => {
          if (ListEmptyComponent) {
            return ListEmptyComponent;
          } else {
            return (<View />);
          }
        }}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        renderItem={({ item, index, section }) => {
          if (section.title === 'type:bottomButton') {
            return (
              <TouchableHighlight
                onPress={item.press}
                style={{
                  marginHorizontal: LHUiUtils.GetPx(24),
                  marginBottom: LHUiUtils.GetPx(50),
                  borderRadius: LHUiUtils.GetPx(5),
                  borderWidth: LHUiUtils.MiJiaBorderWidth,
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden'
                }}
              >
                <View style={styles.btnContainer}>
                  <Text style={styles.btnText}>{item.title}</Text>
                </View>
              </TouchableHighlight>
            );
          } else {
            return (
              <LHStandardCell
                marginLeft={item.marginLeft}
                marginBottom={item.marginBottom}
                marginTop={item.marginTop}
                showOfflineIcon={item.showOfflineIcon}
                separatorMarginLeft={item.separatorMarginLeft}
                iconSource={item.iconSource}
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
                leftArrowSource={item.leftRrrowSource}
                textContainer={item.textContainer}
                description={item.description}
                descriptionStyle={item.descriptionStyle}
                rightDescriptionStyle={item.rightDescriptionStyle}
                rightDescriptionColor={item.rightDescriptionColor}
                rightDescription={item.rightDescription}
                rightIconSource={item.rightIconSource}
                rightIconStype={item.rightIconStype}
                hasDot={item.hasDot}
                hasSwitch={item.hasSwitch}
                useControlledSwitch={item.useControlledSwitch}
                switchValue={item.switchValue}
                switchDisabled={item.switchDisabled}
                switchColor={item.switchColor}
                onSwitchChange={item.onSwitchChange}
                hasSlider={item.hasSlider}
                sliderValue={item.sliderValue}
                onSliderChange={item.onSliderChange}
                hasCheckBox={item.hasCheckBox}
                checkBoxActive={item.checkBoxActive}
                rowContainerStyle={item.rowContainerStyle}
                titleStyle={item.titleStyle}
                title={item.title}
                activeTitleStyle={item.activeTitleStyle}
                activeIconStyle={item.activeIconStyle}
                titleNumberOfLines={item.titleNumberOfLines}
                topSeparatorStyle={typeof item.topSeparatorStyle === 'undefined' ? (index === 0 && !section.title) ? { marginLeft: 0 } : item.topSeparatorStyle : item.topSeparatorStyle}
                topSeparatorLine={(index !== 0 && !item.hideTopSeparatorLine) || (!section.title && !item.hideTopSeparatorLine)}
                bottomSeparatorStyle={typeof item.bottomSeparatorStyle === 'undefined' ? index === section.data.length - 1 ? { marginLeft: 0 } : item.bottomSeparatorStyle : item.bottomSeparatorStyle}
                bottomSeparatorLine={typeof item.bottomSeparatorLine !== 'undefined' ? item.bottomSeparatorLine : index === section.data.length - 1}
                useTouchableHighlight={!item.noTouchableHighlight}
                minimumLongPressDuration={item.minimumLongPressDuration}
                press={item.press}
                longPress={item.longPress}
                showSliderView={item.showSliderView}
                showWithPercent={item.showWithPercent}
                valueStyle={item.valueStyle}
                sliderStyle={item.sliderStyle}
                sliderProps={item.sliderProps}
                onSlidingComplete={item.onSlidingComplete}
                style={[{
                  marginBottom: (index === section.data.length - 1 && data.indexOf(section) !== data.length - 1) ? LHUiUtils.GetPx(8) : 0
                }, item.style]}
                cellContainerStyle={item.cellContainerStyle}
                disabled={item.disabled}
              />
            );
          }
        }}
        renderSectionHeader={({ section }) => {
          if (section.title === 'type:bottomButton') {
            return (
              <View style={{
                height: LHUiUtils.GetPx(16),
                backgroundColor: LHUiUtils.MiJiaBackgroundGray
              }}
              />
            );
          } else if (section.title) {
            return (
              <View style={[{ backgroundColor: '#fff' }, sectionHeaderStyle]}>
                <LHSeparator style={{ backgroundColor: data.indexOf(section) === 0 ? '#fff' : LHUiUtils.MiJiaLineColor, alignSelf: 'flex-start' }} />
                <View style={[styles.sectionHeader]}>
                  <Text style={styles.listTitle}>{section.title}</Text>
                </View>
                <LHSeparator style={{ marginLeft: LHUiUtils.GetPx(24) }} />
              </View>
            );
          } else if (typeof section.sectionHeader === 'function') {
            return section.sectionHeader();
          } else {
            return null;
          }
        }}
        keyExtractor={(item, index) => {
          if (typeof keyExtractor === 'function') {
            return keyExtractor(item, index);
          } else {
            return index;
          }
        }}
      />
    );
  }
}
export default LHPureRenderDecorator(LHStandardList);
