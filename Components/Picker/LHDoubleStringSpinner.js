import React from 'react';
import { View } from 'react-native';
import { StringSpinner } from 'miot/ui';
import { LHCommonLocalizableString, LHPureRenderDecorator, LHUiUtils } from 'LHCommonFunction';

const totalMin = new Array(60).toString().split(',').map((item, index) => {
  if (index < 10) {
    return '0' + String(index);
  }
  return String(index);
});
const totalHour = new Array(24).toString().split(',').map((item, index) => {
  if (index < 10) {
    return '0' + String(index);
  }
  return String(index);
});

class LHDoubleStringSpinner extends React.Component {
  static defaultProps = {
    height: LHUiUtils.GetPx(264),
    textColor: '#B2B2B2',
    selectTextColor: '#00BEFF',
    fontSize: 21,
    selectFontSize: 28,
    rowHeight: LHUiUtils.GetPx(70),
    houtUnit: LHCommonLocalizableString.common_date_hour,
    minUnit: LHCommonLocalizableString.common_date_minute,
    defaultHourValue: '0',
    defaultMinValue: '0',
    unitTextColor: '#00BEFF',
    backgroundColor: '#ffffff',
    onMinChanged() {},
    onHourChanged() {}
  }

  render() {
    const {
      height,
      textColor,
      selectTextColor,
      fontSize,
      selectFontSize,
      rowHeight,
      houtUnit,
      minUnit,
      unitTextColor,
      backgroundColor,
      onHourChanged,
      onMinChanged,
      defaultHourValue,
      defaultMinValue
    } = this.props;

    const defaultHour = ('0' + defaultHourValue).slice(-2);
    const defaultMin = ('0' + defaultMinValue).slice(-2);
    return (

      <View style={{ flexDirection: 'row', height }}>
        <StringSpinner
          style={{
            flex: 1,
            height,
            backgroundColor
          }}
          dataSource={totalHour}
          defaultValue={defaultHour}
          pickerInnerStyle={{
            textColor,
            selectTextColor,
            fontSize,
            selectFontSize,
            rowHeight,
            unit: houtUnit,
            unitTextColor
          }}
          onValueChanged={(data) => { onHourChanged(data); }}
        />
        <StringSpinner
          style={{
            height,
            flex: 1,
            backgroundColor
          }}
          dataSource={totalMin}
          defaultValue={defaultMin}
          pickerInnerStyle={{
            textColor,
            selectTextColor,
            fontSize,
            selectFontSize,
            rowHeight,
            unit: minUnit,
            unitTextColor
          }}
          onValueChanged={(data) => { onMinChanged(data); }}
        />
      </View>

    );
  }
}


export default LHPureRenderDecorator(LHDoubleStringSpinner);
