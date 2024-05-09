import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BLEAPI,{rssiToDistance} from './useBLE';
import { useEffect,useState } from 'react';

//const [variable, setVariable] = useState(initialValueForTheVariable)
//useEffect(()=>{} get triggered after the change of a variable,[list of dependenceis])

const myAPI = new BLEAPI();

export default function App() {
  myAPI.checkPermissions();
  const [devices,setDevices] = useState({});

  const [myDevice, setMyDevice] = useState(0);

  const startDeviceScan = () => {
    myAPI.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        console.log(error);
        // Retry scanning after a delay
        setTimeout(startDeviceScan, 200); // Retry after 1 second
        return;
      }

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      setDevices(prevDvices => {
        if (device.localName == "HMSoft"){
          setMyDevice(parseInt(rssiToDistance(device.rssi)*100));
          return{...prevDvices,[device.id]:device.rssi};
        }
        else{
          return prevDvices;
        }
      });
    });
  };

  useEffect(() => {myAPI.checkPermissions();startDeviceScan();devices["HMSoft"]}, []); // Call useEffect only once for initialization

  return (
    <View  style={{flex:1, backgroundColor:"plum",justifyContent:"center", alignItems:"center"}}>
       {Object.entries(devices).map(([deviceId, rssi]) => (
        <Text key={deviceId}>{`Device ID: ${deviceId}, RSSI: ${rssi}, distance =${parseInt(rssiToDistance(rssi)*100)}`}</Text>
      ))}

 
      <View style={{height:100,width:100,backgroundColor:"white"}}>

      <View style={{position:'absolute',bottom:0,left:0,height:3,width:3,backgroundColor:"red"}}></View>
      <View style={{position:'absolute',bottom:0,left:100,height:3,width:3,backgroundColor:"green"}}></View>
      <View style={{position:'absolute',bottom:100,left:0,height:3,width:3,backgroundColor:"blue"}}></View>
      <View style={{position:'absolute',bottom:0, left:myDevice,height:3,width:3,backgroundColor:"black"}}></View>

    </View>
    <Text></Text>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
