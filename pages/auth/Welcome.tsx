import React, { memo } from "react";
import Background from "components/ui/Auth/Background";
import Logo from "components/ui/Logo";
import Header from "components/ui/Header";
import Button from "components/ui/Button";
import Paragraph from "components/ui/Paragraph";
import { Navigation } from "types/Navigation";

type Props = {
  navigation: Navigation;
};

const WelcomeScreen = ({ navigation }: Props) => (
  <Background>
    <Logo />
    <Header fontSize={48}>Hello RSR</Header>

    <Paragraph>
      Tissez des liens entre vous et chaque citoyen grâce aux ressources que
      vous trouverez sur l'application.
    </Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate("LoginScreen")}>
      Se connecter
    </Button>
    <Button
      mode="outlined"
      onPress={() => navigation.navigate("RegisterScreen")}
    >
      S'inscrire
    </Button>
  </Background>
);

export default memo(WelcomeScreen);
