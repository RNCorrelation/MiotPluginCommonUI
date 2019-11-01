/*eslint-disable*/
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3'
  },
  leftWrap: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0
  },
  rightWrap: {
    position: 'absolute'

  },

  loader: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 1000

  },

  innerCircle: {
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row'
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  unit: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 11,
    color: '#888'
  }
});

class LHPercentageCircle extends Component {
  static propTypes = {
    color: PropTypes.string,
    bgcolor: PropTypes.string,
    innerColor: PropTypes.string,
    radius: PropTypes.number,
    percent: PropTypes.number,
    borderWidth: PropTypes.number,
    textStyle: PropTypes.array,
    disabled: PropTypes.bool,
    unit: PropTypes.string
  };

  constructor(props) {
    super(props);
    let percent = this.props.percent;
    let leftTransformerDegree = '0deg';
    let rightTransformerDegree = '0deg';
    if (percent >= 50) {
      rightTransformerDegree = '180deg';
      leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
    } else {
      if (Platform.OS === 'ios') {
        leftTransformerDegree = '0deg';
        rightTransformerDegree = percent * 3.6 + 'deg';
      } else {
        leftTransformerDegree = '0deg';
        rightTransformerDegree = -(50-percent) * 3.6 + 'deg';
      }
    }

    this.state = {
      percent: this.props.percent,
      borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : this.props.borderWidth,
      leftTransformerDegree: leftTransformerDegree,
      rightTransformerDegree: rightTransformerDegree,
      textStyle: this.props.textStyle ? this.props.textStyle : null
    };
  }

  componentWillReceiveProps (nextProps) {
    let percent = nextProps.percent;
    let leftTransformerDegree = '0deg';
    let rightTransformerDegree = '0deg';
    if (percent >= 50) {
      rightTransformerDegree = '180deg';
      leftTransformerDegree = (percent - 50) * 3.6 + 'deg';
    } else {
      if (Platform.OS == 'ios') {
        leftTransformerDegree = '0deg';
        rightTransformerDegree = percent * 3.6 + 'deg';
      } else {
        leftTransformerDegree = '0deg';
        rightTransformerDegree = -(50-percent) * 3.6 + 'deg';
      }
    }
    this.setState({
      percent: this.props.percent,
      borderWidth: this.props.borderWidth < 2 || !this.props.borderWidth ? 2 : this.props.borderWidth,
      leftTransformerDegree: leftTransformerDegree,
      rightTransformerDegree: rightTransformerDegree
    });
  }

  render () {
    const { style } = this.props;
    if (this.props.disabled) {
      return (
        <View style={[styles.circle, {
          width: this.props.radius * 2,
          height: this.props.radius * 2,
          borderRadius: this.props.radius
        }]}>
          <Text style={styles.text}>{this.props.disabledText}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.circle, {
        width: this.props.radius * 2,
        height: this.props.radius * 2,
        borderRadius: this.props.radius,
        backgroundColor: this.props.bgcolor
      }, style]}>
        <View style={[styles.leftWrap, {
          width: this.props.radius,
          height: this.props.radius * 2,
          left: 0
        }]}>
          <View style={[styles.loader, {
            left: this.props.radius,
            width:this.props.radius,
            height: this.props.radius*2,
            borderTopLeftRadius:0,
            borderBottomLeftRadius:0,
            backgroundColor:this.props.color,
            transform:[{translateX:-this.props.radius/2},{rotate:this.state.leftTransformerDegree},{translateX:this.props.radius/2}],
          }]}></View>
        </View>
        <View style={[styles.leftWrap, {
          left: this.props.radius,
          width: this.props.radius,
          height: this.props.radius * 2
        }]}>
          <View style={[styles.loader,{
            left:-this.props.radius,
            width:this.props.radius,
            height: this.props.radius*2,
            borderTopRightRadius:0,
            borderBottomRightRadius:0,
            backgroundColor: Platform.OS == 'ios' ? this.props.color : this.props.percent < 50 ? this.props.bgcolor : this.props.color,
            transform:[{translateX:this.props.radius/2},{rotate:this.state.rightTransformerDegree},{translateX:-this.props.radius/2}],
          }]}></View>
        </View>
        <View style={[styles.innerCircle, {
          width: (this.props.radius - this.state.borderWidth) * 2,
          height: (this.props.radius - this.state.borderWidth) * 2,
          borderRadius: this.props.radius - this.state.borderWidth,
          backgroundColor: this.props.innerColor
        }]}>
          <View style={{ flex: 1 }}></View>
          <View style={styles.centerText}>
            {this.props.children ? this.props.children :
              <Text style={[styles.text, this.state.textStyle]}>{this.props.percent}%</Text>}
          </View>
          <View style={styles.unit}>
              {this.props.unit ? this.props.unit : null}
          </View>
        </View>
      </View>
    );
  }
}

// set some attributes default value
LHPercentageCircle.defaultProps = {
  bgcolor: '#e3e3e3',
  innerColor: '#fff'
};

module.exports = LHPercentageCircle;