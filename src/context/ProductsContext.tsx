import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {ImagePickerResponse} from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import {Producto, ProductsResponse} from '../interfaces/appInterfaces';

type ProductsContextProps = {
  products: Producto[];
  loadProducts: () => Promise<void>;
  addProduct: (categoryId: string, productName: string) => Promise<Producto>;
  updateProduct: (
    categoryId: string,
    productName: string,
    productId: string,
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loadProductById: (productId: string) => Promise<Producto>;
  uploadImage: (data: ImagePickerResponse, id: string) => Promise<void>;
  isLoadingProd: boolean;
  isLoadingImg: boolean;
};

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({children}: any) => {
  const [products, setProducts] = useState<Producto[]>([]);
  const [isLoadingProd, setIsLoadingProd] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const resp = await cafeApi.get<ProductsResponse>(`/productos?limite=50`);
    setProducts([...resp.data.productos]);
  };

  const addProduct = async (
    categoryId: string,
    productName: string,
  ): Promise<Producto> => {
    setIsLoadingProd(true);
    const resp = await cafeApi.post<Producto>('/productos', {
      nombre: productName,
      categoria: categoryId,
    });
    setProducts([...products, resp.data]);
    setIsLoadingProd(false);
    return resp.data;
  };

  const updateProduct = async (
    categoryId: string,
    productName: string,
    productId: string,
  ) => {
    setIsLoadingProd(true);
    try {
      console.log({productName, categoryId, productId});
      const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
        nombre: productName,
        categoria: categoryId,
      });
      setProducts(
        products.map(prod => (prod._id === productId ? resp.data : prod)),
      );
    } catch (error) {
      console.log('error-->', error);
      setIsLoadingProd(false);
    }
    setIsLoadingProd(false);
  };

  const deleteProduct = async (productId: string) => {
    setIsLoadingProd(true);
    try {
      const resp = await cafeApi.delete<Producto>(`/productos/${productId}`);
      setIsLoadingProd(false);
    } catch (error: any) {
      setIsLoadingProd(false);
      Alert.alert('Alerta', error.response.data.msg, [
        {
          text: 'ok',
          onPress: async () => {},
        },
      ]);
    }
  };

  const loadProductById = async (productId: string): Promise<Producto> => {
    setIsLoadingProd(true);
    const resp = await cafeApi.get<Producto>(`/productos/${productId}`);
    setIsLoadingProd(false);
    return resp.data;
  };

  const uploadImage = async (data: ImagePickerResponse, id: string) => {
    setIsLoadingImg(true);
    const fileUpload = {
      uri: data.assets![0].uri,
      type: data.assets![0].type,
      name: data.assets![0].fileName,
    };

    const formData = new FormData();
    formData.append('archivo', fileUpload);

    try {
      console.log('--->', id, fileUpload, formData);
      const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: () => {
          return formData;
        },
      });

      console.log('--->', resp);
      setIsLoadingImg(false);
    } catch (error) {
      console.log('error-->', error);
      setIsLoadingImg(false);
      Alert.alert('Alerta', 'No se pudo guardar la imagen', [
        {
          text: 'ok',
          onPress: async () => {},
        },
      ]);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        loadProductById,
        uploadImage,
        isLoadingProd,
        isLoadingImg,
      }}>
      {children}
    </ProductsContext.Provider>
  );
};
