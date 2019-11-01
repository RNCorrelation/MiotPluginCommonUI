/*
 * @Date: 2019-08-22 21:38:08
 * @LastEditors: Lavie
 * @LastEditTime: 2019-08-23 14:21:46
 */
import React from 'react';
import { LHPureRenderDecorator, LHUiUtils } from 'LHCommonFunction';
import { StyleSheet, View } from 'react-native';
import { LHTitleBarCustom } from 'LHCommonUI';
import LHCurve from './LHCurve';

const styles = StyleSheet.create({
  navigatorWithoutBorderBotoom: {
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  pageWhiteStyle: {
    flex: 1,
    backgroundColor: LHUiUtils.MiJiaWhite
  },
  titleStyle: {
    fontSize: LHUiUtils.GetPx(16)
  }
});
class LHCurvePage extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <View>
          <LHTitleBarCustom
            title={navigation.getParam('title')}
            titleStyle={styles.titleStyle}
            style={[styles.navigatorWithoutBorderBotoom]}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={[styles.pageWhiteStyle]}>
        <LHCurve
          type={navigation.getParam('type')}
          dateActive={navigation.getParam('dateActive')}
        />
      </View>
    );
  }
}

export default (LHPureRenderDecorator(LHCurvePage));