import React from 'react';
import { View, Text, Image } from 'react-native';
import { CardStyleInterpolators } from 'react-navigation-stack';

class Splash extends React.Component {

    static navigationOptions = {
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                2000
            )
        )
    }

    async componentDidMount() {
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
            this.props.navigation.navigate('TabNavigatorScreen');

        }
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Image
                    style={{ width: 200, height: 200 }}
                    source={require('../asset/tire.png')} />
                <Text style={styles.textStyles}>TCMS</Text>
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    textStyles: {
        color: 'green',
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 20
    }
}

export default Splash;