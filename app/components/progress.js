import React,{Component,PropTypes}from 'react';
import './progress.less';
import ReactDOM from 'react-dom';

export default class Progress extends Component{
	static propTypes={
		barColor:PropTypes.string,
	}

	static defaultProps={
		barColor:"#2f9824"
	}

	handleChangeProgress(e){
		let progressBar=ReactDOM.findDOMNode(this.refs.progressBar);
		//获取原生 DOM 节点
		
		let progress=(e.clientX-progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
		//getBoundingClientRect()获取某个元素相对于视窗的位置
		//点击的长度 - progress开始距body左边的位置 = 绿色进度条的长度
		//绿色进度条 / 整个进度条 = 点击位置进度值
		//此时需要通知父组件
		this.props.onProgressChange && this.props.onProgressChange(progress);

	}



	render(){
		return (
			<div className="components-progress" ref="progressBar" 
				onClick={this.handleChangeProgress.bind(this)}>
				<div className="progress" 
				style={{width:`${this.props.progress}%`,backgroundColor:this.props.barColor}} ></div>
			</div>
			)
	}
}
