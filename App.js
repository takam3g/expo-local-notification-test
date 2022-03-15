import React, {useState, useEffect} from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Notifications from 'expo-notifications';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Button, 
  Platform,
  TouchableOpacity,
} from 'react-native'


const App = () => {

    const [name, setName] = useState()
    const [dateTime, setDateTime] = useState(new Date())
    const [items, setItems] = useState([])
  
    const handleSubmit = () => {
      setItems([...items, {name: name, expiry: dateTime}])
    }
  
    const handleClearAll = () => {
      setItems([])
      
    }
  
  
    //For DateTimePicker
    //https://www.npmjs.com/package/@react-native-community/datetimepicker
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
  
    const onChange = (event, value) => {
      const currentDate = value || dateTime;
      setShow(Platform.OS === 'ios');
      setDateTime(currentDate);
      console.log(dateTime.toLocaleString())
    };
  
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
  
    // const showDatepicker = () => {
    //   showMode('date');
    // };
  
    const showTimepicker = () => {
      showMode('time');
    };
  
  
    //for local notifiation

    const setNotification = (item, index) => {

    // First, set the handler that will cause the notification
    // to show the alert
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Second, call the method
    Notifications.scheduleNotificationAsync({
      content: {
        title: "You set notification for",
        body: `[${index}] ${item.name} : ${item.expiry}`,
      },
      trigger: null,
    });

    //schedule notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Attention",
        body: `${item.name} is expirying soon! : ${item.expiry}`,
      },
      trigger: {
        hour: item.expiry.getHours(),
        minute: item.expiry.getMinutes()
      },
    });

    }
  
  
    return (
      <View style={styles.body}>
        <Text style={styles.text}>
          Enter Item:
        </Text>
        <TextInput 
          style={styles.input}
          placeholder='e.g. Banana'
          onChangeText={(value) => setName(value)}
        />
  
        {/* <Text style={styles.text}>
          Enter Expiry:
        </Text>
        <TextInput 
          style={styles.input}
          placeholder='e.g. Jan 31'
          onChangeText={(value) => setExpiry(value)}
        /> */}
  
      <View>
        {/* <View>
          <Button onPress={showDatepicker} title="Set Expiry Date" />
        </View> */}
        <View>
          <Button onPress={showTimepicker} title="Set Expiry" />
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateTime}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
  
        <Pressable
          onPress={handleSubmit}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : 'skyblue', margin:20},
          ]}
          hitSlop={{top: 10, bottom: 10, right: 10, left: 10}} //10 around button can be pressed as the button as well
        >
          <Text style={styles.text}>
            Submit
          </Text>
        </Pressable>
  
        <Pressable
          onPress={handleClearAll}
          style={({pressed}) => [
            {backgroundColor: pressed ? '#dddddd' : 'skyblue', marginBottom: 50},
          ]}
          hitSlop={{top: 10, bottom: 10, right: 10, left: 10}} //10 around button can be pressed as the button as well
        >
          <Text style={styles.text}>
            Clear All
          </Text>
        </Pressable>
  
        <ScrollView>
          {items.map((item, index) =>
            <TouchableOpacity key={index} style={styles.list} onPress={()=>{setNotification(item, index)}}>
              <Text style={styles.text}>{item.name} -- {item.expiry.toLocaleString()}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
  
      </View>
  )

};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    marginVertical: 60,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    margin: 10,
  },
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  list: {
    width: 350,
    height: 50,
    margin: 10,
    alignItems: 'center',
    backgroundColor: 'pink',
  }

});

export default App