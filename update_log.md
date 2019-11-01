# Mijia-CommonUI-Modules 模块更新日志

## 2019-07-08 更新

### LHTitleBarCustom 更新
- 1、sdk 大于等于10021以后默认使用新版图标，图标大小由原来的84 * 84更新为120 * 120
- 2、增加 useOldIcon 属性指定使用旧版图标，默认值false
- 3、leftButtons、rightButtons 内部指定使用白色图标的属性由backBtnIcon更改为btnIconType
- 新增内置默认的x关闭图标和勾完成图标, leftButtons和rightButtons item对象的type: deafultCloseBtn/deafultCompleteBtn

### LHStandardCell
- 1、左侧选中态箭头有更新，之前的图标带白色背景，更换为标准的透明背景、尺寸由 30 * 30 改为 18 * 30
- 2、增加activeIconStyle属性控制左侧箭头样式，可通过tintColor指定箭头颜色
- 3、在右侧加入小红点，设置属性hasDot，true为显示，false为隐藏

## 2019-07-12 更新
- 1、增加 LHTitleBarCustom btn的disable状态.

## 2019-07-16 更新
- 1、增加 LHTitleBarCustom showSeparator 是否导航分割线，默认false
- 2、增加 LHSeparator 横向分割线

## 2019-07-17 更新
- 1、LHStandardCell switch 更换为米家的switch
- 2、LHStandardCell 增加switchDisabled是否禁用属性
- 3、LHStandardCell 增加switchTintColor 未选中的背景色属性
- 4、LHStandardCell 根据最新规范调整了样式，主要是边距调整

## 2019-07-17 更新
- 1、增加时间picker布局：LHDoubleStringSpinner.

## 2019-07-18 更新
- 1、LHStanddardCell 增加属性iconSourecStyle,用于处理图片样式，例如height,width,tintColor

## 2019-07-31 更新
- 1、LHStandardEmpty 包裹元素的默认高度为页面高度去掉状态栏和导航栏的高度