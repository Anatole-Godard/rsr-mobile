import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Other as OtherType } from "../../../types/Resource/Other";
import { CalculatorIcon, CalendarIcon, CheckCircleIcon, MenuAlt2Icon } from "react-native-heroicons/outline";
import { toModularInput } from "../../../libs/toModularInput";
import { Chip } from "react-native-paper";
import Carousel from "../../Carousel/Carousel";


export const Other = (props: OtherType) => {
  return (
    <View style={{
      width: "100%", position: "relative"
    }}>
      {props.properties.medias &&
        <View style={{
          width: "100%",
          height: 200
        }}>
          <Carousel images={props.properties.medias} />
        </View>
      }
      <View style={{
        width: "100%"
      }}>
        {toModularInput(props.properties).map((input, i) => (
          <Fragment key={input.slug + "-" + i}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginVertical: 8,
                marginLeft: 8
              }}>
              <View style={{
                display: "flex", flexDirection: "row", alignItems: "center"
              }}>
                <Text style={{ marginBottom: 5, fontFamily: "Marianne-Bold", fontSize: 16 }}>{input.label}</Text>
                {input.type === "string" && (
                  <Chip style={styles.chip} textStyle={{ fontFamily: "Spectral" }} icon={MenuAlt2Icon}>
                    Texte
                  </Chip>
                )}
                {input.type === "date" && (
                  <Chip style={styles.chip} textStyle={{ fontFamily: "Spectral" }} icon={CalendarIcon}>
                    Date
                  </Chip>
                )}
                {input.type === "number" && (
                  <Chip style={styles.chip} textStyle={{ fontFamily: "Spectral" }} icon={CalculatorIcon}>
                    Nombre
                  </Chip>
                )}
                {input.type === "boolean" && (
                  <Chip style={styles.chip} textStyle={{ fontFamily: "Spectral" }} icon={CheckCircleIcon}>
                    Oui/Non
                  </Chip>
                )}
              </View>
              <Text style={{ fontFamily: "Spectral" }}>
                {input.type !== "boolean"
                  ? input.value
                  : input.value
                    ? "Oui"
                    : "Non"}
              </Text>
            </View>
            <View style={{
              borderBottomColor: "000", borderBottomWidth: StyleSheet.hairlineWidth
            }} />
          </Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginLeft: 5,
    backgroundColor: "#d8d8ee",
    color: "#443cb1",
    height: 30
  }
});
