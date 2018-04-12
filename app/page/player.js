import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import MyProgress from '../components/progress';
import AMUIReact from 'amazeui-react';
import { Link } from 'react-router';
import "./player.less";
import PubSub from 'pubsub-js';
let Icon = AMUIReact.Icon;
let Grid = AMUIReact.Grid;
let Col = AMUIReact.Col;
let Image = AMUIReact.Image;
let Progress = AMUIReact.Progress;


export default class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {
			progress: 0,
			duration: null,
			loading: false,
			volume: 0,
			isPlay: true,
			currentTime: 0,
			playMode: "refresh",  //random
			isMounted: true
		}
	}

	componentDidMount() {
		let { duration, currentTime, playMode } = this.state;
		$('#player').bind($.jPlayer.event.timeupdate, (e) => {
			duration = e.jPlayer.status.duration;
			currentTime = this.formatTime(parseInt(e.jPlayer.status.currentTime));
			this.setState({
				currentTime: currentTime,
				loading: true,
				duration: duration,
				progress: e.jPlayer.status.currentPercentAbsolute,
				leftTime: duration * (1 - e.jPlayer.status.currentPercentAbsolute) / 100,
				volume: e.jPlayer.options.volume * 100,
			})
		})
		//PubSub.publish('PLAY_MODE', playMode)
	}
	//接收当前进度的变化
	// shouldComponentUpdate(np, ns) {
	// 	return true
	// 	return !!(parseFloat(ns.progress) === 100)

	// }
	componentWillUpdate(np, ns) {
		if (parseInt(ns.progress) === 99) {
			PubSub.publish('PLAY_MODE', ns.playMode)
		}
	}
	formatTime(seconds) {
		let min = Math.floor(seconds / 60),
			second = seconds % 60,
			hour, newMin, time;

		if (min > 60) {
			hour = Math.floor(min / 60);
			newMin = min % 60;
		}

		if (second < 10) { second = '0' + second; }
		if (min < 10) { min = '0' + min; }

		return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
	}

	componentWillUnmount() {
		$("#player").unbind($.jPlayer.event.timeupdate);
		this.setState({ isMounted: false })
	}
	//音乐进度
	progressChangeHandler(e) {
		let { duration, progress, playMode } = this.state;
		$("#player").jPlayer('play', duration * e);
		this.setState({ isPlay: true })
	}
	//音乐音量
	volumeChangeHandler(e) {
		$("#player").jPlayer('volume', e)
	}
	//音乐暂停播放
	toggleIsPlayHandler(e) {
		let { isPlay, deg } = this.state;

		// let matrix=$(".playCover img").css('transform');  
		// let m=matrix.split(",");
		// let n=m.map(item=>{return item.replace(/[^0-9\.|\-|\+]/ig,"")})
		// deg=this.getMatrix(n[0],n[1],n[2],n[3]);
		// $(".playCover img").css({'transform':'rotate('+deg+'deg)'}); 
		if (isPlay) {
			$("#player").jPlayer('pause', e)
		} else {
			$("#player").jPlayer('play', e);
		}
		isPlay = !isPlay;
		this.setState({ isPlay: isPlay, deg: deg })
	}
	// 
	getMatrix = (a, b, c, d) => {
		var aa = Math.round(180 * Math.asin(a) / Math.PI);
		var bb = Math.round(180 * Math.acos(b) / Math.PI);
		var cc = Math.round(180 * Math.asin(c) / Math.PI);
		var dd = Math.round(180 * Math.acos(d) / Math.PI);
		var deg = 0;
		if (aa == bb || -aa == bb) {
			deg = dd;
		} else if (-aa + bb == 180) {
			deg = 180 + cc;
		} else if (aa + bb == 180) {
			deg = 360 - cc || 360 - dd;
		}
		return deg >= 360 ? 0 : (deg) % 360;
	}
	//重新播放音乐
	repeatPlayHandler(e) {
		$("#player").jPlayer('stop');
		$("#player").jPlayer('play', e)
		this.setState({ isPlay: true })
	}
	//切换播放模式	
	togglePlayModeHandler() {
		let { playMode } = this.state;
		playMode = playMode === "refresh" ? "random" : "refresh";
		//	PubSub.publish('PLAY_MODE', playMode)
		this.setState({ playMode: playMode })
	}

	//转播上一首或下一首
	playNextHandler(type, e) {
		PubSub.publish('PLAY_CHANGE', type);
		this.setState({ isPlay: true })
	}
	renderPlayerContainer() {
		let { currentMusicIndex, musiclist } = this.props;
		let currentMusicItem = musiclist[currentMusicIndex]
		let { volume, progress, isPlay, deg, currentTime, playMode } = this.state;
		return (
			<div style={{ marginTop: 100 }}>
				<Grid fixed className="doc-g">
					<Col sm={5} style={{ color: "#2f9824" }}><Link to="/list">我的私人音乐坊 >> </Link></Col>
				</Grid>
				<Grid fixed className="doc-g">
					<Col sm={8}>
						<Grid fixed className="doc-g">
							<Col sm={5} style={{ fontSize: 30 }}>{currentMusicItem.title}</Col>
						</Grid>
						<Grid fixed className="doc-g">
							<Col sm={5}>{currentMusicItem.artist}</Col>
						</Grid>
						<br />
						<Grid fixed className="doc-g" collapse>
							<Col sm={2}>{currentTime}</Col>
							<Col sm={1}><Icon icon="volume-up" /></Col>
							<Col sm={3} end style={{ paddingTop: 10, marginLeft: -30 }}>
								<MyProgress
									progress={volume}
									onProgressChange={this.volumeChangeHandler.bind(this)}
									barColor="#aaa" />
							</Col>
						</Grid>
						<Grid fixed className="doc-g" style={{ marginTop: 20 }}>
							<Col sm={12}>
								<MyProgress
									progress={progress}
									onProgressChange={this.progressChangeHandler.bind(this)}
								/></Col>
						</Grid>
						<br />
						<Grid fixed className="doc-g player-button">
							<Col sm={2}><Icon icon="chevron-left" amSize="md" onClick={this.playNextHandler.bind(this, "prev")} /></Col>
							<Col sm={2}><Icon icon={`${isPlay ? "pause" : "play"}`} amSize="md" onClick={this.toggleIsPlayHandler.bind(this)} /></Col>
							<Col sm={2}><Icon icon="chevron-right" amSize="md" onClick={this.playNextHandler.bind(this, "next")} /></Col>
							<Col sm={1} smOffset={4}><Icon icon="repeat" amSize="sm" onClick={this.repeatPlayHandler.bind(this)} /></Col>
							<Col sm={1}><Icon icon={playMode} amSize="sm" onClick={this.togglePlayModeHandler.bind(this)} /></Col>
						</Grid>
					</Col>
					<Col sm={3} end>
						<Image src={currentMusicItem.cover} width="200" height="200" circle />
					</Col>
				</Grid>
			</div>
		)
	}
	render() {
		return (<div>
			{this.state.loading && <div>
				{/* <Progress 
					progress={this.state.progress}
					onProgressChange={this.progressChangeHandler.bind(this)}
				/> */}
				{this.renderPlayerContainer()}
			</div>}
		</div>
		)
	}
}