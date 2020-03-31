import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text,
    Share, Linking,
    Alert, ActivityIndicator, YellowBox, SafeAreaView, ScrollView
} from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import Notification from '../util/notification';
import { useFocusEffect } from '@react-navigation/native';
import Modal from 'react-native-modalbox';

import { db } from '../util/config';
let itemsRef = db.ref('/Tires');
let itemsRefWorkshop = db.ref('/Workshop');
// let itemsRefSetting = db.ref('/Setting');

export default function Pressure() {
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState("");
    const [max, setMax] = useState("");
    const [min, setMin] = useState("");
    const [noti, setNoti] = useState("");
    const [isOpen, setIsOpen] = useState(false)
    const [datas, setDatas] = useState(null);
    const [dataWorkshop, setDataWorkshop] = useState(null);
    const [load, setLoad] = useState(false);


    useFocusEffect(
        React.useCallback(() => {
            // const fetchAsyncStorage = async () => {
            //     setLoading(true);
            //     try {
            //         const type2 = await AsyncStorage.getItem("type");
            //         const max2 = await AsyncStorage.getItem("max");
            //         const min2 = await AsyncStorage.getItem("min");
            //         const noti2 = await AsyncStorage.getItem("notification");
            //         // console.log(max2 + " " + min2 + " " + noti2)
            //         // setType(type2);
            //         // setMax(max2);
            //         // setMin(min2);
            //         // setNoti(JSON.parse(noti2));
            //         // setLoading(false);
            //         // checkPressure(max2, min2);

            //     } catch (e) {
            //         console.log(e);
            //     }
            // };

            const fetchData2 = async () => {
                setLoading(true);
                let type2 = await AsyncStorage.getItem("type");
                let max2 = await AsyncStorage.getItem("max");
                let min2 = await AsyncStorage.getItem("min");
                let noti2 = await AsyncStorage.getItem("notification");
                setType(type2);
                itemsRef.on('value', snapshot => {
                    let data = snapshot.val();
                    let items = Object.values(data);
                    setDatas(items);
                    setLoading(false);
                    checkPressure(max2, min2, items[0], noti2);
                });
            }
            fetchData2();
        }, [])
    );


    useEffect(() => {
        itemsRefWorkshop.on('value', snapshot => {
            let data = snapshot.val();
            let items = Object.values(data);
            setDataWorkshop(items);
            setLoading(false);
            setLoad(true);
        });
    }, []);

    const checkPressure = (max2, min2, ain, noti2) => {

        let status = '';
        if (ain.TirePressure >= parseInt(min2) && ain.TirePressure <= parseInt(max2)) {
            Alert.alert(
                'Information',
                'Your tire pressure is ideal.'
            )
            status = 'ideal';
        } else if (ain.TirePressure < parseInt(min2)) {
            Alert.alert(
                'Alert!',
                'Your tire pressure is low. Please fill more than ' + min2 + ' kPA. Go to nearest workshop?',
                [
                    { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => setIsOpen(true) },
                ],
                { cancelable: false }
            )
            status = 'low';
        } else if (ain.TirePressure > parseInt(max2)) {
            Alert.alert(
                'Alert!',
                'Your tire pressure is high. Please fill less than ' + max2 + ' kPA. Go to nearest workshop?',
                [
                    { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
                    { text: 'Yes', onPress: () => setIsOpen(true) },
                ],
                { cancelable: false }
            )
            status = 'high';
        }

        if (noti2) {
            console.log(status)
            // checkNotification(status)
        }
    }

    const checkNotification = (status) => {
        let msg = '';
        if (status !== 'ideal') {
            if (status === 'low') {
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
    }

    const shareBtn = async () => {
        let tire1 = datas[0];

        try {
            const result = await Share.share({
                title:
                    'TCMS',
                message:
                    'Tire 1 = ' + tire1.TirePressure + ' kPA & ' + tire1.TireAirTemperature + ' C'
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

    const openGps = (lat, lng, provider) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = `${provider}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL('google.navigation:q=' + latLng);
    };

    const closeModal = () => {
        setIsOpen(false);
    }


    if (loading) {
        return (
            <View
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <ActivityIndicator size="large" color='red' />
            </View>
        );
    }

    if (load) {
        return (
            <View style={styles.MainContainer}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>Type of Car : {type ? type : '-'}</Text>
                {/* <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>{status}</Text> */}

                <FlatList
                    data={datas}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <View style={styles.Thumbnail}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>{item.tireName}</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{item.TirePressure} kPA</Text>
                                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'green' }}>{item.TireAirTemperature} C</Text>
                            </View>
                        </View>
                    )}
                    numColumns={2}
                    keyExtractor={item => item.tireNo}
                />
                <TouchableOpacity activeOpacity={.7} onPress={() => shareBtn()}
                    style={{ position: 'absolute', right: 0, bottom: 0, padding: 20 }}>
                    <Fontawesome name='share-alt' size={40} ></Fontawesome>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} onPress={() => setIsOpen(true)}
                    style={{ position: 'absolute', left: 0, bottom: 0, padding: 20 }}>
                    <Fontawesome name='home' size={40} ></Fontawesome>
                </TouchableOpacity>
                <Modal
                    style={[styles.modal, styles.modal3]}
                    position={'center'}
                    isOpen={isOpen}
                    onClosed={() => setIsOpen(false)}>
                    <View >
                        <SafeAreaView style={{ height: '100%' }}>
                            <View
                                style={styles.buttonOk2}
                                activeOpacity={0.7}
                                onPress={() => this.closeModal()}>
                                <Text style={styles.buttonText}>
                                    List Of Workshop  </Text>
                            </View>
                            <SafeAreaView style={{ height: '80%' }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {
                                        dataWorkshop.map((workshop, id) =>
                                            (
                                                <TouchableOpacity
                                                    key={id}
                                                    activeOpacity={.7}
                                                    style={styles.container}
                                                    onPress={() => {
                                                        openGps(workshop.latitude, workshop.longitude, workshop.name)
                                                    }}
                                                >
                                                    <View style={{ justifyContent: 'center', width: '80%' }}>
                                                        <Text>{workshop.name}</Text>
                                                        <Text>{workshop.address}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'center', right: 5 }}>
                                                        <Fontawesome name='angle-right' size={40}></Fontawesome>
                                                    </View>
                                                </TouchableOpacity>
                                            ))
                                    }

                                </ScrollView>
                            </SafeAreaView>
                            <TouchableOpacity
                                style={styles.buttonOk}
                                activeOpacity={0.7}
                                onPress={() => closeModal()}>
                                <Text style={styles.buttonText}>
                                    Dismiss  </Text>
                            </TouchableOpacity>
                        </SafeAreaView>

                    </View>
                </Modal>

            </View>
        )
    }

    return null;
}

const styles = StyleSheet.create({

    container: {
        borderBottomWidth: 0.5,
        padding: 15,
        height: 80,
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    buttonOk2: {
        backgroundColor: 'red',
        width: 300,
        textAlign: 'center',
        top: 0
    },

    buttonOk: {
        backgroundColor: 'red',
        width: 300,
        textAlign: 'center',
        position: 'absolute',
        bottom: 0
    },

    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: 'white',
    },

    modal: {
        alignItems: 'center',
    },

    modal3: {
        height: 400,
        width: 300,
    },

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

