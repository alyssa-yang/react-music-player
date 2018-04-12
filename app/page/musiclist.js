import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import MyProgress from '../components/progress';
import AMUIReact from 'amazeui-react';
import PubSub from 'pubsub-js';
let Icon = AMUIReact.Icon;
let Grid = AMUIReact.Grid;
let Col = AMUIReact.Col;
let List = AMUIReact.List;
let ListItem = AMUIReact.ListItem;
let Close = AMUIReact.Close;

export default class MusicList extends Component {
    handleClickMusic(index, e) {
        PubSub.publish('PLAY_MUSIC', index)
    }
    handleDeleteMusic(id, e) {
        e.stopPropagation();
        e.preventDefault();
        PubSub.publish('DELETE_MUSIC', id)
    }
    renderList() {
        let { musiclist, currentMusicIndex } = this.props;
        musiclist = _.filter(musiclist, n => !n.delete)
        let LIST = musiclist.length > 0 ? musiclist.map((item, index) => {
            return (<ListItem
                key={item.id}
                href="#"
                onClick={this.handleClickMusic.bind(this, index)}
            >
                <span style={item.focus ? { color: "#2f9824" } : {}} ><strong>{item.title}</strong> - {item.artist}</span>

                <Col sm={1} smPush={11}><Close onClick={this.handleDeleteMusic.bind(this, item.id)} /></Col>
            </ListItem>)

        }) : <div>当前无音乐</div>
        return (<Grid collapse className="doc-g"><Col sm={12}>
            <List border>{LIST}</List>
        </Col>
        </Grid>)
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        )
    }
}