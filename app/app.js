import React, { Component, PropTypes } from 'react';
import Header from './components/header';
import Player from './page/player';
import MusicList from './page/musiclist';
import { MUSIC_LIST } from './config/config';
import PubSub from 'pubsub-js';
import _ from 'lodash';

// node server
export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			musiclist: MUSIC_LIST,
			currentMusicIndex: 0,
			playMode: undefined,
			elseMusic: [],
			isMounted: true
		}
	}

	componentDidMount() {
		this.playFunctionHandler();
	}

	playFunctionHandler() {
		let { musiclist, currentMusicIndex } = this.state;
		$("#player").jPlayer({
			supplied: 'mp3',
			wmode: 'window',
		});
		//播放当前音乐
		this.playMusic(currentMusicIndex);
		//检测到当前音乐播放模式
		PubSub.subscribe('PLAY_MODE', (msg, playMode) => {
			this.playModeMusic(playMode)
		})

		//播放下一首
		PubSub.subscribe('PLAY_CHANGE', (msg, type) => {
			this.playChangeMusic(type)
		})

		//删除音乐
		PubSub.subscribe('DELETE_MUSIC', (msg, id) => {
			//删除当前播放，自动播放下一首
			//标记删除项
			let index = _.findIndex(musiclist, n => n.id === id)
			musiclist[index].delete = true;

			this.setState({ musiclist: musiclist })
			//如果当前项在播放 找下一首未删除项
			if (musiclist[index].focus) {
				let payIndex = (index + 1) % musiclist.length;
				this.playMusic(payIndex)
			}

		});
		//播放音乐
		PubSub.subscribe('PLAY_MUSIC', (msg, index) => {
			this.playMusic(index);
		})

	}
	//播放下一首音乐
	playChangeMusic(type) {
		let { musiclist, currentMusicIndex } = this.state;
		//上一首
		if (type === "prev") { currentMusicIndex = (currentMusicIndex - 1) % musiclist.length }
		//下一首
		else { currentMusicIndex = (currentMusicIndex + 1) % musiclist.length }
		this.setState({ currentMusicIndex: currentMusicIndex }, () => { this.playMusic(currentMusicIndex) })
	}

	//根据当前播放模式进行播放
	playModeMusic(playMode) {
		let { musiclist } = this.state;
		if (playMode === "random") {
			//随机播放
			let index = _.random(0, musiclist.length - 1);
			this.playMusic(index)
			//this.setState({ currentMusicIndex: index })
		} else if (playMode === "refresh") {
			//循环播放
			this.playMusic(this.state.currentMusicIndex)
		}
	}

	//播放点击的音乐
	playMusic = (index) => {
		let { musiclist } = this.state;
		let elseMusic;
		if (musiclist[index].delete) {
			elseMusic = _.filter(musiclist, n => !n.delete);
			if (elseMusic.length === 0) {
				$("#player").jPlayer("stop");
				this.setState({ musiclist: musiclist })
				return
			}
			index = _.findIndex(musiclist, n => n.id === elseMusic[0].id)
		}
		$("#player").jPlayer('setMedia', {
			mp3: musiclist[index].file
		}).jPlayer('play')
		$("#player").jPlayer("pauseOthers");
		_.map(musiclist, (n, i) => n.focus = !!(i === index))
		this.setState({ currentMusicIndex: index, musiclist: musiclist })
	}

	componentWillUnmount() {
		$("#player").jPlayer("destroy");
		PubSub.unsubscribe('DELETE_MUSIC');
		PubSub.unsubscribe('PLAY_MUSIC');
		PubSub.unsubscribe('PLAY_CHANGE');
		PubSub.unsubscribe('PLAY_MODE');
		this.setState({ isMounted: false })
	}


	render() {
		let { currentMusicIndex, musiclist } = this.state;
		return (<div>
			<div>
				<Header />
				{React.cloneElement(this.props.children, this.state)}
			</div>
		</div>)
	}
}





















