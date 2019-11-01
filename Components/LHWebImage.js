import React from 'react';
import {
  View,
  Image
} from 'react-native';
import { Host } from 'miot';
import { LHPureRenderDecorator } from 'LHCommonFunction';

class LHWebImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: ''
    };
  }

  componentWillMount() {
    console.log('LHWebImageLHWebImageLHWebImageLHWebImageLHWebImageLHWebImageLHWebImage');
    this.downloadWebImage();
  }

  downloadWebImage() {
    const { source } = this.props;
    const fileName = 'lumi_teyhhhyyst.png';

    Host.file.isFileExists(fileName).then((res) => {
      console.log('file exist at path:', res);
      if (res === true) {
        this.setState({
          source: fileName
        });
      } else {
        Host.file.downloadFile(source.uri, fileName)
          .then((res1) => {
            console.log(res1);
            this.setState({
              source: res1.path
            });
          })
          .catch(() => {
          });
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { source } = this.state;
    const { style } = this.props;
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Image source={{ local: source }} style={{ width: '100%', height: '100%' }} />
      </View>

    );
  }
}

export default LHPureRenderDecorator(LHWebImage);
