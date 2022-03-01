import { theme } from "core/theme";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePreferences } from "hooks/usePreferences";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ClockIcon } from "react-native-heroicons/outline";
import { Text } from "react-native-paper";
import { Event as EventType } from "types/Resource/Event";

interface Props extends EventType {}

export const Event = (props: Props) => {
  const { properties } = props;
  const { startDate, endDate } = properties;

  const { colorScheme } = usePreferences();
  return (
    <>
      {startDate.toString() !== "" && (
        <View
          style={{
            flexDirection: "column",
            backgroundColor: theme[colorScheme].colors.surface,
            padding: 8,
            borderRadius: 8,
            width: "100%",
            height:"100%",
            justifyContent: "center",
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
              <ClockIcon size={24} color={theme[colorScheme].colors.primary} />
              {endDate?.toString() !== "" && (
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
                {format(new Date(startDate.toString()), "PPPP", {
                  locale: fr,
                })}
              </Text>
              <Text style={{ fontFamily: "Spectral", fontSize: 12 }}>
                {format(new Date(startDate.toString()), "p", { locale: fr })}
              </Text>
            </View>
          </View>
          {(endDate && endDate?.toString() !== "") && (
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
                  {format(new Date(endDate.toString()), "PPPP", {
                    locale: fr,
                  })}
                </Text>
                <Text style={{ fontFamily: "Spectral", fontSize: 12 }}>
                  {format(new Date(endDate.toString()), "p", {
                    locale: fr,
                  })}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};
