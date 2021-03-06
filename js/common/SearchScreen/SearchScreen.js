import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

import s from './SearchScreen.style';

import {
  DEAL_TYPES,
  LATITUDE_BUDAPEST,
  LONGITUDE_BUDAPEST,
  LATITUDE_DELTA_BUDAPEST,
} from '../../constants';

import Button from '../Button';
import NumberPicker from '../NumberPicker';
import PriceRangePicker from '../PriceRangePicker';
import ResultScreen from '../ResultScreen';
import SingleResultPage from '../SingleResultPage';
import LocationPicker from '../LocationPicker';

class SearchScreen extends Component {

  static propTypes = {};

  static defaultProps = {
    addToWatchlist: () => LOG('TODO: Add to watchlist.'),
  };

  state = {
    dealType: DEAL_TYPES.RENT,
    priceRange: [100, 150],
    location: {
      settlement: [],
      circle: {
        radius: 1000,
        point: {
          latitude: LATITUDE_BUDAPEST,
          longitude: LONGITUDE_BUDAPEST,
        },
      },
    },
    //minLot: 1,
    minRooms: 1,
    isLoading: false,
  };

  saveQueryOptions = key => value => {
    this.setState({ [key]: value });
  };

  getLongitudeDelta = () => {
    const { width: WINDOW_WIDTH } = Dimensions.get('window');

    const ASPECT_RATIO = WINDOW_WIDTH / 200;

    return LATITUDE_DELTA_BUDAPEST * ASPECT_RATIO;
  };

  goToResultPage = () => {
    this.props.navigator.push({
      component: ResultScreen,
      title: 'Results',
      passProps: {
        searchConfig: this.state,
        addToWatchlist: this.props.addToWatchlist,
        viewSingleResult: this.viewSingleResult,
      },
    });
  };

  viewSingleResult = data => () => {
    this.props.navigator.push({
      component: SingleResultPage,
      title: data.address,
      passProps: {
        data,
      },
    });
  };

  render() {
    return (
      <ScrollView
        style={s.root}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.page}>
          {/*<PropertyTypePicker
           value={this.state.propertyType}
           onChange={this.saveQueryOptions}
           />*/}
          <PriceRangePicker
            label="Price Between (HUF)"
            range={[30, 250, 10]}
            suffix="k"
            value={this.state.priceRange}
            onChange={this.saveQueryOptions('priceRange')}
          />
          <LocationPicker
            label="Location"
            initialRegion={{
              latitude: LATITUDE_BUDAPEST,
              longitude: LONGITUDE_BUDAPEST,
              latitudeDelta: LATITUDE_DELTA_BUDAPEST,
              longitudeDelta: this.getLongitudeDelta(),
            }}
            location={this.state.location}
            onChange={location => this.setState({ location })}
          />
          <NumberPicker
            label="Rooms (at least)"
            options={[1, 2, 3, 4, 5, 6]}
            value={this.state.minRooms}
            onChange={this.saveQueryOptions('minRooms')}
          />
          <Button
            containerStyle={s.searchButton}
            style={s.searchButtonText}
            onPress={this.goToResultPage}
          >
            Search
          </Button>
        </View>
      </ScrollView>
    );
  }
}

export default SearchScreen;
