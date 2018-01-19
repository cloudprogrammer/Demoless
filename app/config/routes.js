import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { NavBar } from '../components/header';
import { Intro, Loading, LogIn, Register } from '../screens/intro';
import { Profile, EditProfile } from '../screens/profile';
import { Friends } from '../screens/friends';
import { Settings } from '../screens/settings';
import { connectAlert } from '../components/alert';
import Drawer from '../components/drawer';

const FriendsNav = StackNavigator({
  Friends: {
    screen: connectAlert(Friends),
    navigationOptions: props => ({
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Friends',
      headerLeft: (
        <TouchableOpacity onPress={() => props.screenProps.drawerNavigation.navigate('DrawerOpen')}>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <Ionicons name="md-menu" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
}, {
  headerMode: 'screen',
});

const ProfileNav = StackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: props => ({
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Your Profile',
      headerLeft: (
        <TouchableOpacity onPress={() => props.screenProps.drawerNavigation.navigate('DrawerOpen')}>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <Ionicons name="md-menu" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
  EditProfile: {
    screen: connectAlert(EditProfile),
    navigationOptions: {
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Edit Profile',
    },
  },
}, {
  headerMode: 'screen',
});

const SettingsNav = StackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: props => ({
      header: headerProps => <NavBar {...headerProps} />,
      title: 'Settings',
      headerLeft: (
        <TouchableOpacity onPress={() => props.screenProps.drawerNavigation.navigate('DrawerOpen')}>
          <View style={{ paddingLeft: 10, paddingRight: 20 }}>
            <Ionicons name="md-menu" color="#fff" size={20} />
          </View>
        </TouchableOpacity>
      ),
    }),
  },
}, {
  headerMode: 'screen',
});

const MainNav = DrawerNavigator({
  Friends: {
    screen: ({ navigation }) =>
      <FriendsNav screenProps={{ drawerNavigation: navigation }} />,
  },
  Profile: {
    screen: ({ navigation }) =>
      <ProfileNav screenProps={{ drawerNavigation: navigation }} />,
  },
  Settings: {
    screen: ({ navigation }) =>
      <SettingsNav screenProps={{ drawerNavigation: navigation }} />,
  },
}, {
  drawerPosition: 'left',
  drawerWidth: 125,
  initialRouteName: 'Friends',
  contentComponent: (props) => {
    const clonedProps = {
      ...props,
      items: props.items.filter(item => !['Profile'].includes(item.key)),
    };
    return (
      <Drawer {...clonedProps} />
    );
  },
});

const IntroNav = StackNavigator({
  Intro: {
    screen: Intro,
    navigationOptions: {
      header: () => null,
    },
  },
  Loading: {
    screen: connectAlert(Loading),
    navigationOptions: {
      header: () => null,
    },
  },
  LogIn: {
    screen: connectAlert(LogIn),
    navigationOptions: {
      header: props => <NavBar {...props} />,
      title: 'Log In',
    },
  },
  Register: {
    screen: connectAlert(Register),
    navigationOptions: {
      header: props => <NavBar {...props} />,
      title: 'Register',
    },
  },
  Main: {
    screen: ({ navigation }) => <MainNav screenProps={{ rootNavigation: navigation }} />,
    navigationOptions: {
      header: () => null,
    },
  },
}, {
  initialRouteName: 'Loading',
  headerMode: 'screen',
});

export default IntroNav;
