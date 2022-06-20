import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {ProductsContext} from '../context/ProductsContext';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> {}

export const ProductsScreen = ({navigation}: Props) => {
  const {products, loadProducts, deleteProduct} = useContext(ProductsContext);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonRight}
          onPress={() => navigation.navigate('ProductScreen', {})}>
          <Text style={{color: 'white'}}>Agregar</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const loadProductsFormBackend = async () => {
    setIsRefreshing(true);
    await loadProducts();
    setIsRefreshing(false);
  };

  const alertDelete = (nombre: string, id: string) => {
    Alert.alert('Borrar producto', `¿Desea borra el producto "${nombre}"`, [
      {
        text: 'cancelar',
        onPress: async () => {},
      },
      {
        text: 'ok',
        onPress: async () => {
          await deleteProduct(id);
          loadProductsFormBackend();
        },
      },
    ]);
  };

  return (
    <View style={{flex: 1, marginHorizontal: 10}}>
      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({item}) => (
          <View style={styles.containerItem}>
            <TouchableOpacity
              style={{
                // backgroundColor: 'red',
                flex: 1,
                justifyContent: 'center',
                height: 30,
              }}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('ProductScreen', {
                  id: item._id,
                  name: item.nombre,
                })
              }>
              <Text style={styles.productName}>{item.nombre}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{...styles.buttonRight, backgroundColor: '#fc9292'}}
              onPress={() => alertDelete(item.nombre, item._id)}>
              <Text style={{color: 'white'}}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.itemSeparator}></View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadProductsFormBackend}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    fontSize: 20,
  },
  itemSeparator: {
    borderBottomWidth: 2,
    marginVertical: 5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  buttonRight: {
    marginRight: 10,
    backgroundColor: '#5856d6',
    padding: 8,
    borderRadius: 10,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
