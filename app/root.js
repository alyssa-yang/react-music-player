import React ,{Component,PropTypes}from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import {MUSIC_LIST} from './config/config';
import APP from './app';
import {Router,IndexRoute,Link,Route,hashHistory} from 'react-router';

export default class Root extends Component{

	render(){
		return(<div>
                    <Router history={hashHistory}>
                        <Route path="/" component={APP}>
                            <IndexRoute component={Player}></IndexRoute>
                            <Route path="/list" component={MusicList}></Route>
                        </Route>
                    </Router>
				</div>)
	}
}
	




















