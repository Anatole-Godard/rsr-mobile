import Button from "components/ui/Button";
import { StepIndicator } from "components/ui/StepIndicator";
import TextInput from "components/ui/TextInput";
import { types } from "constants/resourceTypes";
import { theme } from "core/theme";
import { nameValidator } from "core/validators";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  CurrencyDollarIcon,
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
  PhotographIcon,
  TagIcon,
  TrashIcon,
  XIcon,
} from "react-native-heroicons/outline";
import { IconButton, RadioButton, Text } from "react-native-paper";
import { Navigation } from "types/Navigation";

import * as ImagePicker from "expo-image-picker";
import { Resource } from "types/Resource";

import MapInput, { MapInputVariants } from "react-native-map-input";
import { fetchXHR } from "utils/fetchXHR";

interface Props {
  navigation: Navigation;
}

export const ResourceCreate = (props: Props) => {
  const { colorScheme } = usePreferences();

  const [step, setStep] = useState<number>(0);

  const [name, setName] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [type, setType] = useState(types[0].value);

  const [price, setPrice] = useState({ value: "0.00", error: "" });
  const [category, setCategory] = useState({ value: "", error: "" });

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

  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }>({
    latitude: 49.441147,
    longitude: 1.089014,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState<string | null>(null);

  const [externalLink, setExternalLink] = useState({ value: "", error: "" });

  const _onNextStep = async () => {
    if (step === 0) {
      const nameError = nameValidator(name.value);

      if (nameError) {
        setName({ ...name, error: nameError });
        return;
      }
      setStep((old) => old + 1);
    } else if (step === 1) {
      setStep((old) => old + 1);
    }
  };

  const _previousStep = () => setStep((old) => old - 1);
  const _onSubmit = async () => {
    console.log(formatResource());
  };

  const formatResource = () => {
    let data: Resource["data"] = {
      type: type,
      attributes: {},
    };
    if (type === "physical_item") {
      data.attributes = {
        properties: {
          name: name.value,
          description: description.value,
          price: parseFloat(price.value),
          category: category.value,
          image: null,
        },
      };
    } else if (type === "location") {
      data.attributes = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [position.latitude, position.longitude],
        },
        properties: {
          name: name.value,
          location,
        },
      };
    } else if (type === "external_link") {
      data.attributes = {
        properties: {
          name: name.value,
          description: description.value,
          externalLink: externalLink.value,
          image: null,
        },
      };
    }

    return {
      description: description.value,
      // tags: tags.map((tag) => tag.value),
      data,
    };
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const response = await fetchXHR(
        "GET",
        `https://api-adresse.data.gouv.fr/reverse/?lat=${position.latitude}&lon=${position.longitude}&format=json`
      );
      //   const body = await response.json();
      let json = JSON.parse(response as string);
      if (json?.features[0] != null)
        setLocation(json.features[0]?.properties?.label);
      else setLocation("");
    };

    const delayDebounce = setTimeout(() => {
      if (position != null) fetchLocation();
    }, 2000);

    return () => clearTimeout(delayDebounce);
  }, [position]);

  return (
    <View
      style={{
        ...styles.wrapper,
        backgroundColor: theme[colorScheme].colors.background,
      }}
    >
      <StepIndicator
        style={{ marginBottom: 20 }}
        steps={{
          current: step + 1,
          total: 3,
          name: [
            "Définir la ressource",
            "Détailler la ressource",
            "Confirmation",
          ][step],
        }}
        progress={[
          ...(step === 0
            ? [{ value: 0, indeterminate: true }]
            : [{ value: 1 }]),
          ...(step === 1
            ? [{ value: 0, indeterminate: true }]
            : step !== 2
            ? [{ value: 0 }]
            : [{ value: 1 }]),
          ...(step === 2
            ? [{ value: 0, indeterminate: true }]
            : [{ value: 0 }]),
        ]}
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
              borderColor: theme[colorScheme].colors.secondary,
              marginTop: 0,
              // ...styles.topSeparator,
            }}
          >
            <TagIcon size={24} color={theme[colorScheme].colors.secondary} />
            <Text style={styles.label}>Propriétés de la ressource</Text>
          </View>
          <TextInput
            label="Nom de la ressource"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({ value: text, error: "" })}
            error={!!name.error}
            errorText={name.error}
            style={styles.input}
            // autoCapitalize="none"
          />
          <TextInput
            label="Description de la ressource"
            returnKeyType="next"
            value={description.value}
            onChangeText={(text) => setDescription({ value: text, error: "" })}
            error={!!description.error}
            errorText={description.error}
            style={{
              ...styles.input,
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
              borderColor: theme[colorScheme].colors.secondary,
            }}
          >
            {type === "location" && (
              <LocationMarkerIcon
                size={24}
                color={theme[colorScheme].colors.secondary}
              />
            )}
            {type === "physical_item" && (
              <HandIcon size={24} color={theme[colorScheme].colors.secondary} />
            )}
            {type === "external_link" && (
              <ExternalLinkIcon
                size={24}
                color={theme[colorScheme].colors.secondary}
              />
            )}

            <Text style={styles.label}>Type de ressource</Text>
          </View>
          <RadioButton.Group
            onValueChange={(value) => setType(value)}
            value={type}
          >
            {types.map((t) => (
              <>
                <RadioButton.Item
                  key={t.value}
                  label={t.label}
                  value={t.value}
                  labelStyle={styles.radioLabel}
                  color={theme[colorScheme].colors.primary}
                  style={{
                    ...styles.resourceType,
                    backgroundColor: theme[colorScheme].colors.background,
                    borderColor:
                      type === t.value
                        ? theme[colorScheme].colors.primary
                        : theme[colorScheme].colors.placeholder,
                  }}
                />
                <View style={{ marginBottom: 8 }}></View>
              </>
            ))}
          </RadioButton.Group>
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
              borderColor: theme[colorScheme].colors.secondary,
              marginTop: 0,
            }}
          >
            <BookOpenIcon
              size={24}
              color={theme[colorScheme].colors.secondary}
            />
            <Text style={styles.label}>
              Détails de la ressource :{" "}
              {types.find((t) => t.value === type)?.label}
            </Text>
          </View>

          {type === "physical_item" && (
            <View>
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
                    style={{ width: "80%", height: 96, borderRadius: 4 }}
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

              <TextInput
                label="Prix de l'objet"
                returnKeyType="next"
                value={price.value}
                onChangeText={(text) => setPrice({ value: text, error: "" })}
                error={!!price.error}
                errorText={price.error}
                style={styles.input}
                // autoCapitalize="none"
                left={(props: {
                  size: number | undefined;
                  color: Color | undefined;
                }) => (
                  <CurrencyDollarIcon size={props.size} color={props.color} />
                )}
              />
              <TextInput
                label="Catégorie de l'objet"
                returnKeyType="next"
                value={category.value}
                onChangeText={(text) => setCategory({ value: text, error: "" })}
                error={!!category.error}
                errorText={category.error}
                style={styles.input}
              />
            </View>
          )}
          {type === "location" && (
            <View>
              <MapInput
                region={position}
                onChange={(coordinates) =>
                  setPosition({
                    ...position,
                    longitude: coordinates.longitude,
                    latitude: coordinates.latitude,
                  })
                }
                variant={MapInputVariants.BY_MARKER}
                style={{
                  height: Dimensions.get("window").height / 2.75,
                  borderRadius: 8,
                }}
                zoomEnabled
              />
              <TextInput
                label="Adresse"
                returnKeyType="next"
                value={location?.toString()}
                onChangeText={(text) => setLocation(text)}
                style={styles.input}
              />
            </View>
          )}
          {type === "external_link" && (
            <View>
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
                    style={{ width: "80%", height: 96, borderRadius: 4 }}
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

              <TextInput
                label="Lien externe"
                returnKeyType="next"
                value={externalLink.value}
                onChangeText={(text) =>
                  setExternalLink({ value: text, error: "" })
                }
                error={!!externalLink.error}
                errorText={externalLink.error}
                style={styles.input}
              />
            </View>
          )}
        </View>
      )}

      {step === 2 && (
        <View
          style={{
            ...styles.container,
            backgroundColor: theme[colorScheme].colors.background,
          }}
        >
          <Text>{JSON.stringify(formatResource(), undefined, 1)}</Text>
        </View>
      )}

      {step === 0 && (
        <Button
          icon={(props) => (
            <ArrowRightIcon size={props.size} color={props.color} />
          )}
          mode="outlined"
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
          <Button
            icon={(props) => (
              <ArrowRightIcon size={props.size} color={props.color} />
            )}
            mode="contained"
            onPress={_onNextStep}
          >
            Suivant
          </Button>
        </View>
      )}

      {step === 2 && (
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
          <Button
            icon={(props) => (
              <CheckIcon size={props.size} color={props.color} />
            )}
            mode="contained"
            onPress={_onSubmit}
          >
            Créer
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
  input: {
    // lineHeight: 12,
    // marginBottom: ,
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
  tag: {
    backgroundColor: theme.light.colors.background,
    height: 28,
  },
  tagText: {
    fontFamily: "Spectral",
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
