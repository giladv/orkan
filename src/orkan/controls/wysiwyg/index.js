import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
// import * as QuillNS from 'quill';
import ReactQuill from 'react-quill';
// import ImageResize from 'quill-image-resize-module';

import {formInput} from '../../form';
import inject from '../../inject';
import MediaGallery from '../../media-gallery';
import {createStyle} from '../../utils/style-utils';

import 'react-quill/dist/quill.snow.css';
import style from './style';

// const Quill = QuillNS;
// Quill.register('modules/imageResize', ImageResize);


@inject()
@observer
export default class Wysiwyg extends Component {

	static propTypes = {
		value: PropTypes.bool,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
	};

	static defaultProps = {
		onChange: () => null,
	};

	@autobind
	handleImage(){
		const {orkan} = this.props;
		orkan.openModal(MediaGallery).then(src => this.editor.insertEmbed(this.editor.getSelection(focus = true).index, 'image', src));
	}
	render(){
		const {className, value, onChange, disabled, ...otherProps} = this.props;

		const s = createStyle(style, className, {
			root: {
				disabled
			}
		});

		return (
			<ReactQuill
				{...otherProps}
				ref={ref => this.editor = ref && ref.getEditor()}
				className={s.root}
				onChange={newValue => {
					onChange(newValue);
				}}
				value={value || ''}
				formats={[
					'bold',
					'header',
					'italic',
					'link',
					'list',
					'blockquote',
					'image',
					'indent'
				]}
				modules={{
					// ImageResize: true,
					toolbar: {
						container: [
							[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
							['bold', 'italic', 'link'],
							['blockquote', {'list': 'ordered'}, {'list': 'bullet'}],
							['image']

						],
						handlers: {
							image: this.handleImage
						}
					},
					clipboard: {
						matchVisual: false // https://quilljs.com/docs/modules/clipboard/#matchvisual
					}
				}}/>
		);
	}
}

export const WysiwygControl = formInput()(Wysiwyg);
