import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import Container from '../../components/container';

class Profile extends Component {
  static propTypes = {
    rowColor: PropTypes.string,
    accent: PropTypes.string,
    text: PropTypes.string,
    user: PropTypes.object,
  };

  static navigationOptions = props => ({
    headerRight: (
      <TouchableOpacity onPress={() => props.navigation.navigate('EditProfile')}>
        <View style={{ paddingRight: 10, paddingLeft: 20 }}>
          <Icon name="md-more" color="#fff" size={20} />
        </View>
      </TouchableOpacity>
    ),
  })

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { username, firstName, lastName } = this.props.user;
    return (
      <Container>
        <View
          style={{
            backgroundColor: this.props.rowColor,
            marginHorizontal: 10,
            marginVertical: 10,
            paddingLeft: 10,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../../assets/default.png')}
            style={{
              width: 75,
              height: 75,
              borderRadius: 37.2,
              borderColor: this.props.accent,
              borderWidth: 2,
            }}
          />
          <Text style={{ color: this.props.text, fontSize: 20, paddingLeft: 10 }}>Username: {username}</Text>
        </View>
        <View
          style={{
            backgroundColor: this.props.rowColor,
            marginHorizontal: 10,
            marginVertical: 10,
            paddingLeft: 10,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: this.props.text, fontSize: 20, paddingLeft: 10 }}>Full name: {firstName} {lastName}</Text>
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
});

export default connect(mapStateToProps)(Profile);
