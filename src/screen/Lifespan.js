import React, { Component } from 'react'
import { Text, StyleSheet, View, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

import { db } from '../util/config';
let itemsRef = db.ref('/Tread');


export default class Lifespan extends Component {

    constructor() {
        super();
        this.state = {
            refreshing: true,
        };
    }

    componentDidMount() {
        itemsRef.once('value', snapshot => {
            let data = snapshot.val();
            let items = Object.values(data);
            this.setState({
                dataSource: items,
                refreshing: false
            });
        });
    }

    readNowBtn = (val) => {
        db.ref('/Tread/Tire' + val).update({
            Button: 1,
        });
        this.testFunc();
        this.setState({
            refreshing: true
        })
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                1000
            )
        )
    }

    async testFunc() {

        const data = await this.performTimeConsumingTask();
        if (data !== null) {
            itemsRef.once('value', snapshot => {
                let data = snapshot.val();
                let items = Object.values(data);
                this.setState({
                    dataSource: items,
                    refreshing: false
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
        if (this.state.dataSource) {
            return (
                <SafeAreaView style={{ height: '100%' }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {
                            this.state.dataSource.map((item) => {
                                return (
                                    <View key={item.tireNo} style={styles.container}>
                                        <View style={{ flexDirection: 'row', marginBottom: 7 }}>
                                            <Text style={{ marginRight: 10, fontSize: 25, fontWeight: 'bold' }}>Tire {item.tireNo}</Text>
                                            <TouchableOpacity
                                                onPress={() => this.readNowBtn(item.tireNo)}
                                                activeOpacity={0.5}
                                                style={{ backgroundColor: 'red', marginRight: 10, borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 18 }}>READ NOW</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                style={{ backgroundColor: 'red', borderRadius: 5, paddingHorizontal: 20, justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 18 }}>NEW TIRE</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 17, width: 45 }}>Then </Text><Text style={{ color: 'green', fontSize: 17 }}>: {item.Then}cm</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 17, width: 45 }}>Now </Text><Text style={{ color: 'green', fontSize: 17 }}>: {item.Now} cm</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 17 }}>Predicted Lifespan </Text><Text style={{ color: 'green', fontSize: 17 }}> : {12 - (item.Then - item.Now)} months left</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </SafeAreaView>
            )
        }
        return null
    }
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.5,
        height: 150,
        padding: 20
    },
})

const tcmsData = [
    {
        tireNo: 1,
        then: 15,
        now: 17,
        lifespan: 4
    },
    {
        tireNo: 2,
        then: 15,
        now: 17,
        lifespan: 5
    },
    {
        tireNo: 3,
        then: 15,
        now: 17,
        lifespan: 7
    },
    {
        tireNo: 4,
        then: 15,
        now: 16,
        lifespan: 6
    },
]