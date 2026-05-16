// sketch.js — ProControls demo

let gainSlider, masterSlider, vuMeter, rangeSlider, xyPad;
let gainDial, rubberDial, groovedDial, pointerDial, vuDial, ledMeter;
let styleSwitch, filterSwitch;
let waveSelector, reverbSelector, tagSelector;
let playBtn, stopBtn, recBtn;
let gridPattern, gridMatrix;
let multiSlider, adsrDisplay, multiDial;
let channelPanel, markupDisplay, presetMenu, freqSlider;
let controls = [];
let vuLevel   = 0;
let _noiseT   = 0;

const STYLES = ['black', 'stainless', 'white', 'brushed', 'dimpled', 'red', 'blue', 'yellow'];
const LABELS = ['BLACK', 'STEEL', 'WHITE', 'BRUSH', 'DIMPL', 'RED', 'BLUE', 'YLW'];
let currentStyle = 'stainless';

function buildControls() {
  proControlReset();
  ControlStyle = currentStyle;

  // ── ROW 1  Sliders · XYPad · Dials  (y=42, h=190) ──────────────────────────

  gainSlider = new AnalogSlider({
    x: 20, y: 42, height: 190,
    min: 0, max: 30,
    value: gainSlider?.value ?? 15,
    label: 'GAIN', readout: 'raw', decimals: 1,
    theme: { capIndicator: '#ff0000' },
    onChange: v => console.log('gain', v),
  });

  masterSlider = new AnalogSlider({
    x: 92, y: 42, height: 190,
    min: 0, max: 1,
    value: masterSlider?.value ?? 0.85,
    label: 'MASTER', readout: 'db',
    theme: { capIndicator: '#ffcc00' },
  });

  vuMeter = new VUMeter({
    x: 162, y: 42, width: 36, height: 190,
    min: 0, max: 1, value: 0,
    label: 'VU', meterWidth: 10, showFader: false,
  });

  rangeSlider = new RangeSlider({
    x: 206, y: 42, width: 52, height: 190,
    min: 0, max: 1,
    valueLow:  rangeSlider?.valueLow  ?? 0.2,
    valueHigh: rangeSlider?.valueHigh ?? 0.8,
    label: 'RANGE', readout: 'raw', decimals: 2,
    onChange: (lo, hi) => console.log('range', lo, hi),
  });

  xyPad = new XYPad({
    x: 270, y: 42, width: 196, height: 190,
    minX: -1, maxX: 1, minY: -1, maxY: 1,
    valueX: xyPad?.valueX ?? 0,
    valueY: xyPad?.valueY ?? 0,
    label: 'XY',
    crosshairColor: '#ff6600',
    springBack: true,
    onChangeX: vx => console.log('x', vx),
    onChangeY: vy => console.log('y', vy),
  });

  gainDial = new Dial({
    x: 480, y: 52, size: 72,
    min: 0, max: 20,
    value: gainDial?.value ?? 10,
    label: 'GAIN', readout: 'raw', decimals: 0,
    onChange: v => console.log('dial gain', v),
  });

  rubberDial = new Dial({
    x: 560, y: 52, size: 72,
    min: 0, max: 1, value: rubberDial?.value ?? 0.6,
    label: 'CUTOFF', readout: 'raw', decimals: 2,
    style: 'rubber',
  });

  groovedDial = new Dial({
    x: 640, y: 52, size: 72,
    min: 0, max: 1, value: groovedDial?.value ?? 0.4,
    label: 'RESO', readout: 'raw', decimals: 2,
    style: 'grooved',
  });

  pointerDial = new Dial({
    x: 720, y: 52, size: 72,
    min: 0, max: 1, value: pointerDial?.value ?? 0.75,
    label: 'ATTACK', readout: 'raw', decimals: 2,
    style: 'pointer',
  });

  vuDial = new VUDial({
    x: 800, y: 52, size: 72,
    min: 0, max: 1, value: 0,
    label: 'VU', showKnob: false,
  });

  styleSwitch = new Switch({
    x: 882, y: 42, width: 80,
    states: LABELS,
    state: STYLES.indexOf(currentStyle),
    springDefault: STYLES.indexOf('stainless'),
    label: 'STYLE',
    onChange: i => {
      currentStyle = STYLES[i];
      buildControls();
    },
  });

  // ── ROW 2  Selectors · Tags · GridPads · LED  (y=250, h=125) ────────────────

  waveSelector = new Selector({
    x: 20, y: 252, width: 192,
    options: ['SINE', 'SQUARE', 'SAW', 'TRI', 'NOISE'],
    state: waveSelector?.state ?? 0,
    label: 'WAVE',
    onChange: (i, lbl) => console.log('wave', lbl),
  });

  reverbSelector = new Selector({
    x: 20, y: 312, width: 192,
    style: 'arrow',
    options: ['NONE', 'ROOM', 'HALL', 'PLATE', 'SPRING'],
    state: reverbSelector?.state ?? 0,
    label: 'REVERB',
    onChange: (i, lbl) => console.log('reverb', lbl),
  });

  filterSwitch = new Switch({
    x: 224, y: 252, width: 148, height: 96,
    states: ['LP', 'BP', 'HP', 'NOTCH'],
    state: filterSwitch?.state ?? 0,
    label: 'FILTER MODE',
  });

  // Centred under the 5 dials (x=480–872, centre=676)
  playBtn = new IconButton({
    x: 607, y: 156, size: 42, icon: 'play_arrow', toggle: false,
    onClick: () => console.log('play'),
  });
  stopBtn = new IconButton({
    x: 653, y: 156, size: 42, icon: 'stop', toggle: false,
    onClick: () => console.log('stop'),
  });
  recBtn = new IconButton({
    x: 699, y: 156, size: 42, icon: 'fiber_manual_record', toggle: true,
    onClick: s => console.log('rec', s),
  });

  tagSelector = new TagSelector({
    x: 382, y: 252, width: 234,
    words: ['REVERB', 'DELAY', 'CHORUS', 'FLANGER', 'PHASER', 'DISTORT',
            'COMPRESS', 'EQ', 'GATE', 'LIMITER', 'PITCH', 'RING MOD'],
    selected: tagSelector?.selected ?? [],
    label: 'FX CHAIN',
    onChange: (sel, added, removed) => console.log('fx', sel),
  });

  gridPattern = new GridPad({
    x: 628, y: 252,
    rows: 4, cols: 4,
    mode: 'toggle',
    cellSize: 22,
    hGroup: 2, vGroup: 2,
    label: 'PATTERN',
    values: gridPattern?.values ?? null,
    onChange: v => console.log('pattern', v),
  });

  gridMatrix = new GridPad({
    x: 742, y: 252,
    rows: 4, cols: 5,
    mode: 'percent',
    cellSize: 18,
    hGroup: 5,
    label: 'MATRIX',
    values: gridMatrix?.values ?? null,
    onChange: v => console.log('matrix', v),
  });

  ledMeter = new LEDMeter({
    x: 864, y: 296,
    min: 0, max: 1, value: 0,
    readout: 'db', digits: 4, decimals: 1,
    label: 'dB',
  });

  // ── ROW 3  ADSR · Panel · Dials · Menu · SliderSelector · Markup  (y=388) ───

  const R3 = 388;
  const aVal = multiSlider?.slider('A').value ?? 0.3;
  const dVal = multiSlider?.slider('D').value ?? 0.4;
  const sVal = multiSlider?.slider('S').value ?? 0.7;
  const rVal = multiSlider?.slider('R').value ?? 0.8;

  multiSlider = new MultiSlider({
    x: 20, y: R3 + 14,
    width: 60, height: 88,
    readout: 'raw', decimals: 2,
    sliders: {
      'A': { value: aVal, min: 0, max: 2 },
      'D': { value: dVal, min: 0, max: 2 },
      'S': { value: sVal, min: 0, max: 1 },
      'R': { value: rVal, min: 0, max: 4 },
    },
    onChange: v => {
      if (adsrDisplay) {
        adsrDisplay.attack  = v['A'];
        adsrDisplay.decay   = v['D'];
        adsrDisplay.sustain = v['S'];
        adsrDisplay.release = v['R'];
      }
    },
  });

  // MultiSlider renders child labels below the track — account for that height
  adsrDisplay = new ADSRDisplay({
    x: 20, y: R3 + 121,
    width: 252, height: 110,
    attack: aVal, decay: dVal, sustain: sVal, release: rVal,
    label: 'ENV',
  });

  channelPanel = new Panel({
    x: 286, y: R3,
    width: 178, height: 231,
    label: 'CHANNEL',
  });
  channelPanel.add(new Dial({
    x: 14, y: 16, size: 68, min: 0, max: 100,
    value: 60, label: 'FREQ', readout: 'raw', decimals: 0,
  }));
  channelPanel.add(new Dial({
    x: 96, y: 16, size: 68, min: 0, max: 100,
    value: 40, label: 'RES', readout: 'raw', decimals: 0,
  }));
  channelPanel.add(new Switch({
    x: 14, y: 104, width: 150,
    states: ['LP', 'BP', 'HP', 'NOTCH'],
    state: 0, label: 'MODE',
  }));
  channelPanel.add(new Dial({
    x: 14, y: 146, size: 65, min: 0, max: 100,
    value: 75, label: 'MIX', readout: 'raw', decimals: 0,
  }));
  channelPanel.add(new Dial({
    x: 93, y: 146, size: 65, min: 0, max: 100,
    value: 30, label: 'DRIVE', readout: 'raw', decimals: 0,
  }));

  multiDial = new MultiDial({
    x: 476, y: R3,
    size: 64, min: 0, max: 100,
    readout: 'raw', decimals: 0,
    dials: {
      'BASS':   multiDial?.dial('BASS').value   ?? 50,
      'MID':    multiDial?.dial('MID').value    ?? 50,
      'TREBLE': multiDial?.dial('TREBLE').value ?? 50,
    },
    onChange: v => console.log('tone', v),
  });

  presetMenu = new Menu({
    x: 476, y: R3 + 110,
    width: 196,
    orientation: 'popup',
    items: [
      'Init Patch',
      ['Synth Leads', 'Classic Lead', 'Screaming Saw', 'Soft Lead'],
      ['Bass', 'Warm Sub', '808 Kick', 'Pluck Bass'],
      ['Pads', 'String Pad', 'Choir', 'Evolving'],
      'Random',
    ],
    onChange: (lbl, path) => console.log('preset', path),
  });

  freqSlider = new SliderSelector({
    x: 684, y: R3,
    height: 231,
    options: ['16Hz', '64Hz', '250Hz', '1kHz', '4kHz', '16kHz'],
    state: freqSlider?.state ?? 2,
    label: 'FREQ',
    onChange: (i, lbl) => console.log('freq', lbl),
  });

  markupDisplay = new Markup({
    x: 783, y: R3,
    width: 164, height: 231,
    fontSize: 11,
    padding: 10,
    text: `== ProControls ==

A '''p5.js''' control library with a hardware-inspired feel.

''Drag · Scroll · Touch''

'''Controls:'''
* Sliders & Dials
* XYPad & GridPad
* Selectors & Tags
* Panels & Menus

'''Links:'''
[[https://procontrols.org|procontrols.org]]
[[https://p5js.org|p5js.org]]`,
  });

  controls = [
    gainSlider, masterSlider, vuMeter, rangeSlider, xyPad,
    gainDial, rubberDial, groovedDial, pointerDial, vuDial, styleSwitch,
    waveSelector, reverbSelector, filterSwitch,
    playBtn, stopBtn, recBtn,
    tagSelector, gridPattern, gridMatrix, ledMeter,
    multiSlider, adsrDisplay,
    channelPanel, multiDial, presetMenu, freqSlider, markupDisplay,
  ];
}

function setup() {
  createCanvas(970, 640);
  buildControls();
}

function draw() {
  proControlBackground();

  // Simulate VU driven by master fader + slow Perlin noise
  _noiseT += 0.002;
  const target = masterSlider.value * (0.4 + noise(_noiseT) * 0.7);
  vuLevel        = lerp(vuLevel, target, 0.12);
  vuMeter.value  = vuLevel;
  vuDial.value   = vuLevel;
  ledMeter.value = vuLevel;
}
