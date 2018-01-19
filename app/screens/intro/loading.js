import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import CircleSnail from 'react-native-progress/CircleSnail';
import PropTypes from 'prop-types';
import Backendless from 'backendless';
import Container from '../../components/container';
import Styles from '../../assets/styles';
import { updateTheme } from '../../actions/theme';
import { setProfile } from '../../actions/profile';

class Loading extends Component {
  static propTypes = {
    accent: PropTypes.string,
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    alertWithType: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      animating: true,
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('theme').then((storedTheme) => {
      const theme = JSON.parse(storedTheme);
      if (theme !== null) {
        this.props.dispatch(updateTheme(
          theme.backgroundPrimary,
          theme.accent,
          theme.text,
          theme.header,
          theme.rowColor,
          theme.gradient,
        ));
      }
    });
  }

  componentDidMount() {
    AsyncStorage.getItem('userId').then((success) => {
      if (success) {
        Backendless.Data.of('Users').findById(success)
          .then((user) => {
            this.props.dispatch(setProfile(user));
            this.props.navigation.dispatch({
              type: 'Navigation/RESET',
              index: 0,
              actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Main' }],
            });
          })
          .catch((error) => {
            this.props.alertWithType('error', 'Something Went Wrong', error.message);
            this.props.navigation.dispatch({
              type: 'Navigation/RESET',
              index: 0,
              actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Intro' }],
            });
          });
      } else {
        this.props.navigation.dispatch({
          type: 'Navigation/RESET',
          index: 0,
          actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Intro' }],
        });
      }
    })
      .catch(() => {
        this.props.navigation.dispatch({
          type: 'Navigation/RESET',
          index: 0,
          actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Intro' }],
        });
      });
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  accent: state.theme.accent,
});

export default connect(mapStateToProps)(Loading);
