import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { fetchRSR } from '../../utils/fetchRSR';
import { CheckCircleIcon, PlusCircleIcon, XIcon } from 'react-native-heroicons/outline';
import { Resource, ResourceMinimum } from '../../types/Resource';
import { Playlist } from '../../types/Playlist/Playlist';
import { Navigation } from '../../types/Navigation';
import { Text, TextInput, View } from 'react-native';
import { API_URL } from 'constants/env';
import useFetchRSR from '../../hooks/useFetchRSR';
import { Checkbox, IconButton, TouchableRipple, useTheme } from 'react-native-paper';
import { colors, theme } from 'core/theme';

interface Props {
  navigation: Navigation;
  route: { params: Resource };
}

export const SelectPlaylists = (props: Props) => {
  const { user } = useAuth();
  const {
    data: playlists,
    error,
    loading,
    revalidate
  }: {
    data?: Playlist;
    error?: Error;
    loading: boolean;
    revalidate: () => void;
  } = useFetchRSR(
    `${API_URL}/user/${user.data.uid}/resources/playlists`,
    user.session
  );

  const manage = async (playlistKey: string, action: 'add' | 'remove') => {
    const res = await fetchRSR(
      `${API_URL}/user/${user.data.uid}/resources/playlists/manage`,
      user.session,
      {
        method: action === 'add' ? 'POST' : 'DELETE',
        body: JSON.stringify({
          playlistKey,
          resource: props.route.params
        })
      }
    );
    if (res.ok) revalidate();
  };

  const deletePlaylist = async (key: string) => {
    const res = await fetchRSR(
      `${API_URL}/user/${user.data.uid}/resources/playlists/delete`,
      user.session,
      {
        method: 'DELETE',
        body: JSON.stringify({
          playlistKey: key
        })
      }
    );
    if (res.ok) revalidate();
  };

  const paperTheme = useTheme();
  
  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      paddingBottom: 48,
      padding: 20,
      backgroundColor: paperTheme.colors.surface
    }}>
      {!error && !loading ? (
        <>
          <View style={{ width: '100%' , marginBottom : 16}}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: paperTheme.colors.primary }}>
              Enregister dans...
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: '#8D8D8DFF',
              borderBottomWidth: 1
            }}
          />
          {playlists?.keys.map((key: string, index: number) => (
            <PlaylistCheckbox
              paperTheme={paperTheme}
              name={key}
              inPlaylist={
                (playlists?.[key] as ResourceMinimum[]).find(
                  (r) => r.slug === props.route.params.slug
                ) != null
              }
              onCheck={(e) =>
                manage(key, e ? 'add' : 'remove')
              }
              onDelete={deletePlaylist}
              key={index}
            />
          ))}
        </>
      ) : (
        <Text style={{
          width: '100%',
          height: '100%',
          textAlign: 'center',
          paddingTop: 30,
          fontSize: 18,
          color: paperTheme.colors.text
        }}>
          {loading ? 'Chargement...' : 'Une erreur est survenue'}
        </Text>
      )}
      {(playlists || {keys:[]}).keys.length > 0 && (
        <View
          style={{
            borderBottomColor: '#8D8D8DFF',
            borderBottomWidth: 1
          }}
        />
      )}
      <PlaylistCreator revalidate={revalidate} paperTheme={paperTheme} />
    </View>
  );
};

const PlaylistCheckbox = ({
                            paperTheme,
                            name,
                            inPlaylist = false,
                            onCheck,
                            onDelete
                          }: {
  paperTheme: ReactNativePaper.Theme;
  name: string;
  inPlaylist: boolean;
  // eslint-disable-next-line no-unused-vars
  onCheck: (e: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (key: string) => void;
}) => {
  return (
    <View style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      width: '100%',
      marginBottom: 5
    }}>
      <TouchableRipple onPress={() => onCheck(!inPlaylist)} style={{ flex: 2, alignSelf: 'stretch' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Checkbox
            color={inPlaylist ? !paperTheme.dark
              ? '#1ea04b'
              : paperTheme.colors.primary : '#757575'}
            status={inPlaylist ? 'checked' : 'unchecked'}
          />
          <Text style={{ color: paperTheme.colors.text }}>{name}</Text>
        </View>
      </TouchableRipple>
      <IconButton icon={XIcon} style={{ backgroundColor: '#fce0e0', borderRadius: 5 }}
                  color={paperTheme.colors.error}
                  onPress={() => onDelete(name)}>
      </IconButton>
    </View>
  );
};

const PlaylistCreator = ({
                           paperTheme,
                           revalidate
                         }: {
  paperTheme: ReactNativePaper.Theme;
  revalidate: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');

  const { user } = useAuth();

  const create = async () => {
    if (key) {
      const res = await fetchRSR(`${API_URL}/user/${user.data.uid}/resources/playlists/create`,
        user.session,
        {
          method: 'POST',
          body: JSON.stringify({
            playlistKey: key
          })
        }
      );

      if (res.ok) {
        setOpen(false);
        setKey('');
        revalidate();
      }
    }
  };

  return (
    <>
      <View style={{ display: 'flex', flexDirection: 'row', paddingHorizontal: 10 }}>
        {open ? (
          <>
            <View style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:
                !paperTheme.dark
                  ? colors.trueGray[200]
                  : colors.trueGray[800],
              borderRadius: 5,
              padding: 10,
              height: 44,
              marginTop : 16
            }}>
              <TouchableRipple
                onPress={() => setOpen(false)}
                style={{
                  position: 'absolute',
                  left: 10,
                  backgroundColor: '#fce0e0',
                  borderRadius: 5,
                  padding: 2,
                  zIndex: 1
                }}
              >
                <XIcon color={paperTheme.colors.error} />
              </TouchableRipple>
              <TextInput
                onChangeText={(text) => setKey(text)}
                value={key}
                style={{
                  width: '100%',
                  paddingHorizontal: 25,
                  marginHorizontal: 10,
                  backgroundColor:
                    !paperTheme.dark
                      ? colors.trueGray[200]
                      : colors.trueGray[800],
                  color: paperTheme.colors.text
                }}
                placeholderTextColor={theme[paperTheme.dark ? 'dark' : 'light'].colors.secondary}
                placeholder='À regarder plus tard...'
              />
              <TouchableRipple
                onPress={() => create()}
                style={{
                  position: 'absolute',
                  right: 10,
                  backgroundColor: '#84edaa',
                  borderRadius: 5,
                  padding: 2,
                  zIndex: 1
                }}
              >
                <CheckCircleIcon color={
                  !paperTheme.dark
                    ? '#1ea04b'
                    : paperTheme.colors.primary} />
              </TouchableRipple>
            </View>
          </>
        ) : (
          <TouchableRipple onPress={() => setOpen(true)} rippleColor={undefined} style={{ width: '100%', marginTop : 16 }}>
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#84edaa',
              borderRadius: 5,
              padding: 10
            }}>
              <PlusCircleIcon color='#2e7c4a' />
              <Text> Créer une playlist</Text>
            </View>
          </TouchableRipple>
        )}
      </View>
    </>
  );
};