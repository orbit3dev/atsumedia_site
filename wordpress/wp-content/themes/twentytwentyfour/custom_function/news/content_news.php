<?php


function custom_content_page()
{
?>

    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/custom_function/custom_css/editor_container.css">
    <style>
        .header-container {
            display: flex;
            justify-content: space-between;
            /* Ensures space between title and button */
            align-items: center;
            /* Aligns items vertically in the center */
            margin-bottom: 10px;
        }

        /* Button Styling */
        .news_button {
            padding: 8px 16px;
            background-color: #0073aa;
            /* WordPress blue */
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            font-size: 14px;
        }

        /* Hover effect */
        .news_button:hover {
            background-color: #005177;
        }

        .form-table {
            width: 100%;
            border-collapse: collapse;
        }

        .form-table th {
            text-align: left;
            font-weight: bold;
            padding: 8px;
            width: 180px;
            background: #f9f9f9;
            border-bottom: 1px solid #ddd;
        }

        .form-table td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }

        /* Input & Textarea Styling */
        input[type="text"],
        input[type="date"],
        textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }

        /* Checkboxes & Radios */
        input[type="radio"],
        input[type="checkbox"] {
            margin-right: 5px;
        }

        /* Image Preview */
        #first_view_preview img,
        #author_preview img {
            display: block;
            margin-top: 10px;
            max-width: 150px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        /* Submit Button */
        .button-primary {
            padding: 10px 20px;
            background-color: #0073aa;
            color: white;
            font-size: 16px;
            border-radius: 4px;
            transition: background 0.3s ease;
        }

        .button-primary:hover {
            background-color: #005177;
        }

        .submit-container {
            display: flex;
            justify-content: flex-end;
            /* Moves button to the right */
            margin-top: 20px;
        }

        #editorjs_news {
            border: 1px solid #ddd;
            min-height: 200px;
            padding: 10px;
            background: #fff;
            direction: ltr !important;
            text-align: left;
        }

        #editorjs_news {
            text-align: left;
            margin: 0 auto;
            max-width: 800px;
        }
    </style>
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
                                <td><input type="date" name="date"></td>
                            </tr>
                            <tr>
                                <th>ジャンル選択</th>
                                <td>
                                    <label><input type="radio" name="genre" value="anime"> アニメ</label>
                                    <label><input type="radio" name="genre" value="movie"> 映画</label>
                                    <label><input type="radio" name="genre" value="japanese_drama">国内ドラマ</label>
                                    <label><input type="radio" name="genre" value="foreign_drama"> 海外ドラマ</label>
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
                                    <input type="hidden" name="first_view_image" id="first_view_image">
                                    <button type="button" id="upload_first_view_button">画像をアップロード</button>
                                    <div id="first_view_preview"></div>
                                </td>
                            </tr>
                            <tr>
                                <th><label for="editorjs">記事内容</label></th>
                                <td>
                                    <!-- <div id="editorjs-container"> -->
                                    <div id="editorjs_news"></div>
                                    <!-- </div> -->
                                    <input type="hidden" name="article_content" id="article_content">
                                </td>
                            </tr>


                            <tr>
                                <th><label for="banner">バナー</label></th>
                                <td><textarea name="banner" rows="2" class="large-text"></textarea></td>
                            </tr>
                            <tr>
                                <th><label for="related_titles">関連作品</label></th>
                                <td><textarea name="related_titles" rows="2" class="large-text"></textarea></td>
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
                                    <input type="hidden" name="author_image" id="author_image">
                                    <button type="button" id="upload_author_button">画像をアップロード</button>
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
<?php
}

// JavaScript for media uploader
function custom_content_scripts()
{
?>
    <script>
        let editor;
        jQuery(document).ready(function($) {
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
                        "data": "created_at"
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
                            $('input[name="title"]').val(data.title);
                            $('input[name="slug"]').val(data.slug);
                            $('input[name="date"]').val(data.date_news.split(' ')[0]);
                            $('textarea[name="synopsis"]').val(data.outline);
                            $('input[name="meta_title"]').val(data.title_meta);
                            $('textarea[name="meta_description"]').val(data.description_meta);

                            $('textarea[name="banner"]').val(data.banner);
                            $('textarea[name="related_titles"]').val(data.related_titles);
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
                            $('#first_view_preview').html('<img src="http://localhost/wordpress/wp-content/themes/twentyfourteen' + data.image + '" width="150">');
                            $('#author_image').val(data.author_image);
                            $('#author_preview').html('<img src="http://localhost/wordpress/wp-content/themes/twentyfourteen' + data.author_image + '" width="150">');

                            $('#news_id').val(data.id)

                            let fixedContent = data.content.replace(/<a href="(.*?)">/g, '<a href=\\"$1\\">');

                            try {
                                jsonData = JSON.parse(fixedContent);
                                editor.render(jsonData)
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
                            window.location.reload();
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
                editor.clear()
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

            mediaUploader('upload_first_view_button', 'first_view_image', 'first_view_preview');
            mediaUploader('upload_author_button', 'author_image', 'author_preview');

            // Handle Form Submission
            $('#custom-content-form').submit(function(e) {
                // e.preventDefault(); // Prevent page reload

                // Get data from Editor.js
                editor.save().then((outputData) => {
                    // Serialize form data
                    var formData = $(this).serializeArray();

                    // Append Editor.js content as JSON string
                    formData.push({
                        name: "article_content",
                        value: JSON.stringify(outputData)
                    });

                    // Send data via AJAX
                    $.ajax({
                        type: 'POST',
                        url: ajaxurl, // WordPress built-in AJAX URL
                        data: {
                            action: 'insert_at_news', // WordPress AJAX action
                            form_data: $.param(formData) // Convert formData array to URL-encoded string
                        },
                        success: function(response) {
                            if (response.success) {
                                alert('データが正常にアップロードされました');
                                $('#custom-content-form')[0].reset(); // Reset form after success
                            } else {
                                alert('エラー: ' + response.data.message);
                            }
                            windows.reload()
                        },
                        error: function(xhr, status, error) {
                            console.error("Error:", error);
                            alert('フォームを送信中にエラーが発生しました');
                        }
                    });
                }).catch((error) => {
                    console.error("Editor.js Saving failed:", error);
                    alert('記事内容の保存に失敗しました');
                });
            });

            editor = new EditorJS({
                holder: 'editorjs_news',
                // data: articleData.blocks || [], // If no data, initializes with an empty array
                tools: {
                    paragraph: {
                        class: Paragraph
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
    $article_content = !empty($form_data['article_content']) ? wp_unslash($form_data['article_content']) : null;
    $banner = sanitize_textarea_field($form_data['banner']);
    $related_titles = sanitize_textarea_field($form_data['related_titles']);
    $author_name = sanitize_text_field($form_data['author_name']);
    $author_description = sanitize_textarea_field($form_data['author_description']);
    $author_image = !empty($form_data['author_image']) ? esc_url_raw(trim($form_data['author_image'])) : null;

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
        'related_titles' => $related_titles,
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