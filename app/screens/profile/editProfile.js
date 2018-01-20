import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Image, View, TextInput, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Backendless from 'backendless';
import Container from '../../components/container';
import Button from '../../components/button';
import styles from '../../assets/styles';

const options = {

};

const appId = '';
const RESTApiKey = '';

class EditProfile extends Component {
  static propTypes = {
    rowColor: PropTypes.string,
    accent: PropTypes.string,
    text: PropTypes.string,
    background: PropTypes.string,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      avatarSource: '',
    };
  }

  profilePressed = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        this.props.alertWithType('error', 'Something Went Wrong', response.error);
      } else if (response.data) {
        const source = { uri: response.uri };
        if (response.type) {
          source.type = response.type;
        }

        this.setState({
          avatarSource: `data:image/jpeg;base64,${response.data}`,
        }, () => {
          fetch(`https://api.backendless.com/${appId}/${RESTApiKey}/files/binary/profilePictures/${this.props.user.objectId}.jpeg?overwrite=true`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'text/plain',
              'application-type': 'REST',
            },
            body: response.data,
          }).then((res) => {
            const currentUser = this.props.user;
            if (currentUser.profileUrl === '') {
              currentUser.profileUrl = res._bodyInit.replace(/"/g, '');
              Backendless.Data.of('Users').save(currentUser)
                .then(() => this.props.alertWithType('success', 'Success', 'Profile picture updated'))
                .catch(error => this.props.alertWithType('error', 'Error Saving Profile Picture', error.message));
            }
          }).catch((error) => {
            this.props.alertWithType('error', 'Something Went Wrong', '');
            console.log(error);
          });
        });
      }
    });
  }

  saveChanges = () => {
    const { firstName, lastName } = this.state;

    if (firstName === '' && lastName === '') {
      this.props.alertWithType('info', 'Oops', 'Nothing to update');
    } else {
      const { user } = this.props;

      if (firstName !== '') {
        user.firstName = firstName;
      }
      if (lastName !== '') {
        user.firstName = firstName;
      }

      Backendless.UserService.update(user)
        .then(() => this.props.alertWithType('success', 'Profile Updated', 'Changes saved successfully'))
        .catch(error => this.props.alertWithType('error', 'Error Updating', error.message));
    }
  }

  render() {
    const { firstName, lastName } = this.props.user;
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: this.props.rowColor,
              marginHorizontal: 10,
              marginVertical: 10,
              paddingLeft: 10,
              paddingVertical: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={this.profilePressed}>
              <Image
                source={this.state.avatarSource === '' ? require('../../assets/default.png') : this.state.avatarSource}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 37.2,
                  borderColor: this.props.accent,
                  borderWidth: 2,
                }}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: this.props.text, fontSize: 15, fontStyle: 'italic', paddingTop: 10,
              }}
            >
              Tap to change
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginVertical: 5,
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                backgroundColor: this.props.rowColor,
                paddingVertical: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginRight: 5,
              }}
            >
              <Text
                style={{
                  textAlign: 'left', width: '100%', color: this.props.text, fontSize: 15,
                }}
              >
                First Name
              </Text>
              <TextInput
                placeholder={firstName}
                autoCorrect={false}
                maxLength={15}
                selectionColor={this.props.accent}
                onChangeText={text => this.setState({ firstName: text })}
                style={[styles.input, { backgroundColor: this.props.background, width: '100%', color: this.props.text }]}
              />
            </View>
            <View
              style={{
                backgroundColor: this.props.rowColor,
                marginLeft: 5,
                paddingHorizontal: 10,
                paddingVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Text
                style={{
                  textAlign: 'left', width: '100%', color: this.props.text, fontSize: 15,
                }}
              >
                Last Name
              </Text>
              <TextInput
                placeholder={lastName}
                autoCorrect={false}
                maxLength={15}
                selectionColor={this.props.accent}
                onChangeText={text => this.setState({ lastName: text })}
                style={[styles.input, { backgroundColor: this.props.background, width: '100%', color: this.props.text }]}
              />
            </View>
          </View>
        </View>
        <View style={styles.bottomButton}>
          <Button
            text="Save Changes"
            padding
            background
            onPress={this.saveChanges}
          />
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  accent: state.theme.accent,
  text: state.theme.text,
  rowColor: state.theme.rowColor,
  background: state.theme.backgroundPrimary,
});

export default connect(mapStateToProps)(EditProfile);
