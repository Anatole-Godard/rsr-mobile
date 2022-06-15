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
import { Checkbox, IconButton, TouchableRipple } from 'react-native-paper';

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
    error?: any;
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

  return (
    <>
      {!error && !loading ? (
        <>
          <View style={{ width: '100%', padding: 10 }}>
            <Text style={{ fontSize: 16, textAlign: 'left', padding: 5 }}>
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
          fontSize: 18
        }}>
          {loading ? 'Chargement...' : 'Une erreur est survenue'}
        </Text>
      )}
      {playlists && playlists?.keys.length > 0 && (
        <View
          style={{
            borderBottomColor: '#8D8D8DFF',
            borderBottomWidth: 1,
            marginBottom: 10
          }}
        />
      )}
      <PlaylistCreator revalidate={revalidate} />
    </>
  );
};

const PlaylistCheckbox = ({
                            name,
                            inPlaylist = false,
                            onCheck,
                            onDelete
                          }: {
  name: string;
  inPlaylist: boolean;
  onCheck: (e: boolean) => void;
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
            color={inPlaylist ? '#1ea04b' : '#757575'}
            status={inPlaylist ? 'checked' : 'unchecked'}
          />
          <Text>{name}</Text>
        </View>
      </TouchableRipple>
      <IconButton icon={XIcon} style={{ padding: 5, backgroundColor: '#f4f4f4', borderRadius: 5 }}
                  onPress={() => onDelete(name)}>
      </IconButton>
    </View>
  );
};

const PlaylistCreator = ({
                           revalidate
                         }: {
  revalidate: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>('');

  const { user } = useAuth();

  const create = async () => {
    console.warn(key);
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
              backgroundColor: '#f4f4f4',
              borderRadius: 5,
              padding: 10
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
                <XIcon color='#c64747' />
              </TouchableRipple>
              <TextInput
                onChangeText={(text) => setKey(text)}
                value={key}
                style={{ width: '100%', paddingHorizontal: 25, marginHorizontal: 10 }}
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
                <CheckCircleIcon color='#1ea04b' />
              </TouchableRipple>
            </View>
          </>
        ) : (
          <TouchableRipple onPress={() => setOpen(true)} rippleColor={undefined} style={{ width: '100%' }}>
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