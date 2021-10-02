import { Flex, Image as ChakraImage, Spinner } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import React, { useEffect, useState } from 'react';

const FallbackImage = props => (
  <ChakraImage
    src={NoImageAvailable}
    p="1.5rem"
    borderRadius="0.375rem"
    {...props}
  />
);
const LoadingImage = props => (
  <Flex
    p="1.5rem"
    borderRadius="0.375rem"
    justify="center"
    align="center"
    {...props}
  >
    <Spinner
      color="blue.500"
      size="xl"
      speed="0.75s"
      thickness="3px"
      emptyColor="#EEf4FD"
    />
  </Flex>
);

export const ImageOrVideo = ({ src, onError, onLoad, ...props }) => {
  const [isImageErrored, setImageErrored] = useState(false);
  const [isVideoErrored, setVideoErrored] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [isVideoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isImageErrored && isVideoErrored) {
      onError();
    }
  }, [isImageErrored, isVideoErrored, onError]);

  useEffect(() => {
    if (isImageLoaded || isVideoLoaded) {
      onLoad();
      setLoading(false);
    }
  }, [isImageLoaded, isVideoLoaded, onLoad]);

  let render = () => null;
  if (!isImageErrored) {
    render = () => (
      <ChakraImage
        src={src}
        onError={() => setImageErrored(true)}
        onLoad={() => setImageLoaded(true)}
        borderRadius="0.375rem"
        objectFit="contain"
        objectPosition="center"
        opacity={isLoading ? 0 : 1}
        {...props}
      />
    );
  } else if (!isVideoErrored) {
    render = () => (
      <video
        src={src}
        controls={false}
        autoPlay
        loop
        muted
        onError={() => setVideoErrored(true)}
        onCanPlay={() => setVideoLoaded(true)}
        opacity={isLoading ? 0 : 1}
        {...props}
      />
    );
  } else {
    render = () => <FallbackImage opacity={isLoading ? 0 : 1} {...props} />;
  }
  return (
    <Flex
      borderRadius="0.375rem"
      justify="center"
      align="center"
      overflow="hidden"
      {...props}
    >
      <LoadingImage {...props} display={isLoading ? undefined : 'none'} />
      {render()}
    </Flex>
  );
};
