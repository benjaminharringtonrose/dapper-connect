/* eslint-disable @typescript-eslint/ban-types */
import React, { Component } from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";

const randseed = new Array(4);

interface BlockieProps {
  seed: string;
  size: number;
  scale: number;
  color?: string;
  bgcolor?: string;
  spotcolor?: string;
}

class Blockie extends Component<BlockieProps, {}> {
  seedrand(seed) {
    for (let i = 0; i < randseed.length; i++) {
      randseed[i] = 0;
    }

    for (let i = 0; i < seed.length; i++) {
      randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
    }
  }

  rand() {
    const t = randseed[0] ^ (randseed[0] << 11);

    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

    return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
  }

  createColor() {
    const h = Math.floor(this.rand() * 360);
    const s = this.rand() * 60 + 40 + "%";
    const l = (this.rand() + this.rand() + this.rand() + this.rand()) * 25 + "%";

    const color = "hsl(" + h + "," + s + "," + l + ")";

    return color;
  }

  createImageData(size) {
    const width = size;
    const height = size;

    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;

    const data = [];

    for (let y = 0; y < height; y++) {
      let row = [];

      for (let x = 0; x < dataWidth; x++) {
        row[x] = Math.floor(this.rand() * 2.3);
      }

      const r = row.slice(0, mirrorWidth);

      r.reverse();

      row = row.concat(r);

      for (let i = 0; i < row.length; i++) {
        data.push(row[i]);
      }
    }

    return data;
  }

  renderIcon(size, scale) {
    const seed = this.props.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

    this.seedrand(seed);

    const color = this.props.color || this.createColor();
    const bgcolor = this.props.bgcolor || this.createColor();
    const spotcolor = this.props.spotcolor || this.createColor();

    const imageData = this.createImageData(size);
    const width = Math.sqrt(imageData.length);

    return imageData.map((item, i) => {
      let fill = bgcolor;

      if (item) {
        if (item === 1) {
          fill = color;
        } else {
          fill = spotcolor;
        }
      }

      const row = Math.floor(i / size);
      const col = i % size;

      return (
        <Rect key={i} x={row * scale} y={col * scale} width={scale} height={scale} fill={fill} />
      );
    });
  }

  render() {
    const size = this.props.size || 8;
    const scale = this.props.scale || 8;

    return (
      <View>
        <View style={{ borderRadius: (size * scale) / 2, overflow: "hidden" }}>
          <Svg height={size * scale} width={size * scale}>
            {this.renderIcon(size, scale)}
          </Svg>
        </View>
      </View>
    );
  }
}

export default Blockie;
