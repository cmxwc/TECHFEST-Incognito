import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Modal, Pressable, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {useData, useTheme, useTranslation} from '../hooks/';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text, Image} from '../components';

import Leaderboard from 'react-native-leaderboard';

const LeaderboardRank= () => {
  const {user} = useData();
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {colors, gradients, sizes, assets} = useTheme();
  const rankData = [
    {
        name: "Shawn Lee",
        location: "India",
        score : 60,
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        dt: "2022-02-10"
    },
    {
        name: "John Tay (You)",
        location: "USA",
        score : 50,
        img: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?fit=crop&w=80&q=80",
        dt: "2021-01-01"
    },
    {
        name: "Bessie Tan",
        location: "Chaina",
        score : 30,
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        dt: "2021-08-17"
    },
    {
        name: "Adella Lim",
        location: "Japan",
        score : 30,
        img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        dt: "2021-10-23"
    },
    {
        name: "Clair Sim",
        location: "London",
        score : 20,
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        dt: "2022-01-22"
    },
    {
        name: "Kameron Ang",
        location: "Canada",
        score : 10,
        img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
        dt: "2022-01-21"
    }
]

  return (
    <Block>
      
      <View style={styles.container}>
        <Text p semibold marginBottom={sizes.s}>
            Your Ranking
        </Text>

        <View style={{
                      flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                      marginBottom: 15, marginTop: 20, paddingTop: 20, paddingBottom:20, backgroundColor: colors.primary, borderRadius: 10
                  }}>
                      <Text h5 white style={{ color: 'white', fontSize: 25, flex: 1, textAlign: 'right', marginRight: 40 }}>
                          2nd
                      </Text>
                      <Image style={{ flex: .66, height: 60, width: 60, borderRadius: 60 / 2 }}
                          source={{uri: user?.avatar}} />
                      <Text h5 white style={{ color: 'white', fontSize: 25, flex: 1, marginLeft: 40 }}>
                          50pts
                      </Text>
          </View>


        <Text p semibold marginBottom={sizes.s} >
          Leaderboard Ranking
        </Text>

        <Leaderboard 
        data={rankData} 
        sortBy='score' 
        labelBy='name'
        icon='img'
        />
      </View>

    </Block>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
        paddingTop:10,
        backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width: '100%',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
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
});

export default LeaderboardRank;
