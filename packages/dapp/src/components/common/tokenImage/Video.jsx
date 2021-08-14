import { Flex, Image as ChakraImage, Spinner } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import { DEFAULT_IMAGE_TIMEOUT } from 'lib/constants';
import { fetchImageUri, uriToHttpAsArray } from 'lib/uriHelpers';
import React, { useEffect, useRef, useState } from 'react';

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

const BAD_SRCS = {};
const IMAGE_TIMEOUT = 'image-timeout';

export const Video = ({ uri, ...props }) => {
  const [, refresh] = useState(0);
  const [srcs, setSrcs] = useState([]);

  const src = srcs.find(s => !BAD_SRCS[s]);
  const timer = useRef(null);

  useEffect(() => {
    const oldSrcs = uriToHttpAsArray(uri);

    setSrcs(oldSrcs);

    let isSubscribed = true;
    const load = async () => {
      const newUris = await Promise.all(oldSrcs.map(fetchImageUri));
      const newSrcs = newUris
        .filter(u => !!u)
        .map(uriToHttpAsArray)
        .reduce((t, a) => [...t, ...a], []);

      if (newSrcs.length > 0) {
        setSrcs(newSrcs);
      }
      timer.current = setTimeout(() => {
        if (isSubscribed) {
          sessionStorage.setItem(uri, IMAGE_TIMEOUT);
          setSrcs([]);
        }
      }, DEFAULT_IMAGE_TIMEOUT);
    };
    const sessionSrc = sessionStorage.getItem(uri);
    if (sessionSrc) {
      setSrcs(sessionSrc === IMAGE_TIMEOUT ? [] : [sessionSrc]);
    } else {
      load();
    }
    return () => {
      isSubscribed = false;
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [uri]);

  if (src) {
    return (
      <Flex
        borderRadius="0.375rem"
        justify="center"
        align="center"
        overflow="hidden"
        {...props}
      >
        <video
          src={src}
          controls={false}
          autoPlay
          loop
          muted
          fallback={<LoadingImage {...props} />}
          onError={() => {
            if (src) BAD_SRCS[src] = true;
            refresh(i => i + 1);
          }}
          onCanPlay={() => {
            if (timer.current) {
              clearTimeout(timer.current);
            }
            sessionStorage.setItem(uri, src);
          }}
          {...props}
        />
      </Flex>
    );
  }

  return <FallbackImage {...props} />;
};
