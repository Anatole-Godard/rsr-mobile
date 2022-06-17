import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption, Surface, Text, Title, TouchableRipple } from 'react-native-paper';
import color from 'color';
import { Resource } from 'types/Resource';
import { usePreferences } from 'hooks/usePreferences';
import { colors, theme } from 'core/theme';

import {
  CalendarIcon,
  ExternalLinkIcon,
  HandIcon,
  LocationMarkerIcon,
  QuestionMarkCircleIcon
} from 'react-native-heroicons/outline';

import { formatDistance } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { useAuth } from 'hooks/useAuth';
import { types } from 'constants/resourceTypes';
import { useNavigation } from '@react-navigation/native';
import { GeoJSON_Point } from '../../types/Resource/GeoJSON';
import { PhysicalItem } from '../../types/Resource/PhysicalItem';
import { ExternalLink } from '../../types/Resource/ExternalLink';
import { Event } from '../../types/Resource/Event';


// type: 'location' | 'physical_item' | 'external_link' | 'event' | 'other';
// attributes: GeoJSON_Point | PhysicalItem | ExternalLink | Event | any;
const ResourceDataView = ({
                            type
                          }: {
  type: 'location' | 'physical_item' | 'external_link' | 'event' | 'other';
}) => {
  const { colorScheme } = usePreferences();
  let style;

  if (type === 'location')
    style = {
      backgroundColor:
        colorScheme === 'light' ? colors.indigo[100] : colors.indigo[800],
      borderColor: colors.indigo[500]
    };
  if (type === 'physical_item')
    style = {
      backgroundColor:
        colorScheme === 'light' ? colors.emerald[100] : colors.emerald[800],
      borderColor: colors.emerald[500]
    };
  if (type === 'external_link')
    style = {
      backgroundColor:
        colorScheme === 'light' ? colors.amber[100] : colors.amber[800],
      borderColor: colors.amber[500]
    };
  if (type === 'event')
    style = {
      backgroundColor:
        colorScheme === 'light' ? colors.red[100] : colors.red[800],
      borderColor: colors.red[500]
    };
  if (type === 'other')
    style = {
      backgroundColor:
        colorScheme === 'light' ? colors.gray[100] : colors.gray[800],
      borderColor: colors.gray[500]
    };
  return (
    <View
      style={{
        ...styles.image,
        ...style,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      {type === 'location' && (
        <LocationMarkerIcon
          size={24}
          color={
            colorScheme === 'light' ? colors.indigo[700] : colors.indigo[300]
          }
        />
      )}
      {type === 'physical_item' && (
        <HandIcon
          size={24}
          color={
            colorScheme === 'light' ? colors.emerald[700] : colors.emerald[300]
          }
        />
      )}
      {type === 'external_link' && (
        <ExternalLinkIcon
          size={24}
          color={
            colorScheme === 'light' ? colors.amber[700] : colors.amber[300]
          }
        />
      )}
      {type === 'event' && (
        <CalendarIcon
          size={24}
          color={colorScheme === 'light' ? colors.red[700] : colors.red[300]}
        />
      )}
      {type === 'other' && (
        <QuestionMarkCircleIcon
          size={24}
          color={colorScheme === 'light' ? colors.gray[700] : colors.gray[300]}
        />
      )}
      <Text style={{ fontFamily: 'Spectral' }}>
        {types.find((r) => r.value === type)?.label || type === 'other' && 'Autre'}
      </Text>
    </View>
  );
};

interface Props extends Resource {
  onPress: () => void;
}

export const ResourceCard = (props: Props) => {
  const { navigate } = useNavigation();
  const { colorScheme } = usePreferences();
  const { user } = useAuth();

  const contentColor = color(theme[colorScheme].colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme[colorScheme].colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  return (
    <TouchableRipple onPress={() => {
      props.onPress();
    }}>
      <Surface style={styles.container}>
        <View style={styles.rightColumn}>
          <View style={styles.topRow}>
            <Title style={{ fontFamily: 'Marianne-ExtraBold' }}>
              {props.data.attributes.properties.name}
            </Title>
          </View>
          <Text
            style={{
              color: contentColor,
              lineHeight: -5,
              fontSize: 15,
              fontFamily: 'Spectral',
              paddingBottom: 8
            }}
            numberOfLines={4}
            ellipsizeMode='tail'
          >
            {props.description?.trimEnd()}
          </Text>
          <ResourceDataView type={props.data.type} />
          <View style={styles.bottomRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Caption style={styles.handle}>{props.owner.fullName}</Caption>
              <Caption style={[styles.handle, styles.dot]}>
                {'\u2B24'}
              </Caption>
              <Caption style={styles.handle}>
                {formatDistance(
                  new Date(props.createdAt.toString()),
                  new Date(),
                  { locale: fr }
                )}
              </Caption>
              {user.data.uid === props.owner.uid && (
                <>
                  <Caption style={[styles.handle, styles.dot]}>
                    {'\u2B24'}
                  </Caption>
                  <Caption
                    style={{
                      color: props.validated
                        ? colors.green[700]
                        : colors.trueGray[500]
                    }}
                  >
                    {props.validated ? 'validée' : 'en attente'}
                  </Caption>
                </>
              )}
            </View>
          </View>
        </View>
      </Surface>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    elevation: 1
  },
  rightColumn: {
    flex: 1
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  handle: {
    marginRight: 3
  },
  dot: {
    fontSize: 3
  },
  image: {
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: -5,
    borderRadius: 16,
    width: '100%',
    height: 64
  },
  bottomRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4
  },
  iconDescription: {
    marginLeft: 2,
    lineHeight: 12
  }
});
