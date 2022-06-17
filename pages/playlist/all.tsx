import { Navigation } from '../../types/Navigation';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Playlist } from '../../types/Playlist/Playlist';
import useFetchRSR from '../../hooks/useFetchRSR';
import { FlatList, KeyboardAvoidingView, ScrollView, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import Paragraph from '../../components/ui/Paragraph';
import { List, Searchbar } from 'react-native-paper';
import { theme } from '../../core/theme';
import { usePreferences } from '../../hooks/usePreferences';
import { API_URL } from '../../constants/env';
import { ResourceCard } from '../../components/Resources/Resource';
import { Resource } from '../../types/Resource';
import { fetchRSR } from '../../utils/fetchRSR';

interface Props {
  navigation: Navigation;
}

export const PlaylistsScreen = (props: Props) => {
  const { user } = useAuth();
  const { colorScheme } = usePreferences();

  const {
    data: playlists,
    error,
    loading,
    revalidate
  }: {
    data?: Playlist;
    error?: any;
    loading: boolean;
    revalidate: () => void;
  } = useFetchRSR(
    `${API_URL}/user/${user.data.uid}/resources/playlists`,
    user.session
  );

  const [filtered, setFiltered] = React.useState<Playlist | undefined>(playlists);

  function filter(value: string) {
    try {
      console.warn(value);
      // if there's no hits found, set filtered back to all items
      if (value.length <= 0) {
        setFiltered(playlists);

        // else, search on the provided 'key'
      } else {
        let filteredList: Playlist = { keys: [] };
        const keysList = playlists?.keys.filter((v) => {
            const checked = (v)
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
            if (checked) {
              filteredList[v] = playlists[v];
            }
          }
        );
        console.warn(filteredList);
        //setFiltered(filteredList);
      }
    } catch (e) {
      revalidate();
      console.warn(user.data.uid);
    }
  }

  const listEmptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 256
      }}
    >
      <LottieView
        autoPlay={true}
        style={{
          width: 128,
          height: 128
        }}
        source={require('../../assets/lotties/empty.json')}
      />
      <Paragraph style={{ marginTop: 16 }}>
        Oh! Il n'y a pas encore de playlists disponibles...
      </Paragraph>
      <Paragraph style={{ marginTop: -12, fontSize: 12 }}>
        Peut-être avez-vous un problème de réseau ?
      </Paragraph>
    </View>
  );

  const RenderCards = ({ item }: { item: string }) => (
    <List.Accordion title={item} id={item}>
      {playlists && playlists?.[item]?.map((resource, idx) => (
        <ResourceCard {...resource} onPress={async () => {
          const res = await fetchRSR(API_URL + '/resource/' + resource.slug, user?.session);
          const body = await res.json();
          props.navigation &&
          props.navigation.push('Details', {
            ...body.data.attributes
          });
        }} />
      ))}
    </List.Accordion>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={56}
    >
      <Searchbar
        placeholder='Rechercher une ressource...'
        onChangeText={filter}
        style={{
          fontFamily: 'Spectral',
          elevation: 0,
          backgroundColor: theme[colorScheme].colors.surface,
          borderRadius: 0
        }}
      />
      {(playlists || { keys: [] }).keys.length > 0 ? (
        <List.AccordionGroup>
          <FlatList
            data={playlists?.keys}
            ListEmptyComponent={listEmptyComponent}
            renderItem={({ item, index }) => (
              <View>
                <RenderCards item={item} index={item} /></View>
            )} />
        </List.AccordionGroup>
      ) : (
        <View>
          <Text>No playlists</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );

};