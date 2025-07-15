import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';


const { width, height } = Dimensions.get('window');

const index = () => {

  const svgWidth = width;
  const svgHeight = height;

  const points1 = [
    `${0.3 * svgWidth},${0.01 * svgHeight}`,
    `${0.08 * svgWidth},${0.62 * svgHeight}`,
    `${0.95 * svgWidth},${0.32 * svgHeight}`
    ].join(' ');

  const points2 = [
    `${0.7 * svgWidth},${0.99 * svgHeight}`,
    `${0.92 * svgWidth},${0.38 * svgHeight}`,
    `${0.05 * svgWidth},${0.68 * svgHeight}`
    ].join(' ');

  const rectWidth1 = width * 2;
  const rectHeight1 = height * 0.4;

  const rectWidth2 = width * 2;
  const rectHeight2 = height * 0.55;

  const rectWidth3 = width * 2;
  const rectHeight3 = height * 0.75;

  const cx = width / 2;
  const cy = height / 2;

  const x1 = cx - rectWidth1 / 2;
  const y1 = cy - rectHeight1 / 2;

  const x2 = cx - rectWidth2 / 2;
  const y2 = cy - rectHeight2 / 2;
  
  const x3 = cx - rectWidth3 / 2;
  const y3 = cy - rectHeight3 / 2;

  return (
    <View style={styles.container}>

      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="grad1" cx="30%" cy="30%" r="90%">
            <Stop offset="0%" stopColor="#d17dffff" stopOpacity="1" />
            <Stop offset="100%" stopColor="#e8bdffff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad2" cx="90%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#7eff61ff" stopOpacity="1" />
            <Stop offset="100%" stopColor="#baffabff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad3" cx="30%" cy="90%" r="80%">
            <Stop offset="0%" stopColor="#21f8ffff" stopOpacity="1" />
            <Stop offset="100%" stopColor="#b9fdffff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad4" cx="20%" cy="50%" r="90%">
            <Stop offset="0%" stopColor="#ff62f7ff" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#ffa2faff" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="grad5" cx="80%" cy="50%" r="90%">
            <Stop offset="0%" stopColor="#6562ffff" stopOpacity="0.7" />
            <Stop offset="100%" stopColor="#a2a8ffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="30%" cy="30%" r="500" fill="url(#grad1)" />
        <Circle cx="90%" cy="50%" r="500" fill="url(#grad2)" />
        <Circle cx="30%" cy="90%" r="500" fill="url(#grad3)" />

        <Rect x={x1} y={y1} width={rectWidth1} height={rectHeight1} rx="10" fill="white" opacity={0.3} />
        <Rect x={x2} y={y2} width={rectWidth2} height={rectHeight2} rx="10" fill="white" opacity={0.2} />
        <Rect x={x3} y={y3} width={rectWidth3} height={rectHeight3} rx="10" fill="white" opacity={0.1} />

        <Polygon points={points1} fill="url(#grad4)" />
        <Polygon points={points2} fill="url(#grad5)" />
        

      </Svg>
      <View style={styles.mainThing}>
        {/* <Text style={styles.header}>PixPlore</Text> */}
        <Image source={require('./Logo.png')} style={{ width: 220, height: 180}}/>
        <Text style={styles.subtext}>Learning through lenses, growing through curiosity</Text>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
  },
  subtext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center', 
  },
  mainThing: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 0,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
