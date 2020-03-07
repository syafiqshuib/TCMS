
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text,
    Share,
    Alert, ActivityIndicator, YellowBox
} from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Notification from '../util/notification';


import { db } from '../util/config';
let itemsRef = db.ref('/Tires');

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            refreshing: true,
            items: [],
            max: '',
            min: '',
            type: ''
        };
        console.ignoredYellowBox = [
            'Setting a timer'
        ];
    }

    handleClick = (type) => {
        let msg = '';

        if (type === 'low') {
            msg = 'Your tire pressure is low';
        } else {
            msg = 'Your tire pressure is high';
        }
        Notification.configure()
            .localNotification({
                title: "TCMS",
                message: msg,
            })

    }

    async componentDidMount() {
        let max = await AsyncStorage.getItem("max");
        let min = await AsyncStorage.getItem("min");
        let type = await AsyncStorage.getItem("type");
        let noti = await AsyncStorage.getItem("notification");
        this.setState({ max: max, min: min, type: type, noti: JSON.parse(noti) })

        // const { navigation } = this.props;
        // this.focusListener = navigation.addListener('Focus', async () => {
        //     let max = await AsyncStorage.getItem("max");
        //     let min = await AsyncStorage.getItem("min");
        //     let type = await AsyncStorage.getItem("type");
        //     let noti = await AsyncStorage.getItem("notification");
        //     this.setState({ max: max, min: min, type: type, noti: JSON.parse(noti) })
        // });

        itemsRef.on('value', snapshot => {
            let data = snapshot.val();
            let items = Object.values(data);
            if (items[0].Button === 1) {
                this.checkPressure(items);
            } else {
                this.setState({ dataSource: items, refreshing: false });
            }
        });

        React.useEffect(() => {
            const { navigation } = this.props;
            const unsubscribe = navigation.addListener('focus', async () => {
                let max = await AsyncStorage.getItem("max");
                let min = await AsyncStorage.getItem("min");
                let type = await AsyncStorage.getItem("type");
                let noti = await AsyncStorage.getItem("notification");
                this.setState({ max: max, min: min, type: type, noti: JSON.parse(noti) })
            });

            return unsubscribe;
        }, [navigation]);

        return <ProfileContent />;



    }


    checkPressure = (items) => {
        console.log(this.state.noti)
        if (items[0].TirePressure >= parseInt(this.state.min) && items[0].TirePressure <= parseInt(this.state.max)) {
            Alert.alert(
                'Information',
                'Your tire pressure is ideal.'
            )
        } else if (items[0].TirePressure < parseInt(this.state.min)) {
            Alert.alert(
                'Alert!',
                'Your tire pressure is low. Please fill more than ' + this.state.min + ' kPA.'
            )
            if (this.state.noti === true) {
                this.handleClick('low')
            }
        } else if (items[0].TirePressure > parseInt(this.state.max)) {
            Alert.alert(
                'Alert!',
                'Your tire pressure is high. Please fill less than ' + this.state.max + ' kPA.'
            )
            if (this.state.noti === true) {
                this.handleClick('high')
            }
        }
        this.setState({ dataSource: items, refreshing: false });
    }

    shareBtn = async () => {
        let tire1 = this.state.dataSource[0];
        let tire2 = this.state.dataSource[1];
        let tire3 = this.state.dataSource[2];
        let tire4 = this.state.dataSource[3];

        try {
            const result = await Share.share({
                title:
                    'TCMS',
                message:
                    'Tire 1 = ' + tire1.TirePressure + ' kPA, ' + tire1.TireAirTemperature + ' C /Tire 2 = ' + tire2.TirePressure + ' kPA, ' + tire2.TireAirTemperature + ' C /Tire 3 = ' + tire3.TirePressure + ' kPA, ' + tire3.TireAirTemperature + ' C /Tire 4 = ' + tire4.TirePressure + ' kPA, ' + tire4.TireAirTemperature + ' C',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            alert(error.message);
        }
    }

    render() {
        if (this.state.refreshing) {
            return (
                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <ActivityIndicator size="large" color='red' />
                </View>
            );
        }
        return (
            <View style={styles.MainContainer}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>Type of Car : {this.state.type ? this.state.type : '-'}</Text>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <View style={styles.Thumbnail}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Tire {item.tireNo}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{item.TirePressure} kPA</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{item.TireAirTemperature} C</Text>
                            </View>
                        </View>
                    )}
                    numColumns={2}
                    keyExtractor={item => item.tireNo}
                />
                <TouchableOpacity activeOpacity={.7} onPress={() => this.shareBtn()}
                    style={{ position: 'absolute', right: 0, bottom: 0, padding: 20 }}>
                    <Fontawesome name='share-alt' size={45} ></Fontawesome>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        paddingTop: 20,
        flex: 1
    },
    Thumbnail: {
        justifyContent: 'center',
        paddingLeft: 15,
        height: 200,
        borderWidth: 1
    },
});

