import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../../assets/ministere.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 107,
    height: 92,
    marginBottom: 12,
    marginLeft:4
  },
});

export default memo(Logo);