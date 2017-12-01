/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import * as firebase from 'firebase';
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AppRegistry,
  ActivityIndicator,
  AsyncStorage,
  Navigator,
  ToolbarAndroid,
  ListView
} from 'react-native';

const instructions = Platform.select({
  ios: 'Ios show this line',
  android: 'Android show thiss line',
});

var firebaseConfig = {
  apiKey: "AIzaSyAoK_hfMfMj30B0PPgJ0qg9sA6kjPVO6QA",
  authDomain: "giaohangnhanh-159411.firebaseapp.com",
  databaseURL: "https://giaohangnhanh-159411.firebaseio.com",
  projectId: "giaohangnhanh-159411",
  storageBucket: "giaohangnhanh-159411.appspot.com",
  messagingSenderId: "967684400118"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// other code and class declaration.


export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.tasksRef = firebaseApp.database().ref().child("flashsale").child("1").child("listitem");
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      user:null,
      loading: true,
      newTask: "",
    }
  }

  componentDidMount(){
    // start listening for firebase updates
    this.listenForTasks(this.tasksRef);
  }

//listener to get data from firebase and update listview accordingly
  listenForTasks(tasksRef) {
    tasksRef.on('value', (dataSnapshot) => {
    var tasks = [];
    dataSnapshot.forEach((child) => {
      tasks.push({
        discount: child.val().discount,
        name: child.val().coupon_name,
        coupon_left: child.val().coupon_left,
        coupon_total: child.val().coupon_total,
      });
    });

    console.log("========================================");
    console.log("data", tasks);
    console.log("========================================");

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tasks)
    });
   
  });
  }


  render() {
    return (
      <View style={styles.container}>
        <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData.name}-{rowData.discount} :  con lai {rowData.coupon_left} don hang</Text>}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
