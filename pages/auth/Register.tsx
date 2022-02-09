import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Background from "components/ui/Auth/Background";
import Logo from "components/ui/Logo";
import Header from "components/ui/Header";
import Button from "components/ui/Button";
import TextInput from "components/ui/TextInput";
import BackButton from "components/ui/BackButton";
import { theme } from "core/theme";
import { Navigation } from "types/Navigation";
import {
  emailValidator,
  passwordValidator,
  nameValidator,
} from "core/validators";
import { useAuth } from "hooks/useAuth";
import { UserIcon } from "react-native-heroicons/outline";
import { usePreferences } from "hooks/usePreferences";

type Props = {
  navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
  const { register } = useAuth();
  const { colorScheme } = usePreferences();

  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [logoVisible, setLogoVisible] = useState(true);
  const showLogo = () => setLogoVisible(true);
  const hideLogo = () => setLogoVisible(false);

  const _onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    register(email.value, password.value, name.value, "2000-01-01");
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("WelcomeScreen")} />

      {logoVisible && <Logo />}

      <Header fontSize={32}>Se créer un compte</Header>

      <TextInput
        left={() => <UserIcon />}
        label="Nom complet"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
        onFocus={hideLogo}
        onBlur={showLogo}
      />

      <TextInput
        label="Adresse e-mail"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        onFocus={hideLogo}
        onBlur={showLogo}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Mot de passe"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        onFocus={hideLogo}
        onBlur={showLogo}
        secureTextEntry
      />

      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}>
        S'inscrire
      </Button>

      <View style={styles.row}>
        <Text style={{color: theme[colorScheme].colors.secondary}}>Vous avez déjà un compte? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={{...styles.link, color: theme[colorScheme].colors.primary}}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({

  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
  },
});

export default memo(RegisterScreen);
