import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { COLORS } from '../utils/constants';
import { authService } from '../domain/auth';

export default function RegisterScreen() {
    const navigation = useNavigation<any>();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const validateFields = () => {
        const newErrors = {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!name.trim()) {
            newErrors.name = 'Nome é obrigatório.';
            isValid = false;
        }

        if (!email.trim()) {
            newErrors.email = 'E-mail é obrigatório.';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = 'Formato de e-mail inválido.';
            isValid = false;
        }

        if (!phone.trim()) {
            newErrors.phone = 'Celular é obrigatório.';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Senha é obrigatória.';
            isValid = false;
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Confirme a senha.';
            isValid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'As senhas não coincidem.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        console.log('chamou register');

        if (!validateFields()) return;

        try {

            await authService.register({
                email,
                password,
                name,
                phone_number: phone,
            });

            navigation.navigate('LoginScreen', {
                email,
                password,
                showBiometricModal: true,
            });
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar. Tente novamente.');
        }
    };

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
              <Text style={styles.title}>Cadastro</Text>

              <Input label="Nome completo" value={name} onChangeText={setName} error={errors.name} />
              <Input label="E-mail" value={email} onChangeText={setEmail} maskType="email" error={errors.email} />
              <Input label="Celular" value={phone} onChangeText={setPhone} maskType="cel-phone" error={errors.phone} />
              <Input label="Senha" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
              <Input label="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry error={errors.confirmPassword} />

              <Button title="CRIAR CONTA" variant="filled" onPress={handleRegister} />
          </ScrollView>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontFamily: 'Roboto',
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.mainText,
        marginBottom: 24,
    },
});
