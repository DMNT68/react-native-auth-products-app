import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {ProductsStackParams} from '../navigator/ProductsNavigator';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {useCategories} from '../hooks/useCategories';
import {useForm} from '../hooks/useForm';
import {ProductsContext} from '../context/ProductsContext';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

interface Props
  extends StackScreenProps<ProductsStackParams, 'ProductScreen'> {}

export const ProductScreen = ({navigation, route}: Props) => {
  const {id = '', name = ''} = route.params;

  const [tempUri, setTempUri] = useState<string>('');

  const {
    loadProductById,
    addProduct,
    updateProduct,
    isLoadingProd,
    uploadImage,
    isLoadingImg,
  } = useContext(ProductsContext);

  const {categories, isLoading} = useCategories();

  const {_id, categoriaId, nombre, img, onChange, setFormValue} = useForm({
    _id: id,
    categoriaId: '',
    nombre: name,
    img: '',
  });

  useEffect(() => {
    navigation.setOptions({
      title: nombre ? nombre : 'Nuevo producto',
    });
  }, [nombre]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    if (id.length === 0) return;
    const product = await loadProductById(id);
    setFormValue({
      _id: id,
      categoriaId: product.categoria._id,
      img: product.img || '',
      nombre,
    });
  };

  const saveOrUpdate = async () => {
    if (_id.length > 0) {
      console.log('press');
      updateProduct(categoriaId, nombre, id);
    } else {
      const tempCategoriaId = categoriaId || categories[0]._id;
      const newProduct = await addProduct(tempCategoriaId, nombre);
      onChange(newProduct._id, '_id');
      // onChange(newProduct.nombre, 'nombre');
      // onChange(newProduct.categoria._id, 'categoriaId');
    }
  };

  const takePhoto = async () => {
    await launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets) return;

        setTempUri(resp.assets[0].uri!);
        onChange(resp.assets[0].uri!, 'img');
        uploadImage(resp, _id);
      },
    );
  };
  const takePhotoFromGallery = async () => {
    await launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.assets) return;

        setTempUri(resp.assets[0].uri!);
        onChange(resp.assets[0].uri!, 'img');
        uploadImage(resp, _id);
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nombre del producto:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Producto"
          value={nombre}
          onChangeText={value => onChange(value, 'nombre')}
        />
        <Text style={styles.label}>Categoría:</Text>
        {isLoading ? (
          <View
            style={{
              marginVertical: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 50,
            }}>
            <ActivityIndicator color="#5856d6" size={20} />
            <Text>Cargando categorías...</Text>
          </View>
        ) : (
          <Picker
            style={styles.textInput}
            selectedValue={categoriaId}
            onValueChange={value => onChange(value, 'categoriaId')}>
            {categories.map(c => (
              <Picker.Item key={c._id} label={c.nombre} value={c._id} />
            ))}
          </Picker>
        )}
        <View style={{marginVertical: 10}}>
          <TouchableOpacity
            disabled={isLoadingProd ? true : false}
            activeOpacity={0.9}
            style={isLoading ? styles.buttonLoading : styles.button}
            onPress={saveOrUpdate}>
            <Text style={{color: 'white'}}>
              {isLoadingProd ? 'Cargando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
        {_id.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.button}
              onPress={takePhoto}>
              <Text style={{color: 'white'}}>Cámara</Text>
            </TouchableOpacity>
            <View style={{width: 10}} />
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.button}
              onPress={takePhotoFromGallery}>
              <Text style={{color: 'white'}}>Galería</Text>
            </TouchableOpacity>
          </View>
        )}
        {isLoadingImg ? (
          <View
            style={{
              marginVertical: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              height: 50,
            }}>
            <ActivityIndicator color="#5856d6" size={20} />
            <Text>Cargando Imgen...</Text>
          </View>
        ) : (
          img.length > 0 && (
            <Image
              source={{uri: img}}
              style={{marginTop: 20, width: '100%', height: 300}}
            />
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderColor: 'rgba(0,0,0,0.2)',
    height: 45,
    marginTop: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#5856d6',
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLoading: {
    backgroundColor: '#b1aff0',
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
