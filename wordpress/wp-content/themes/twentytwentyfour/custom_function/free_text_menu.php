<?php
function free_text_menu()
{
?>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- jQuery & Select2 -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/switch_images.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/free_text.css">
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/editor_container.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

    <div class="wrap">
        <h1>記事を選択</h1>

        <!-- Select2 Dropdown -->
        <select id="article-select" style="width: 400px;"></select>
        </br>
        <!-- DataTable Result -->
        <div class="editor-container" style="background: #fff; padding: 20px; border-radius: 10px;display:none;">
            <div id="editorjs_article"></div>
            <button id="saveButton" class="submit-button">Save Article</button>
        </div>
    </div>

    <script>
        $(document).ready(function() {
            const $select = $('#article-select');
            let articleId;
            let editor;

            class CustomParagraph extends Paragraph {
                constructor({
                    data,
                    config,
                    api
                }) {
                    super({
                        data,
                        config,
                        api
                    });
                    this.tunes = data?.tunes || {};
                }

                save(blockContent) {
                    const baseData = super.save(blockContent);

                    const alignment =
                        this.tunes?.alignmentTune?.alignment || 'left';

                    return {
                        ...baseData,
                        alignment
                    };
                }
            }

            class ButtonTool {
                static get toolbox() {
                    return {
                        title: 'Button Block',
                        icon: '<svg width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" rx="3" ry="3" style="fill:gray"></rect></svg>'
                    };
                }

                constructor({
                    data
                }) {
                    this.data = data || {};
                    this.link = this.data.link || 'https://';
                    this.buttonText = this.data.text || ''; // map saved `text` to buttonText

                    // Extract barText from title (strip slashes: "\ a /" → "a")
                    const title = this.data.title || '';
                    this.barText = title.replace(/\\?\s*(.*?)\s*\/?/g, '$1').trim();

                    // If title exists, assume it was saved — mark as set
                    this.isSet = !!title;
                }

                render() {
                    this.$wrapper = $('<div>');

                    // Input for bar text
                    this.$inputBarText = $('<input>', {
                        type: 'text',
                        placeholder: 'Text between bars (| text |)',
                        value: this.barText,
                        class: 'cdx-input'
                    });

                    // Input for button text
                    this.$inputButtonText = $('<input>', {
                        type: 'text',
                        placeholder: 'Button Text',
                        value: this.buttonText,
                        class: 'cdx-input',
                        style: 'margin-top: 8px;'
                    });

                    // Input for link
                    this.$inputLink = $('<input>', {
                        type: 'text',
                        placeholder: 'Button Link (href)',
                        value: this.link,
                        class: 'cdx-input',
                        style: 'margin-top: 8px;'
                    });

                    // セット button
                    this.$setButton = $('<button>', {
                        type: 'button',
                        text: 'セット',
                        style: 'margin-top:10px; display:block; background-color:#FF6534; color:white; padding:6px 12px; border:none; border-radius:4px; cursor:pointer;'
                    });

                    this.$setButton.on('click', () => {
                        this.barText = this.$inputBarText.val();
                        this.buttonText = this.$inputButtonText.val();
                        this.link = this.$inputLink.val();
                        this.isSet = true;

                        this.$wrapper.empty(); // clear inputs
                        this.renderPreview(); // show button
                    });

                    if (this.isSet) {
                        this.renderPreview();
                    } else {
                        this.$wrapper.append(
                            this.$inputBarText,
                            this.$inputButtonText,
                            this.$inputLink,
                            this.$setButton
                        );
                    }

                    return this.$wrapper[0];
                }

                renderPreview() {
                    // Build preview HTML
                    const $a = $('<a>', {
                        href: this.link,
                        target: '_blank',
                        class: 'custom-group'
                    });

                    const $bar = $('<div>', {
                        text: ` ${this.barText} `,
                        style: 'font-weight: bold; color: #FF6534; margin-bottom: 10px;'
                    });

                    const $button = $('<button>', {
                        class: 'custom-button',
                        text: this.buttonText
                    });

                    $a.append($bar, $button);
                    this.$wrapper.append($a); // Only button shown, no more input
                }

                save() {
                    return {
                        link: this.link,
                        text: this.buttonText,
                        title: ` ${this.barText} `
                    };
                }
            }

            function formatOptionWithImage(option) {
                if (!option.image) return option.text;
                return `<img src="${option.image}" style="height: 20px; width: auto; vertical-align: middle; margin-right: 5px;" /> ${option.text}`;
            }

            function formatSelectedOption(option) {
                return option.text;
            }

            $select.select2({
                placeholder: '記事を選択',
                ajax: {
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/page_settings/article_list.php",
                    dataType: 'json',
                    delay: 250,
                    cache: false,
                    data: function(params) {
                        return {
                            term: params.term || '',
                            page: params.page || 1
                        };
                    },
                    processResults: function(data, params) {
                        params.page = params.page || 1;
                        return {
                            results: data.results,
                            pagination: {
                                more: data.more
                            }
                        };
                    },
                    cache: true
                },
                templateResult: formatOptionWithImage,
                templateSelection: formatSelectedOption,
                escapeMarkup: markup => markup
            });

            // Fetch existing content
            $select.on('select2:select', function(e) {
                articleId = $('#article-select').val();
                $('.editor-container').show();

                if (editor) {
                    editor.isReady
                        .then(() => editor.clear())
                        .then(() => loadArticleData())
                        .catch(err => {
                            console.error('❌ Error during editor reset:', err);
                            loadArticleData(); // Fallback
                        });
                } else {
                    loadArticleData();
                }
            });

            function loadArticleData() {
                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/free_text/get_free_text.php",
                    method: 'GET',
                    data: {
                        article_id: articleId
                    },
                    success: function(response) {
                        let rawData = {};
                        try {
                            rawData = JSON.parse(response);
                        } catch (e) {
                            console.error('❌ Failed to parse article data:', e);
                            rawData = {};
                        }

                        // If it's nested like { blocks: { time, blocks: [], version } }, extract it
                        let articleData = rawData.blocks && rawData.blocks.blocks ?
                            rawData.blocks :
                            rawData;

                        // Ensure articleData.blocks is an array
                        if (!Array.isArray(articleData.blocks)) {
                            articleData.blocks = [];
                        }

                        if (!editor) {
                            if ($('#editorjs_article').length) {
                                editor = new EditorJS({
                                    holder: 'editorjs_article',
                                    data: articleData,
                                    tools: {
                                        paragraph: {
                                            class: CustomParagraph,
                                            tunes: ['alignmentTune'],
                                            config: {
                                                preserveBlank: true,
                                            },
                                        },
                                        header: {
                                            class: Header,
                                            inlineToolbar: true,
                                            config: {
                                                levels: [2, 3, 4],
                                                defaultLevel: 2
                                            },
                                        },
                                        AnyButton: {
                                            class: ButtonTool
                                        },
                                        image: {
                                            class: ImageTool,
                                            config: {
                                                endpoints: {
                                                    byFile: "<?php echo get_template_directory_uri(); ?>/custom_function/news/save_images_news.php",
                                                }
                                            }
                                        },
                                        table: {
                                            class: Table
                                        },
                                        quote: {
                                            class: Quote
                                        },
                                        embed: {
                                            class: Embed
                                        },
                                        linkTool: {
                                            class: LinkTool,
                                            config: {
                                                endpoint: '<?php echo get_template_directory_uri(); ?>/custom_function/free_text/save_link_free_text.php',
                                                fetchData: (url) => {
                                                    return fetch('<?php echo get_template_directory_uri(); ?>/custom_function/free_text/save_link_free_text.php', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        body: JSON.stringify({
                                                            url: url
                                                        })
                                                    }).then(response => response.json());
                                                }
                                            }
                                        },
                                        alignmentTune: {
                                            class: AlignmentBlockTune,
                                            config: {
                                                blocks: {
                                                    paragraph: 'left',
                                                    header: 'center',
                                                }
                                            }
                                        }
                                    },
                                    onReady: () => {
                                        console.log('✅ Editor.js is ready');
                                        if (typeof AlignmentBlockTune !== 'undefined') {
                                            console.log('Alignment BlockTune is loaded and ready.');
                                        } else {
                                            console.error('Alignment BlockTune is not loaded.');
                                        }
                                    },
                                    onChange: () => {
                                        console.log('✏️ Content changed');
                                    }
                                });
                            }
                        } else {
                            editor.isReady
                                .then(() => editor.render(articleData))
                                .catch(err => console.error('❌ Render failed:', err));
                        }
                    },
                    error: function() {
                        alert("Error fetching article data.");
                    }
                });
            }




            // Save edited content
            $('#saveButton').on('click', function() {
                articleId = $('#article-select').val();
                editor.save().then((outputData) => {
                    $.ajax({
                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/free_text/save_free_text.php",
                        method: 'POST',
                        data: {
                            article_id: articleId,
                            content: JSON.stringify(outputData)
                        },
                        success: function(response) {
                            alert('Article saved successfully');
                            window.location.reload();
                        },
                        error: function() {
                            alert("Error saving article.");
                        }
                    });
                }).catch((error) => {
                    alert('Saving failed: ' + error);
                });
            });
        });
    </script>
<?php
}
?>