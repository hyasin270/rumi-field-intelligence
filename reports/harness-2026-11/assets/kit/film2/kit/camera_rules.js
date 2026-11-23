// camera_rules.js (film2 kit): the lens, the named views and the lint thresholds in one place.
// v2-visuals owns the numbers (VISUAL_LANGUAGE_v2.md section 4); v2-kit owns the code that reads them. Change with a CHANGELOG line.
// Open with v2-lead (VISUAL_LANGUAGE_v2 section 12.1): W at yaw -14 / pitch -12 where the plan and CAMERA_RULES C3 say face on.
window.CAMERA_RULES = {
  fov: 20, fovTol: 0.1,                                   // VL 4.1: one lens, 20 degrees vertical
  house: { yaw: -14, pitch: -12 },                         // VL 4.2: every W shot, and the start and end of every move
  sRange: { yaw: [-20, -6], pitch: [-17, -3] },           // VL 4.2: S shots may use these, nothing else
  wRange: { yaw: [-14.5, -13.5], pitch: [-12.5, -11.5] },
  // VL 4.3: sprite height on screen at 1080p (a hero sprite), and the camera distance that gives it
  sizes: { wide: [34, 46], room: [270, 320], close: [360, 460] },   // VL 4.3 v1.2+: room a quarter of the frame or more
  sizeTarget: { wide: 40, room: 295, close: 410 },
  actionSafe: { x0: 67, y0: 38, x1: 1853, y1: 1042 },
  graphicsSafe: { x0: 96, y0: 54, x1: 1824, y1: 1026 },   // VL 4.6
  subtitleBand: { y0: 930, y1: 1040 },                     // VL 4.6 / 7: nothing else enters it
  subjectBox: { x0: 480, y0: 300, x1: 1440, y1: 800 },    // VL 4.6
  views: {
    W: { look: [0, -3.4, -2.2], dist: 62, yaw: -14, pitch: -12 },          // VL 10.1 W-centre: the map
    "W-centre": { look: [0, -3.4, -2.2], dist: 62, yaw: -14, pitch: -12 },
    "W-left": { look: [1.9, -2.3, -2.2], dist: 63, yaw: -14, pitch: -12 }, // VL 10.1: model left, the right third clear
    "W-list": { look: [4.8, -3.4, -2.2], dist: 58.2, yaw: -14, pitch: -12 }, // VL 14.1: the model between x 300 and 1110 (solved on the block's corners); the list in x 1168 to 1824
  },
  apertureFinal: { wide: 0, room: 0.1, close: 0.12 },     // VL 15.24: close is 0.12; no shot above 0.12
  apertureMax: 0.12,
  drift: { push: 0.035, yaw: 2.0 },                        // VL 4.5: during a hold, 3 to 4% closer and 1.5 to 2.5 degrees of yaw
  moveMs: [900, 3000],                                     // VL 4.5
};
