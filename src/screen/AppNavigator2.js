import React from 'react';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator, CardStyleInterpolators } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createSwitchNavigator } from 'react-navigation';
import { fromLeft, fromRight } from 'react-navigation-transitions';
import SplashScreen from './Splash';
import PressureScreen from './Pressure';
import LifeSpanScreen from './Lifespan';
import SettingScreen from './Setting';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class AppNavigator extends React.Component {
    render() {
        return <AppContainer />;
    }
}

const PressureStack = createStackNavigator(
    {
        Pressure: { screen: PressureScreen },
        Setting: { screen: SettingScreen },
    },
    {
        initialRouteName: 'Pressure',
    }
);

const LifespanStack = createStackNavigator({
    LifeSpan: { screen: LifeSpanScreen },
});

const TabNavigator = createBottomTabNavigator(
    {
        PressureTab: {
            screen: PressureStack,
            navigationOptions: {
                tabBarLabel: "Pressure",
            },
        },
        LifeSpanTab: {
            screen: LifespanStack,
            navigationOptions: {
                tabBarLabel: "Lifespan",
            },
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;

                if (routeName === 'PressureTab') {
                    iconName = 'exclamation';
                } else if (routeName === 'LifeSpanTab') {
                    iconName = 'heartbeat';
                }

                if (routeName === 'PressureTab') {
                    return <Fontawesome type='Icon' name={iconName} size={30} color={tintColor} />;
                } else if (routeName === 'LifeSpanTab') {
                    return <Fontawesome type='Icon' name={iconName} size={30} color={tintColor} />;
                }

            },

        }),
        initialRouteName: 'PressureTab',
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: '#D8D8D8',
            showLabel: true,
            style: {
                height: 50,
                backgroundColor: 'red',
                borderTopWidth: 0.8,
            },
            labelStyle: {
                marginTop: -5,
                marginBottom: 5
            }

        },
    }
);

PressureStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
        tabBarVisible = false;
    }
    return {
        tabBarVisible,
    };
};


const AppsNavigator = createAppContainer(createSwitchNavigator(
    {
        SplashScreen: SplashScreen,
        TabNavigatorScreen: TabNavigator,
    },
    {
        initialRouteName: 'SplashScreen',
    }

));

const AppContainer = createAppContainer(AppsNavigator);