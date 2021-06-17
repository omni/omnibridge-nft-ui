import { Image as ChakraImage } from '@chakra-ui/react';
import NoImageAvailable from 'assets/no-image-available.svg';
import { fetchImageUri, uriToHttp, uriToHttpAsArray } from 'lib/uriHelpers';
import React, { useEffect, useState } from 'react';

export const Image = React.memo(({ src: uri, ...props }) => {
  const [src, setSrc] = useState(uri);

  useEffect(() => {
    const oldSrc = uriToHttp(uri);
    setSrc(oldSrc);
    const load = async () => {
      const newSrc = uriToHttp(await fetchImageUri(oldSrc));
      setSrc(newSrc);
    };
    load();
  }, [uri]);

  if (src) {
    return <ChakraImage src={src} {...props} />;
  }

  return <ChakraImage src={NoImageAvailable} p="1.5rem" {...props} />;
});

const BAD_SRCS = {};

export const ImageAsArray = React.memo(({ src: uri, ...props }) => {
  const [, refresh] = useState(0);
  const [srcs, setSrcs] = useState([]);

  const src = srcs.find(s => !BAD_SRCS[s]);

  useEffect(() => {
    const oldSrcs = uriToHttpAsArray(uri);
    setSrcs(oldSrcs);
    const load = async () => {
      const newUris = await Promise.all(oldSrcs.map(fetchImageUri));
      const newSrcs = newUris
        .filter(u => !!u)
        .map(uriToHttpAsArray)
        .reduce((t, a) => [...t, ...a], []);
      if (newSrcs.length > 0) {
        setSrcs(newSrcs);
      }
    };
    load();
  }, [uri]);

  if (src) {
    return (
      <ChakraImage
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true;
          refresh(i => i + 1);
        }}
        {...props}
      />
    );
  }

  return <ChakraImage src={NoImageAvailable} p="1.5rem" {...props} />;
});
