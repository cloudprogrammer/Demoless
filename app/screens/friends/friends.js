import React, { Component } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Backendless from 'backendless';
import DeviceInfo from 'react-native-device-info';
import ProfileImage from '../../components/profileImage';
import Container from '../../components/container';

class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      loading: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.loadFriends();
    this.setDeviceId();
  }

  setDeviceId = () => {
    Backendless.Data.of('Users').save({ objectId: this.props.user.objectId, deviceId: DeviceInfo.getUniqueID() })
      .catch(error => console.log(error));
  }

  loadFriends = () => {
    this.setState({ refreshing: !this.state.loading });
    const query = Backendless.DataQueryBuilder.create();
    query.setRelated('friends');
    query.setWhereClause(`objectId = '${this.props.user.objectId}'`);
    Backendless.Data.of('Users').find(query)
      .then((response) => {
        this.setState({ friends: response[0].friends, refreshing: false, loading: false });
      })
      .catch(error => this.setState(
        { loading: false, refreshing: false },
        () => this.props.alertWithType('error', 'Error Loading Friends', error.message),
      ));
  }

  render() {
    return (
      <Container>
        <FlatList
          data={this.state.friends}
          refreshing={this.state.refreshing}
          onRefresh={this.loadFriends}
          keyExtractor={item => item.objectId}
          pin
          contentContainerStyle={{ marginHorizontal: 10, paddingTop: 10, flex: 1 }}
          renderItem={(({ item }) => (
            <View
              style={{
                backgroundColor: this.props.rowColor,
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={() => this.props.navigate('UserProfile', { user: item })} >
                <ProfileImage
                  size={50}
                  url={item.profileUrl}
                  showBorder
                />
                <Text style={{ color: this.props.text, paddingLeft: 10, fontSize: 20 }}>{item.firstName} {item.lastName}</Text>
              </TouchableOpacity>
            </View>
          ))}
          ListEmptyComponent={(
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 25,
              }}
            >
              <Text style={{ color: this.props.text, fontSize: 25 }}>No friends :(</Text>
            </View>
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  rowColor: state.theme.rowColor,
  text: state.theme.text,
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Friends);
