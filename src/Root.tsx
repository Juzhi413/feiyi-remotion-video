import React from 'react';
import {Composition} from 'remotion';
import {FeiyiSendingVideo} from './FeiyiSendingVideo';

export const Root: React.FC = () => {
  return (
    <Composition
      id="FeiyiSendingVideo"
      component={FeiyiSendingVideo}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
