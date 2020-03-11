import React, { Component } from 'react'
import { Text, StyleSheet, View, Switch, ToastAndroid, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';

import { db } from '../util/config';
let itemsRef = db.ref('/Setting/Type');

export default class Setting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            switchValue: "",
            refreshing: true,
        };
    }

    componentDidMount() {
        this.getToken();
    }

    getToken = async () => {
        try {
            let type = await AsyncStorage.getItem("type");
            let noti = await AsyncStorage.getItem("notification");
            this.setState({
                checkedId: type,
                switchValue: JSON.parse(noti),
                refreshing: false
            });
        } catch (error) {
            alert(error)
        }
    }

    toggleSwitch = (value) => {
        this.setState({ switchValue: value })
        AsyncStorage.setItem('notification', JSON.stringify(value));
    }

    handleCheck = (value, index, data) => {
        let max = data[index].max;
        let min = data[index].min;
        this.setState({ selectedValue: value })
        // AsyncStorage.setItem('type', value);
        // AsyncStorage.setItem('max', JSON.stringify(max));
        // AsyncStorage.setItem('min', JSON.stringify(min));

        itemsRef.update({
            Car: value,
            Max: max,
            Min: min
        });

        ToastAndroid.show('Type of car is default to ' + value, ToastAndroid.LONG);
        this.getToken();
    }

    render() {
        const { checkedId } = this.state
        let dataType = [{
            value: 'SUV', max: 241, min: 206
        }, {
            value: 'Sedan', max: 241, min: 206
        }, {
            value: 'MPV', max: 262, min: 248
        }];

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
            <View style={styles.container}>

                <View style={{ justifyContent: 'space-between', marginBottom: 100 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Type of Car</Text>
                    <Dropdown
                        label='Please select Car'
                        data={dataType}
                        value={this.state.checkedId || this.state.label}
                        itemCount={3}
                        dropdownPosition={0.01}
                        containerStyle={styles.dropdownStyle}
                        onChangeText={(value, index, data) => { this.handleCheck(value, index, data) }}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Notification is {this.state.switchValue ? 'ON' : 'OFF'}</Text>
                    <Switch
                        onValueChange={this.toggleSwitch}
                        value={this.state.switchValue} />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        padding: 20
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },

    dropdownStyle: {
        width: '50%',
        // paddingHorizontal: 30,
    }

})
