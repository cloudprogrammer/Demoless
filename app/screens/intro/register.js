import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Switch,
  StatusBar,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import PropTypes from 'prop-types';
import Backendless from 'backendless';
import Styles from '../../assets/styles';
import Container from '../../components/container';
import Button from '../../components/button';
import { setProfile } from '../../actions/profile';

class Register extends Component {
  static propTypes = {
    alertWithType: PropTypes.func,
    accent: PropTypes.string,
    text: PropTypes.string,
  }

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      username: '',
      firstName: '',
      lastName: '',
      animating: false,
    };
    this._register = this.register.bind(this);
  }

  register() {
    const {
      email, password, username, firstName, lastName,
    } = this.state;

    if (email === '' || password === '' || username === '' || firstName === '' || lastName === '') {
      this.props.alertWithType('error', 'Error', 'Fill in all fields');
    } else {
      this.setState({ animating: true });
      const newUser = new Backendless.User({
        username,
        password,
        email,
        firstName,
        lastName,
      });
      Backendless.UserService.register(newUser)
        .then(() => {
          this.setState({ animating: false });
          this.props.alertWithType('success', 'Success', 'Registered successfully');
          this.props.navigation.goBack();
        })
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
            onSubmitEditing={() => this.usernameField.focus()}
          />
          <TextInput
            placeholder="Username"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            ref={(input) => { this.usernameField = input; }}
            onChangeText={text => this.setState({ username: text })}
            onSubmitEditing={() => this.firstNameField.focus()}
          />
          <TextInput
            placeholder="First Name"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            ref={(input) => { this.firstNameField = input; }}
            onChangeText={text => this.setState({ firstName: text })}
            onSubmitEditing={() => this.lastNameField.focus()}
          />
          <TextInput
            placeholder="Last Name"
            style={[Styles.input, { borderBottomColor: this.props.accent, borderBottomWidth: 1, color: this.props.text }]}
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={50}
            keyboardType="email-address"
            placeholderTextColor={this.props.text}
            selectionColor={this.props.accent}
            underlineColorAndroid="transparent"
            ref={(input) => { this.lastNameField = input; }}
            onChangeText={text => this.setState({ lastName: text })}
            onSubmitEditing={() => this.passwordField.focus()}
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
            ref={(input) => { this.passwordField = input; }}
            onSubmitEditing={this._register}
          />
        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button
            text="Register"
            onPress={this._register}
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

export default connect(mapStateToProps)(Register);
