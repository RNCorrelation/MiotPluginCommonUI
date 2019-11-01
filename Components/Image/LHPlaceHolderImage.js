/**
* @module LHCommonUI/LHPlaceHolderImage
* @description 占位图组件
* @property {string} source 图片资源
* @property {object} [iconSourceStyle] 作用于图片资源上的样式
* @property {Object} [style] 图片包裹容器样式
* @example
* import { LHPlaceHolderImage } from "LHCommonUI";
*
* <LHPlaceHolderImage
*   source={require('图片资源路径')}
* />
*/
import React from 'react';
import {
  Image,
  View
} from 'react-native';

import { LHPureRenderDecorator } from 'LHCommonFunction';
import LHCommonIcon from '../../Resources/LHCommonIcon';

class LHPlaceHolderImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPlaceHolder: true
    };
  }

  componentWillReceiveProps(data) {
    if (!data.iconSource || !data.iconSource.uri) {
      this.setState({
        showPlaceHolder: true
      });
    }
  }

  render() {
    const {
      style,
      iconSource,
      iconSourceStyle,
      children
    } = this.props;
    const { showPlaceHolder } = this.state;
    const iconSourceImage = iconSource.uri ? (
      <Image
        resizeMode="contain"
        key={iconSource.uri}
        style={[{ width: '100%', height: '100%' }, iconSourceStyle, { opacity: !showPlaceHolder ? 1 : 0 }]}
        source={iconSource}
        onLoad={() => {
          this.setState({
            showPlaceHolder: false
          });
        }}
        onError={() => {
          this.setState({
            showPlaceHolder: true
          });
        }}
      />
    ) : null;
    return (
      <View style={style}>
        <Image
          resizeMode="contain"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: showPlaceHolder ? 1 : 0
          }}
          source={LHCommonIcon.deviceIcon.default}
        />
        <View style={{ width: '100%', height: '100%' }}>
          {iconSourceImage}
          {children}
        </View>
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHPlaceHolderImage);
