import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

import { db } from '../util/config';
let itemsRef = db.ref('/Tread');


export default class Lifespan extends Component {

    constructor() {
        super();
        this.state = {
            refreshing: true,
            thenVal: 0,
            nowVal: 0,

        };
    }

    componentDidMount() {
        itemsRef.once('value', snapshot => {
            let data = snapshot.val();
            let items = Object.values(data);
            this.setState({
                tireNo: items[0].tireNo,
                thenVal: items[0].Then.toFixed(1),
                nowVal: items[0].TireTread.toFixed(1),
                tireName: items[0].tireName,
                refreshing: false
            });
        });
    }

    readNowBtn = (val) => {
        this.setState({
            refreshing: true
        })
        db.ref('/Tread/Tire' + val).update({
            Button: 1,
        });
        this.returnReadNow();
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                5000
            )
        )
    }

    async returnReadNow() {

        const data = await this.performTimeConsumingTask();
        if (data !== null) {
            if (this.state.thenVal != 0) {
                itemsRef.once('value', snapshot => {
                    let data = snapshot.val();
                    let items = Object.values(data);

                    var degradationRate = (items[0].Then - 1.5875) / 3;
                    var lifeSpan = (1 / degradationRate.toFixed(3)) * (items[0].TireTread - 1.5875) * (365 / 1);

                    this.setState({
                        tireNo: items[0].tireNo,
                        thenVal: items[0].Then.toFixed(1),
                        nowVal: items[0].TireTread.toFixed(1),
                        predictLifeSpan: lifeSpan.toFixed(1),
                        refreshing: false
                    });
                });
            } else {
                alert('Plese click New Tire Button')
                this.setState({
                    refreshing: false
                });
            }
        }
    }

    newTireBtn = (val) => {
        this.setState({
            refreshing: true
        })
        db.ref('/Tread/Tire' + val).update({
            Button: 1,
        });
        this.returNewTire(val);
    }

    async returNewTire(val) {
        const data = await this.performTimeConsumingTask();
        if (data !== null) {
            itemsRef.once('value', snapshot => {
                let data = snapshot.val();
                let items = Object.values(data);

                var degradationRate = (items[0].TireTread - 1.5875) / 3;
                var lifeSpan = (1 / degradationRate.toFixed(3)) * (items[0].TireTread - 1.5875) * (365 / 1);

                this.setState({
                    tireNo: items[0].tireNo,
                    thenVal: items[0].TireTread.toFixed(1),
                    nowVal: items[0].TireTread.toFixed(1),
                    predictLifeSpan: lifeSpan.toFixed(1),
                    refreshing: false
                });
                db.ref('/Tread/Tire' + val).update({
                    Then: items[0].TireTread,
                });
            });
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
        // if (this.state.tireNo) {
        return (
            <SafeAreaView style={{ height: '100%' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* { */}
                    {/* this.state.dataSource.map((item) => {
                                return ( */}
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>{this.state.tireName}</Text>

                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: {this.state.thenVal} mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: {this.state.nowVal} mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : {this.state.predictLifeSpan ? this.state.predictLifeSpan : 0} days left</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => this.readNowBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', marginRight: 10, borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>READ NOW</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.newTireBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>NEW TIRE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>FRONT RIGHT</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 days left</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => this.readNowBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', marginRight: 10, borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>READ NOW</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.newTireBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>NEW TIRE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>REAR LEFT</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 days left</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => this.readNowBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', marginRight: 10, borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>READ NOW</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.newTireBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>NEW TIRE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>REAR RIGHT</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 7.9 mm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 days left</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={() => this.readNowBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', marginRight: 10, borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>READ NOW</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.newTireBtn(1)}
                                activeOpacity={0.5}
                                style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>NEW TIRE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* )
                            }) */}
                    {/* } */}
                </ScrollView>
            </SafeAreaView>
        )
        // }
        // return null
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.5,
        height: 190,
        padding: 20
    },
})
