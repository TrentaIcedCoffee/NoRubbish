/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {NativeRouter, Switch, Route, Redirect} from 'react-router-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import {userActions} from './src/store/actions';
import * as utils from './src/utils';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './src/component/pages/Main';
import Chat from './src/component/pages/Chat';
import Profile from './src/component/pages/Profile';

const socket = utils.socketIOClient(utils.endpoint);
// TODO failed to connect & no warning
console.log(socket);
socket.on('connect', () => {
  console.log('connected');
  socket.on('activeUsers', data => {
    store.dispatch(userActions.setter({activeUsers: data.activeUsers}));
  });
  socket.on('msg', data => {
    store.dispatch(userActions.pushMsg(data));
  });
});

const authStateChanged = user => dispatch => {
  if (user) {
    dispatch(userActions.setter({user: user}));
    socket.userEmail = user.email; // IM for future use
    socket.emit('addUser', {user: socket.userEmail});
  } else {
    dispatch(userActions.setter({user: user}));
    socket.emit('rmUser', {user: socket.userEmail});
  }
};

// firebase auth
utils.auth.onAuthStateChanged(user => store.dispatch(authStateChanged(user)));

const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Home" component={Main} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="Profile" component={Profile} />
          </Stack.Navigator>
        </NavigationContainer>
        {/* <Main /> */}
        {/* <Chat /> */}
        {/* <Profile /> */}
        {/* <NativeRouter>
          <Switch>
            <Route exact path="/" component={StartPage} />
            <Route exact path="/Lst" component={TrapLstPage} />
            <Route exact path="/Info" component={TrapInfoPage} />
            <Redirect to="/" />
          </Switch>
        </NativeRouter> */}
      </Provider>
    );
  }
}

export default App;
