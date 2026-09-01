import type { IconData } from './icon'

// Direct clean imports from @iconify-icons/noto
import astronaut from '@iconify-icons/noto/astronaut'
import rocket from '@iconify-icons/noto/rocket'
import videoGame from '@iconify-icons/noto/video-game'
import trophy from '@iconify-icons/noto/trophy'
import brain from '@iconify-icons/noto/brain'
import puzzlePiece from '@iconify-icons/noto/puzzle-piece'
import lightBulb from '@iconify-icons/noto/light-bulb'
import gear from '@iconify-icons/noto/gear'
import glowingStar from '@iconify-icons/noto/glowing-star'
import sparkles from '@iconify-icons/noto/sparkles'
import treasureChest from '@iconify-icons/noto/treasure-chest'
import redQuestionMark from '@iconify-icons/noto/red-question-mark'
import shield from '@iconify-icons/noto/shield'
import speakerHighVolume from '@iconify-icons/noto/speaker-high-volume'
import mutedSpeaker from '@iconify-icons/noto/muted-speaker'
import heartHands from '@iconify-icons/noto/heart-hands'
import artistPalette from '@iconify-icons/noto/artist-palette'

// Direct clean package subpath imports from @iconify-icons/material-symbols
import volunteerActivismRounded from '@iconify-icons/material-symbols/volunteer-activism-rounded'
import volumeUpRounded from '@iconify-icons/material-symbols/volume-up-rounded'
import volumeOffRounded from '@iconify-icons/material-symbols/volume-off-rounded'
import videogameAssetRounded from '@iconify-icons/material-symbols/videogame-asset-rounded'
import verifiedRounded from '@iconify-icons/material-symbols/verified-rounded'

export const Icons: Record<string, IconData> = {
  // Navigation & Core
  rocketLaunch: rocket as IconData,
  gamepad: videoGame as IconData,
  trophy: trophy as IconData,
  profile: astronaut as IconData,
  settings: gear as IconData,

  // App Features & Games
  puzzle: puzzlePiece as IconData,
  brain: brain as IconData,
  quiz: redQuestionMark as IconData,
  lightbulb: lightBulb as IconData,
  shapes: artistPalette as IconData,
  treasureChest: treasureChest as IconData,
  inclusiveHands: volunteerActivismRounded as IconData,
  heartHands: heartHands as IconData,
  star: glowingStar as IconData,
  sparkles: sparkles as IconData,
  shieldCheck: shield as IconData,
  verified: verifiedRounded as IconData,
  volumeUp: volumeUpRounded as IconData,
  volumeOff: volumeOffRounded as IconData,
  speakerHigh: speakerHighVolume as IconData,
  speakerMuted: mutedSpeaker as IconData,
  videogameAsset: videogameAssetRounded as IconData,

  // Noto Astronaut
  astronautNoto: astronaut as IconData,

  // App Store / Google Play
  apple: {
    width: 24,
    height: 24,
    body: `<path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.12-1.96.99-3.11-1 .04-2.18.68-2.88 1.5-.61.7-.99 1.83-.87 2.92 1.1.08 2.1-.49 2.76-1.31z"/>`
  },

  googlePlay: {
    width: 24,
    height: 24,
    body: `<path fill="currentColor" d="M3.6 2.25c-.37.38-.6 1-.6 1.75v16c0 .75.23 1.37.6 1.75l.1.1 9.5-9.5v-.22l-9.5-9.5-.1.12zm12.3 9.47l-2.8-2.8-9.5 9.5 12.3-6.7zm-2.8-3.4l2.8-2.8-12.3-6.7 9.5 9.5zm3.6 1.9l2.7 1.5c.8.44.8 1.16 0 1.6l-2.7 1.5-3.1-3.1 3.1-3.1z"/>`
  }
}
