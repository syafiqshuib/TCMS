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
                thenVal: items[0].Then,
                nowVal: items[0].TireTread,
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
                    this.setState({
                        tireNo: items[0].tireNo,
                        thenVal: items[0].Then,
                        nowVal: items[0].TireTread,
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
                this.setState({
                    tireNo: items[0].tireNo,
                    thenVal: items[0].TireTread,
                    nowVal: items[0].TireTread,
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
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>Tire {this.state.tireNo}</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: {this.state.thenVal} cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: {this.state.nowVal} cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : {this.state.thenVal ? this.state.thenVal - this.state.nowVal : 0} months left</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>Tire 2</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 months left</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>Tire 3</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 months left</Text>
                        </View>
                    </View>
                    <View style={styles.container}>
                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>Tire 4</Text>
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
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: 30 cm</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : 0 months left</Text>
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
        height: 150,
        padding: 20
    },
})
