import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  AsyncStorage,
  PushNotificationIOS,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import Backendless from 'backendless';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import Notifications from 'react-native-push-notification';
import Styles from '../../assets/styles';
import Container from '../../components/container';
import Button from '../../components/button';
import { setProfile } from '../../actions/profile';

class LogIn extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    accent: PropTypes.string,
    text: PropTypes.string,
    gradient: PropTypes.string,
    navigation: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      rememberLogIn: true,
      animating: false,
    };
    this._logIn = this.logIn.bind(this);
    this._forgotPassword = this.forgotPassword.bind(this);
  }

  logIn() {
    const { email, password, rememberLogIn } = this.state;

    if (email === '' || password === '') {
      this.props.alertWithType('error', 'Error', 'Fill in all fields');
    } else {
      this.setState({ animating: true });
      Backendless.UserService.login(email, password, rememberLogIn)
        .then((loggedInUser) => {
          this.setState({ animating: false });
          this.props.dispatch(setProfile(loggedInUser));
          if (rememberLogIn) {
            AsyncStorage.setItem('userId', loggedInUser.objectId)
              .then(() => this.navigate())
              .catch(error => console.log(error));
          } else {
            this.navigate();
          }
        })
        .catch(error => this.setState({ animating: false }, () => this.props.alertWithType('error', 'Something Went Wrong', error.message)));
    }
  }

  navigate = () => {
    Notifications.configure({
      onRegister(token) {
        Backendless.setupDevice({ uuid: DeviceInfo.getUniqueID(), platform: Platform.OS.toUpperCase(), version: DeviceInfo.getSystemVersion() });
        Backendless.Messaging.registerDevice(token.token, ['default'], 1606470357000);
      },
      onNotification(notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      senderID: 'gcm_senderid',
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    this.props.navigation.dispatch({
      type: 'Navigation/RESET',
      index: 0,
      actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Main' }],
    });
  }

  forgotPassword() {
    const { email } = this.state;
    if (email === '') {
      this.props.alertWithType('error', 'Error', 'Enter email');
    } else {
      this.setState({ animating: true });
      Backendless.UserService.restorePassword(email)
        .then(() => this.setState({ animating: false }, () => this.props.alertWithType('success', 'Success', 'Password reset link sent')))
        .catch(error => this.setState({ animating: false }, () => this.props.alertWithType('error', 'Something Went Wrong', error.message)));
    }
  }

  render() {
    return (
      <Container>
        <View style={[Styles.progressContainer, { zIndex: this.state.animating ? 10000 : 0 }]}>
          <CircleSnail
            color={[this.props.accent]}
            size={100}
            animating={this.state.animating}
            hidesWhenStopped
            indeterminate
          />
        </View>
        <View style={[Styles.paddingTop15, { flex: 1 }]}>
          <TextInput
            placeholder="Email"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            onChangeText={text => this.setState({ email: text })}
            onSubmitEditing={() => this.password.focus()}
          />
          <TextInput
            placeholder="Password"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            maxLength={32}
            returnKeyType="go"
            autoCapitalize="none"
            placeholderTextColor={this.props.text}
            autoCorrect={false}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            secureTextEntry
            onChangeText={text => this.setState({ password: text })}
            ref={(input) => { this.password = input; }}
            onSubmitEditing={this._logIn}
          />
          <View style={[Styles.row, Styles.paddingTop]}>
            <Text style={[Styles.italic, { color: this.props.text }]}>
                Remember Log In?
            </Text>
            <Switch
              onTintColor={this.props.accent}
              tintColor={this.props.accent}
              value={this.state.rememberLogIn}
              thumbTintColor={this.props.gradient}
              onValueChange={val => this.setState({ rememberLogIn: val })}
            />
          </View>
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Forgot Password"
            onPress={this._forgotPassword}
            padding
            background
          />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Log In"
            onPress={this._logIn}
            padding
            background
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  text: state.theme.text,
  accent: state.theme.accent,
  gradient: state.theme.gradient,
  header: state.theme.header,
});

export default connect(mapStateToProps)(LogIn);
