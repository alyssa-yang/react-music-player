import React from 'react';
import './header.less';
import AMUIReact from 'amazeui-react';
import { Link } from 'react-router';
let Icon = AMUIReact.Icon;
let Grid = AMUIReact.Grid;
let Col = AMUIReact.Col;

let Header = React.createClass({
	render() {
		return (
			<Grid className="doc-g">
				<Col sm={1}><Link to="/"><Icon icon="music" amStyle="danger" button spin size="lg" /></Link></Col>
				<Col sm={4} end><h1 className="caption">React Music Player</h1></Col>
			</Grid>
		)
	}
});

export default Header;