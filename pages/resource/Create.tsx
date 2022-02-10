import Button from "components/ui/Button";
import { StepIndicator } from "components/ui/StepIndicator";
import TextInput from "components/ui/TextInput";
import { types } from "constants/resourceTypes";
import { theme } from "core/theme";
import { nameValidator } from "core/validators";
import { usePreferences } from "hooks/usePreferences";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckIcon,
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
  TagIcon,
} from "react-native-heroicons/outline";
import { RadioButton, Text } from "react-native-paper";
import { Navigation } from "types/Navigation";

interface Props {
  navigation: Navigation;
}

export const ResourceCreate = (props: Props) => {
  const { colorScheme } = usePreferences();

  const [step, setStep] = useState<number>(0);

  const [name, setName] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [type, setType] = useState(types[0].value);

  const _onNextStep = async () => {
    const nameError = nameValidator(name.value);

    if (nameError) {
      setName({ ...name, error: nameError });
      return;
    }
    setStep(1);
  };

  const _previousStep = () => setStep(0);
  const _onSubmit = async () => {};

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
          total: 2,
          name: ["Définir la ressource", "Détailler la ressource"][step],
        }}
        progress={[
          step === 0 ? { value: 0, indeterminate: true } : { value: 1 },
          step === 0 ? { value: 0 } : { value: 0, indeterminate: true },
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
              ...styles.topSeparator,
            }}
          >
            <BookOpenIcon
              size={24}
              color={theme[colorScheme].colors.secondary}
            />
            <Text style={styles.label}>Détails de la ressource</Text>
          </View>
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
    paddingBottom: 64,
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
