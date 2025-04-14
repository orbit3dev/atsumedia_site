import { make } from './utils/dom';
import './index.scss';
import ajax from './ajax';
import isPromise from './utils/isPromise';

const UiState = {
	/**
	 * The UI is in an empty state, with no image loaded or being uploaded.
	 */
	Empty: 'empty',

	/**
	 * The UI is in an uploading state, indicating an image is currently being uploaded.
	 */
	Uploading: 'uploading',

	/**
	 * The UI is in a filled state, with an image successfully loaded.
	 */
	Filled: 'filled',
};

/**
 * Class for working with UI:
 *  - rendering base structure
 *  - show/hide preview
 *  - apply tune view
 */
class Ui {
	/**
	 * @param {object} ui - image tool Ui module
	 * @param {object} ui.api - Editor.js API
	 * @param {ImageConfig} ui.config - user config
	 * @param {Function} ui.onSelectFile - callback for clicks on Select file button
	 * @param {boolean} ui.readOnly - read-only mode flag
	 */
	constructor({ api, config, onSelectFile, readOnly }) {
		this.api = api;
		this.config = config;
		this.onSelectFile = onSelectFile;
		this.readOnly = readOnly;
		this.nodes = {
			wrapper: make('div', [this.CSS.baseClass, this.CSS.wrapper]),
			imageContainer: make('div', [this.CSS.imageContainer]),
			fileButton: this.createFileButton(),
			imageEl: undefined,
			imagePreloader: make('div', this.CSS.imagePreloader),
            linkInput: make('input', [this.CSS.input], { placeholder: '画像のリンク先URL(空欄の場合はリンクなし)' }),
		};

		/**
		 * Create base structure
		 *  <wrapper>
		 *    <image-container>
		 *      <image-preloader />
		 *    </image-container>
		 *    <caption />
		 *    <select-file-button />
		 *  </wrapper>
		 */
		this.nodes.imageContainer.appendChild(this.nodes.imagePreloader);
		this.nodes.wrapper.appendChild(this.nodes.imageContainer);
		this.nodes.wrapper.appendChild(this.nodes.fileButton);
	}

	/**
	 * CSS classes
	 *
	 * @returns {object}
	 */
	get CSS() {
		return {
			baseClass: this.api.styles.block,
			loading: this.api.styles.loader,
			input: this.api.styles.input,
			button: this.api.styles.button,

			/**
			 * Tool's classes
			 */
			wrapper: 'image-tool',
			imageContainer: 'image-tool__image',
			imagePreloader: 'image-tool__image-preloader',
			imageEl: 'image-tool__image-picture',
		};
	}

	/**
	 * Renders tool UI
	 *
	 * @param {ImageToolData} toolData - saved tool data
	 * @returns {Element}
	 */
	render(toolData) {
		if (!toolData.file || Object.keys(toolData.file).length === 0) {
			this.toggleStatus(UiState.Empty);
		} else {
			this.toggleStatus(UiState.Uploading);
		}
        if (!this.readOnly) {
            // 読み取り専用（プレビューのみ）の場合はリンク先URLの入力欄を表示しない
            this.nodes.linkInput.value = toolData.linkUrl ?? '';
		    this.nodes.wrapper.appendChild(this.nodes.linkInput);
        }
		return this.nodes.wrapper;
	}

	/**
	 * Creates upload-file button
	 *
	 * @returns {Element}
	 */
	createFileButton() {
		const button = make('div', [this.CSS.button]);

		button.innerHTML =
			this.config.buttonContent ||
			`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.7778 9.33331H13.7867"/>
</svg>
 ${this.api.i18n.t('Select an Image')}`;

		button.addEventListener('click', () => {
			this.onSelectFile();
		});

		return button;
	}

	/**
	 * Shows uploading preloader
	 *
	 * @param {string} src - preview source
	 * @returns {void}
	 */
	showPreloader(src) {
		this.nodes.imagePreloader.style.backgroundImage = `url(${src})`;

		this.toggleStatus(UiState.Uploading);
	}

	/**
	 * Hide uploading preloader
	 *
	 * @returns {void}
	 */
	hidePreloader() {
		this.nodes.imagePreloader.style.backgroundImage = '';
		this.toggleStatus(UiState.Filled);
	}

	/**
	 * Shows an image
	 *
	 * @param {string} url - image source
	 * @param {string} linkUrl - url of href
	 * @returns {void}
	 */
	fillImage(url, linkUrl) {
		/**
		 * Check for a source extension to compose element correctly: video tag for mp4, img — for others
		 */
		const tag = /\.mp4$/.test(url) ? 'VIDEO' : 'IMG';

		const attributes = {
			src: url,
		};

		/**
		 * We use eventName variable because IMG and VIDEO tags have different event to be called on source load
		 * - IMG: load
		 * - VIDEO: loadeddata
		 *
		 * @type {string}
		 */
		let eventName = 'load';

		/**
		 * Update attributes and eventName if source is a mp4 video
		 */
		if (tag === 'VIDEO') {
			/**
			 * Add attributes for playing muted mp4 as a gif
			 *
			 * @type {boolean}
			 */
			attributes.autoplay = true;
			attributes.loop = true;
			attributes.muted = true;
			attributes.playsinline = true;

			/**
			 * Change event to be listened
			 *
			 * @type {string}
			 */
			eventName = 'loadeddata';
		}

		/**
		 * Compose tag with defined attributes
		 *
		 * @type {Element}
		 */
		this.nodes.imageEl = make(tag, this.CSS.imageEl, attributes);

		/**
		 * Add load event listener
		 */
		this.nodes.imageEl.addEventListener(eventName, () => {
			this.toggleStatus(UiState.Filled);

			/**
			 * Preloader does not exists on first rendering with presaved data
			 */
			if (this.nodes.imagePreloader) {
				this.nodes.imagePreloader.style.backgroundImage = '';
			}
		});

        const trimedLinkUrl = (linkUrl ?? '').trim();
        const sanitizedLinkUrl = trimedLinkUrl.replace(/"/g, '');
        if (this.readOnly && tag === 'IMG' && sanitizedLinkUrl) {
            // 画像のリンク先URLが設定されている場合はaタグで囲みリンクを設定
            const a = make('a', [], { href: sanitizedLinkUrl, target: '_blank' });
            a.appendChild(this.nodes.imageEl);
		    this.nodes.imageContainer.appendChild(a);
        } else {
		    this.nodes.imageContainer.appendChild(this.nodes.imageEl);
        }
	}

	/**
	 * Changes UI status
	 *
	 * @param {string} status - see {@link Ui.status} constants
	 * @returns {void}
	 */
	toggleStatus(status) {
		// debugger;
		for (const statusType in UiState) {
			if (Object.prototype.hasOwnProperty.call(UiState, statusType)) {
				console.log(`${this.CSS.wrapper}--${UiState[statusType]}`, status === UiState[statusType]);
				this.nodes.wrapper.classList.toggle(
					`${this.CSS.wrapper}--${UiState[statusType]}`,
					status === UiState[statusType]
				);
			}
		}
	}

	/**
	 * Apply visual representation of activated tune
	 *
	 * @param {string} tuneName - one of available tunes {@link Tunes.tunes}
	 * @param {boolean} status - true for enable, false for disable
	 * @returns {void}
	 */
	applyTune(tuneName, status) {
		this.nodes.wrapper.classList.toggle(`${this.CSS.wrapper}--${tuneName}`, status);
	}
}

class Uploader {
	/**
	 * @param {object} params - uploader module params
	 * @param {ImageConfig} params.config - image tool config
	 * @param {Function} params.onUpload - one callback for all uploading (file, url, d-n-d, pasting)
	 * @param {Function} params.onError - callback for uploading errors
	 */
	constructor({ config, onUpload, onError }) {
		this.config = config;
		this.onUpload = onUpload;
		this.onError = onError;
	}

	/**
	 * Handle clicks on the upload file button
	 * Fires ajax.transport()
	 *
	 * @param {Function} onPreview - callback fired when preview is ready
	 */
	uploadSelectedFile({ onPreview }) {
		const preparePreview = function (file) {
			const reader = new FileReader();

			reader.readAsDataURL(file);
			reader.onload = (e) => {
				onPreview(e.target.result);
			};
		};

		/**
		 * Custom uploading
		 * or default uploading
		 */
		let upload;

		// custom uploading
		if (this.config.uploader && typeof this.config.uploader.uploadByFile === 'function') {
			const uploadByFile = this.config.uploader.uploadByFile;
			upload = ajax.selectFiles({ accept: this.config.types || 'image/*' }).then((files) => {
				preparePreview(files[0]);

				const customUpload = uploadByFile(files[0]);

				if (!isPromise(customUpload)) {
					console.warn('Custom uploader method uploadByFile should return a Promise');
				}

				return customUpload;
			});

			// default uploading
		} else {
			upload = ajax
				.transport({
					url: this.config.endpoints.byFile,
					data: this.config.additionalRequestData,
					accept: this.config.types || 'image/*',
					headers: this.config.additionalRequestHeaders,
					beforeSend: (files) => {
						preparePreview(files[0]);
					},
					fieldName: this.config.field || 'image',
				})
				.then((response) => response.body);
		}

		upload
			.then((response) => {
				this.onUpload(response);
			})
			.catch((error) => {
				this.onError(error);
			});
	}

	/**
	 * Handle clicks on the upload file button
	 * Fires ajax.post()
	 *
	 * @param {string} url - image source url
	 */
	uploadByUrl(url) {
		let upload;

		/**
		 * Custom uploading
		 */
		if (this.config.uploader && typeof this.config.uploader.uploadByUrl === 'function') {
			upload = this.config.uploader.uploadByUrl(url);

			if (!isPromise(upload)) {
				console.warn('Custom uploader method uploadByUrl should return a Promise');
			}
		} else {
			/**
			 * Default uploading
			 */
			upload = ajax
				.post({
					url: this.config.endpoints.byUrl,
					data: Object.assign(
						{
							url: url,
						},
						this.config.additionalRequestData
					),
					type: ajax.contentType.JSON,
					headers: this.config.additionalRequestHeaders,
				})
				.then((response) => response.body);
		}

		upload
			.then((response) => {
				this.onUpload(response);
			})
			.catch((error) => {
				this.onError(error);
			});
	}

	/**
	 * Handle clicks on the upload file button
	 * Fires ajax.post()
	 *
	 * @param {File} file - file pasted by drag-n-drop
	 * @param {Function} onPreview - file pasted by drag-n-drop
	 */
	uploadByFile(file, { onPreview }) {
		/**
		 * Load file for preview
		 *
		 * @type {FileReader}
		 */
		const reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onload = (e) => {
			onPreview(e.target.result);
		};

		let upload;

		/**
		 * Custom uploading
		 */
		if (this.config.uploader && typeof this.config.uploader.uploadByFile === 'function') {
			upload = this.config.uploader.uploadByFile(file);

			if (!isPromise(upload)) {
				console.warn('Custom uploader method uploadByFile should return a Promise');
			}
		} else {
			/**
			 * Default uploading
			 */
			const formData = new FormData();

			formData.append(this.config.field || 'image', file);

			if (this.config.additionalRequestData && Object.keys(this.config.additionalRequestData).length) {
				Object.entries(this.config.additionalRequestData).forEach(([name, value]) => {
					formData.append(name, value);
				});
			}

			upload = ajax
				.post({
					url: this.config.endpoints.byFile,
					data: formData,
					type: ajax.contentType.JSON,
					headers: this.config.additionalRequestHeaders,
				})
				.then((response) => response.body);
		}

		upload
			.then((response) => {
				this.onUpload(response);
			})
			.catch((error) => {
				this.onError(error);
			});
	}
}

export default class ImageTool {
	/**
	 * @param {object} tool - tool properties got from editor.js
	 * @param {ImageToolData} tool.data - previously saved data
	 * @param {ImageConfig} tool.config - user config for Tool
	 * @param {object} tool.api - Editor.js API
	 * @param {boolean} tool.readOnly - read-only mode flag
	 * @param {BlockAPI|{}} tool.block - current Block API
	 */
	constructor({ data, config, api, readOnly, block }) {
		this.api = api;
		this.readOnly = readOnly;
		this.block = block;

		/**
		 * Tool's initial config
		 */
		this.config = {
			endpoints: config.endpoints,
			additionalRequestData: config.additionalRequestData,
			additionalRequestHeaders: config.additionalRequestHeaders,
			field: config.field,
			types: config.types,
			buttonContent: config.buttonContent,
			uploader: config.uploader,
			actions: config.actions,
		};

		/**
		 * Module for file uploading
		 */
		this.uploader = new Uploader({
			config: this.config,
			onUpload: (response) => this.onUpload(response),
			onError: (error) => this.uploadingFailed(error),
		});

		/**
		 * Module for working with UI
		 */
		this.ui = new Ui({
			api,
			config: this.config,
			onSelectFile: () => {
				this.uploader.uploadSelectedFile({
					onPreview: (src) => {
						this.ui.showPreloader(src);
					},
				});
			},
			readOnly,
		});

		/**
		 * Set saved state
		 */
		this._data = {
			withBorder: false,
			withBackground: false,
			stretched: false,
			file: {
				url: '',
			},
            linkUrl: '',
		};
		this.data = data;
	}

	/**
	 * Notify core that read-only mode is supported
	 *
	 * @returns {boolean}
	 */
	static get isReadOnlySupported() {
		return true;
	}

	/**
	 * Get Tool toolbox settings
	 * icon - Tool icon's SVG
	 * title - title to show in toolbox
	 *
	 * @returns {{icon: string, title: string}}
	 */
	static get toolbox() {
		return {
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M5.13968 15.32L8.69058 11.5661C9.02934 11.2036 9.48873 11 9.96774 11C10.4467 11 10.9061 11.2036 11.2449 11.5661L15.3871 16M13.5806 14.0664L15.0132 12.533C15.3519 12.1705 15.8113 11.9668 16.2903 11.9668C16.7693 11.9668 17.2287 12.1705 17.5675 12.533L18.841 13.9634"/>
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M13.7778 9.33331H13.7867"/>
</svg>
`,
			title: 'Image',
		};
	}

	static IconAddBorder = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.9919 9.5H19.0015"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.5 5H14.5096"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.625 5H15C17.2091 5 19 6.79086 19 9V9.375"></path><path stroke="currentColor" stroke-width="2" d="M9.375 5L9 5C6.79086 5 5 6.79086 5 9V9.375"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.3725 5H9.38207"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9.5H5.00957"></path><path stroke="currentColor" stroke-width="2" d="M9.375 19H9C6.79086 19 5 17.2091 5 15V14.625"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.3725 19H9.38207"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 14.55H5.00957"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 13V16M16 19V16M19 16H16M16 16H13"></path></svg>`;

	static IconStretch = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L20 12L17 15"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 12H20"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L4 12L7 15"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12H10"></path></svg>`;

	static IconAddBackground = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19V19C9.13623 19 8.20435 19 7.46927 18.6955C6.48915 18.2895 5.71046 17.5108 5.30448 16.5307C5 15.7956 5 14.8638 5 13V12C5 9.19108 5 7.78661 5.67412 6.77772C5.96596 6.34096 6.34096 5.96596 6.77772 5.67412C7.78661 5 9.19108 5 12 5H13.5C14.8956 5 15.5933 5 16.1611 5.17224C17.4395 5.56004 18.44 6.56046 18.8278 7.83886C19 8.40666 19 9.10444 19 10.5V10.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 13V16M16 19V16M19 16H16M16 16H13"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6.5 17.5L17.5 6.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.9919 10.5H19.0015"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.9919 19H11.0015"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13L13 5"></path></svg>`;

	/**
	 * Available image tools
	 *
	 * @returns {Array}
	 */
	static get tunes() {
		return [
			{
				name: 'withBorder',
				icon: this.IconAddBorder,
				title: 'With border',
				toggle: true,
			},
			{
				name: 'stretched',
				icon: this.IconStretch,
				title: 'Stretch image',
				toggle: true,
			},
			{
				name: 'withBackground',
				icon: this.IconAddBackground,
				title: 'With background',
				toggle: true,
			},
		];
	}

	/**
	 * Renders Block content
	 *
	 * @public
	 *
	 * @returns {HTMLDivElement}
	 */
	render() {
		return this.ui.render(this.data);
	}

	/**
	 * Validate data: check if Image exists
	 *
	 * @param {ImageToolData} savedData — data received after saving
	 * @returns {boolean} false if saved data is not correct, otherwise true
	 * @public
	 */
	validate(savedData) {
		return !!savedData.file.url;
	}

	/**
	 * Return Block data
	 *
	 * @public
	 *
	 * @returns {ImageToolData}
	 */
	save() {
        this.data.linkUrl = this.ui.nodes.linkInput.value;
		return this.data;
	}

	/**
	 * Returns configuration for block tunes: add background, add border, stretch image
	 *
	 * @public
	 *
	 * @returns TunesMenuConfig
	 */
	renderSettings() {
		// Merge default tunes with the ones that might be added by user
		// @see https://github.com/editor-js/image/pull/49
		const tunes = ImageTool.tunes.concat(this.config.actions || []);

		return tunes.map((tune) => ({
			icon: tune.icon,
			label: this.api.i18n.t(tune.title),
			name: tune.name,
			toggle: tune.toggle,
			isActive: this.data[tune.name],
			onActivate: () => {
				/**If it'a user defined tune, execute it's callback stored in action property */
				if (typeof tune.action === 'function') {
					tune.action(tune.name);

					return;
				}
				this.tuneToggled(tune.name);
			},
		}));
	}

	/**
	 * Fires after clicks on the Toolbox Image Icon
	 * Initiates click on the Select File button
	 *
	 * @public
	 */
	appendCallback() {
		this.ui.nodes.fileButton.click();
	}

	/**
	 * Specify paste substitutes
	 *
	 * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
	 * @returns {{tags: string[], patterns: object<string, RegExp>, files: {extensions: string[], mimeTypes: string[]}}}
	 */
	static get pasteConfig() {
		return {
			/**
			 * Paste HTML into Editor
			 */
			tags: [
				{
					img: { src: true },
				},
			],
			/**
			 * Paste URL of image into the Editor
			 */
			patterns: {
				image: /https?:\/\/\S+\.(gif|jpe?g|tiff|png|svg|webp)(\?[a-z0-9=]*)?$/i,
			},

			/**
			 * Drag n drop file from into the Editor
			 */
			files: {
				mimeTypes: ['image/*'],
			},
		};
	}

	/**
	 * Specify paste handlers
	 *
	 * @public
	 * @see {@link https://github.com/codex-team/editor.js/blob/master/docs/tools.md#paste-handling}
	 * @param {CustomEvent} event - editor.js custom paste event
	 *                              {@link https://github.com/codex-team/editor.js/blob/master/types/tools/paste-events.d.ts}
	 * @returns {void}
	 */
	async onPaste(event) {
		switch (event.type) {
			case 'tag': {
				const image = event.detail.data;

				/** Images from PDF */
				if (/^blob:/.test(image.src)) {
					const response = await fetch(image.src);

					const file = await response.blob();

					this.uploadFile(file);
					break;
				}

				this.uploadUrl(image.src);
				break;
			}
			case 'pattern': {
				const url = event.detail.data;

				this.uploadUrl(url);
				break;
			}
			case 'file': {
				const file = event.detail.file;

				this.uploadFile(file);
				break;
			}
		}
	}

	/**
	 * Private methods
	 * ̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿
	 */

	/**
	 * Stores all Tool's data
	 *
	 * @private
	 *
	 * @param {ImageToolData} data - data in Image Tool format
	 */
	set data(data) {
        this.linkUrl = data.linkUrl ?? '';
		this.image = data.file;

		ImageTool.tunes.forEach(({ name: tune }) => {
			const value = typeof data[tune] !== 'undefined' ? data[tune] === true || data[tune] === 'true' : false;

			this.setTune(tune, value);
		});
	}

	/**
	 * Return Tool data
	 *
	 * @private
	 *
	 * @returns {ImageToolData}
	 */
	get data() {
		return this._data;
	}

    set linkUrl(url) {
        this._data.linkUrl = url;
    }

	/**
	 * Set new image file
	 *
	 * @private
	 *
	 * @param {object} file - uploaded file data
	 */
	set image(file) {
		this._data.file = file || { url: '' };

		if (file && file.url) {
			this.ui.fillImage(file.url, this._data.linkUrl);
		}
	}

	/**
	 * File uploading callback
	 *
	 * @private
	 *
	 * @param {UploadResponseFormat} response - uploading server response
	 * @returns {void}
	 */
	onUpload(response) {
		if (response.success && response.file) {
			this.image = response.file;
		} else {
			this.uploadingFailed('incorrect response: ' + JSON.stringify(response));
		}
	}

	/**
	 * Handle uploader errors
	 *
	 * @private
	 * @param {string} errorText - uploading error text
	 * @returns {void}
	 */
	uploadingFailed(errorText) {
		console.log('Image Tool: uploading failed because of', errorText);

		this.api.notifier.show({
			message: this.api.i18n.t('Couldn’t upload image. Please try another.'),
			style: 'error',
		});
		this.ui.hidePreloader();
	}

	/**
	 * Callback fired when Block Tune is activated
	 *
	 * @private
	 *
	 * @param {string} tuneName - tune that has been clicked
	 * @returns {void}
	 */
	tuneToggled(tuneName) {
		// inverse tune state
		this.setTune(tuneName, !this._data[tuneName]);
	}

	/**
	 * Set one tune
	 *
	 * @param {string} tuneName - {@link Tunes.tunes}
	 * @param {boolean} value - tune state
	 * @returns {void}
	 */
	setTune(tuneName, value) {
		this._data[tuneName] = value;

		this.ui.applyTune(tuneName, value);
		if (tuneName === 'stretched') {
			/**
			 * Wait until the API is ready
			 */
			Promise.resolve()
				.then(() => {
					this.block.stretched = value;
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}

	/**
	 * Show preloader and upload image file
	 *
	 * @param {File} file - file that is currently uploading (from paste)
	 * @returns {void}
	 */
	uploadFile(file) {
		this.uploader.uploadByFile(file, {
			onPreview: (src) => {
				this.ui.showPreloader(src);
			},
		});
	}

	/**
	 * Show preloader and upload image by target url
	 *
	 * @param {string} url - url pasted
	 * @returns {void}
	 */
	uploadUrl(url) {
		this.ui.showPreloader(url);
		this.uploader.uploadByUrl(url);
	}
}
