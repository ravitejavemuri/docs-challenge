import React from 'react';
import { StyleSheet, Text, View,TextInput,FlatList  } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
//import { Observable, Subscriber } from 'rxjs';
import axios from 'axios';
import { debounce  } from "throttle-debounce";


export default class AppEntry extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            value:'',
            unames:[],
            loading:false
        }
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
        this.SearchDebounce  = debounce(500, this.search);

    }

     handleChange(value){
         // trial
        //  let inputStream = new Observable( subscriber => {
        //      subscriber.next(value)
        //  })

        //  inputStream.subscribe({
        //     next(x) { this.setState({value:value,loading:true}); },
        //     error(err) { console.error('something wrong occurred: ' + err); },
        //     complete() { console.log('done'); }
        //  })

        //actual
        this.setState({value:value,loading:true});
        if(value && value.length > 2){
            this.SearchDebounce(value)
        }
        else{
            this.setState({loading:false, unames:[]})
        }
    }

   async search(value){
       console.log("requesting with ", value)
        try{
            let res = await axios.get(`https://api.github.com/search/users?q=${value}+in:fullname&sort=followers&order=desc`);
            //console.log(res.status)
            if(res.status === 200){
                    let need = res.data.items
                    await this.setState({unames:res.data.items, loading:false, value : ''});
            }
        }catch(err){
            alert(err)
            this.setState({loading:false})
        }
    }
  
    renderSearch(){
        return (
            <SearchBar
            placeholder="Type Here..."
            darkTheme
            platform="android"
            onChangeText={(value) => this.handleChange(value)}
            autoCorrect={false}
            onClear={()=>{this.setState({loading:false,unames:[]})}}
            showLoading ={this.state.loading}
            value={this.state.value}
          />)
    }
  render() {
      //console.log(this.state.unames)
    return(<View>
        <View style={styles.boxView}>
            {this.renderSearch()}
        </View>
        <FlatList
          data={this.state.unames}
          
          renderItem={({ item }) => (
            <ListItem
            leftAvatar={{ source: { uri: item.avatar_url } }}
            title={` ${item.login}`}
            />
        )}
        keyExtractor={item => item.login}
        />
        </View>
    )
  }
}


const styles = StyleSheet.create({
    boxView: {
        paddingTop:35
    },
  });