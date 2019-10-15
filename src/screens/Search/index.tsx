import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet, TouchableOpacity, View
} from "react-native";
import MasonryList from '@appandflow/masonry-list';
import {
    Button,
    Container,
    Icon,
    Header,
    Item, Input, Text, Left, Body, Right, Content, Footer
} from "native-base";
import {colors} from "../../utils/theme";
import NestedCell from '../../components/nestedCell/index'
import CameraRoll from '@react-native-community/cameraroll';
import SearchTag from "../../components/searchTag";
import tags from "../../utils/tags";
import Modal from 'react-native-modalbox';
import {RNCamera} from "react-native-camera";
import {bool} from "prop-types";


export default class Comments extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            refreshing: false,
            setRefreshing: false,
            isModalOpen: true,
            orderedStories: null,
            selectedStory: null,
            tmpImages: null,
            images: [],
            search: '',

            camera: {
                //captureTarget: RNCamera.Constants.CaptureTarget.cameraRoll,
                type: RNCamera.Constants.Type.back,
                orientation: RNCamera.Constants.Orientation.auto,
                flashMode: RNCamera.Constants.FlashMode.auto,
            },
        };
    }

    wait = (timeout: number) => {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    };


    closeModal = () => {
        this.setState({isModalOpen: false});
    };

    openModal = () => {
        this.setState({isModalOpen: true});
    };

    onRefresh = () => {
        this.setState({setRefreshing: true});
        this.wait(2000).then(() => {
            this.setState({setRefreshing: false});
        });
    };

    goBack = () => {
        this.props.navigation.goBack();
    };

    updateSearch = (search: any) => {
        this.setState({search});
    };


    componentDidMount() {
        const fetchParams = {
            first: 25,
        };
        CameraRoll.getPhotos(fetchParams).then((data: any) => {
            const assets = data.edges;
            const images = assets.map((asset: any) => asset.node.image);
            this.setState({
                tmpImages: images,
            });
            const imgArray: any = [];
            this.state.tmpImages.forEach(function (image: any, index: number) {
                imgArray.push({uri: image.uri, id: index, height: Math.round(Math.random() * 50 + 100)})
            });
            this.setState({images: imgArray});
        }).catch((err: any) => {
            console.log("Error retrieving photos");
        });
    }

    render() {
        const {search, isModalOpen} = this.state;
        return (
            <Container>
                <Header rounded searchBar style={{borderRadius: 8, backgroundColor: colors.white, borderBottomWidth:0,paddingLeft: 8}}>
                    <Item style={{borderRadius: 8, backgroundColor: colors.exlight_gray}}>
                        <Icon name="ios-search"/>
                        <Input placeholder="Search"/>
                    </Item>
                    <Button transparent>
                        <TouchableOpacity onPress={this.openModal}>
                            <Icon type={"AntDesign"} fontSize={32} style={{color: colors.black}}
                                  name='scan1'/>
                        </TouchableOpacity>
                    </Button>
                </Header>
                <View style={{padding: 10}}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            {
                                tags.map(tag => (
                                    <SearchTag key={tag.id} id={tag.id} title={tag.text}/>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
                <MasonryList
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                    data={this.state.images}
                    renderItem={({item}) => <NestedCell item={item}/>}
                    getHeightForItem={({item}) => item.height + 2}
                    numColumns={3}
                    keyExtractor={item => item.id}
                />
                <Modal
                    style={styles.modal}
                    isOpen={isModalOpen}
                    onClosed={this.closeModal}
                    position="center"
                    swipeToClose
                    swipeArea={250}
                    backButtonClose>
                    <RNCamera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.modal}
                        aspect={this.state.camera.aspect}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        onFocusChanged={() => {
                        }}
                        onZoomChanged={() => {
                        }}
                        defaultTouchToFocus
                        mirrorImage={false}
                    >
                        <View style={{flex:1, backgroundColor:colors.extraLightRedFiltered}}>
                            <Header rounded searchBar style={{borderRadius: 8, backgroundColor: colors.transparent,borderBottomWidth:0, paddingLeft: 8}}>

                                <Left>
                                    <Button transparent>
                                        <TouchableOpacity onPress={this.closeModal}>
                                            <Icon type={"AntDesign"} fontSize={32} style={{color: colors.white}}
                                                  name='close'/>
                                        </TouchableOpacity>
                                    </Button>
                                </Left>
                                <Right>
                                    <Button transparent>
                                        <TouchableOpacity>
                                            <Icon type={"AntDesign"} fontSize={32} style={{color: colors.white}}
                                                  name='scan1'/>
                                        </TouchableOpacity>
                                    </Button>
                                </Right>
                            </Header>
                            <View style={{flex:1, justifyContent:'center' , alignItems:'center'}}>
                                <Icon type={"AntDesign"} style={{color: colors.dark_gray ,fontSize:52}}
                                      name='instagram'/>
                                <Text style={{fontWeight:'bold', marginTop:9, color:colors.dark_gray,textTransform:'uppercase',fontSize:32}}>Username</Text>
                            </View>
                            <Footer style={{height: 20, backgroundColor: colors.transparent , borderTopWidth:0}}>
                                <View style={{
                                    alignItems:'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    flex: 1
                                }}>
                                    <TouchableOpacity>
                                        <Icon type={"AntDesign"} fontSize={32} style={{color: colors.white}}
                                              name='scan1'/>
                                    </TouchableOpacity>
                                    <Text style={{color:colors.white, fontWeight:'bold', marginLeft:10}}>Go to your nametag</Text>
                                </View>
                            </Footer>
                        </View>
                    </RNCamera>
                </Modal>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    paddingContainer: {
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10
    },
    marginContainer: {
        marginTop: 16
    },
    modal: {
        height: Dimensions.get("window").height,
        width: Dimensions.get("window").width,
        flex: 1
    },
    scrollView: {},

});
