import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const colors = {
  rice: '#f4ead6',
  riceDeep: '#ded0ae',
  cinnabar: '#b93b2f',
  cinnabarDark: '#76241f',
  indigo: '#173d66',
  ink: '#1d1913',
  gold: '#d6a84d',
  paleGold: '#f3d991',
  jade: '#6f8f82',
};

const FPS = 30;
const seconds = (value: number) => value * FPS;
const FREEZE_FRAME = seconds(11);
const useTimelineFrame = () => Math.min(useCurrentFrame(), FREEZE_FRAME);

const skills = ['技艺', '纹样', '器物', '故事'];
const phases = ['传承', '传播', '再生'];
const pathWords = ['坚守匠心', '活态传承', '数字连接', '走进生活'];

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const PaperTexture: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.rice,
      backgroundImage: `
        radial-gradient(circle at 13% 18%, rgba(185, 59, 47, 0.12) 0 2px, transparent 3px),
        radial-gradient(circle at 78% 32%, rgba(23, 61, 102, 0.12) 0 2px, transparent 3px),
        radial-gradient(circle at 44% 80%, rgba(214, 168, 77, 0.13) 0 2px, transparent 3px),
        repeating-linear-gradient(92deg, rgba(29, 25, 19, 0.035) 0 1px, transparent 1px 8px),
        repeating-linear-gradient(3deg, rgba(255, 255, 255, 0.22) 0 2px, transparent 2px 12px),
        linear-gradient(135deg, #fbf4e4 0%, #eadbbd 48%, #f7edd8 100%)
      `,
    }}
  />
);

const Seal: React.FC<{left: number; top: number; text: string; scale?: number}> = ({
  left,
  top,
  text,
  scale = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: 110 * scale,
      height: 110 * scale,
      border: `${5 * scale}px solid ${colors.cinnabar}`,
      color: colors.cinnabar,
      fontSize: 30 * scale,
      fontWeight: 800,
      letterSpacing: 2,
      lineHeight: `${48 * scale}px`,
      padding: 8 * scale,
      textAlign: 'center',
      whiteSpace: 'pre-line',
      transform: 'rotate(-8deg)',
      boxShadow: `0 0 0 ${2 * scale}px rgba(185, 59, 47, 0.18) inset`,
      opacity: 0.88,
    }}
  >
    {text}
  </div>
);

const ParticleField: React.FC = () => {
  const frame = useTimelineFrame();
  const fieldIn = interpolate(frame, [seconds(2.4), seconds(3.2)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <>
      {Array.from({length: 56}).map((_, index) => {
        const x = 130 + ((index * 193) % 2500);
        const y = 100 + ((index * 89) % 760);
        const delay = index * 2.7;
        const shimmer = Math.sin((frame - delay) / 13) * 0.5 + 0.5;
        const drift = Math.sin((frame + index * 9) / 24) * 10;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x + drift,
              top: y + Math.cos((frame + index) / 20) * 7,
              width: 3 + (index % 4),
              height: 3 + (index % 4),
              borderRadius: 999,
              background: index % 3 === 0 ? colors.gold : index % 3 === 1 ? colors.cinnabar : colors.indigo,
              opacity: fieldIn * (0.18 + shimmer * 0.42),
              boxShadow: index % 3 === 0 ? `0 0 16px ${colors.gold}` : 'none',
            }}
          />
        );
      })}
    </>
  );
};

const FlowLine: React.FC = () => {
  const frame = useTimelineFrame();
  const dashOffset = -(frame - seconds(2.5)) * 8;
  const lineIn = interpolate(frame, [seconds(2.45), seconds(3.1)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glowLength = interpolate(frame, [seconds(2.5), seconds(6), seconds(8.6)], [0, 1500, 2700], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <svg
      width="2660"
      height="460"
      viewBox="0 0 2660 460"
      style={{position: 'absolute', left: 120, top: 360, overflow: 'visible'}}
    >
      <path
        d="M 20 220 C 310 64, 520 92, 770 210 S 1215 357, 1515 195 S 2050 63, 2520 215"
        fill="none"
        stroke={colors.indigo}
        strokeWidth="5"
        strokeDasharray="18 24"
        strokeDashoffset={dashOffset}
        opacity={0.72 * lineIn}
      />
      <path
        d="M 20 220 C 310 64, 520 92, 770 210 S 1215 357, 1515 195 S 2050 63, 2520 215"
        fill="none"
        stroke={colors.gold}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${glowLength} 2800`}
        opacity={0.92 * lineIn}
        filter="drop-shadow(0 0 14px rgba(214,168,77,.8))"
      />
      <path
        d="M 20 240 C 310 84, 520 112, 770 230 S 1215 377, 1515 215 S 2050 83, 2520 235"
        fill="none"
        stroke={colors.paleGold}
        strokeWidth="2"
        opacity={0.74 * lineIn}
      />
    </svg>
  );
};

const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  sub?: string;
  start: number;
  tone?: 'red' | 'blue' | 'gold';
}> = ({x, y, label, sub, start, tone = 'gold'}) => {
  const frame = useTimelineFrame();
  const active = spring({frame: frame - start, fps: 30, config: {damping: 14, stiffness: 80}});
  const pulse = Math.sin((frame - start) / 8) * 0.5 + 0.5;
  const color = tone === 'red' ? colors.cinnabar : tone === 'blue' ? colors.indigo : colors.gold;

  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: clamp(active), transform: `scale(${0.75 + active * 0.25})`}}>
      <div
        style={{
          width: 134,
          height: 134,
          borderRadius: 999,
          background: `radial-gradient(circle, ${colors.rice} 0 38%, ${color} 40% 44%, rgba(255,255,255,0) 46%)`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 ${18 + pulse * 22}px ${color}`,
          display: 'grid',
          placeItems: 'center',
          color,
          fontWeight: 900,
          fontSize: 32,
        }}
      >
        {label}
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 14,
            padding: '10px 20px',
            background: 'rgba(244, 234, 214, 0.78)',
            border: `2px solid ${color}`,
            borderRadius: 999,
            color: colors.ink,
            fontSize: 24,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 12px 24px rgba(29,25,19,.12)',
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

const MessageBubble: React.FC<{left: number; top: number; text: string; start: number; accent: string}> = ({
  left,
  top,
  text,
  start,
  accent,
}) => {
  const frame = useTimelineFrame();
  const entrance = spring({frame: frame - start, fps: 30, config: {damping: 16, stiffness: 100}});
  const float = Math.sin((frame - start) / 18) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: top + float,
        opacity: clamp(entrance),
        transform: `translateY(${(1 - entrance) * 35}px) scale(${0.9 + entrance * 0.1})`,
        padding: '18px 28px',
        borderRadius: '28px 28px 28px 6px',
        background: 'rgba(255, 249, 233, 0.88)',
        border: `3px solid ${accent}`,
        color: colors.ink,
        fontSize: 30,
        fontWeight: 800,
        boxShadow: '0 18px 34px rgba(29,25,19,.16)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{color: accent, marginRight: 12}}>●</span>
      {text}
    </div>
  );
};


const Workshop: React.FC = () => {
  const frame = useTimelineFrame();
  const appear = spring({frame: frame - seconds(0.25), fps: FPS, config: {damping: 18, stiffness: 62}});
  const ember = interpolate(frame, [seconds(1.2), seconds(2.5)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 380,
        width: 420,
        height: 360,
        opacity: clamp(appear),
        transform: `translateY(${(1 - appear) * 44}px)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          width: 360,
          height: 92,
          clipPath: 'polygon(50% 0, 100% 76%, 92% 100%, 8% 100%, 0 76%)',
          background: `linear-gradient(135deg, ${colors.cinnabarDark}, ${colors.cinnabar})`,
          boxShadow: '0 18px 28px rgba(29,25,19,.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 54,
          top: 104,
          width: 292,
          height: 190,
          border: `5px solid ${colors.ink}`,
          borderTop: 0,
          background: 'rgba(255,249,233,.62)',
          boxShadow: 'inset 0 0 0 8px rgba(214,168,77,.12)',
        }}
      />
      <div style={{position: 'absolute', left: 112, top: 172, width: 172, height: 26, background: colors.indigo, borderRadius: 16}} />
      <div style={{position: 'absolute', left: 118, top: 198, width: 160, height: 64, border: `4px solid ${colors.gold}`, borderTop: 0}} />
      <div style={{position: 'absolute', left: 152, top: 130, width: 58, height: 58, borderRadius: 999, background: colors.riceDeep, border: `4px solid ${colors.ink}`}} />
      <div style={{position: 'absolute', left: 164, top: 188, width: 38, height: 82, background: colors.cinnabar, borderRadius: 18}} />
      <div
        style={{
          position: 'absolute',
          left: 208,
          top: 196,
          width: 92,
          height: 8,
          background: colors.ink,
          transform: 'rotate(-18deg)',
          transformOrigin: 'left center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 278,
          top: 176,
          width: 52,
          height: 52,
          borderRadius: 999,
          background: `rgba(214,168,77,${0.28 + ember * 0.45})`,
          boxShadow: `0 0 ${18 + ember * 30}px ${colors.gold}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 304,
          padding: '12px 22px',
          borderRadius: 999,
          background: 'rgba(255,249,233,.86)',
          border: `3px solid ${colors.cinnabar}`,
          color: colors.cinnabarDark,
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        传统工坊
      </div>
    </div>
  );
};

const Phone: React.FC = () => {
  const frame = useTimelineFrame();
  const scanProgress = Math.max(0, frame - seconds(6)) % 74;
  const scan = interpolate(scanProgress, [0, 74], [-80, 470]);
  const appear = spring({frame: frame - seconds(6), fps: FPS, config: {damping: 18, stiffness: 70}});
  const playback = spring({frame: frame - seconds(6.55), fps: FPS, config: {damping: 15, stiffness: 95}});
  const likes = ['▶', '赞', '评', '藏'];

  return (
    <div
      style={{
        position: 'absolute',
        left: 1940,
        top: 185,
        width: 290,
        height: 560,
        borderRadius: 46,
        background: `linear-gradient(150deg, ${colors.ink}, #2f2a21)`,
        padding: 18,
        opacity: clamp(appear),
        transform: `rotate(7deg) translateY(${(1 - appear) * 60}px)`,
        boxShadow: '0 32px 60px rgba(29,25,19,.34)',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 34,
          overflow: 'hidden',
          position: 'relative',
          background: `linear-gradient(180deg, rgba(23,61,102,.95), rgba(244,234,214,.96))`,
          border: `3px solid ${colors.gold}`,
        }}
      >
        <div style={{position: 'absolute', inset: 24, border: `3px dashed ${colors.paleGold}`, borderRadius: 22}} />
        <div style={{position: 'absolute', left: 52, top: 82, color: colors.rice, fontSize: 30, fontWeight: 900}}>数字连接</div>
        <div style={{position: 'absolute', left: 54, top: 145, color: colors.paleGold, fontSize: 22, fontWeight: 700}}>SCAN CULTURE</div>
        <div
          style={{
            position: 'absolute',
            left: 16,
            top: scan,
            width: 258,
            height: 54,
            background: 'linear-gradient(180deg, rgba(243,217,145,0), rgba(243,217,145,.82), rgba(243,217,145,0))',
            filter: 'blur(1px)',
            boxShadow: `0 0 30px ${colors.paleGold}`,
          }}
        />
        <div style={{position: 'absolute', left: 62, top: 256, width: 162, height: 162, border: `8px solid ${colors.cinnabar}`, borderRadius: 18}} />
        <div style={{position: 'absolute', left: 91, top: 285, width: 104, height: 104, border: `7px solid ${colors.indigo}`, borderRadius: 14}} />
        <div
          style={{
            position: 'absolute',
            left: 106,
            top: 318,
            width: 74,
            height: 74,
            borderRadius: 999,
            background: 'rgba(255,249,233,.86)',
            display: 'grid',
            placeItems: 'center',
            color: colors.cinnabar,
            fontSize: 36,
            fontWeight: 900,
            opacity: clamp(playback),
            transform: `scale(${0.72 + playback * 0.28})`,
          }}
        >
          ▶
        </div>
        {likes.slice(1).map((item, index) => {
          const iconIn = spring({frame: frame - seconds(6.85) - index * 11, fps: FPS, config: {damping: 14, stiffness: 80}});
          return (
            <div
              key={item}
              style={{
                position: 'absolute',
                right: 24,
                bottom: 120 - index * 60,
                width: 48,
                height: 48,
                borderRadius: 999,
                background: 'rgba(255,249,233,.9)',
                border: `2px solid ${index === 1 ? colors.indigo : colors.gold}`,
                color: index === 1 ? colors.indigo : colors.cinnabar,
                display: 'grid',
                placeItems: 'center',
                fontSize: 22,
                fontWeight: 900,
                opacity: clamp(iconIn),
                transform: `translateX(${(1 - iconIn) * 34}px)`,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TitleBlock: React.FC = () => {
  const frame = useTimelineFrame();
  const titleIn = spring({frame, fps: FPS, config: {damping: 16, stiffness: 58}});
  return (
    <div style={{position: 'absolute', left: 170, top: 140, opacity: clamp(titleIn), transform: `translateY(${(1 - titleIn) * 46}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <div style={{width: 110, height: 10, background: colors.cinnabar}} />
        <div style={{color: colors.indigo, fontSize: 30, letterSpacing: 8, fontWeight: 900}}>信息可视化动画</div>
      </div>
      <div
        style={{
          marginTop: 24,
          color: colors.ink,
          fontSize: 92,
          fontWeight: 950,
          letterSpacing: 4,
          textShadow: `4px 4px 0 rgba(214,168,77,.32)`,
        }}
      >
        非遗正在发送中
      </div>
      <div style={{marginTop: 22, color: colors.cinnabarDark, fontSize: 38, fontWeight: 800, letterSpacing: 2}}>
        一条从手艺人到当代生活的文化消息
      </div>
    </div>
  );
};

const SkillCards: React.FC = () => {
  const frame = useTimelineFrame();
  return (
    <div style={{position: 'absolute', left: 570, top: 695, display: 'flex', gap: 22}}>
      {skills.map((skill, index) => {
        const pop = spring({frame: frame - seconds(3.05) - index * 18, fps: FPS, config: {damping: 13, stiffness: 90}});
        return (
          <div
            key={skill}
            style={{
              width: 126,
              height: 126,
              display: 'grid',
              placeItems: 'center',
              color: index % 2 ? colors.indigo : colors.cinnabar,
              fontSize: 34,
              fontWeight: 900,
              background: 'rgba(255, 248, 226, .78)',
              border: `3px solid ${index % 2 ? colors.indigo : colors.cinnabar}`,
              boxShadow: `inset 0 0 0 8px rgba(214,168,77,.15), 0 18px 24px rgba(29,25,19,.10)`,
              opacity: clamp(pop),
              transform: `translateY(${(1 - pop) * 35}px) rotate(${index % 2 ? 3 : -3}deg)`,
            }}
          >
            {skill}
          </div>
        );
      })}
    </div>
  );
};

const PhaseRibbon: React.FC = () => (
  <div style={{position: 'absolute', left: 1170, top: 155, display: 'flex', gap: 28}}>
    {phases.map((phase, index) => (
      <MessageBubble key={phase} left={index * 190} top={index % 2 ? 66 : 0} text={phase} start={seconds(6.35) + index * 18} accent={index === 1 ? colors.indigo : colors.gold} />
    ))}
  </div>
);

const ClosingStatement: React.FC = () => {
  const frame = useTimelineFrame();
  const show = spring({frame: frame - seconds(9), fps: FPS, config: {damping: 18, stiffness: 64}});
  return (
    <div
      style={{
        position: 'absolute',
        left: 1770,
        top: 800,
        width: 880,
        opacity: clamp(show),
        transform: `translateX(${(1 - show) * 80}px)`,
      }}
    >
      <div style={{color: colors.ink, fontSize: 46, fontWeight: 950, letterSpacing: 2}}>
        非遗不止于过去，更在于当下与未来
      </div>
      <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap'}}>
        {pathWords.map((word, index) => (
          <React.Fragment key={word}>
            <span
              style={{
                padding: '12px 18px',
                borderRadius: 999,
                border: `2px solid ${index % 2 ? colors.indigo : colors.cinnabar}`,
                color: index % 2 ? colors.indigo : colors.cinnabar,
                background: 'rgba(255,249,233,.8)',
                fontSize: 27,
                fontWeight: 850,
              }}
            >
              {word}
            </span>
            {index < pathWords.length - 1 ? <span style={{fontSize: 32, color: colors.gold, fontWeight: 900}}>→</span> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const FeiyiSendingVideo: React.FC = () => {
  const frame = useTimelineFrame();
  const {durationInFrames} = useVideoConfig();
  const cameraX = interpolate(
    frame,
    [0, seconds(2.4), seconds(6), seconds(8.8), seconds(10.4), durationInFrames - 1],
    [0, -70, -590, -930, -820, -820],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const cameraScale = interpolate(frame, [seconds(9), seconds(10.4), durationInFrames - 1], [1, 0.92, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const finalGlow = interpolate(frame, [seconds(9), seconds(10.5), durationInFrames - 1], [0, 1, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{fontFamily: 'Noto Serif CJK SC, Source Han Serif SC, SimSun, serif', overflow: 'hidden'}}>
      <PaperTexture />
      <AbsoluteFill style={{background: `radial-gradient(circle at 78% 40%, rgba(214,168,77,${0.08 + finalGlow * 0.18}), transparent 34%)`}} />
      <div
        style={{
          position: 'absolute',
          width: 2860,
          height: 1080,
          transform: `translateX(${cameraX}px) scale(${cameraScale})`,
          transformOrigin: '960px 540px',
          willChange: 'transform',
        }}
      >
        <ParticleField />
        <Seal left={80} top={795} text="非遗\n活态" />
        <Seal left={2420} top={92} text="未来\n已达" scale={0.88} />
        <TitleBlock />
        <FlowLine />
        <Workshop />
        <Node x={470} y={384} label="源" sub="手艺人｜文化的源头" start={seconds(0.75)} tone="red" />
        <SkillCards />
        <Node x={1010} y={510} label="传" start={seconds(4.15)} tone="gold" />
        <Node x={1470} y={362} label="播" start={seconds(5.05)} tone="blue" />
        <Node x={2145} y={520} label="生" start={seconds(7.6)} tone="red" />
        <MessageBubble left={880} top={262} text="文化消息已启程" start={seconds(3.25)} accent={colors.gold} />
        <PhaseRibbon />
        <Phone />
        <ClosingStatement />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background: `linear-gradient(0deg, rgba(29,25,19,.16), transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
