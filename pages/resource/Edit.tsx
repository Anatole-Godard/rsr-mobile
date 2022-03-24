import { useNavigation } from "@react-navigation/native";
import { useAuth } from "hooks/useAuth";
import { usePreferences } from "hooks/usePreferences";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
  PhotographIcon,
  TagIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import {
  Appbar,
  Button,
  IconButton,
  RadioButton,
  Text,
} from "react-native-paper";
import { Navigation } from "types/Navigation";
import { Resource } from "types/Resource";

import * as ImagePicker from "expo-image-picker";
import { types, visibilities } from "constants/resourceTypes";
import { nameValidator } from "core/validators";
import { fetchRSR } from "utils/fetchRSR";
import { API_URL } from "constants/env";
import { fetchXHR } from "utils/fetchXHR";
import { colors, theme } from "core/theme";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { StepIndicator } from "components/ui/StepIndicator";
import TextInput from "components/ui/TextInput";
import { TextInput as PaperInput } from "react-native-paper";

import MapInput, { MapInputVariants } from "react-native-map-input";
import { ScrollView } from "react-native-gesture-handler";
import { Input } from "types/Input";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DatePickerModal } from "react-native-paper-dates";

interface Props {
  navigation: Navigation;
  route: { params: Resource };
}

export const ResourceEditScreen = (props: Props) => {
  const { setOptions } = useNavigation();

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <Appbar.Action
          onPress={_onSubmit}
          icon={(props) => <CheckIcon size={props.size} color={props.color} />}
        />
      ),
    });
  }, []);
  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const [step, setStep] = useState<number>(0);
  const [stepIndicator, setStepIndicator] = useState({
    progress: [{ value: 0, indeterminate: true }, { value: 0 }],
    steps: {
      current: 1,
      total: 2,
      name: "Redéfinir la ressource",
    },
  });

  useEffect(() => {
    if (step === 0)
      setStepIndicator({
        progress: [{ value: 0, indeterminate: true }, { value: 0 }],
        steps: {
          current: 1,
          total: 2,
          name: "Redéfinir la ressource",
        },
      });
    if (step === 1)
      setStepIndicator({
        progress: [{ value: 1 }, { value: 0, indeterminate: true }],
        steps: {
          current: 2,
          total: 2,
          name: "Détailler la ressource",
        },
      });
  }, [step]);

  const [name, setName] = useState({
    value: props.route.params.data.attributes.properties.name,
    error: "",
  });
  const [description, setDescription] = useState({
    value: props.route.params.description || "",
    error: "",
  });
  const [type, setType] = useState(
    props.route.params.data.type || types[0].value
  );

  const [visibility, setVisibility] = useState(
    props.route.params.visibility || visibilities[0].value
  );

  const [price, setPrice] = useState({
    value: props.route.params.data.attributes.properties.price || "0.00",
    error: "",
  });
  const [category, setCategory] = useState({
    value: props.route.params.data.attributes.properties.category || "",
    error: "",
  });

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

  const [startDate, setStartDate] = useState<Input>({
    value: props.route.params.data.attributes.properties.startDate || "",
    error: "",
  });
  const [endDate, setEndDate] = useState<Input>({
    value: props.route.params.data.attributes.properties.endDate || "",
    error: "",
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const onDismiss = React.useCallback(() => {
    setDatePickerOpen(false);
  }, [setDatePickerOpen]);

  const onConfirm = React.useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: Date | undefined;
      endDate: Date | undefined;
    }) => {
      setDatePickerOpen(false);
      setStartDate({ value: startDate?.toISOString() || "", error: "" });
      setEndDate({ value: endDate?.toISOString() || "", error: "" });
    },
    [setDatePickerOpen, setStartDate, setEndDate]
  );

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
    //TODO validators
    if (user) {
      try {
        const res = await fetchRSR(
          API_URL + "/resource/" + props.route.params.slug + "/edit",
          user.session,
          {
            method: "PUT",
            body: JSON.stringify(formatResource()),
          }
        );
        const body = await res.json();
        if (res.ok && body.data.attributes) {
          props.navigation.push("Details", {
            ...body.data.attributes,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
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
    } else if (type === "event") {
      data.attributes = {
        properties: {
          name: name.value,
          description: description.value,
          startDate: startDate.value,
          endDate: endDate.value,
          participants: [],
        },
      };
    }

    return {
      description: description.value,
      // tags: tags.map((tag) => tag.value),
      data,
      visibility,
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
        steps={stepIndicator.steps}
        progress={stepIndicator.progress}
      />

      {step === 0 && (
        <ScrollView
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
            // autoCapitalize="none"
          />
          <TextInput
            label="Description de la ressource"
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
              borderColor: theme[colorScheme].colors.secondary,
            }}
          >
            {types
              .find((t) => t.value === type)
              ?.icon.outline({
                size: 24,
                color: theme[colorScheme].colors.secondary,
              })}

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
                    padding: 6,
                    borderRadius: 8,
                    backgroundColor: theme[colorScheme].colors.surface,
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

          <View
            style={{
              ...styles.separator,
              borderColor: theme[colorScheme].colors.secondary,
            }}
          >
            {visibilities
              .find((t) => t.value === visibility)
              ?.icon.outline({
                size: 24,
                color: theme[colorScheme].colors.secondary,
              })}
            <Text style={styles.label}>Visibilité de la ressource</Text>
          </View>
          <Text
            style={{
              fontFamily: "Spectral",
              textAlign: "justify",
              marginBottom: 8,
            }}
          >
            La création de ressource non répertoriée n'est pas disponible sur
            mobile, merci d'utiliser l'application web.
          </Text>
          <RadioButton.Group
            onValueChange={(value) => setVisibility(value)}
            value={visibility}
          >
            {visibilities.map((v) =>
              v.value !== "unlisted" ? (
                <>
                  <RadioButton.Item
                    key={v.value}
                    label={v.label}
                    value={v.value}
                    labelStyle={styles.radioLabel}
                    color={theme[colorScheme].colors.primary}
                    disabled={v.value === "unlisted"}
                    style={{
                      padding: 6,
                      borderRadius: 8,
                      backgroundColor: theme[colorScheme].colors.surface,
                      borderColor:
                        visibility === v.value
                          ? theme[colorScheme].colors.primary
                          : theme[colorScheme].colors.placeholder,
                    }}
                  />
                  <View style={{ marginBottom: 8 }}></View>
                </>
              ) : null
            )}
          </RadioButton.Group>
        </ScrollView>
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
                left={
                  <PaperInput.Icon
                    style={{ marginTop: 14 }}
                    icon={() => (
                      <CurrencyDollarIcon
                        size={24}
                        color={colors.trueGray[500]}
                      />
                    )}
                  />
                }
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

          {type === "event" && (
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
              <Button
                onPress={() => setDatePickerOpen(true)}
                mode="outlined"
                icon={(props) => (
                  <CalendarIcon size={props.size} color={props.color} />
                )}
                style={{ marginTop: 12 }}
              >
                Sélectionner une date
              </Button>
              <DatePickerModal
                locale="fr"
                mode="range"
                visible={datePickerOpen}
                onDismiss={onDismiss}
                startDate={
                  startDate.value ? new Date(startDate.value) : undefined
                }
                endDate={endDate.value ? new Date(endDate.value) : undefined}
                onConfirm={onConfirm}
                // validRange={{
                //   startDate: new Date(2021, 1, 2),  // optional
                //   endDate: new Date(), // optional
                //   disabledDates: [new Date()] // optional
                // }}
                // onChange={} // same props as onConfirm but triggered without confirmed by user
                saveLabel="Confimer" // optional
                // uppercase={false} // optional, default is true
                label="Sélectionner une date" // optional
                // startLabel="From" // optional
                // endLabel="To" // optional
                // animationType="slide" // optional, default is slide on ios/android and none on web
              />
              <Text
                style={{
                  fontFamily: "Spectral",
                  textAlign: "justify",
                  marginBottom: 8,
                  marginTop: 12,
                }}
              >
                La sélection de l'heure n'est pas encore disponible sur mobile,
                si vous souhaitez préciser l'horaire, merci d'éditer la
                ressource sur l'application web.
              </Text>

              {startDate.value !== "" && (
                <View
                  style={{
                    flexDirection: "column",
                    backgroundColor: theme[colorScheme].colors.surface,
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: 48,
                      }}
                    >
                      <ClockIcon
                        size={24}
                        color={theme[colorScheme].colors.primary}
                      />
                      {endDate.value !== "" && (
                        <Text
                          style={{
                            fontFamily: "Spectral",
                            fontSize: 12,
                          }}
                        >
                          FROM
                        </Text>
                      )}
                    </View>
                    <View style={{ flexDirection: "column", marginLeft: 12 }}>
                      <Text style={{ fontFamily: "Spectral", fontSize: 16 }}>
                        {format(new Date(startDate.value), "PPPP", {
                          locale: fr,
                        })}
                      </Text>
                      <Text style={{ fontFamily: "Spectral", fontSize: 12 }}>
                        {format(new Date(startDate.value), "p", { locale: fr })}
                      </Text>
                    </View>
                  </View>
                  {endDate.value !== "" && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 8,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          width: 48,
                        }}
                      >
                        <ClockIcon
                          size={24}
                          color={theme[colorScheme].colors.primary}
                        />
                        <Text
                          style={{
                            fontFamily: "Spectral",
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          TO
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          marginLeft: 12,
                          paddingTop: 8,
                          borderTopWidth: StyleSheet.hairlineWidth,
                          flex: 1,
                          marginRight: 8,
                        }}
                      >
                        <Text style={{ fontFamily: "Spectral", fontSize: 16 }}>
                          {format(new Date(endDate.value), "PPPP", {
                            locale: fr,
                          })}
                        </Text>
                        <Text style={{ fontFamily: "Spectral", fontSize: 12 }}>
                          {format(new Date(endDate.value), "p", {
                            locale: fr,
                          })}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
              {/* <Text>{JSON.stringify({ startDate, endDate })}</Text> */}
            </View>
          )}
        </View>
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

      {(step === 0 || step === 1) && (
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
