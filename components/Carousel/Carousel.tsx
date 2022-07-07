import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { Media } from "../../types/Resource/Media";
import { DocumentIcon, VideoCameraIcon, VolumeUpIcon } from "react-native-heroicons/outline";
import { HOST_URL } from "../../constants/env";
import { TouchableRipple } from "react-native-paper";

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void | null>();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });
  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (typeof savedCallback?.current !== "undefined") {
        savedCallback?.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
type Props = {
  images: Media[];
};

const MAX_WIDTH = Dimensions.get("screen").width;


const Carousel: React.FC<Props> = ({ images }) => {
  const animation = useRef(new Animated.Value(0));
  const [currentImage, setCurrentImage] = useState(0);
  useInterval(() => handleAnimation(), 500000);

  const handleAnimation = (index: number | null = null) => {
    let newCurrentImage = index ? index : currentImage + 1;

    if (newCurrentImage >= images.length) {
      newCurrentImage = 0;
    }

    Animated.spring(animation.current, {
      toValue: -(MAX_WIDTH * newCurrentImage),
      useNativeDriver: true
    }).start();

    setCurrentImage(newCurrentImage);
  };

  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={{
            display: "flex",
            flexDirection: "row",
            transform: [{ translateX: animation.current }]
          }}>
          {images.map((image) => (
            <View
            >
              {image.type.includes("image") && (
                <>
                  <Image
                    source={{ uri: HOST_URL + image.url }}
                    style={styles.image}
                    alt={image.name} />
                </>
              )}
              {image.type.includes("audio") && (
                <>
                  <Image
                    source={{ uri: "https://source.unsplash.com/random/?audio" }}
                    style={styles.image}
                    alt='meeting'
                  />

                  <View style={styles.overlayIconContainer}>
                    <VolumeUpIcon style={styles.overlayIcon} size={50} />
                  </View>
                </>
              )}
              {image.type.includes("video") && (
                <>
                  <Image
                    source={{ uri: "https://source.unsplash.com/random/?video" }}
                    style={styles.image}
                    alt='meeting'
                  />
                  <View style={styles.overlayIconContainer}>
                    <VideoCameraIcon style={styles.overlayIcon} size={50} />
                  </View>
                </>
              )}
              {image.type.includes("application/pdf") && (
                <>
                  <Image
                    source={{ uri: "https://source.unsplash.com/random/?document" }}
                    style={styles.image}
                    alt='meeting'
                  />

                  <View style={styles.overlayIconContainer}>
                    <DocumentIcon style={styles.overlayIcon} size={50} />
                  </View>
                </>
              )}
            </View>
          ))}
        </Animated.View>
        <View style={styles.indicatorContainer}>
          {images.map((image, index) => (
            <TouchableRipple onPress={() => {
              handleAnimation(index);
            }}>
              <View
                key={`${image}_${index}`}
                style={[
                  styles.indicator,
                  index === currentImage ? styles.activeIndicator : undefined
                ]}
              />
            </TouchableRipple>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    height: 200,
    width: MAX_WIDTH,
    borderRadius: 10,
    zIndex: 10
  },
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    height: 200,
    overflow: "hidden",
    backgroundColor: "#b3b3b3",
    borderRadius: 10
  },
  indicatorContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    bottom: 10,
    zIndex: 2
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderColor: "white",
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 10
  },
  activeIndicator: {
    backgroundColor: "white"
  },
  overlayIconContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0, 0.60)",
    zIndex: 10,
    left: 0
  },
  overlayIcon: {
    position: "absolute",
    top: "35%",
    left: "39%",
    opacity: 1,
    color: "white"
  }
});

export default Carousel;
