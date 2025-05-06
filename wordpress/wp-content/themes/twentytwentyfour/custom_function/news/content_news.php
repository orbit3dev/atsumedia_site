<?php


function custom_content_page()
{
?>

    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/editor_container.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/content_news.css">
    <div class="wrap" id="table_panel">
        <div class="header-container">
            <h1><b>コンテンツ一覧</b></h1>
            <button type="button" id="add_new_news" class='news_button'>新しいニュースを作成</button>
        </div>
        <table id="contentTable" class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>タイトル</th>
                    <th>slug(URL文字列)</th>
                    <th>あらすじ</th>
                    <th>公開 / 非公開選択</th>
                    <th>TOP画面に表示</th>
                    <th>日付</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <form id="custom-content-form" method="post">
        <div class="wrap">
            <div class="header-container">
                <h1><b>コンテンツフォーム</b></h1>
                <button type="button" id="cancel_news" class='news_button'>戻る</button>
            </div>
            <div style="display: flex;">
                <!-- Sidebar Menu -->
                <!-- <div style="width: 250px; border-right: 1px solid #ddd; padding: 10px;">
                <h3>Menu</h3>
                <ul>
                    <li><a href="#">Add New Content</a></li>
                    <li><a href="#">Manage Content</a></li>
                </ul>
            </div> -->

                <!-- Form Content -->
                <div style="flex-grow: 1; padding: 10px;">
                    <form method="post" enctype="multipart/form-data">
                        <table class="form-table">
                            <tr>
                                <th><label for="title">タイトル</label></th>
                                <td><input type="text" name="title" class="regular-text" required></td>
                            </tr>
                            <tr>
                                <th><label for="slug">slug(URL文字列)</label></th>
                                <td><input type="text" name="slug" class="regular-text"></td>
                            </tr>
                            <tr>
                                <th><label for="date">日付</label></th>
                                <td><input type="date" name="date" id="customDate"></td>
                            </tr>
                            <tr>
                                <th>カテゴリー選択</th>
                                <td>
                                    <label><input type="radio" name="genre" value="anime"> アニメ</label>
                                    <label><input type="radio" name="genre" value="movie"> 映画</label>
                                    <label><input type="radio" name="genre" value="drama_japan">国内ドラマ</label>
                                    <label><input type="radio" name="genre" value="drama_global"> 海外ドラマ</label>
                                </td>
                            </tr>
                            <tr>
                                <th><label>TOP画面に表示</label></th>
                                <td><input type="checkbox" name="top_screen"></td>
                            </tr>
                            <tr>
                                <th><label for="synopsis">あらすじ</label></th>
                                <td><textarea name="synopsis" rows="4" class="large-text"></textarea></td>
                            </tr>
                            <tr>
                                <th>公開 / 非公開選択</th>
                                <td>
                                    <label><input type="radio" name="visibility" value="public"> 公開</label>
                                    <label><input type="radio" name="visibility" value="private"> 非公開</label>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="meta_title">Meta Title</label></th>
                                <td><input type="text" name="meta_title" class="regular-text"></td>
                            </tr>
                            <tr>
                                <th><label for="meta_description">Meta Description</label></th>
                                <td><textarea name="meta_description" rows="2" class="large-text"></textarea></td>
                            </tr>
                            <tr>
                                <th><label>ファーストビュー画像(OGP画像としても利用)</label></th>
                                <td>
                                    <input type="file" id="first_view_image_input" name="first_view_image_input" accept="image/*">
                                    <input type="hidden" name="first_view_image" id="first_view_image">
                                    <!-- <button type="button" id="upload_first_view_button">画像をアップロード</button> -->
                                    <div id="first_view_preview"></div>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="editorjs_news">記事内容</label></th>
                                <td>
                                    <!-- <div id="editorjs-container"> -->
                                    <div id="editorjs_news"></div>
                                    <!-- </div> -->
                                    <input type="hidden" name="article_content" id="article_content">
                                </td>
                            </tr>


                            <tr style='display:none;'>
                                <th><label for="banner">バナー</label></th>
                                <td><textarea name="banner" rows="2" class="large-text"></textarea></td>
                            </tr>
                            <tr>
                                <th><label for="article-select">関連作品</label></th>
                                <td><select id="article-select" multiple style="width: 400px;"></select></td>
                                <!-- <td><textarea name="related_titles" rows="2" class="large-text"></textarea></td> -->
                            </tr>
                            <tr>
                                <th><label for="author_name">著者名</label></th>
                                <td><input type="text" name="author_name" class="regular-text"></td>
                            </tr>
                            <tr>
                                <th><label for="author_description">著者説明文</label></th>
                                <td><textarea name="author_description" rows="3" class="large-text"></textarea></td>
                            </tr>
                            <tr>
                                <th><label>著者画像</label></th>
                                <td>
                                    <input type="file" id="author_image_input" name="author_image_input" accept="image/*">
                                    <input type="hidden" name="author_image" id="author_image">
                                    <!-- <button type="button" id="upload_author_button">画像をアップロード</button> -->
                                    <div id="author_preview"></div>
                                </td>
                            </tr>
                        </table>
                        <input type="hidden" name="news_id" id="news_id">
                        <div class="submit-container">
                            <input type="submit" name="submit_form" class="button button-primary" value="保存">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </form>
    <style>
        input.flatpickr-input[readonly] {
            background-color: white !important;
            color: black;
        }
    </style>
<?php
}

// JavaScript for media uploader
function custom_content_scripts()
{
?>
    <script>
        let editor;
        jQuery(document).ready(function($) {
            const $select = $('#article-select');
            selectedData = ''
            if (typeof flatpickr !== "undefined") {
                flatpickr("#customDate", {
                    enableTime: true, // Enable time picker
                    dateFormat: "Y/m/d H:i", // Format: yyyy/mm/dd HH:MM
                    time_24hr: true // Use 24-hour format (optional)
                });
            }

            function formatSelectedOption(option) {
                if (!option.id) return option.text;
                return option.text;
            }

            function formatOptionWithImage(option) {
                if (!option.image) return option.text;
                return `<img src="${option.image}" style="height: 20px; width: auto; vertical-align: middle; margin-right: 5px;" /> ${option.text}`;
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
            let originalImageUrl = '';
            let originalImageFilename = '';
            $select.on('select2:select', function(e) {
                let selectedData = $select.select2('data');
            });
            $select.on('select2:unselect', function(e) {
                let deselectedItem = e.params.data;
            });

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
                        text: `\\ ${this.barText} /`,
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
                        title: `\\ ${this.barText} /`
                    };
                }
            }

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

            if ($('#editorjs_news').length) {
                editor = new EditorJS({
                    holder: 'editorjs_news',
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



            $('#custom-content-form').hide()
            var table = $('#contentTable').DataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "<?php echo get_template_directory_uri(); ?>/custom_function/news/get_news_data.php",
                    "type": "POST",
                    "data": {
                        action: 'fetch_content_data'
                    }
                },
                "columns": [{
                        "data": "title"
                    },
                    {
                        "data": "slug"
                    },
                    {
                        "data": "synopsis"
                    },
                    {
                        "data": "is_public"
                    },
                    {
                        "data": "is_top"
                    },
                    {
                        "data": "datetime"
                    },
                    {
                        "data": "id",
                        "render": function(data, type, row) {
                            let editButton = '<button class="edit-btn button" data-id="' + data + '">編集</button>';

                            // Check if the content is public or private
                            let actionButtonText = (row.is_public === '公開') ? '非公開にする' : '公開にする';
                            let actionButtonClass = (row.is_public === '公開') ? 'deactivate-btn' : 'activate-btn';

                            let actionButton = '<button class="' + actionButtonClass + ' button" data-id="' + data + '">' + actionButtonText + '</button>';

                            return editButton + " " + actionButton;
                        }
                    }
                ],
                "rowCallback": function(row, data, index) {
                    if (data.is_public === '非公開') {
                        $(row).css("background-color", "#FFDDDD"); // Pastel red for private rows
                    }
                }
            });
            $('#contentTable').before('<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>色の意味:</strong> 通常の背景: 公開, <span style="background-color: #FFDDDD; padding: 2px 5px;">赤背景</span>: 非公開</p>');
            $('#add_new_news').on('click', function() {
                $('#table_panel').hide(500)
                $('#custom-content-form').show(1000)
                clearForm()
            })
            $('#cancel_news').on('click', function() {
                $('#custom-content-form').hide(500)
                $('#table_panel').show(1000)
                clearForm()
            })
            // Delete event
            $('#contentTable').on('click', '.delete-btn', function() {
                var id = $(this).data('id');
                if (confirm('このコンテンツを削除しますか？')) {
                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'delete_content',
                            content_id: id
                        },
                        success: function(response) {
                            if (response.success) {
                                alert('削除成功');
                                table.ajax.reload();
                            } else {
                                alert('削除失敗');
                            }
                        }
                    });
                }
            });
            $('#contentTable tbody').on('click', '.edit-btn', function() {
                var id = $(this).data('id');

                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/news/get_news_data.php",
                    type: "POST",
                    data: {
                        action: "get_news_by_id",
                        id: id
                    },
                    dataType: "json",
                    success: function(response) {
                        if (response.success) {
                            $('#table_panel').hide(500)
                            $('#custom-content-form').show(1000)
                            var data = response.data;
                            clearForm()
                            $('input[name="title"]').val(data.title);
                            $('input[name="slug"]').val(data.slug);
                            $('input[name="date"]').val(data.date_news);
                            $('textarea[name="synopsis"]').val(data.outline);
                            $('input[name="meta_title"]').val(data.title_meta);
                            $('textarea[name="meta_description"]').val(data.description_meta);

                            $('textarea[name="banner"]').val(data.banner);
                            // $('textarea[name="related_titles"]').val(data.related_titles);
                            $('input[name="author_name"]').val(data.author);
                            $('textarea[name="author_description"]').val(data.author_description);

                            // Genre Selection
                            $('input[name="genre"][value="' + data.genre_type + '"]').prop("checked", true);

                            // Visibility
                            $('input[name="visibility"][value="' + (data.is_public === "公開" ? "public" : "private") + '"]').prop("checked", true);

                            // Top Screen Checkbox
                            $('input[name="top_screen"]').prop("checked", data.is_top === "表示");

                            // Images
                            $('#first_view_image').val(data.image);
                            if (data.image != '' && data.image != null) {
                                $('#first_view_preview').html('<img src="' + data.image + '" width="150">');
                            }
                            if (data.author_image != '' && data.author_image != null) {
                                $('#author_image').val(data.author_image);
                                $('#author_preview').html('<img src="' + data.author_image + '" width="150">');
                            }
                            var savedRelatedTitles = typeof data.related_articles != 'undefined' ? JSON.parse(data.related_articles) : null;
                            if (Array.isArray(savedRelatedTitles)) {
                                savedRelatedTitles.forEach(function(item) {
                                    var option = new Option(item.text, item.id, true, true); // true, true = selected and default
                                    $select.append(option);
                                });
                                $select.trigger('change');
                            }
                            if (data.related_titles && data.related_titles !== '') {

                            } else {
                                console.log('No related titles or empty string');
                            }
                            $('#news_id').val(data.id)

                            let fixedContent = data.content.replace(/<a href="(.*?)">/g, '<a href=\\"$1\\">');

                            try {
                                jsonData = JSON.parse(fixedContent);
                                if (typeof editor !== 'undefined' && editor.isReady) {
                                    editor.isReady
                                        .then(() => {
                                            return editor.clear();
                                        })
                                        .then(() => {
                                            return editor.render(jsonData);
                                        })
                                        .catch(error => {
                                            console.error("Editor rendering error:", error);
                                        });
                                } else {
                                    console.warn("Editor is not initialized yet.");
                                }
                            } catch (error) {
                                console.error("JSON Parse Error:", error);
                            }
                        } else {
                            alert("データ取得エラー");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX Error:", xhr.responseText);
                        alert("通信エラー: " + error);
                    }
                });
            });

            $('#contentTable tbody').on('click', '.deactivate-btn, .activate-btn', function() {
                var button = $(this);
                var id = button.data('id');
                var newStatus = button.hasClass('deactivate-btn') ? '非公開' : '公開';
                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/news/get_news_data.php",
                    type: "POST",
                    data: {
                        action: "change_status",
                        id: id,
                        status: newStatus
                    },
                    dataType: "json",
                    success: function(response) {
                        if (response.success) {
                            alert("ステータスが「" + newStatus + "」に変更されました。");
                            // window.location.reload();
                        } else {
                            alert("ステータス変更に失敗しました。");
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error("AJAX Error:", xhr.responseText);
                        alert("通信エラー: " + error);
                    }
                });
            });

            function clearForm() {
                $('#custom-content-form')[0].reset(); // Reset all input fields
                $('input[type="checkbox"], input[type="radio"]').prop('checked', false);
                $('textarea').val('');
                $('input[type="hidden"]').val('');
                $('#first_view_preview, #author_preview').html('');
                if (typeof editor !== 'undefined') {
                    editor.clear()
                }
            }

            function mediaUploader(buttonId, inputId, previewId) {
                $('#' + buttonId).click(function(e) {
                    e.preventDefault();
                    var mediaUploader = wp.media({
                        title: 'Choose an Image',
                        button: {
                            text: 'Use this image'
                        },
                        multiple: false
                    }).on('select', function() {
                        var attachment = mediaUploader.state().get('selection').first().toJSON();
                        $('#' + inputId).val(attachment.url);
                        $('#' + previewId).html('<img src="' + attachment.url + '" width="150">');
                    }).open();
                });
            }

            // mediaUploader('upload_first_view_button', 'first_view_image', 'first_view_preview');
            // mediaUploader('upload_author_button', 'author_image', 'author_preview');

            function handleImagePreview(inputId, previewId) {
                $(`#${inputId}`).on("change", function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            $(`#${previewId}`).html(`<img src="${event.target.result}" width="150">`);
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            function uploadImage(inputId, hiddenFieldId, callback) {
                const imageFile = $(`#${inputId}`).prop("files")[0];

                if (!imageFile) {
                    callback(null);
                    return;
                }

                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);

                $.ajax({
                    url: "<?php echo get_template_directory_uri(); ?>/custom_function/news/upload_image_news.php",
                    type: "POST",
                    data: imageFormData,
                    processData: false,
                    contentType: false,
                    success: function(uploadResponse) {
                        if (uploadResponse.success) {
                            $(`#${hiddenFieldId}`).val(uploadResponse.data.url);
                            callback(uploadResponse.data.url);
                        } else {
                            alert("画像アップロードに失敗しました: " + uploadResponse.data.message);
                            callback(null);
                        }
                    },
                    error: function() {
                        alert("画像アップロード中にエラーが発生しました");
                        callback(null);
                    }
                });
            }

            // Apply preview handling to both image inputs
            handleImagePreview("first_view_image_input", "first_view_preview");
            handleImagePreview("author_image_input", "author_preview");

            // Modify form submission to wait for both uploads before proceeding
            $("#custom-content-form").submit(function(e) {
                e.preventDefault();

                let firstViewImageUploaded = false;
                let authorImageUploaded = false;

                function checkUploads() {
                    if (firstViewImageUploaded && authorImageUploaded) {
                        submitArticleForm();
                    }
                }

                uploadImage("first_view_image_input", "first_view_image", function() {
                    firstViewImageUploaded = true;
                    checkUploads();
                });

                uploadImage("author_image_input", "author_image", function() {
                    authorImageUploaded = true;
                    checkUploads();
                });
            });

            function submitArticleForm() {
                editor.save().then((outputData) => {
                    outputData.blocks = outputData.blocks.map((block) => {
                        if (
                            block.tunes &&
                            block.tunes.alignmentTune &&
                            block.tunes.alignmentTune.alignment
                        ) {
                            return {
                                ...block,
                                data: {
                                    ...block.data,
                                    alignment: block.tunes.alignmentTune.alignment,
                                },
                            };
                        }

                        return block;
                    });
                    const formData = $("#custom-content-form").serializeArray();

                    idList = []
                    selectedData = $select.select2('data')
                    selectedData.forEach(item => {
                        if (item.id) {
                            idList.push(item.id);
                        }
                        for (let key in item) {
                            if (Array.isArray(item[key])) {
                                extractIdsRecursive(item[key], ids);
                            }
                        }
                    });
                    articleId = idList.join(',')
                    formData.push({
                        name: "article_content",
                        value: JSON.stringify(outputData),
                    });
                    formData.push({
                        name: "article_select",
                        value: articleId,
                    });
                    $.ajax({
                        type: "POST",
                        url: ajaxurl,
                        data: {
                            action: "insert_at_news",
                            form_data: $.param(formData),
                        },
                        success: function(response) {
                            if (response.success) {
                                alert("データが正常にアップロードされました");
                                $("#custom-content-form")[0].reset();
                                $("#first_view_preview").html("");
                                $("#author_preview").html("");
                                window.location.reload();
                            } else {
                                alert("エラー: " + response.data.message);
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Error:", error);
                            alert("フォームを送信中にエラーが発生しました");
                        },
                    });
                }).catch((error) => {
                    console.error("Editor.js Saving failed:", error);
                    alert("記事内容の保存に失敗しました");
                });
            }


            // Handle Form Submission
            // $('#custom-content-form').submit(function(e) {
            //     e.preventDefault(); // Prevent default for now

            //     const imageFile = $('#first_view_image_input').prop('files')[0];

            //     // If there's an image, upload it first
            //     if (imageFile) {
            //         const imageFormData = new FormData();
            //         imageFormData.append('file', imageFile);

            //         // Upload to your custom PHP file in theme directory
            //         $.ajax({
            //             url: "< ?php echo get_template_directory_uri(); ?>/custom_function/news/upload_image_news.php",
            //             type: 'POST',
            //             data: imageFormData,
            //             processData: false,
            //             contentType: false,
            //             success: function(uploadResponse) {
            //                 if (uploadResponse.success) {
            //                     // Set hidden input for form submission
            //                     $('#first_view_image').val(uploadResponse.data.url);
            //                     submitArticleForm(); // Proceed with final form submit
            //                 } else {
            //                     alert('画像アップロードに失敗しました: ' + uploadResponse.data.message);
            //                 }
            //             },
            //             error: function() {
            //                 alert('画像アップロード中にエラーが発生しました');
            //             }
            //         });
            //     } else {
            //         submitArticleForm(); // No image? Just submit.
            //     }
            // });


        });
    </script>
<?php
}
function insert_at_news()
{
    global $wpdb;
    $table_name = $wpdb->prefix . 'news';

    // Parse and sanitize form data
    parse_str($_POST['form_data'], $form_data);
    $base_url = IMAGE_LOCATION_STORE;
    $news_id = isset($form_data['news_id']) ? intval($form_data['news_id']) : null;
    $title = sanitize_text_field($form_data['title']);
    $slug = sanitize_text_field($form_data['slug']);
    $date = sanitize_text_field($form_data['date']);
    $genre = sanitize_text_field($form_data['genre']);
    $is_top = isset($form_data['top_screen']) ? 1 : 0;
    $synopsis = sanitize_textarea_field($form_data['synopsis']);
    $is_public = ($form_data['visibility'] === 'public') ? 1 : 0;
    $meta_title = sanitize_text_field($form_data['meta_title']);
    $meta_description = sanitize_textarea_field($form_data['meta_description']);
    $first_view_image = !empty($form_data['first_view_image']) ? esc_url_raw($form_data['first_view_image']) : null;
    if (isset($first_view_image)) {
        $first_view_image = str_replace($base_url, '', $first_view_image);
    }
    $article_content = !empty($form_data['article_content']) ? ($form_data['article_content']) : null;
    $banner = sanitize_textarea_field($form_data['banner']);
    $article_select = sanitize_textarea_field($form_data['article_select']);
    $author_name = sanitize_text_field($form_data['author_name']);
    $author_description = sanitize_textarea_field($form_data['author_description']);
    $author_image = !empty($form_data['author_image']) ? esc_url_raw(trim($form_data['author_image'])) : null;
    if (isset($author_image)) {
        $author_image = str_replace($base_url, '', $author_image);
    }

    // Simulate author ID & username (Replace with actual logged-in user data)
    $author_id = get_current_user_id(); // WordPress function to get logged-in user ID
    $author_username = wp_get_current_user()->user_login; // Get username of the logged-in user

    $datetime = current_time('mysql');

    // Data array for insertion/updation
    $data = [
        'id_author_create' => $author_id,
        'username_author_create' => $author_username,
        'title' => $title,
        'path_name' => $slug,
        'datetime' => $date,
        'title_date_time' => $date,
        'genre_type' => $genre,
        'genre_type_copy' => $genre,
        'genre_type_public' => $is_public,
        'is_top' => $is_top,
        'top_public' => $is_top,
        'outline' => $synopsis,
        'is_public' => $is_public,
        'meta_title' => $meta_title,
        'title_meta' => $meta_title, // Adjusted for title_meta field
        'description_meta' => $meta_description,
        'image' => $first_view_image,
        'content' => $article_content,
        'banner' => $banner,
        'related_titles' => $article_select,
        'author' => $author_name,
        'author_description' => $author_description,
        'author_image' => $author_image,
        'type' => $genre, // Type field mapping
        'type_name' => $genre, // Type_name field mapping
        'updated_at' => $datetime,
    ];

    if ($news_id) {
        // Check if record exists before updating
        $existing = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM $table_name WHERE id = %d", $news_id));


        if ($existing) {
            // Update existing record
            $update = $wpdb->update($table_name, $data, ['id' => $news_id]);

            if ($update !== false) {
                wp_send_json_success(['message' => 'Content updated successfully.']);
            } else {
                wp_send_json_error(['message' => 'Failed to update content.']);
            }
        } else {
            wp_send_json_error(['message' => 'Record not found for update.']);
        }
    } else {
        // Insert new record
        $data['created_at'] = $datetime;
        $insert = $wpdb->insert($table_name, $data);

        if ($insert) {
            wp_send_json_success(['message' => 'Content added successfully.', 'id' => $wpdb->insert_id]);
        } else {
            wp_send_json_error(['message' => 'Failed to insert content.']);
        }
    }
}


?>