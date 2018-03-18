import React from 'react';
import {shallow} from 'enzyme';
import shallowToJson from 'enzyme-to-json';

import MorphingPlayButton from '../index'

test('Index Page should render correctly', () => {
    const wrapper = shallow(
        <MorphingPlayButton buttonText="Watch My Video" youtubeId="Mh4f9AYRCZY"/>
    );
    expect(shallowToJson(wrapper)).toMatchSnapshot();
});




