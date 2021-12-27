import React, { useState } from 'react';
import { TouchableOpacity, ScrollView, Text, View, StyleSheet,Button } from 'react-native';
import Constants from 'expo-constants';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import axios from "axios";
import {HeartOutlined, HeartFilled} from '@ant-design/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';

var Countries={};
var countryName;
var CountryNames=[];
var countryDetails=[]

export default function App() {

  return (
     <NavigationContainer>
      <Drawer.Navigator initialRouteName="World Statistics" options={{
        title: 'World Statistics',
        headerStyle: {
          backgroundColor: 'darkslategrey',
        },
        headerTintColor: 'silver',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>

      <Drawer.Screen name="World Statistics" component={WorldStatistics} options={{
        title: 'World Covid-19 Statistics',
        headerStyle: {
          backgroundColor: 'darkslategrey',
        },
        headerTintColor: 'silver',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}/>
        <Drawer.Screen name="Countries Statistics" component={CountriesStatistics} options={{
      title: 'Countries Statistics',
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
      headerTintColor: 'silver',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      }}/>
        <Drawer.Screen name="Favourite Countries" component={FavouriteCountries} options={{
      title: 'Favourite Countries',
      headerStyle: {
        backgroundColor: 'darkslategrey',
      },
      headerTintColor: 'silver',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function WorldStatistics({ navigation }) {

const [getData1, setData1] = useState([]);

console.log(getData1)

var list1 =[]

const options1 = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/allcountriesname',
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': '566e4495cbmshc48cd80b5e642f9p124b72jsn84ff0632014e'
  }
};
axios.request(options1).then(function (response) {
	console.log(response.data);
  Countries=(response.data.body.countries)
}).catch(function (error) {
	console.error(error);
});

const options2 = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/population',
  params: {country_name: {countryName}},
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': '566e4495cbmshc48cd80b5e642f9p124b72jsn84ff0632014e'
  }
};

axios.request(options2).then(function (response) {
	console.log(response.data);
  countryDetails=response.data[0]
}).catch(function (error) {
	console.error(error);
});

const [getPop, setPop] = useState('');

const options = {
  method: 'GET',
  url: 'https://world-population.p.rapidapi.com/worldpopulation',
  headers: {
    'x-rapidapi-host': 'world-population.p.rapidapi.com',
    'x-rapidapi-key': '566e4495cbmshc48cd80b5e642f9p124b72jsn84ff0632014e'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
  setPop(response.data.body.world_population);
  console.log(getPop)
}).catch(function (error) {
	console.error(error);
});

const covidapi = {
  method: 'GET',
  url: 'https://covid-19-data.p.rapidapi.com/totals',
  headers: {
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    'x-rapidapi-key': 'a912c0fb05msh7ea58c13f6c57aap1fa44djsna5e0ad1c54a6'
  }
};

axios.request(covidapi).then(function (response) {
	console.log(response.data.[0])
  setData1([response.data.[0].confirmed,
            response.data.[0].recovered,
            response.data.[0].critical,
            response.data.[0].deaths,
            response.data.[0].lastUpdate])
}).catch(function (error) {
	console.error(error);
});

  const percentfind=(pop,inf)=> {
    var disp= (inf/pop)*100
    disp= disp.toFixed(5)
    return(
      disp
    )
  }

  return (
    <View style={styles.container}>
    <Text style={styles.style1}>Total World population: {getPop}</Text>
    <Text style={styles.style1}>Confirmed Cases: {percentfind(getPop,getData1[0])}%</Text>
    <Text style={styles.style1}>Recovered : {percentfind(getPop,getData1[1])}%</Text>
    <Text style={styles.style1}>Critical Cases : {percentfind(getPop,getData1[2])}%</Text>
    <Text style={styles.style1}>deaths : {percentfind(getPop,getData1[3])}%</Text>
    <Text style={styles.style1}>LastUpdate Cases : {getData1[4]}</Text>
    </View>
  );

}

function CountriesStatistics({ navigation }) {

return (
    <View >
      <TouchableOpacity>
        <View style={styles.container2}>
          {Countries.map((x1)=>{ return <View ><TouchableOpacity style={styles.style1} 
          onPress={ CountryNames=[...CountryNames,{x1}]}> {x1}<HeartOutlined style={{marginLeft: 22}}/>
          </TouchableOpacity></View>})}
        </View>
      </TouchableOpacity>
    </View>
  );
}

function FavouriteCountries({ navigation }) {

    if(CountryNames.length<2){
      return(
<View style={{marginTop:20,alignItems:'center'}}> <Text style={{fontWeight: 'bold'}}>No Favourites!</Text></View>
      );
    }
     else{
       return(
         <ScrollView>
            <View >
              {CountryNames.map((x1)=>{ return <View style={styles.style1}>
              <Text style={styles.style1}> 
                {x1} 
              </Text><HeartFilled style={{marginTop:25,marginLeft:35}}/></View>})}
            </View> 
          </ScrollView>
          );
      }
}


const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: 'lavender',
  },
    container2: {
    flex: 'row',
    paddingTop: 0,
    backgroundColor: 'lavender',
  },
  style1: {
    borderBottomWidth: 2,
    flexDirection: 'row',
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 20,
    alignContent: "center"
  }
});