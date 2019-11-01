/**
* @module LHCommonUI/LHReplaceIconPage
* @description 选择页面，使用需要在路由中注入
* @param {Object} params 进入页面传参
* @param {string} params.title 页面标题
* @param {string} [params.selectedColor=LHUiUtils.MiJiaBlue] 页面选中项背景色、弹窗确定按钮的颜色值
* @param {boolean} [params.hasSaveButton=false] 导航栏是否有保存按钮
* @param {Function} [params.saveButtonPress] 导航栏保存按钮点击回调，返回参数 (selectedItem,instance)，通过instance.goBack()可返回，instance.setSelectedItem(value)可以改变页面的选中值
* @param {Function} [params.backFunction] 返回按钮点击回调，不传默认返回上一页，返回参数 (selectedItem,instance)，通过instance.goBack()可返回，instance.setSelectedItem(value)可以改变页面的选中值
* @param {boolean} [params.exitQuery] 返回是否需要弹窗确认
* @param {boolean} [params.exitQueryText=确认放弃本次操作？] 返回弹窗确认文案
* @param {string|number} [params.selectedItem] 当前选中选中项
* @param {Function} [params.itemPress] 每一项点击回调，返回参数 (newItem, oldItem,instance)，通过instance.goBack()可返回，instance.setSelectedItem(value)可以改变页面的选中值
* @param {Object[]} params.pageData 页面数据
* @param {string} params.pageData.title 选项标题
* @param {string} params.pageData.type 选项的类型，唯一性，选中项根据这个判断
* @param {string} params.pageData.image 选项的图片资源
* @param {Function} [params.pageWillExit] 页面将要退出时的回调，返回参数 (selectedItem)
* @example
*
import {
  LHReplaceIconPage
} from 'LHCommonUI';

将LHReplaceIconPage注入页面路由

const { navigation } = this.props;
navigation.navigate('LHReplaceIconPage', {
  hasSaveButton: true,
  saveButtonPress: (selectedItem, instance) => {
    console.log(selectedItem);
    instance.goBack();
  },
  itemPress: (newItem, oldItem, instance) => {
    // instance.setSelectedItem(oldValue);
  },
  // backFunction: (selectedItem, instance) => {
  //   console.log(selectedItem);
  //   instance.goBack();
  // },
  exitQuery: true,
  title: '更换图标',
  selectedItem: {
    type: 'cooker',
    title: '厨房',
    image: Resources.replaceIconPage.cooker
  },
  pageData: [{
    type: 'fan',
    title: '风扇',
    image: Resources.replaceIconPage.fan
  },
  {
    type: 'cooker',
    title: '厨房',
    image: Resources.replaceIconPage.cooker
  },
  {
    type: 'tablelamp',
    title: '台灯',
    image: Resources.replaceIconPage.tablelamp
  },
  {
    type: 'router',
    title: '厨房',
    image: Resources.replaceIconPage.router
  },
  {
    type: 'tv',
    title: '电视',
    image: Resources.replaceIconPage.tv
  }]
});
*/
import React from 'react';
import {
  StyleSheet,
  View,
  BackHandler,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { BoxShadow } from 'react-native-shadow';
import {
  LHTitleBarCustom,
  LHText
} from 'LHCommonUI';
import {
  LHUiUtils,
  LHDialogUtils,
  LHCommonLocalizableString,
  LHPureRenderDecorator,
  LHDeviceUtils
} from 'LHCommonFunction';

const { width } = Dimensions.get('window');
const itemWidth = (width - LHUiUtils.GetPx(10.5) * 2 - LHUiUtils.GetPx(6.5) * 2 * 3) / 3;
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: LHUiUtils.GetPx(10.5),
    backgroundColor: '#fafafa'
  },
  cardStyle: {
    width: itemWidth,
    height: itemWidth
  },
  itemShape: {
    width: itemWidth,
    height: itemWidth,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: LHUiUtils.GetPx(5),
    shadowOffset: { width: 0, height: LHUiUtils.GetPx(3) },
    borderRadius: 4
  },
  margin: {
    marginHorizontal: LHUiUtils.GetPx(6.5),
    marginVertical: LHUiUtils.GetPx(6.5)
  },
  cellTitle: {
    fontSize: LHUiUtils.GetPx(12, 360, 320),
    lineHeight: LHUiUtils.GetPx(16, 360, 320),
    width: '100%',
    textAlign: 'center',
    color: '#666'
  },
  selectedCellTitle: {
    color: '#fff'
  },
  cellImage: {
    height: LHUiUtils.GetPx(40),
    width: LHUiUtils.GetPx(40)
  },
  selectedCellImage: {
    tintColor: '#fff'
  },
  cellView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: LHUiUtils.GetPx(20, 360, 320),
    paddingBottom: LHUiUtils.GetPx(10),
    paddingHorizontal: LHUiUtils.GetPx(10),
    backgroundColor: '#fff',
    borderRadius: LHUiUtils.GetPx(4)
  }
});

class LHReplaceIconPage extends React.Component {
  static navigationOptions = () => {
    return {
      header: null
    };
  }

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.selectedColor = navigation.getParam('selectedColor') || LHUiUtils.MiJiaBlue;
    this.state = {
      selectedItem: navigation.getParam('selectedItem') || {}
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const exitQuery = navigation.getParam('exitQuery');
    // 有修改时点击返回时弹窗询问
    if (exitQuery) {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.goBackTrigger();
        return true;
      });
    }
  }

  componentWillUnmount() {
    const {
      navigation
    } = this.props;
    const pageWillExit = navigation.getParam('pageWillExit');

    if (typeof pageWillExit === 'function') {
      const { selectedItem } = this.state;
      pageWillExit(selectedItem);
    }
    if (this.backHandler) this.backHandler.remove();
  }

  goBack() {
    const {
      navigation
    } = this.props;
    navigation.goBack();
  }

  back() {
    const {
      navigation
    } = this.props;
    const backFunction = navigation.getParam('backFunction');
    if (typeof backFunction === 'function') {
      const { selectedItem } = this.state;
      backFunction(selectedItem, this);
    } else {
      this.goBack();
    }
  }

  goBackTrigger() {
    const { selectedItem } = this.state;
    const {
      navigation
    } = this.props;
    const exitQuery = navigation.getParam('exitQuery');
    if (exitQuery && selectedItem.type !== (navigation.getParam('selectedItem') || {}).type) {
      const exitQueryText = navigation.getParam('exitQueryText');
      LHDialogUtils.MessageDialogShow({
        message: exitQueryText || LHCommonLocalizableString.common_tips_discard_operation, // 确认放弃本次操作？
        confirm: LHCommonLocalizableString.common_ok,
        confirmStyle: {
          color: this.selectedColor
        },
        onConfirm: () => {
          this.back();
        },
        cancel: LHCommonLocalizableString.common_cancel,
        onCancel: () => {}
      });
    } else {
      this.back();
    }
  }

  itemPress(newItem) {
    this.setSelectedItem(newItem);
    const {
      navigation
    } = this.props;
    const itemPress = navigation.getParam('itemPress');
    if (typeof itemPress === 'function') {
      itemPress(newItem, navigation.getParam('selectedItem'), this);
    }
  }

  setSelectedItem(selectedItem) {
    this.setState({
      selectedItem
    });
  }

  renderItem(item, index) {
    console.log(item);
    if (!item) {
      return <View />;
    }
    const { selectedItem } = this.state;
    const isItemSelected = selectedItem && (selectedItem.type === item.type);
    const cardStyle = StyleSheet.flatten(styles.itemShape);
    const shadowOption = {
      width: cardStyle.width,
      height: cardStyle.height,
      color: cardStyle.shadowColor,
      border: cardStyle.shadowRadius,
      radius: cardStyle.borderRadius,
      opacity: cardStyle.shadowOpacity,
      x: cardStyle.shadowOffset.width,
      y: cardStyle.shadowOffset.height,
      style: StyleSheet.flatten(styles.margin)
    };
    let content = (
      <TouchableWithoutFeedback
        style={[styles.itemShape]}
        onPress={() => {
          this.itemPress(item, index);
        }}
      >
        <View
          style={[styles.itemShape, styles.cellView, isItemSelected ? { backgroundColor: this.selectedColor } : null]}
        >
          <Image
            style={[styles.cellImage, isItemSelected ? styles.selectedCellImage : null]}
            source={item.image}
          />
          <LHText
            style={[styles.cellTitle, isItemSelected ? styles.selectedCellTitle : null]}
            numberOfLines={2}
          >
            {item.title}
          </LHText>
        </View>
      </TouchableWithoutFeedback>
    );
    if (Platform.OS === 'android') {
      content = (
        <BoxShadow
          setting={shadowOption}
        >
          {content}
        </BoxShadow>
      );
    } else {
      content = (
        <View
          key={'replaceIcon_' + index}
          style={[styles.itemShape, styles.margin]}
        >
          {content}
        </View>
      );
    }
    return content;
  }

  getPageData() {
    const { navigation } = this.props;
    const pageData = navigation.getParam('pageData') || [];
    const data = [];
    for (let i = 0, len = pageData.length; i < Math.ceil(len / 3) * 3; i += 1) {
      if (i > len - 1) {
        data.push(null);
      } else {
        data.push(pageData[i]);
      }
    }
    return data;
  }

  render() {
    const {
      navigation
    } = this.props;
    const {
      selectedItem
    } = this.state;
    const hasSaveButton = navigation.getParam('hasSaveButton');
    const saveButtonPress = navigation.getParam('saveButtonPress');
    const oldselectedItem = navigation.getParam('selectedItem');
    return (
      <View style={[{
        flex: 1,
        backgroundColor: '#f7f7f7'
      }]}
      >
        <LHTitleBarCustom
          title={navigation.getParam('title') || ''}
          showSeparator
          leftButtons={[{
            type: 'deafultCloseBtn',
            press: () => {
              this.goBackTrigger();
            }
          }]}
          rightButtons={
            hasSaveButton ? [{
              type: 'deafultCompleteBtn',
              disable: (oldselectedItem || {}).type === selectedItem.type,
              press: () => {
                const { selectedItem: newSelectedItem } = this.state;
                if ((oldselectedItem || {}).type !== newSelectedItem.type) {
                  if (typeof saveButtonPress === 'function') {
                    saveButtonPress(newSelectedItem, this);
                  }
                }
              }
            }] : null
          }
        />
        <FlatList
          style={styles.MainContainer}
          contentContainerStyle={{ paddingBottom: LHDeviceUtils.AppHomeIndicatorHeight || LHUiUtils.GetPx(10) }}
          data={this.getPageData()}
          renderItem={({ item, index }) => {
            return this.renderItem(item, index);
          }}
          numColumns={3}
          extraData={this.state}
          keyExtractor={(_, index) => { return index.toString(); }}
        />
      </View>
    );
  }
}
export default LHPureRenderDecorator(LHReplaceIconPage);