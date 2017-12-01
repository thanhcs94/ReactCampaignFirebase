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
} from 'react-native';
import GridView from 'react-native-grid-view';
var CITY_PER_ROW = 3;

const instructions = Platform.select({
  ios: 'Ios show this line',
  android: 'Android show thiss line',
});

var firebaseConfig = {
  
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// other code and class declaration.

export class Movie extends Component<{}> {
  render() {
      return (
        <View style={styles.movie} >
          <Image
            source={{uri: this.props.movie.location_photo}}
            style={styles.thumbnail}
          />
          <View >
            <Text 
            style={styles.title}
            numberOfLines={3}>{this.props.movie.coupon_name}</Text>
            <Text style={styles.year}>{this.props.movie.discount}</Text>
          </View>
        </View>
      );
  }
}


export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.tasksRef = firebaseApp.database().ref().child("flashsale");
    //this.tasksRef = firebaseApp.database().ref().child("flashsale").child("2").child("listitem");
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
        key: child.key,
        objValue: JSON.stringify(child.val()),
      });
    });

    console.log("========================================");
    console.log("data", tasks[9].objValue);
    console.log("========================================");
    

    alert("Flash running day "+ tasks[9].objValue);
    this.listenForTasks2(firebaseApp.database().ref().child("flashsale").child(tasks[9].objValue).child("listitem"));
    
    // //var obj = JSON.parse(runningObject);
    // alert(runningObject);
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(runningObject)
    // });
   
  });
  }

  listenForTasks2(tasksRef) {
    tasksRef.on('value', (dataSnapshot) => {
      var tasks = [];
      dataSnapshot.forEach((child) => {
        tasks.push({
          discount: child.val().discount,
          name: child.val().coupon_name,
          coupon_left: child.val().coupon_left,
          coupon_total: child.val().coupon_total,
          location_photo: child.val().location_photo
        });
      });
  
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(tasks)
      });
    });
  }



  render() {
    return (
      <View style={styles.container}>
        {/* <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <View>
          
          <Text>{rowData.name}-{rowData.discount} :  con lai {rowData.coupon_left} don hang</Text>
          <Text>-------------------------------------</Text>
          </View>}
      /> */}

      <GridView
        items={this.state.dataSource}
        itemsPerRow={CITY_PER_ROW}
        renderItem={this.renderItem}
        style={styles.listView}
      />

      </View>
    );
  }

  renderItem(item) {
    return <Movie movie={item} />
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
  movie: {
    height: 150,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    fontSize: 10,
    marginBottom: 8,
    width: 90,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});
