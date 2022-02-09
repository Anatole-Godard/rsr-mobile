import React, { memo, useState } from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { emailValidator } from "core/validators";
import Background from "components/ui/Auth/Background";
import BackButton from "components/ui/BackButton";
import Logo from "components/ui/Logo";
import Header from "components/ui/Header";
import TextInput from "components/ui/TextInput";
import Button from "components/ui/Button";
import { theme } from "core/theme";
import { Navigation } from "types/Navigation";
import { usePreferences } from "hooks/usePreferences";

type Props = {
  navigation: Navigation;
};

const ForgotPasswordScreen = ({ navigation }: Props) => {
  const { colorScheme } = usePreferences();
  const [email, setEmail] = useState({ value: "", error: "" });

  const _onSendPressed = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    navigation.navigate("LoginScreen");
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("LoginScreen")} />

      <Logo />

      <Header>Réinitialiser mon mot de passe</Header>

      <TextInput
        label="Adresse e-mail"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <Button mode="contained" onPress={_onSendPressed} style={styles.button}>
        Réinitialiser
      </Button>

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text
          style={{
            ...styles.label,
            color: theme[colorScheme].colors.secondary,
          }}
        >
          ← Se connecter
        </Text>
      </TouchableOpacity>
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: "100%",
    marginTop: 12,
  },
  button: {
    marginTop: 12,
  },
  label: {
    width: "100%",
  },
});

export default memo(ForgotPasswordScreen);
