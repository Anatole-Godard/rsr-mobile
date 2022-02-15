import React, { memo, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Background from "components/ui/Auth/Background";
// import Logo from 'components/Logo';
import Header from "components/ui/Header";
import Button from "components/ui/Button";
import TextInput from "components/ui/TextInput";
import BackButton from "components/ui/BackButton";
import { theme } from "core/theme";
import { emailValidator, passwordValidator } from "core/validators";
import { Navigation } from "types/Navigation";
import { useAuth } from "hooks/useAuth";
import Logo from "components/ui/Logo";
import { usePreferences } from "hooks/usePreferences";

type Props = {
  navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
  const { signIn } = useAuth();
  const { colorScheme } = usePreferences();

  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const [logoVisible, setLogoVisible] = useState(true);
  const showLogo = () => setLogoVisible(true);
  const hideLogo = () => setLogoVisible(false);

  const _onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    signIn(email.value, password.value);
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("WelcomeScreen")} />

      {logoVisible && <Logo />}

      <Header>Enfin de retour. 👋</Header>

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
        autoCorrect={false}
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

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.label}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed}>
        Se connecter
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Vous n'avez pas de compte? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={{...styles.link, color: theme[colorScheme].colors.primary}}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  label: {
    color: theme.light.colors.secondary,
  },
  link: {
    fontWeight: "bold",
  },
});

export default memo(LoginScreen);
