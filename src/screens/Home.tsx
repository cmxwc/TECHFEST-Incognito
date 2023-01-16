import React, {useCallback, useState} from 'react';

import {useData, useTheme, useTranslation} from '../hooks/';
// import {Block, Button, Image, Input, Product, Text} from '../components/';
import MapView from 'react-native-maps';
import { StyleSheet, View, Modal, Text, Pressable} from 'react-native';
import { useEffect } from 'react';
import carpark from '../assets/carpark.json';

import { Marker } from 'react-native-maps';

import proj4 from 'proj4';

import * as Location from 'expo-location';

type carparkInfo = {
  car_park_no: string;
  address: string;
  x_coord: number;
  y_coord: number;
  car_park_type: string;
  type_of_parking_system: string;
  short_term_parking: string;
  free_parking: string;
  night_parking: string;
  car_park_decks: number;
  gantry_height: number;
  car_park_basement: string;
};


const Home = ({ navigation }) => {
  const [coordinates] = useState([8.674252499999994, 9.0845755]);
  const [markers, setMarkers] = useState<never[] | carparkInfo[]>([]);
  const [carparkSelected, setCarparkSelected] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<any>(false);
  proj4.defs("EPSG:3414","+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");
  useEffect(() => {
    //Runs only on the first render
    
    for (var i = 0 ; i < carpark.length ; i++) {
      // console.log(carpark[i])
      var latlng = proj4("EPSG:3414").inverse([carpark[i].x_coord, carpark[i].y_coord]);
      carpark[i].x_coord = latlng[1];
      carpark[i].y_coord = latlng[0];

    }
    setMarkers(carpark)
    // console.log(markers)
  }, []);

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let closest=markers[0];
      let minDist = 1000;
      for (var i = 0; i < markers.length; i++) {
        // if this location is within 0.1KM of the user, add it to the list
        let dist = distance(location.coords.latitude, location.coords.longitude, markers[i].x_coord, markers[i].y_coord, "K") ;
        if (dist < minDist) {
          closest = markers[i];
          minDist = dist;
            
        }
      }
      
      setCarparkSelected(closest);
      setModalVisible(true);
      console.log(closest)
      console.log(location)
    })();
  }, [markers]);

  function distance(lat1:any, lon1:any, lat2:any, lon2:any, unit:any) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

  // console.log(markers)
  const [mapRegion, setmapRegion] = useState<any>(null);

  useEffect(() => {
    if (location) {
      setmapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

    }


  }, [location]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={mapRegion}>
      {markers.map((marker : any) => (

        <MapView.Marker
          pinColor={"purple"}
          key={marker.car_park_no}
          coordinate={{ latitude : marker.x_coord , longitude : marker.y_coord }}
          title={marker.address}
          description={marker.car_park_type}
          onCalloutPress={() => {
            navigation.navigate('Articles', {
              carparkName: marker.address
            })}}
        />
      ))}
      {location ? (
      <MapView.Marker
      pinColor={"red"}
      key={1}
      coordinate={{ latitude : location.coords.latitude, longitude : location.coords.longitude }}
      title={"Current location"}
    />
      ) : null }

      </MapView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}> 
            <Text style={styles.modalTitleText}>Nearest Carpark Found</Text>
            <Text style={styles.modalText}>{carparkSelected && carparkSelected.address ? carparkSelected.address : ''}</Text>
            <Text style={styles.modalText}>{carparkSelected && carparkSelected.car_park_type ? carparkSelected.car_park_type : ''}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                navigation.navigate('Articles', {
                  carparkName: carparkSelected && carparkSelected.address ? carparkSelected.address : ''
                })
                setModalVisible(!modalVisible)}}>
              <Text style={styles.textStyle}>View Carpark Details</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Select Another Carpark</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
  // const {t} = useTranslation();
  // const [tab, setTab] = useState<number>(0);
  // const {following, trending} = useData();
  // const [products, setProducts] = useState(following);
  // const {assets, colors, fonts, gradients, sizes} = useTheme();

  // const handleProducts = useCallback(
  //   (tab: number) => {
  //     setTab(tab);
  //     setProducts(tab === 0 ? following : trending);
  //   },
  //   [following, trending, setTab, setProducts],
  // );

  // return (
  //   <Block>
  //     {/* search input */}
  //     <Block color={colors.card} flex={0} padding={sizes.padding}>
  //       <Input search placeholder={t('common.search')} />
  //     </Block>

  //     {/* toggle products list */}
  //     <Block
  //       row
  //       flex={0}
  //       align="center"
  //       justify="center"
  //       color={colors.card}
  //       paddingBottom={sizes.sm}>
  //       <Button onPress={() => handleProducts(0)}>
  //         <Block row align="center">
  //           <Block
  //             flex={0}
  //             radius={6}
  //             align="center"
  //             justify="center"
  //             marginRight={sizes.s}
  //             width={sizes.socialIconSize}
  //             height={sizes.socialIconSize}
  //             gradient={gradients?.[tab === 0 ? 'primary' : 'secondary']}>
  //             <Image source={assets.extras} color={colors.white} radius={0} />
  //           </Block>
  //           <Text p font={fonts?.[tab === 0 ? 'medium' : 'normal']}>
  //             {t('home.following')}
  //           </Text>
  //         </Block>
  //       </Button>
  //       <Block
  //         gray
  //         flex={0}
  //         width={1}
  //         marginHorizontal={sizes.sm}
  //         height={sizes.socialIconSize}
  //       />
  //       <Button onPress={() => handleProducts(1)}>
  //         <Block row align="center">
  //           <Block
  //             flex={0}
  //             radius={6}
  //             align="center"
  //             justify="center"
  //             marginRight={sizes.s}
  //             width={sizes.socialIconSize}
  //             height={sizes.socialIconSize}
  //             gradient={gradients?.[tab === 1 ? 'primary' : 'secondary']}>
  //             <Image
  //               radius={0}
  //               color={colors.white}
  //               source={assets.documentation}
  //             />
  //           </Block>
  //           <Text p font={fonts?.[tab === 1 ? 'medium' : 'normal']}>
  //             {t('home.trending')}
  //           </Text>
  //         </Block>
  //       </Button>
  //     </Block>

  //     {/* products list */}
  //     <Block
  //       scroll
  //       paddingHorizontal={sizes.padding}
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={{paddingBottom: sizes.l}}>
  //       <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
  //         {products?.map((product) => (
  //           <Product {...product} key={`card-${product?.id}`} />
  //         ))}
  //       </Block>
  //     </Block>
  //   </Block>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTitleText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
export default Home;


