import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, PermissionsAndroid, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native'
import MapView, { Marker, Callout, Circle } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { db } from '../util/config';
let itemsRef = db.ref('/Workshop');


export default class Location extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: true,
            isMapReady: false,
            hidup: 0,
            initialPosition: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0
            },
            error: null,
            mapRegion: null,
            lastLat: null,
            lastLong: null,
        };
    }

    async samplePermissionRequest() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true
            }
        } catch (err) {
            handleAlertError()
        }
    }

    componentDidMount = async () => {
        let hasLocationPermission = await this.samplePermissionRequest();
        // Instead of navigator.geolocation, just use Geolocation.
        if (hasLocationPermission) {
            Geolocation.getCurrentPosition(
                (position) => {
                    let region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }
                    this.onRegionChange(region, region.latitude, region.longitude);
                    this.getLocation();
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    getLocation = async () => {
        itemsRef.once('value', snapshot => {
            let data = snapshot.val();
            let items = Object.values(data);
            this.setState({
                dataSource: items,
                refreshing: false
            });
        });
    }

    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    onMapLayout = () => {
        this.setState({ isMapReady: true });
    }

    openGps(lat, lng, provider) {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = `${provider}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL('google.navigation:q=' + latLng);
    };

    render() {
        let latitude = this.state.lastLat;
        const healthMarker = () => (
            <View>
                <Image
                    source={require("../../src/asset/tireLocation.jpg")}
                    style={{ height: 20, width: 20 }}
                />
            </View>
        );

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
            if (latitude) {
                return (
                    <View>
                        <MapView
                            style={styles.map}
                            region={this.state.mapRegion}
                            // onRegionChange={this.onRegionChange.bind(this)}
                            onLayout={this.onMapLayout}
                            showsUserLocation={true}
                            scrollEnabled={true}
                            zoomEnabled={true}
                            pitchEnabled={true}
                            rotateEnabled={true}
                        >
                            {this.state.isMapReady && this.state.dataSource.map(workshop => (
                                <Marker
                                    key={workshop.id}
                                    coordinate={{
                                        latitude: parseFloat(workshop.latitude),
                                        longitude: parseFloat(workshop.longitude)
                                    }}
                                    title={workshop.name}
                                    description={workshop.address}
                                >
                                    {healthMarker()}
                                    <Callout
                                        onPress={() => {
                                            this.openGps(workshop.latitude, workshop.longitude, workshop.name)
                                        }}
                                    >
                                    </Callout>
                                </Marker>
                            ))}
                        </MapView>
                    </View>
                )
            }
        }
    }
}

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
    map: {
        width,
        height
    },
})
