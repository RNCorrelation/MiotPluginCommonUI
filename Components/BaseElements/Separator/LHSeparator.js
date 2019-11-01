/**
* @module LHCommonUI/LHSeparator
* @description 横向分割线
* @property {Object} style 分割线样式
* @property {Object} separatorContainerStyle 分割线容器样式
* @example
* import { LHSeparator } from "LHCommonUI";
  <LHSeparator />
*
*/
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LHUiUtils } from 'LHCommonFunction';

const styles = StyleSheet.create({
  separatorContainer: {
    height: LHUiUtils.GetPx(0.5),
    overflow: 'hidden',
    backgroundColor: 'transparent',
    flexDirection: 'row'
  },
  separatorStyle: {
    height: LHUiUtils.MiJiaBorderWidth,
    backgroundColor: LHUiUtils.MiJiaLineColor,
    alignSelf: 'center',
    flex: 1
  }
});
export default class LHSeparator extends React.PureComponent {
  render() {
    const { style, separatorContainerStyle } = this.props;
    return Platform.select({
      android: (
        <View style={[styles.separatorContainer, separatorContainerStyle]}>
          <View style={[styles.separatorStyle, style]} />
        </View>
      ),
      ios: (
        <View style={{ flexDirection: 'row' }}>
          <View style={[styles.separatorStyle, style]} />
        </View>
      )
    });
  }
}