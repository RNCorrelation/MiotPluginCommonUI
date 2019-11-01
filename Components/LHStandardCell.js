/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
/**
* @module LHCommonUI/LHStandardCell
* @description 标准cell
* @property {string} title 标题
* @property {number} [titleNumberOfLines] 标题最大显示行数，超出后显示...，默认不限制
* @property {Object} [titleStyle] 标题的样式
* @property {string} [description] 描述【位于标题下方】
* @property {number} [descriptionNumberOfLines] 描述最大显示行数，超出后显示...，默认不限制
* @property {string} [rightDescription] 右描述【位于右边，跟标题处于同一行】
* @property {Object} [rightDescriptionStyle] 右描述的样式
* @property {Object} [style] 最外层容器样式
* @property {Object} [rowContainerStyle] 内容容器的样式【不包含分割线】
* @property {boolean} [hasRightArrow=false] 是否有右侧箭头
* @property {Object} [rightArrowStyle] 右侧箭头样式
* @property {string} [iconSource] 标题前面的icon资源
* @property {Object} [iconSourceStyle] 图标的属性
* @property {Object} [leftIconStyle] 标题前面的icon的样式
* @property {boolean} [hasBadge=false] 是否有badge
* @property {boolean} [showBadge=false] 是否显示badge
* @property {string|number} [badge] badge的值
* @property {string} [leftArrowSource] 左侧箭头资源【cell作为选择项的时候使用】
* @property {Object} [activeIconStyle] 左侧箭头样式，可通过tintColor指定颜色
* @property {boolean} [active=false] cell作为当前选中项【cell作为选择项的时候使用】
* @property {string} [rightIconSource] 右侧图片资源
* @property {Object} [rightIconStype] 右侧图片资源样式
* @property {boolean} [hasSwitch=false] 右侧是否显示switch
* @property {boolean} [hasDot=false] 右侧是否显示Dot
* @property {boolean} [useControlledSwitch=false] 是否使用受控组件
* @property {number} [switchValue=0] switch值options: [0, 1], 1为选中态
* @property {string} [switchColor] switch选中颜色
* @property {string} [switchTintColor] switch未选中时背景颜色
* @property {boolean} [switchDisabled=false] 是否禁用，默认值 false
* @property {Function} [onSwitchChange] switch状态改变回调
* @property {boolean} [hasCheckBox=false] 右侧是否显示checkBox
* @property {boolean} [checkBoxActive=false] checkBox状态是否被选中
* @property {number} [separatorMarginLeft=24] 上下分割线左边距
* @property {boolean} [topSeparatorLine=false] 是否显示上分割线
* @property {Object} [topSeparatorStyle] 上分割线样式
* @property {boolean} [bottomSeparatorLine=false] 是否显示下分割线
* @property {Object} [bottomSeparatorStyle] 下分割线样式
* @property {boolean} [useTouchableHighlight=false] 是否显示按下态
* @property {Function} [press] 点击事件回调
* @property {Function} [longPress] 长按事件回调
* @property {number} [minimumLongPressDuration] 长按多少毫秒触发事件
* @property {number} [marginLeft=24] cell左边距
* @property {number} [marginTop=15] cell上边距
* @property {number} [marginBottom=15] cell下边距，若只设置了marginTop，则marginBottom的值为marginTop
* @property {boolean} [showSliderView] 是否显示slider view
* @property {boolean} [showWithPercent] slider的value是否显示 %
* @property {number} [valueStyle] slider的value style
* @property {number} [sliderStyle] 具体看ListItemWithSlider
* @property {number} [sliderProps] 具体看ListItemWithSlider
* @property {Function} [onSlidingComplete] slider滑动的回调
* @property {Object} [cellContainerStyle] 给cell指定高度的，应该传cellContainerStyle: { flex: 1 }
* @property {boolean} [disabled] 是否是disabled态
* @example
* import { LHStandardCell } from "LHCommonUI";
*
* <LHStandardCell
*   title="标题"
*   description="我是描述"
*   hasRightArrow
* />
*/

import React from 'react';

import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  Image,
  Dimensions
} from 'react-native';

import { LHUiUtils, LHPureRenderDecorator } from 'LHCommonFunction';
import { LHSeparator, LHPlaceHolderImage, LHSwitch } from 'LHCommonUI';
import Switch from 'miot/ui/Switch';
import { ListItemWithSlider } from 'miot/ui/ListItem';
import Images from '../../../../../miot-sdk/resources/Images';
import LHCommonIcon from '../Resources/LHCommonIcon';
import LHWebImage from './LHWebImage';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  dot: {
    width: LHUiUtils.GetPx(10),
    height: LHUiUtils.GetPx(10),
    backgroundColor: '#F05353',
    alignSelf: 'center',
    marginRight: LHUiUtils.GetPx(-4),
    borderRadius: LHUiUtils.GetPx(5),
    marginLeft: LHUiUtils.GetPx(12)
  },
  whiteBg: {
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  allContainer: {
    alignSelf: 'stretch',
    flex: 1
  },
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    minWidth: '45%'
    // flex: 1
  },
  rowContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    width: '100%'
  },
  cellContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    width: '100%'
  },
  icon: {
    marginRight: LHUiUtils.GetPx(12),
    alignSelf: 'center',
    width: LHUiUtils.GetPx(36)
  },
  iconSource: {
    width: '100%',
    height: '100%'
  },
  offlineIcon: {
    position: 'absolute',
    width: LHUiUtils.GetPx(15),
    height: LHUiUtils.GetPx(15),
    right: 0,
    bottom: 0
  },
  rightIcon: {
    marginRight: LHUiUtils.GetPx(12),
    alignSelf: 'center'
  },
  activeIcon: {
    width: LHUiUtils.GetPx(6),
    height: LHUiUtils.GetPx(10),
    alignSelf: 'center',
    tintColor: LHUiUtils.MiJiaBlue
  },
  title: {
    fontSize: LHUiUtils.GetPx(15),
    alignItems: 'stretch',
    alignSelf: 'stretch',
    textAlign: 'left',
    color: LHUiUtils.MiJiaTitleColor,
    // flex: 1,
    marginLeft: LHUiUtils.GetPx(24),
    marginTop: LHUiUtils.GetPx(14),
    marginBottom: LHUiUtils.GetPx(1),
    lineHeight: LHUiUtils.GetPx(20),
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  active: {
    color: LHUiUtils.MiJiaBlue
  },
  description: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    alignItems: 'stretch',
    alignSelf: 'stretch',
    textAlign: 'left',
    color: '#999999',
    // flex: 1,
    marginBottom: LHUiUtils.GetPx(12),
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  descTextStyle: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16),
    alignItems: 'stretch',
    alignSelf: 'stretch',
    textAlign: 'left',
    color: '#999999',
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  descContainerStyle: {
    flexDirection: 'row',
    // paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: LHUiUtils.GetPx(12)
  },
  rightDescription: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(17),
    color: '#7F7F7F',
    alignSelf: 'center',
    marginLeft: LHUiUtils.GetPx(12),
    marginRight: LHUiUtils.GetPx(-4),
    textAlign: 'right',
    fontFamily: LHUiUtils.DefaultFontFamily,
    flex: 1,
    minWidth: '12%'
  },
  noRightArrow: {
    marginRight: LHUiUtils.GetPx(24)
  },
  switch: {
    alignSelf: 'center',
    marginRight: LHUiUtils.GetPx(20)
  },
  subArrow: {
    width: LHUiUtils.GetPx(24),
    height: LHUiUtils.GetPx(24),
    marginRight: LHUiUtils.GetPx(24),
    alignSelf: 'center'
  },
  badgeText: {
    width: LHUiUtils.GetPx(16),
    height: LHUiUtils.GetPx(16),
    borderRadius: LHUiUtils.GetPx(8),
    marginRight: LHUiUtils.GetPx(12),
    backgroundColor: LHUiUtils.MiJiaBlueColor,
    alignSelf: 'center',
    justifyContent: 'center',
    color: LHUiUtils.MiJiaWhite,
    textAlign: 'center',
    overflow: 'hidden',
    fontSize: LHUiUtils.GetPx(12)

  },
  checkBox: {
    width: LHUiUtils.GetPx(20),
    height: LHUiUtils.GetPx(20),
    borderRadius: LHUiUtils.GetPx(9),
    // borderWidth: 1,
    // borderColor: '#b4b4b4',
    alignSelf: 'center',
    marginRight: LHUiUtils.GetPx(24),
    marginLeft: LHUiUtils.GetPx(12)
  },
  checkBoxActive: {
    backgroundColor: LHUiUtils.MiJiaBlue,
    borderColor: LHUiUtils.MiJiaBlue
  },
  checkBoxInner: {
    transform: [{ rotate: '-225deg' }],
    borderColor: LHUiUtils.MiJiaWhite,
    borderRightWidth: 2,
    borderTopWidth: 2,
    width: LHUiUtils.GetPx(10),
    height: LHUiUtils.GetPx(6),
    alignSelf: 'center',
    marginTop: 2,
    opacity: 0
  },
  checkBoxInnerShow: {
    opacity: 1
  },
  sliderTitleText: {
    fontSize: LHUiUtils.GetPx(15),
    color: LHUiUtils.MiJiaTitleColor,
    lineHeight: LHUiUtils.GetPx(20),
    fontFamily: LHUiUtils.DefaultFontFamily
  },
  sliderValueText: {
    fontSize: LHUiUtils.GetPx(12),
    lineHeight: LHUiUtils.GetPx(16)
  },
  sliderThumbStyle: {
    width: LHUiUtils.GetPx(24),
    height: LHUiUtils.GetPx(24),
    borderRadius: LHUiUtils.GetPx(12),
    borderWidth: LHUiUtils.MiJiaBorderWidth,
    borderColor: 'rgba(0,0,0,0.15)'
  }
});

class LHStandardCell extends React.Component {
  constructor(props) {
    super(props);
    const {
      marginLeft,
      data,
      marginTop,
      marginBottom,
      separatorMarginLeft,
      switchDisabled,
      useControlledSwitch,
      hasSwitch
    } = this.props;
    if (hasSwitch && switchDisabled && !useControlledSwitch) {
      console.warn('请指点useControlledSwitch使用LHSwitch控件，使用更优雅的disable态UI效果');
    }
    this.state = {
      marginLeft: typeof marginLeft !== 'undefined' ? marginLeft : LHUiUtils.GetPx(24),
      data: data || {},
      marginTop: typeof marginTop !== 'undefined' ? marginTop : LHUiUtils.GetPx(14),
      marginBottom: typeof marginBottom !== 'undefined' ? marginBottom : (typeof marginTop !== 'undefined' ? marginTop : LHUiUtils.GetPx(15)),
      separatorMarginLeft: this.getSeparatorMarginLeft(separatorMarginLeft)
    };
  }

  componentWillReceiveProps(data) {
    const { separatorMarginLeft } = this.state;
    if (data.separatorMarginLeft !== separatorMarginLeft) {
      this.setState({
        separatorMarginLeft: this.getSeparatorMarginLeft(data.separatorMarginLeft)
      });
    }
  }

  getSeparatorMarginLeft(separatorMarginLeft) {
    const { marginLeft } = this.props;
    return typeof separatorMarginLeft !== 'undefined' ? separatorMarginLeft : (typeof marginLeft !== 'undefined' ? marginLeft : LHUiUtils.GetPx(24));
  }

  viewOnTouched() {
    const { press } = this.props;
    const { data } = this.state;
    if (press) {
      press(data);
    }
  }

  viewOnLongPressed() {
    const { longPress } = this.props;
    const { data } = this.state;
    if (longPress) {
      longPress(data);
    }
  }

  switchIsOn(isOn) {
    const { onSwitchChange } = this.props;
    if (onSwitchChange) {
      onSwitchChange(isOn);
    }
  }


  renderDescription = () => {
    const {
      iconSource,
      active,

      description,
      descriptionNumberOfLines,
      descriptionStyle
    } = this.props;

    const {
      marginLeft
    } = this.state;

    if (!description) return null;
    const leftSty = { marginLeft: (iconSource || active) ? 0 : marginLeft };
    if (typeof description === 'function') {
      return description([styles.descContainerStyle, leftSty], styles.descTextStyle);
    }
    return (descriptionNumberOfLines ? (
      <Text
        numberOfLines={descriptionNumberOfLines}
        style={[
          styles.description,
          leftSty,
          descriptionStyle
        ]}
      >
        {description}
      </Text>
    ) : (
      <Text
        style={[
          styles.description,
          leftSty,
          descriptionStyle
        ]}
      >
        {description}
      </Text>
    ));
  };

  renderRightDescription = () => {
    const {
      rightDescription,
      hasRightArrow,
      rightDescriptionStyle
    } = this.props;

    if (typeof rightDescription === 'function') {
      return rightDescription();
    }

    return rightDescription ? (
      <Text
        numberOfLines={1}
        style={[
          styles.rightDescription, hasRightArrow ? '' : styles.noRightArrow,
          rightDescriptionStyle
        ]}
      >
        {rightDescription}
      </Text>
    ) : <View style={{ flex: 1 }} />;
  };

  render() {
    const {
      iconSource,
      isIconSourceNeedCache,
      leftIconStyle,
      showPlaceHolderImage,
      iconSourceStyle,
      hasRightArrow,
      rightArrowStyle,
      hasBadge,
      showBadge,
      badge,
      // descriptionNumberOfLines,
      active,
      leftArrowSource,
      activeTitleStyle,
      activeIconStyle,
      description,
      // descriptionStyle,
      // rightDescriptionStyle,
      rightDescription,
      rightIconSource,
      rightIconStype,
      hasSwitch,
      hasDot,
      useControlledSwitch,
      switchValue,
      switchColor,
      switchDisabled,
      switchTintColor,
      hasCheckBox,
      checkBoxActive,
      rowContainerStyle,
      titleStyle,
      title,
      titleNumberOfLines,
      style,
      topSeparatorStyle,
      topSeparatorLine,
      bottomSeparatorStyle,
      bottomSeparatorLine,
      useTouchableHighlight,
      minimumLongPressDuration,
      textContainer,
      showOfflineIcon,
      showDeletedIcon,
      showSliderView,
      showWithPercent,
      valueStyle,
      sliderStyle,
      sliderProps,
      onSlidingComplete,
      children,
      cellContainerStyle,
      disabled
    } = this.props;

    const {
      marginLeft,
      marginBottom,
      marginTop,
      separatorMarginLeft
    } = this.state;

    const offlineIcon = showDeletedIcon === true ? null : showOfflineIcon ? (
      <Image
        resizeMode="contain"
        style={styles.offlineIcon}
        source={LHCommonIcon.cellIcon.offLine}
      />
    ) : null;

    const deletedIcon = showDeletedIcon ? (
      <Image
        resizeMode="contain"
        style={styles.offlineIcon}
        source={LHCommonIcon.cellIcon.deleted}
      />
    ) : null;

    let iconImage = null;
    if (isIconSourceNeedCache) {
      iconImage = (
        <LHWebImage
          source={iconSource}
          style={styles.iconSource}
        />
      );
    } else if (iconSource) {
      iconImage = (
        <Image
          resizeMode="contain"
          key={iconSource.uri}
          style={[styles.iconSource, iconSourceStyle]}
          source={iconSource}
        />
      );
    }

    const icon = iconImage ? (
      showPlaceHolderImage ? (
        <LHPlaceHolderImage
          style={[styles.icon, { marginLeft }, leftIconStyle]}
          iconSource={iconSource}
          iconSourceStyle={iconSourceStyle}
        >
          {offlineIcon}
          {deletedIcon}
        </LHPlaceHolderImage>
      ) : (
        <View style={[styles.icon, { marginLeft }, leftIconStyle]}>
          {iconImage}
          {offlineIcon}
          {deletedIcon}
        </View>
      )
    ) : null;

    const rightArrow = hasRightArrow ? (<Image resizeMode="contain" style={[styles.subArrow, rightArrowStyle]} source={Images.common.right_arrow} />) : null;
    const badgeElement = hasBadge ? (
      <Text style={[styles.badgeText, { opacity: showBadge ? 1 : 0 }]}>{badge}</Text>
    ) : null;
    const descriptionElement = this.renderDescription();

    const activeIcon = active ? (
      <View style={{ width: LHUiUtils.GetPx(24), alignSelf: 'center' }}>
        <Image resizeMode="contain" style={[styles.activeIcon, activeIconStyle]} source={leftArrowSource || LHCommonIcon.cellIcon.rightArrow} />
      </View>
    ) : null;

    const rightDescriptionElement = this.renderRightDescription();

    const rightDotElement = hasDot ? (
      <View
        style={[
          styles.dot, hasRightArrow ? '' : styles.noRightArrow
        ]}
      />
    ) : null;

    const rightIcon = rightIconSource ? (
      <Image
        resizeMode="contain"
        style={[styles.rightIcon, hasRightArrow ? '' : styles.noRightArrow, rightIconStype]}
        source={rightIconSource}
      />
    ) : null;

    const rightSwitch = hasSwitch ? (
      <View style={{
        alignSelf: 'center',
        marginRight: LHUiUtils.GetPx(24),
        marginLeft: LHUiUtils.GetPx(12)
      }}
      >
        { useControlledSwitch ? (
          <LHSwitch
            disabled={switchDisabled || false}
            tintColor={switchTintColor || '#f0f0f0'}
            onTintColor={switchColor || LHUiUtils.MiJiaBlue}
            onValueChange={(state) => { this.switchIsOn(state); }}
            value={switchValue}
            ref={(switchBtn) => { this.switchBtn = switchBtn; }}
          />
        ) : (
          <Switch
            disabled={switchDisabled || false}
            tintColor={switchTintColor || '#f0f0f0'}
            onTintColor={switchColor || LHUiUtils.MiJiaBlue}
            onValueChange={(state) => { this.switchIsOn(state); }}
            value={switchValue}
            ref={(switchBtn) => { this.switchBtn = switchBtn; }}
          />
        )
      }
      </View>
    ) : null;

    const rightCheckbBox = hasCheckBox ? (
      <Image
        resizeMode="contain"
        style={styles.checkBox}
        source={checkBoxActive ? LHCommonIcon.cellIcon.checkActive : LHCommonIcon.cellIcon.checkNotActive}
      />
    ) : null;
    const titleS = [
      styles.title,
      { marginBottom: description ? 1 : (iconSource ? LHUiUtils.GetPx(20) : marginBottom) },
      { marginTop: description ? LHUiUtils.GetPx(10) : (iconSource ? LHUiUtils.GetPx(19) : marginTop) },
      active ? typeof activeTitleStyle === 'undefined' ? styles.active : activeTitleStyle : '',
      // activeTitleStyle,
      { marginLeft: (iconSource || active) ? 0 : marginLeft },
      titleStyle
    ];
    const titleEle = title ? (titleNumberOfLines ? (
      <Text
        numberOfLines={titleNumberOfLines}
        style={titleS}
      >
        {title}
      </Text>
    ) : (
      <Text style={titleS}>
        {title}
      </Text>
    )) : null;
    let content = (
      <View style={[styles.rowContainer, { opacity: disabled ? 0.3 : 1 }, rowContainerStyle]}>
        {activeIcon}
        {icon}
        <View style={[
          styles.textContainer,
          {
            maxWidth: ((width
              - LHUiUtils.GetPx(24)
              - (icon ? (((leftIconStyle && StyleSheet.flatten(leftIconStyle).width) || LHUiUtils.GetPx(36)) + LHUiUtils.GetPx(12)) : 0)
              - (activeIcon ? LHUiUtils.GetPx(6) : 0)
              - (rightDescription ? width * 0.12 + LHUiUtils.GetPx(12) : 0)
              - (rightSwitch ? (LHUiUtils.GetPx(44) + LHUiUtils.GetPx(20)) : 0)
              - (rightCheckbBox ? (LHUiUtils.GetPx(20) + LHUiUtils.GetPx(12)) : 0)
              - (rightArrow ? LHUiUtils.GetPx(24) : 0)
              - (rightDotElement ? LHUiUtils.GetPx(10) + LHUiUtils.GetPx(12) : 0)
              - (rightIcon ? ((rightIconStype && StyleSheet.flatten(rightIconStype).width) || LHUiUtils.GetPx(20)) + LHUiUtils.GetPx(12) : 0)
              - LHUiUtils.GetPx(24)
              - LHUiUtils.GetPx(3)
            ) / width) * 100 + '%'
          },
          textContainer
        ]}
        >
          {titleEle}
          {descriptionElement}
        </View>

        {rightDescriptionElement}
        {rightDotElement}
        {rightIcon}
        {badgeElement}
        {rightSwitch}
        {rightCheckbBox}
        {rightArrow}
      </View>
    );
    if (useTouchableHighlight && !disabled) {
      content = (
        <TouchableHighlight
          style={[styles.cellContainer, styles.whiteBg, cellContainerStyle]}
          onPress={() => { this.viewOnTouched(); }}
          onLongPress={() => { this.viewOnLongPressed(); }}
          delayLongPress={minimumLongPressDuration || 500}
          underlayColor={LHUiUtils.MiJiaCellSelBgColor}
          activeOpacity={1}
        >
          {content}
        </TouchableHighlight>
      );
    } else {
      content = (
        <TouchableWithoutFeedback
          style={[
            styles.cellContainer,
            cellContainerStyle
          ]}
          onPress={() => { this.viewOnTouched(); }}
          onLongPress={() => { this.viewOnLongPressed(); }}
          delayLongPress={minimumLongPressDuration || 500}
        >
          {content}
        </TouchableWithoutFeedback>
      );
    }
    if (showSliderView) {
      content = (
        <ListItemWithSlider
          title={title}
          containerStyle={Object.assign({}, { paddingHorizontal: LHUiUtils.GetPx(24), height: LHUiUtils.GetPx(105) }, rowContainerStyle)}
          sliderStyle={StyleSheet.flatten([{ thumbStyle: styles.sliderThumbStyle }, sliderStyle])}
          titleStyle={StyleSheet.flatten([styles.sliderTitleText, titleStyle, { marginRight: LHUiUtils.GetPx(2) }])} // 增加边距，下同
          valueStyle={StyleSheet.flatten([styles.sliderValueText, valueStyle, { marginLeft: LHUiUtils.GetPx(2) }])}
          showSeparator={false}
          showWithPercent={typeof showWithPercent === 'undefined' ? false : showWithPercent}
          sliderProps={sliderProps}
          onSlidingComplete={onSlidingComplete}
        />
      );
    }
    return (
      <View style={[
        { width: '100%' },
        styles.whiteBg,
        style
      ]}
      >
        <LHSeparator
          style={[
            { opacity: topSeparatorLine ? (disabled ? 0.3 : 1) : 0, alignSelf: 'flex-start' },
            { marginLeft: separatorMarginLeft }, topSeparatorStyle
          ]}
        />
        {children || content}
        <LHSeparator
          style={[
            { opacity: bottomSeparatorLine ? (disabled ? 0.3 : 1) : 0, alignSelf: 'flex-start' },
            { marginLeft: separatorMarginLeft }, bottomSeparatorStyle
          ]}
        />
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHStandardCell);
