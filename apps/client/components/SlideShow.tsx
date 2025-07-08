import { SLIDE_LOADING_TIMEOUT } from "@/constants/Config";
import { TEXT } from "@/constants/Text";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useHostIpStore } from "@/stores/useHostStore";
import { Slide } from "@repo/types";
import { useEventListener } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Image, View } from "react-native";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type SlideShowProps = {
  slides: Slide[];
};

const { width, height } = Dimensions.get("window");

export default function SlideShow({ slides }: SlideShowProps) {
  const [isReady, setIsReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideTransitionSpeed = useAppConfigStore((state) => state.slideTransitionSpeed);

  const handleNext = () => {
    setFadeOutAndNext();
  };

  const setFadeOutAndNext = () => {
    fadeAnim.setValue(0);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: slideTransitionSpeed,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, slideTransitionSpeed]);

  const slideContent = (type: string | null) => {
    if (!type) {
      return <NotSupportedExtSlide onNext={handleNext} />;
    }

    switch (type) {
      case "image":
        return <ImgSlide slide={currentSlide} onNext={handleNext} />;
      case "video":
        return <VideoSlide slide={currentSlide} onNext={handleNext} />;
      default:
        return <NotSupportedExtSlide onNext={handleNext} />;
    }
  };

  useEffect(() => {
    const imgUriMaps = slides
      .filter((slide) => slide.type === "image" && slide.filePath !== null)
      .map(
        (slide) =>
          `http://${useHostIpStore.getState().hostIp}/media?path=${encodeURIComponent(slide.filePath!)}`,
      );

    const prefetch = Promise.all(
      imgUriMaps.map((uri) =>
        Image.prefetch(uri)
          .then(() => true)
          .catch(() => false),
      ),
    );
    const timeout = new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, SLIDE_LOADING_TIMEOUT);
    });

    Promise.race([prefetch, timeout]).finally(() => {
      setIsReady(true);
    });
  }, [slides]);

  return (
    <View>
      <ThemedView>
        {isReady ? (
          <Animated.View style={{ opacity: fadeAnim }} key={currentSlide.id}>
            {slideContent(currentSlide.type)}
          </Animated.View>
        ) : (
          <Loading />
        )}
      </ThemedView>
    </View>
  );
}

const ImgSlide = ({ slide, onNext }: { slide: Slide; onNext: () => void }) => {
  const hostIp = useHostIpStore((state) => state.hostIp);

  useEffect(() => {
    if (slide.duration) {
      const timer = setTimeout(onNext, slide.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [slide.duration, onNext]);

  if (slide.filePath === null) {
    return (
      <ThemedView
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
          transform: [{ rotate: `${slide.rotate}deg` }],
        }}
      >
        <ThemedText>{TEXT.SLIDESHOW_NO_IMAGE}</ThemedText>
      </ThemedView>
    );
  }

  const isLandscape = slide.rotate % 180 !== 0;

  return (
    <View style={{ transform: [{ rotate: `${slide.rotate}deg` }] }}>
      <Image
        source={{
          uri: `http://${hostIp}/media?path=${encodeURIComponent(slide.filePath)}`,
        }}
        style={{
          width: isLandscape ? height : width,
          height: isLandscape ? width : height,
          resizeMode: "contain",
        }}
      />
    </View>
  );
};

const VideoSlide = ({ slide, onNext }: { slide: Slide; onNext: () => void }) => {
  const hostIp = useHostIpStore((state) => state.hostIp);
  const videoUri = slide.filePath
    ? `http://${hostIp}/media?path=${encodeURIComponent(slide.filePath)}`
    : null;

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = slide.duration === null ? true : false;
    player.play();
    player.muted = true;
  });

  useEventListener(player, "playToEnd", () => {
    if (slide.duration !== null) return;
    onNext();
  });

  useEffect(() => {
    if (slide.duration) {
      const timer = setTimeout(onNext, slide.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [slide.duration, onNext]);

  if (slide.filePath === null) {
    return (
      <ThemedView
        style={{
          width,
          height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>{TEXT.SLIDESHOW_NO_VIDEO}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View>
      <VideoView
        player={player}
        style={{
          width,
          height,
        }}
        allowsFullscreen
      />
    </View>
  );
};

const NotSupportedExtSlide = ({ onNext }: { onNext: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onNext, 5000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <ThemedView
      style={{
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>{TEXT.SLIDESHOW_NOT_SUPPORTED}</ThemedText>
    </ThemedView>
  );
};

const Loading = () => {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
      <ActivityIndicator size="large" color="#fff" />
      <ThemedText>{TEXT.SLIDESHOW_LOADING}</ThemedText>
    </ThemedView>
  );
};
