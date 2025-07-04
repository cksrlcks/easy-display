import { TEXT } from "@/constants/Text";
import { useAppConfigStore } from "@/stores/useAppConfigStore";
import { useHostIpStore } from "@/stores/useHostStore";
import { Slide } from "@repo/types";
import { useEventListener } from "expo";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type SlideShowProps = {
  slides: Slide[];
};

const { width, height } = Dimensions.get("window");

export default function SlideShow({ slides }: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  const slideTransitionSpeed = useAppConfigStore((state) => state.slideTransitionSpeed);

  const entering = FadeIn.duration(slideTransitionSpeed);
  const exiting = FadeOut.duration(slideTransitionSpeed);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

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

  return (
    <View>
      <ThemedView>
        <Animated.View entering={entering} exiting={exiting} key={currentSlide.id}>
          {slideContent(currentSlide.type)}
        </Animated.View>
      </ThemedView>
    </View>
  );
}

const ImgSlide = ({
  slide,
  onNext,
  direction = "horizontal",
}: {
  slide: Slide;
  onNext: () => void;
  direction?: "horizontal" | "vertical";
}) => {
  const hostIp = useHostIpStore((state) => state.hostIp);

  useEffect(() => {
    if (slide.duration) {
      const timer = setTimeout(onNext, slide.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [slide.duration]);

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

const VideoSlide = ({
  slide,
  onNext,
}: {
  slide: Slide;
  onNext: () => void;
  direction?: "horizontal" | "vertical";
}) => {
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
  }, [slide.duration]);

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
  }, []);

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
