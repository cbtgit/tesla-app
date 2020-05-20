import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useIdentity } from '../App';
import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
  const [vehicle, setVehicle] = React.useState();
  const userToken = useIdentity();
  React.useEffect(() => {
    const getData = async () => {
      const data = await fetch('https://owner-api.teslamotors.com/api/1/vehicles', {
        method: 'GET',
        headers: new Headers({
          'User-Agent': 'Tesla_UA',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + userToken,
        }),
      });

      const json = await data.json();
      const vehicles = json.response.map((x) => x);
      const id = vehicles[0].id_s;
      const vehicleState = vehicles[0].state;
      console.log(vehicleState);
      const wakeUpData = await fetch(
        'https://owner-api.teslamotors.com/api/1/vehicles/' + id + '/wake_up',
        {
          method: 'POST',
          headers: new Headers({
            'User-Agent': 'Tesla_UA',
            Authorization: 'Bearer ' + userToken,
          }),
        },
      );
      const wakeUpJson = await wakeUpData.json();
      console.log(wakeUpJson);

      const vehicleData = await fetch(
        'https://owner-api.teslamotors.com/api/1/vehicles/' + id + '/vehicle_data',
        {
          method: 'GET',
          headers: new Headers({
            'User-Agent': 'Tesla_UA',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userToken,
          }),
        },
      );

      const vehicleJson = await vehicleData.json();
      const vehicle = vehicleJson.response;
      console.log(vehicle);
      setVehicle(vehicle);
    };

    getData();
  }, [userToken]);

  return (
    <View style={styles.container}>
      <Text>{vehicle ? vehicle.display_name : null}</Text>
      <Text>{vehicle ? vehicle.state : null}</Text>
      <Text>{vehicle ? vehicle.charge_state.battery_level : null}</Text>
      <Text>{vehicle ? vehicle.charge_state.battery_range : null}</Text>
      <Text>{vehicle ? vehicle.climate_state.outside_temp : null}</Text>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
