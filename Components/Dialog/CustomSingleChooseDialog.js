/**
 * -------具体使用请参考UserDetailsPage.js的153-167行------------
 *
 * @module CustomSingleChooseDialog
 * @description 自定义单选弹框，目的是用于替换小米给的SingleChoseDialog，
 * @property visible{boolean} : 显示弹框与隐藏
 * @property cancelable{boolean} : 点击蒙层是否隐藏当前弹框，默认为false
 * @property onDismiss{function} : 弹框消失时的回调
 * @property dataSource{array}: 要展示的选择项
 * @property showType{number}:1: 底部有取消按钮，文本居中，2：选择项选中时有小箭头，文本居左
 * @property cancel{string} 取消文本，可以不传，默认为"取消"
 * @property onConfirm(item,position) {Function}选中选择项后的回调，item:选中文本，position：文本的下标
 * @property titleStyle{object} :弹框标题样式（包括字体字体大小、颜色、边框等）
 * @property onCheck{function} :选中时的回调(可以在这个回调里保存选中项，checkedItem传的就是这个选中项)
 * @property checkedItem{string} :当前选中的选项，（一般为文本，传其他值时可能不支持）
 * @example
 * import { CustomSingleChooseDialog } from "LHCommonUI";
 *
 *  showType=1时的用法
 *  //组件调用方式
 * <CustomSingleChooseDialog
 *    title={CustomSingleChooseObj.title}
 *    visible={CustomSingleChooseObj.visible}
 *    dataSource={CustomSingleChooseObj.dataSource}
 *    showType={CustomSingleChooseObj.showType}
 *    cancel={CustomSingleChooseObj.cancel}
 *    onConfirm={CustomSingleChooseObj.onConfirm}
 *    cancelable={CustomSingleChooseObj.cancelable || false}
 *    onDismiss={() => {
            this.setState({
              CustomSingleChooseObj: Object.assign({}, CustomSingleChooseObj, { visible: false })
            });
          }}
 />
 *
 * //函数调用方式
 *LHDialogUtils.showCustomSingleChoseDialog({
 *     title,
 *     showType: 1,
 *     dataSource: [LocalizedStrings.distribution, LocalizedStrings.delete],
 *     cancelable: true,
 *     onConfirm: (obj) => {
 *       if (obj.position === 0) {
 *         selectUnassighedUser = rowData.user;
 *         this.setState({ showModal: true });
 *       } else {
 *         this.delete(rowData);
 *       }
 *     }
 *   });

 showType=2时的用法
 * //组件调用方式
 *<CustomSingleChooseDialog
 *  title={LocalizedStrings['lock.language']}
 *  onCheck={(position) => {
 *           this.setState({ checkedItem: position });
 *         }}
 *  checkedItem={this.state.checkedItem}
 *  visible={this.state.showLanguageSelect}
 *  dataSource={[LocalizedStrings.chinese, LocalizedStrings.english]}
 *  showType={2}
 *  cancel={LocalizedStrings.cancel}
 *  onConfirm={({ item, position }) => {
 *           this.setLanguage(position === 0 ? 1 : 2);
 *         }}
 *  cancelable
 *  onDismiss={() => {
 *           this.setState({
 *             showLanguageSelect: false
 *           });
 *         }}
 />
 * //函数调用方式
 *LHDialogUtils.showCustomSingleChoseDialog({
 *     title: LocalizedStrings['add.xiaomi.phone'],
 *     showType: 1, //1:底部有取消按钮，文本居中，2：选择项选中时有小箭头，文本居左
 *     dataSource: [LocalizedStrings.local_xiaomi_phone, LocalizedStrings.others_xiaomi_phone],
 *     cancelable: true,
 *     onCheck:(position) => {
            this.setState({ languageValue: position + 1 });
          }
       checkedItem:{this.state.languageValue === 2 ? LocalizedStrings.english : LocalizedStrings.chinese}
 *     onConfirm: (obj) => {
 *       // eslint-disable-next-line no-param-reassign
 *       param.isLocalPhone = obj.position === 0;
 *       this.props.navigation.navigate('StartNfcCardGuidePage', param);
 *     }
 *   });
 *
 *
 */

import React from 'react';
import {
  Image,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View, Platform, Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { LHCommonLocalizableString, LHUiUtils, LHDeviceUtils } from 'LHCommonFunction';

const { width } = Dimensions.get('window');

const marginBottomDis = LHDeviceUtils.AppHomeIndicatorHeight || LHUiUtils.GetPx(10);// iPhoneX是34，其他手机时10
export default class CustomSingleChooseDialog extends React.PureComponent {
  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    visible: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/require-default-props
    title: PropTypes.string,
    cancelable: PropTypes.bool, // 是否可以取消
    cancel: PropTypes.string, // 取消文本
    showType: PropTypes.number, // 显示样式，1：没有箭头的样式(默认)，2：有箭头样式
    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    titleStyle: PropTypes.object,
    // eslint-disable-next-line react/forbid-prop-types,react/require-default-props
    dataSource: PropTypes.array, // 所有选项
    // eslint-disable-next-line react/require-default-props
    onDismiss: PropTypes.func,

    // eslint-disable-next-line react/require-default-props
    onConfirm: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    onCheck: PropTypes.func, // 选中回调
    // eslint-disable-next-line react/forbid-prop-types
    checkedItem: PropTypes.any // 当前已选项
  };

  static defaultProps = {
    // eslint-disable-next-line react/default-props-match-prop-types
    visible: false,
    showType: 1,
    cancel: LHCommonLocalizableString.common_cancel,
    checkedItem: '', // 默认是第一个
    cancelable: false // 默认是点击遮罩不能取消
  };

  constructor (props) {
    super(props);
    this.state = {
      showModal: this.props.visible

    };
  }

  /**
   * 接收新props，
   */
  componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.visible != this.props.visible) {
      this.setState({
        showModal: nextProps.visible
        // checkedIndex: 0//为了每次重置状态，
      });
    }
  }

  /**
   *
   */
  selectItem ({ item, position }) {
    // this.setState({ selectIndex: position });
    // 为了给用户一个良好体验，100毫秒后选择框消失
    setTimeout(() => {
      this.props.onDismiss && this.props.onDismiss();// 关闭弹框，在回调函数
      this.props.onCheck && this.props.onCheck(position);// 关闭弹框，在回调函数
      this.props.onConfirm && this.props.onConfirm({
        item,
        position
      });
    }, 100);
  }

  render () {
    const {
      dataSource, onDismiss, cancelable,
      title, titleStyle, showType, cancel, checkedItem
    } = this.props;

    return (
      <Modal
        animationType="none"
        transparent
        visible={this.state.showModal}
        onRequestClose={() => {
          onDismiss && onDismiss();// 可以取消时点击Android返回键取消
        }}
        onShow={() => {
        }}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.cancelWrapper}
            onPress={() => {
              cancelable && onDismiss();// 可以取消时点击遮罩取消
            }}
          />

          <View style={styles.wrapper}>
            {/* 如果有title则显示title */}
            {title && <Text style={[styles.title, titleStyle]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>}
            {/* 可选择列表 */}
            <View style={[styles.btnWrapper]}>
              {(() => {
                const btnContent = [];
                dataSource && dataSource.length > 0 && dataSource.forEach((item, position) => {
                  btnContent.push(
                    <TouchableOpacity
                      onPress={() => {
                        this.selectItem({
                          item,
                          position
                        });
                      }}
                      key={'btnTouch' + position}
                      style={styles.btnBox}
                    >
                      {/* 默认 showType === 1，文本居中显示，showType === 2，文本居左显示，有箭头,this.state.selectIndex === index为显示当前项 */}
                      <View style={[styles.rowWrapper, showType === 1 && {
                        justifyContent: 'center',
                        paddingLeft: 0
                      }]}
                      >
                        {showType === 2 && (checkedItem != '' ? (checkedItem == item) : (position === 0))// 如果设置checkedItem，则比较checkedItem == item，否则默认选定第一个
                        && <Image
                          style={styles.img}
                          resizeMode={'contain'}
                          source={require('../../Resources/select_icon.png')}
                        />}

                        <Text
                          adjustsFontSizeToFit={false}
                          numberOfLines={2}
                          ellipsizeMode={'tail'}
                          allowFontScaling={false}
                          style={[styles.btnText]}
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                });

                if (showType === 1) { // 取消按钮
                  btnContent.push(
                    <TouchableOpacity
                      onPress={() => {
                        onDismiss();
                      }}
                      style={styles.btnBox}
                      key={'btnTouch10'}>
                      <Text
                        adjustsFontSizeToFit={false}
                        allowFontScaling={false}
                        style={{
                          fontFamily: 'System',
                          fontSize: 14,
                          color: '#666666',
                          textAlign: 'center'
                        }}>{cancel}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return btnContent;
              })()}
            </View>
          </View>

        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.4)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  wrapper: {
    alignItems: 'center',
    width: width - LHUiUtils.GetPx(20),
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: LHUiUtils.GetPx(10),
    marginRight: LHUiUtils.GetPx(10),
    marginBottom: marginBottomDis,
    backgroundColor: '#FFFFFF',
    borderRadius: 20
  },
  cancelWrapper: {
    width: '100%', //  flex: 1,都不行，一定要 width: '100%'？
    flex: 1

  },
  title: {
    ...Platform.select({
      android: {
        fontFamily: 'MI-LANTING--GBK1-Bold'// ios 会奔溃，
      }
    }),
    marginTop: LHUiUtils.GetPx(22),
    marginBottom: LHUiUtils.GetPx(23),
    fontSize: LHUiUtils.GetPx(15),
    color: '#000000',
    textAlign: 'center'
  },
  message: {
    // fontFamily: 'MI-LANTING_GB-OUTSIDE-YS',
    // width: '100%',
    paddingHorizontal: LHUiUtils.GetPx(29),
    marginTop: LHUiUtils.GetPx(23),
    marginBottom: LHUiUtils.GetPx(27),
    fontSize: LHUiUtils.GetPx(15),
    color: '#666666',
    textAlign: 'left',
    textAlignVertical: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'PingFangSC-Regular'// android 字体显示正常，ios没有垂直居中，故另外设置PingFangSC-Regular
      },
      android: {
        fontFamily: 'MI-LANTING_GB-OUTSIDE-YS'
      }
    })
  },
  btnWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center'
    // alignItems: 'center',

  },
  btnBox: {
    borderTopColor: 'rgba(0,0,0,0.15)',
    borderTopWidth: 0.5,
    width: '100%',
    // flex: 1,
    height: LHUiUtils.GetPx(50),
    justifyContent: 'center',
    alignItems: 'center'

  },
  rowWrapper: {
    paddingLeft: LHUiUtils.GetPx(38),
    width: '100%',
    paddingTop: LHUiUtils.GetPx(14),
    paddingBottom: LHUiUtils.GetPx(16),
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnText: {
    // fontFamily: 'MI-LANTING_GB-OUTSIDE-YS',
    fontSize: LHUiUtils.GetPx(15),
    color: '#000000',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'PingFangSC-Regular'// android 字体显示正常，ios没有垂直居中，故另外设置PingFangSC-Regular
      },
      android: {
        fontFamily: 'MI-LANTING_GB-OUTSIDE-YS'
      }
    })
  },
  img: {
    tintColor: '#03ace6',
    position: 'absolute',
    left: LHUiUtils.GetPx(18),
    // top: 0,  无效？
    // bottom: 0,
    marginTop: 'auto',
    marginBottom: 'auto',
    width: LHUiUtils.GetPx(8),
    height: LHUiUtils.GetPx(10)
  },
  btnLine: {
    height: LHUiUtils.GetPx(50),
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: 0.5 // 1 / PixelRatio.get()
  }

});
