import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';

import {useData, useTheme} from '../hooks/';
import {IArticle, ICategory} from '../constants/types';
import {Block, Button, Article, Text, Input} from '../components/';



const Articles = () => {
  const data = useData();
  const [selected, setSelected] = useState<ICategory>();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const {colors, gradients, sizes} = useTheme();

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
        renderItem={({item}) => <Article {...item} />}
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
                    Current Carpark
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
                    <Button flex={0} gradient={gradients.secondary} marginBottom={sizes.base}>
                    <Text white bold transform="uppercase">
                      Upload Image
                    </Text>
                  </Button>
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
    </Block>
  );
};

export default Articles;
