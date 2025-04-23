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
                console.log(articleId);
                $('.editor-container').show();

                // Initialize only once
                if (!editor) {
                    $.ajax({
                        url: "<?php echo get_template_directory_uri(); ?>/custom_function/free_text/get_free_text.php",
                        method: 'GET',
                        data: {
                            article_id: articleId
                        },
                        success: function(response) {
                            const articleData = JSON.parse(response);
                            editor = new EditorJS({
                                holder: 'editorjs_article',
                                data: articleData.blocks || [], // If no data, initializes with an empty array
                                tools: {
                                    paragraph: {
                                        class: Paragraph
                                    },
                                    image: {
                                        class: ImageTool,
                                        config: {
                                            endpoints: {
                                                byFile: "<?php echo get_template_directory_uri(); ?>/custom_function/free_text/save_images_free_text.php",

                                            },
                                            additionalRequestData: {
                                                article_id: articleId
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
                                            // endpoint: '< ?php echo get_template_directory_uri(); ?>/custom_function/free_text/save_link_free_text.php'
                                        }
                                    },
                                    linkTool: {
                                        class: LinkTool,
                                        config: {
                                            // endpoint: '/path/to/your/link-parser.php', // Update to your actual endpoint
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
                                                    })
                                                    .then(response => response.json());
                                            }
                                        }
                                    }
                                },
                                onReady: () => {
                                    console.log('✅ Editor.js is ready');
                                },
                                onChange: () => {
                                    console.log('✏️ Content changed');
                                }
                            });
                        },
                        error: function() {
                            alert("Error fetching article data.");
                        }
                    });
                }
            });

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