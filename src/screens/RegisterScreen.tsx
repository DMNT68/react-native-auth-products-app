import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {loginStyle} from '../theme/loginTheme';
import {useForm} from '../hooks/useForm';
import {StackScreenProps} from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> {}

export const RegisterScreen = ({navigation}: Props) => {
  const {name, email, password, onChange} = useForm({
    name: '',
    email: '',
    password: '',
  });

  const onRegister = () => {
    console.log({name, email, password});
    Keyboard.dismiss();
  };

  return (
    <>
      <Background />
      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={loginStyle.formContainer}>
          <WhiteLogo />

          <Text style={loginStyle.title}>Registro</Text>

          <Text style={loginStyle.label}>Nombre:</Text>
          <TextInput
            placeholder="Ingrese su nombre"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
            ]}
            selectionColor="white"
            autoCapitalize="words"
            value={name}
            onChangeText={value => onChange(value, 'name')}
            onSubmitEditing={onRegister}
          />
          <Text style={loginStyle.label}>Correo Electrónico:</Text>
          <TextInput
            placeholder="Ingrese su email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={value => onChange(value, 'email')}
            onSubmitEditing={onRegister}
          />

          <Text style={loginStyle.label}>Contraseña:</Text>
          <TextInput
            placeholder="Ingrese su Contraseña"
            placeholderTextColor="rgba(255,255,255,.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            secureTextEntry
            style={[
              loginStyle.inputField,
              Platform.OS === 'ios' && loginStyle.inputFieldIOS,
            ]}
            selectionColor="white"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={value => onChange(value, 'email')}
            onSubmitEditing={onRegister}
          />

          <View style={loginStyle.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyle.button}
              onPress={onRegister}>
              <Text style={loginStyle.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>

          
            <TouchableOpacity
            style={loginStyle.buttonReturn}
              activeOpacity={0.8}
              onPress={() => navigation.replace('LoginScreen')}>
              <Text style={loginStyle.buttonText}>Login</Text>
            </TouchableOpacity>
     
        </View>
      </KeyboardAvoidingView>
    </>
  );
};
