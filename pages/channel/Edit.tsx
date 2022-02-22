import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhotographIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
} from "react-native-heroicons/outline";
import {
  Appbar,
  Button,
  IconButton,
  Searchbar,
  Text,
} from "react-native-paper";
import { Channel } from "types/Channel";
import { Input } from "types/Input";
import { Navigation } from "types/Navigation";
import { UserMinimum } from "types/User";

import * as ImagePicker from "expo-image-picker";
import { fetchRSR } from "utils/fetchRSR";
import { API_URL, HOST_URL } from "constants/env";
import { membersValidator, nameValidator } from "core/validators";
import { useSearch } from "hooks/useSearch";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, theme } from "core/theme";
import { StepIndicator } from "components/ui/StepIndicator";
import TextInput from "components/ui/TextInput";
import { DetailledChannel } from "components/Channel/DetailledChannel";

interface Props {
  navigation: Navigation;
  route: { params: Channel };
}

export const ChannelEditScreen = (props: Props) => {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <Appbar.Action
          onPress={_onSubmit}
          icon={(props) => <CheckIcon size={props.size} color={props.color} />}
        />
      ),
    });
  }, [props.navigation]);

  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const [step, setStep] = useState<number>(0);
  const [stepIndicator, setStepIndicator] = useState({
    progress: [{ value: 0, indeterminate: true }, { value: 0 }],
    steps: {
      current: 1,
      total: 2,
      name: "Redéfinir le salon",
    },
  });

  useEffect(() => {
    if (step === 0)
      setStepIndicator({
        progress: [{ value: 0, indeterminate: true }, { value: 0 }],
        steps: {
          current: 1,
          total: 2,
          name: "Redéfinir le salon",
        },
      });
    if (step === 1)
      setStepIndicator({
        progress: [{ value: 1 }, { value: 0, indeterminate: true }],
        steps: {
          current: 2,
          total: 2,
          name: "Détailler la salon",
        },
      });
  }, [step]);

  const [name, setName] = useState<Input>({
    value: props.route.params.name || "",
    error: "",
  });
  const [description, setDescription] = useState<Input>({
    value: props.route.params.description || "",
    error: "",
  });

  const [membersOptions, setMembersOptions] = useState<UserMinimum[]>([]);
  const [members, setMembers] = useState<UserMinimum[]>(
    props.route.params.members || []
  );
  const [membersError, setMembersError] = useState<string>("");

  const [privateChannel, setPrivateChannel] = useState<boolean>(
    props.route.params.visibility === "private" || false
  );

  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRSR(`${API_URL}/user`, user.session)
        .then((r) => r.json())
        .then((body) =>
          setMembersOptions(
            body.data.attributes.filter(
              (u: UserMinimum) => u.uid !== user.data.uid
            )
          )
        )
        .catch((err) => console.log(err));
    }
  }, [user]);

  const _onNextStep = () => {
    if (step === 0) {
      setName({ value: name.value, error: nameValidator(name.value) });
      setMembersError(membersValidator(members));

      if (
        nameValidator(name.value) !== "" ||
        membersValidator(members) !== ""
      ) {
        return;
      }

      setStep((old) => old + 1);
    } else if (step === 1) {
      setStep((old) => old + 1);
    }
  };
  const _previousStep = () => setStep((old) => old - 1);
  const _onSubmit = async () => {
    //TODO validators
    if (user) {
      try {
        const res = await fetchRSR(API_URL + "/channel/create", user.session, {
          method: "POST",
          body: JSON.stringify({
            name: name.value,
            description: description.value,
            visibility: privateChannel ? "private" : "public",
            // photoURL: pictureUrl,
            members,
          }),
        });
        const body = await res.json();
        if (res.ok && body.data.attributes) {
          props.navigation.push("ChannelSlug", {
            ...body.data.attributes,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const { search, onChange, filtered } = useSearch("fullName", membersOptions);

  return (
    <View
      style={{
        ...styles.wrapper,
        backgroundColor: theme[colorScheme].colors.background,
      }}
    >
      <StepIndicator
        style={{ marginBottom: 20 }}
        steps={stepIndicator.steps}
        progress={stepIndicator.progress}
      />

      {step === 0 && (
        <View
          style={{
            ...styles.container,
            backgroundColor: theme[colorScheme].colors.background,
          }}
        >
          <View
            style={{
              ...styles.separator,
              borderColor:
                colorScheme === "dark"
                  ? colors.trueGray[800]
                  : colors.trueGray[300],
              marginTop: 0,
              // ...styles.topSeparator,
            }}
          >
            <TagIcon size={24} color={theme[colorScheme].colors.secondary} />
            <Text style={styles.label}>Propriétés du salon</Text>
          </View>

          <TextInput
            label="Nom du salon"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
            // autoCapitalize="none"
          />
          <TextInput
            label="Description du salon"
            returnKeyType="next"
            dense
            value={description.value}
            onChangeText={(text) => setDescription({ value: text, error: "" })}
            error={!!description.error}
            errorText={description.error}
            style={{
              height: 48 * 2,
              justifyContent: "flex-start",
            }}
            multiline
            textAlignVertical="top"
            // autoCapitalize="none"
          />

          <View
            style={{
              ...styles.separator,
              borderColor:
                colorScheme === "dark"
                  ? colors.trueGray[800]
                  : colors.trueGray[300],
              //   marginTop: 0,
              // ...styles.topSeparator,
            }}
          >
            <UsersIcon size={24} color={theme[colorScheme].colors.secondary} />
            <Text style={styles.label}>Membres du salon</Text>
          </View>

          <Searchbar
            placeholder="Rechercher un utilisateur"
            onChangeText={onChange}
            value={search}
            style={{
              fontFamily: "Spectral",
              elevation: 0,
              backgroundColor: theme[colorScheme].colors.background,
              borderRadius: 0,
            }}
          />
          <FlatList
            data={filtered}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor:
                    colorScheme === "dark"
                      ? colors.trueGray[800]
                      : colors.trueGray[300],
                  marginBottom: 4,
                  paddingBottom: 4,
                }}
              />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: theme[colorScheme].colors.surface,
                }}
                onPress={() => {
                  members.find((m) => m.uid === item.uid)
                    ? setMembers(
                        members.filter((u: UserMinimum) => u.uid !== item.uid)
                      )
                    : setMembers([...members, item]);
                  setMembersError("");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    elevation: 0,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: HOST_URL + item.photoURL }}
                      style={{
                        height: 32,
                        width: 32,
                        borderRadius: 16,
                        marginRight: 8,
                      }}
                    />
                    <Text style={{ fontFamily: "Spectral", fontSize: 16 }}>
                      {item.fullName}
                    </Text>
                  </View>
                  {members.find((m) => m.uid === item.uid) && (
                    <CheckCircleIcon
                      size={24}
                      color={theme[colorScheme].colors.secondary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.uid}
            ListFooterComponent={() => (
              <Text
                style={{
                  fontFamily: "Spectral",
                  fontSize: 16,
                  color: theme[colorScheme].colors.error,
                  marginVertical: 8,
                }}
              >
                {membersError}
              </Text>
            )}
          />
        </View>
      )}

      {step === 1 && (
        <View
          style={{
            ...styles.container,
            backgroundColor: theme[colorScheme].colors.background,
          }}
        >
          <View
            style={{
              ...styles.separator,
              borderColor:
                colorScheme === "dark"
                  ? colors.trueGray[800]
                  : colors.trueGray[300],
              marginTop: 0,
            }}
          >
            <PhotographIcon
              size={24}
              color={theme[colorScheme].colors.secondary}
            />
            <Text style={styles.label}>Image du salon</Text>
          </View>
          <Button
            mode="outlined"
            onPress={pickImage}
            icon={(props) => (
              <PhotographIcon size={props.size} color={props.color} />
            )}
          >
            Prendre une photo
          </Button>
          {image && (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: image }}
                style={{ width: "80%", height: 200, borderRadius: 4 }}
              />
              <IconButton
                onPress={() => setImage(null)}
                size={36}
                icon={(props) => (
                  <TrashIcon size={props.size} color={props.color} />
                )}
              />
            </View>
          )}

          <View
            style={{
              ...styles.separator,
              borderColor:
                colorScheme === "dark"
                  ? colors.trueGray[800]
                  : colors.trueGray[300],
            }}
          >
            {privateChannel ? (
              <LockClosedIcon
                size={24}
                color={theme[colorScheme].colors.secondary}
              />
            ) : (
              <LockOpenIcon
                size={24}
                color={theme[colorScheme].colors.secondary}
              />
            )}
            <Text style={styles.label}>Confidentialité</Text>
          </View>

          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 8,
              paddingLeft: 16,
              backgroundColor: theme[colorScheme].colors.surface,
            }}
            onPress={() => setPrivateChannel(!privateChannel)}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                elevation: 0,
              }}
            >
              <Text style={{ fontFamily: "Spectral", fontSize: 16 }}>
                Salon privé
              </Text>
              {privateChannel && (
                <CheckCircleIcon
                  size={24}
                  color={theme[colorScheme].colors.secondary}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View
          style={{
            ...styles.container,
            backgroundColor: theme[colorScheme].colors.background,
          }}
        >
          <DetailledChannel
            {...{
              name: name.value,
              description: description.value,
              members,
              image,
              visibility: privateChannel ? "private" : "public",
              messages: [],
              activities: [],
              slug: "",
              owner: {
                uid: user.data.uid,
                fullName: user.data.fullName,
                photoURL: user.data.photoURL,
              },
              createdAt: new Date().toISOString(),
            }}
          />
        </View>
      )}

      {step === 0 && (
        <Button
          icon={(props) => (
            <ArrowRightIcon size={props.size} color={props.color} />
          )}
          mode="contained"
          onPress={_onNextStep}
        >
          Suivant
        </Button>
      )}

      {step === 1 && (
        <View>
          <Button
            icon={(props) => (
              <ArrowLeftIcon size={props.size} color={props.color} />
            )}
            mode="outlined"
            onPress={_previousStep}
          >
            Précédent
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 48,
    padding: 20,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Marianne-Bold",
  },

  topSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginVertical: 0,
    borderTopWidth: 0,
    paddingTop: 12,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginVertical: 12,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  radioLabel: {
    fontFamily: "Spectral",
  },
  resourceType: {
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 4,
  },
});
