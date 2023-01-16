import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Modal, Pressable, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';

import {useData, useTheme} from '../hooks/';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text, Input} from '../components/';

import Timeline from 'react-native-timeline-flatlist';
import { Assets } from '@react-navigation/stack';

interface MyProps {
    carparkName: string
  }

const Articles = ({ route, navigation }) => {
  const { carparkName } = route.params;
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const {colors, gradients, sizes, assets} = useTheme();

  const timeline = [
    {time: '2 Jan 2023', title: 'Issue reported', description: ''},
    {time: '3 Jan 2023', title: 'Issue acknowledged', description: 'Description'},
    {time: '3 Jan 2023', title: 'Further details requested', description: 'Action required by you'},
    {time: '4 Jan 2023', title: 'Further details sent', description: ''},
    {time: '7 Jan 2023', title: 'Maintainence in progress...', description: ''},
    {time: '9 Jan 2023', title: 'Maintainence completed!', description: '', icon:assets.check, circleColor:'#00ff00', circleSize:30}
  ]

  const openModal = (item:any) => {
    console.log(item)
    setModalVisible(true)
  }

  // init articles
  useEffect(() => {
    setArticles(data?.articles);
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [data.articles, data.categories]);

  // update articles on category change
  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newArticles = data?.articles?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setArticles(newArticles);
    console.log(selected)
  }, [data, selected, setArticles]);

  return (
    <Block>
      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => setSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.name}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>
      {
        typeof selected != "undefined" && selected && selected.name == "All Issues" ? (
      <FlatList
        data={articles}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => `${item?.id}`}
        style={{paddingHorizontal: sizes.padding}}
        contentContainerStyle={{paddingBottom: sizes.l}}
        renderItem={({item}) => 
        (
          <TouchableOpacity onPress={ () => openModal(item)} >
          <Article {...item} />
          </TouchableOpacity>
        )
        
        }
      /> ) : null 
        }
       {
        typeof selected != "undefined" && selected && selected.name == "Add New" ? (
          <Block
                color={colors.card}
                margin={sizes.m}
                paddingTop={sizes.m}
                paddingHorizontal={sizes.padding}>
                  <Text p semibold marginBottom={sizes.s}>
                    Carpark
                  </Text>
                  <Text p marginBottom={sizes.m}>
                    {JSON.stringify(carparkName).slice(1, -1)}
                  </Text>
                <Text p semibold marginBottom={sizes.s}>
                  Issue
                </Text>
                <Block>
                  <Input placeholder="Issue" marginBottom={sizes.sm} />
                  <Text p semibold marginBottom={sizes.s}>
                  Description
                  </Text>
                  <Block>
                    <Input placeholder="Description" marginBottom={sizes.m} />
                    <Button flex={0} gradient={gradients.primary} marginBottom={sizes.base}>
                    <Text white bold transform="uppercase">
                      Submit
                    </Text>
                  </Button>
                  </Block>

                </Block>


              </Block>
        ) : null 
       }
       {/* {
        typeof selected != "undefined" && selected && selected.name == "Progress" ? (
          <Block>
            <View style={styles.container}>
              <Text p semibold marginBottom={sizes.s}>
                {JSON.stringify(carparkName).slice(1, -1)}
              </Text>
              <Text p semibold marginBottom={sizes.s}>
                      Issue #0015: xxxx
              </Text>
              <Timeline 
              style={styles.list}
              data={timeline}
              innerCircle={'icon'}
              // columnFormat='two-column'
              // isUsingFlatlist={true}
              />
            </View>
          </Block>
        ) : null
       } */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}> 
            
            <View style={styles.container}>
                <Text p semibold marginBottom={sizes.s}>
                  {JSON.stringify(carparkName).slice(1, -1)}
                </Text>
                <Text p semibold marginBottom={sizes.s}>
                        Issue #0015: xxxx
                </Text>
                <Timeline 
                style={styles.list}
                data={timeline}
                innerCircle={'icon'}
                // columnFormat='two-column'
                // isUsingFlatlist={true}
                />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>

      </Modal>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
        paddingTop:65,
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

export default Articles;
