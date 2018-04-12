import React from 'react';
import {render} from 'react-dom';
import Root from './root';
import {AppContainer} from 'react-hot-loader';   

render(
	<AppContainer>
		<Root />
	</AppContainer>,
	document.getElementById('root')
);

if(module.hot){
	module.hot.accept('./root',()=>{
		const NewRoot=require('./root').default;
		render(
		<AppContainer>
			<NewRoot />
			</AppContainer>,
			document.getElementById('root')
			)
	})
}