<script lang="ts">
  // https://github.com/efeskucuk/svelte-color-picker/blob/master/src/HsvPicker.svelte
  import { onMount } from "svelte";
  export let color: [number, number, number, number] = [0, 0, 0, 1];
  export let hexValue: string = '#FF0000';

  onMount(() => {
    document.addEventListener("mouseup", endEvents);
    updateFromHex();
  });

  let csDrag = false;
  let hueDrag = false;
  let alphaDrag = false;
  const endEvents = (): void => {
    csDrag = false;
    hueDrag = false;
    alphaDrag = false;
  };

  const csWidth = 240;
  const csHeight = 160;
  const hueWidth = 220;
  const alphaWidth = 220;

  let h = 1;
  let s = 1;
  let v = 1;
  let a = 1;
  let r = 255;
  let g = 0;
  let b = 0;
  $: hr = hsvToRgb(h, 1, 1)[0];
  $: hg = hsvToRgb(h, 1, 1)[1];
  $: hb = hsvToRgb(h, 1, 1)[2];

  const updateFromHex = (): void => {
    let hex = hexValue.replace("#", "");
    if (hex.length !== 6 && !hex.match(/([^A-F0-9])/gi)) {
      let hexFiltered = "";
      if (hex.length === 3) {
        hex.split("").forEach((c) => {
          hexFiltered += c + c;
        });
      } else {
        hexFiltered = hex;
      }
      r = parseInt(hexFiltered.substring(0, 2), 16);
      g = parseInt(hexFiltered.substring(2, 4), 16);
      b = parseInt(hexFiltered.substring(4, 6), 16);
      const hsv = rgbToHSV(r, g, b);
      h = hsv.h;
      s = hsv.s;
      v = hsv.v;
      hueChange();
      updateCsPicker();
      updateHuePicker();      
    }
  };

  const updateCsPicker = (): void => {
    const csPicker: HTMLElement = document.querySelector("#colorsquare-picker");
    const xPercentage = s * 100;
    const yPercentage = (1 - v) * 100;
    csPicker.style.top = yPercentage + "%";
    csPicker.style.left = xPercentage + "%";
  };

  const updateHuePicker = (): void => {
    const huePicker: HTMLElement = document.querySelector("#hue-picker");
    const xPercentage = h * 100;
    huePicker.style.left = xPercentage + "%";
  };

  const colorChangeCallback = (): void => {
    color = [r, g, b, a];
  };

  
  const csDown = () => {
    csDrag = true;
  };

  const csMove = (event) => {
    if (csDrag) {
      s = event.layerX / csWidth;
      v = 1 - event.layerY / csHeight;
      updateCsPicker();
      colorChange();
    }
  };

  const hueDown = () => {
    hueDrag = true;
  };

  const hueMove = (event) => {
    if (hueDrag) {
      const picker: HTMLElement = document.querySelector("#hue-picker");
      const xPercentage = event.layerX / hueWidth;
      picker.style.left = (xPercentage * 100).toFixed(2) + "%";
      h = xPercentage;
      hueChange();
    }
  };

  const alphaDown = () => {
    alphaDrag = true;
  };

  const alphaMove = (event) => {
    if (alphaDrag) {
      const picker: HTMLElement = document.querySelector("#alpha-picker");
      const xPercentage = event.layerX / alphaWidth;
      picker.style.left = (xPercentage * 100).toFixed(2) + "%";
      a = xPercentage;
      colorChange();
    }
  };

  const hueChange = (): void => {
    colorChange();
  };

  const colorChange = (): void => {
    let rgb = hsvToRgb(h, s, v);
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];
    hexValue = rgbaToHex();
    colorChangeCallback();
  };

  // Math algorithms
  const hsvToRgb = (h, s, v): [number, number, number] => {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const rgbaToHex = (): string => {
    let rHex = r.toString(16);
    let gHex = g.toString(16);
    let bHex = b.toString(16);

    if (rHex.length == 1) rHex = "0" + rHex;
    if (gHex.length == 1) gHex = "0" + gHex;
    if (bHex.length == 1) bHex = "0" + bHex;
    return ("#" + rHex + gHex + bHex).toUpperCase();
  };

  const rgbToHSV = (r: number, g: number, b: number): {
    h: number;
    s: number;
    v: number;
  } => {
    let rperc, gperc, bperc, max, min, diff, pr, hnew, snew, vnew;
    rperc = r / 255;
    gperc = g / 255;
    bperc = b / 255;
    max = Math.max(rperc, gperc, bperc);
    min = Math.min(rperc, gperc, bperc);
    diff = max - min;
    vnew = max;
    vnew == 0 ? (snew = 0) : (snew = diff / max);
    for (let i = 0; i < 3; i++) {
      if ([rperc, gperc, bperc][i] === max) {
        pr = i;
        break;
      }
    }
    if (diff == 0) {
      hnew = 0;
      return { h: hnew, s: snew, v: vnew };
    } else {
      switch (pr) {
        case 0:
          hnew = (60 * (((gperc - bperc) / diff) % 6)) / 360;
          break;
        case 1:
          hnew = (60 * ((bperc - rperc) / diff + 2)) / 360;
          break;
        case 2:
          hnew = (60 * ((rperc - gperc) / diff + 4)) / 360;
          break;
      }
      if (hnew < 0) hnew += 6;
    }
    return { h: hnew, s: snew, v: vnew };
  };
</script>

<div class="main-container">
  <div class="colorsquare size" style="background-color:{`rgba(${hr},${hg},${hb},1)`};">
    <div class="saturation-gradient">
      <div class="value-gradient">
        <div id="colorsquare-picker" />
        <div
          id="colorsquare-event"
          on:mousedown={csDown}
          on:mousemove={csMove}
        />
      </div>
    </div>
  </div>

  <div class="hue-selector">
    <div id="hue-picker" />
    <div
      id="hue-event"
      on:mousedown={hueDown}
      on:mousemove={hueMove} />
  </div>

  <div class="alpha-selector">
    <div class="alpha-value" />
    <div id="alpha-picker" />
    <div
      id="alpha-event"
      on:mousedown={alphaDown}
      on:mousemove={alphaMove} />
  </div>

  <div class="color-info-box">
    <div class="color-picked-bg">
      <div class="color-picked" style="background-color:rgba({r},{g},{b},{a})" />
    </div>

    <div class="hex-text-block">
      <input class="hex" type="text" bind:value={hexValue} on:change={() => updateFromHex()} />
    </div>

    <div class="rgb-text-div">
      <div class="rgb-text-block">
        <input class="rgb" type="number" bind:value={r} min="0" max="255" on:change={() => colorChange()} />
        <p class="text-label">R</p>
      </div>

      <div class="rgb-text-block">
        <input class="rgb" type="number" bind:value={g} min="0" max="255" on:change={() => colorChange()} />
        <p class="text-label">G</p>
      </div>

      <div class="rgb-text-block">
        <input class="rgb" type="number" bind:value={b} min="0" max="255" on:change={() => colorChange()} />
        <p class="text-label">B</p>
      </div>

      <div class="rgb-text-block">
        <input class="rgb" type="number" bind:value={a} min="0" max="255" on:change={() => colorChange()} />
        <p class="text-label">A</p>
      </div>
    </div>
  </div>
</div>

<style>
  .main-container {
    width: 240px;
    height: 265px;
    background: #f2f2f2;
    border-radius: 1px;
    -webkit-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    -moz-box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.51);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .saturation-gradient {
    background: linear-gradient(
      to right,
      rgb(255, 255, 255),
      rgba(255, 255, 255, 0)
    );
    width: 240px;
    height: 160px;
  }
  .value-gradient {
    background: linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0));
    overflow: hidden;
    width: 240px;
    height: 160px;
  }
  .hue-selector {
    background: linear-gradient(
      to right,
      #ff0000 0%,
      #ffff00 17%,
      #00ff00 33%,
      #00ffff 50%,
      #0000ff 67%,
      #ff00ff 83%,
      #ff0000 100%
    );
    margin: 15px 10px 10px 10px;
    border-radius: 10px;
    height: 10px;
  }
  #hue-picker {
    background: #fff;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: 0%;
    position: relative;
    cursor: default;
    transform: translate(-5px, -1px);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  }
  #hue-event {
    width: 236px;
    height: 14px;
    transform: translate(-8px, -14px);
    cursor: default;
    touch-action: none;
  }
  .alpha-selector {
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
      linear-gradient(-45deg, #808080 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #808080 75%),
      linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 10px 10px;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    margin: 10px 10px;
    border-radius: 10px;
    height: 10px;
    position: relative;
  }
  #alpha-picker {
    background: #fff;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: 100%;
    position: relative;
    cursor: default;
    transform: translate(-5px, -11px);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.67);
  }
  #alpha-event {
    width: 236px;
    height: 14px;
    transform: translate(-8px, -24px);
    cursor: default;
    touch-action: none;
  }
  .alpha-value {
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  .colorsquare {
    background: rgb(255, 0, 0);
  }
  #colorsquare-picker {
    margin: 0;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid #fffb;
    position: relative;
    transform: translate(-9px, -9px);
    left: 100%;
  }
  #colorsquare-event {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translate(0, -16px);
    touch-action: none;
  }
  .color-info-box {
    margin: 10px;
    width: 100%;
    height: 22px;
    vertical-align: middle;
    position: relative;
  }
  .color-picked {
    width: 18px;
    height: 18px;
    border-radius: 2px;
    background: rgba(255, 0, 0, 1);
    display: inline-block;
  }
  .color-picked-bg {
    background-image: linear-gradient(45deg, #808080 25%, transparent 25%),
      linear-gradient(-45deg, #808080 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #808080 75%),
      linear-gradient(-45deg, transparent 75%, #808080 75%);
    background-size: 10px 10px;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    border: 2px solid #fff;
    border-radius: 4px;
    width: 18px;
    height: 18px;
    color: #fff;
    display: inline-block;
  }
  .hex-text-block {
    display: inline-block;
    background: white;
    border-radius: 2px;
    padding: 2px;
    border: 1px solid #e3e3e3;
    height: 16px;
    width: 54px;
    vertical-align: top;
    text-align: center;
  }
  .rgb-text-block {
    display: inline-block;
    background: white;
    border-radius: 2px;
    padding: 2px;
    margin: 0 1px;
    border: 1px solid #dcdcdc;
    height: 16px;
    width: 23px;
    vertical-align: top;
    text-align: center;
  }
  .rgb-text-div {
    right: 10%;
    display: inline-block;
    vertical-align: top;
    position: absolute;
  }
  .text-label {
    position: relative;
    top: -12px;
    font-family: sans-serif;
    font-size: small;
    color: #888;
  }
  input {
    border: 1px solid black;
    border-radius: 2px;
    font-family: sans-serif;
    margin: 0;
    display: inline-block;
    font-size: 12px;
    font-size-adjust: 0.5;
  }
  input.hex {
    width: 50px;
  }
  input.rgb {
    width: 20px;
  }
</style>
